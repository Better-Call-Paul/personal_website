'use client'

import { useEffect, useRef, useMemo } from 'react'

/* ─── Color palettes matching the original diagram ─── */
const TMA_BOLD = {
  default: { fill: '#8B4049', stroke: '#5A2830', strokeWidth: '0.5' },
  top: { fill: '#A85060' },
  right: { fill: '#7B3039' },
}

const TMA_DIM = {
  default: { fill: '#6B3039', stroke: '#4A1820', strokeWidth: '0.5' },
  top: { fill: '#834050' },
  right: { fill: '#5B2029' },
}

const MMA_BOLD = {
  default: { fill: '#2C3E50', stroke: '#1A252F', strokeWidth: '0.5' },
  top: { fill: '#3A5068' },
  right: { fill: '#1E2D3D' },
}

const MMA_DIM = {
  default: { fill: '#1E2D3D', stroke: '#0E1D2D', strokeWidth: '0.5' },
  top: { fill: '#2A3E50' },
  right: { fill: '#162535' },
}

const BUF_T = {
  default: { fill: '#2C2C2C', stroke: '#111', strokeWidth: '0.5' },
  top: { fill: '#404040' },
  right: { fill: '#1C1C1C' },
}

const BUF_M = {
  default: { fill: '#1A1A2E', stroke: '#0A0A1E', strokeWidth: '0.5' },
  top: { fill: '#2E2E42' },
  right: { fill: '#0E0E22' },
}

/* ─── Operation layout ─── */
interface Op {
  id: string
  x: number
  z: number
  w: number
  style: Record<string, any>
  delay: number
}

/*
 * Ampere-style: single main loop, TMA and MMA share one warp.
 * z-axis: higher z = further back (appears upper-left in oblique view)
 * buf0 at z=5 (back/top), buf3 at z=2, MMA at z=0 (front/bottom)
 */
const AMPERE: Op[] = [
  // Buffer cubes
  { id: 'a-b0', x: 0, z: 5, w: 1, style: BUF_T, delay: 0 },
  { id: 'a-b1', x: 0, z: 4, w: 1, style: BUF_T, delay: 0.06 },
  { id: 'a-b2', x: 0, z: 3, w: 1, style: BUF_T, delay: 0.12 },
  { id: 'a-b3', x: 0, z: 2, w: 1, style: BUF_T, delay: 0.18 },
  // TMA batch 1 — staggered across buffer rows
  { id: 'a-t0', x: 3, z: 5, w: 8, style: TMA_BOLD, delay: 0.3 },
  { id: 'a-t1', x: 5, z: 4, w: 6, style: TMA_DIM, delay: 0.5 },
  { id: 'a-t2', x: 7, z: 3, w: 6, style: TMA_DIM, delay: 0.7 },
  { id: 'a-t3', x: 9, z: 2, w: 5, style: TMA_DIM, delay: 0.9 },
  // MMA0 — starts after TMA0 completes
  { id: 'a-m0', x: 14, z: 0, w: 8, style: MMA_BOLD, delay: 1.3 },
  // TMA batch 2
  { id: 'a-t4', x: 22, z: 5, w: 8, style: TMA_BOLD, delay: 1.6 },
  // MMA1
  { id: 'a-m1', x: 27, z: 0, w: 6, style: MMA_DIM, delay: 2.0 },
]

/*
 * Blackwell warp specialization: dedicated TMA warp and MMA warp.
 * TMA warp at z=8-11, gap, MMA warp at z=2-5
 */
const BLACKWELL: Op[] = [
  // TMA warp buffer cubes
  { id: 'b-tb0', x: 0, z: 11, w: 1, style: BUF_T, delay: 0 },
  { id: 'b-tb1', x: 0, z: 10, w: 1, style: BUF_T, delay: 0.06 },
  { id: 'b-tb2', x: 0, z: 9, w: 1, style: BUF_T, delay: 0.12 },
  { id: 'b-tb3', x: 0, z: 8, w: 1, style: BUF_T, delay: 0.18 },
  // TMA warp batch 1
  { id: 'b-t0', x: 3, z: 11, w: 8, style: TMA_BOLD, delay: 0.4 },
  { id: 'b-t1', x: 5, z: 10, w: 6, style: TMA_DIM, delay: 0.6 },
  { id: 'b-t2', x: 7, z: 9, w: 6, style: TMA_DIM, delay: 0.8 },
  { id: 'b-t3', x: 9, z: 8, w: 5, style: TMA_DIM, delay: 1.0 },
  // MMA warp buffer cubes
  { id: 'b-mb0', x: 0, z: 5, w: 1, style: BUF_M, delay: 0.2 },
  { id: 'b-mb1', x: 0, z: 4, w: 1, style: BUF_M, delay: 0.26 },
  { id: 'b-mb2', x: 0, z: 3, w: 1, style: BUF_M, delay: 0.32 },
  { id: 'b-mb3', x: 0, z: 2, w: 1, style: BUF_M, delay: 0.38 },
  // MMA warp operations — staggered
  { id: 'b-m0', x: 13, z: 5, w: 8, style: MMA_BOLD, delay: 1.3 },
  { id: 'b-m1', x: 15, z: 4, w: 6, style: MMA_DIM, delay: 1.5 },
  { id: 'b-m2', x: 17, z: 3, w: 6, style: MMA_DIM, delay: 1.7 },
  { id: 'b-m3', x: 19, z: 2, w: 5, style: MMA_DIM, delay: 1.9 },
  // TMA warp batch 2
  { id: 'b-t4', x: 20, z: 11, w: 8, style: TMA_BOLD, delay: 2.2 },
  { id: 'b-t5', x: 22, z: 10, w: 6, style: TMA_DIM, delay: 2.4 },
  { id: 'b-t6', x: 24, z: 9, w: 6, style: TMA_DIM, delay: 2.6 },
  { id: 'b-t7', x: 26, z: 8, w: 5, style: TMA_DIM, delay: 2.8 },
]

/* ─── Scene builder ─── */
function build(Heerich: any, ops: Op[]): string {
  const h = new Heerich({
    tile: [14, 14],
    camera: { type: 'oblique', angle: 80, distance: 12 },
  })

  for (const op of ops) {
    h.addBox({
      position: [op.x, 0, op.z],
      size: [op.w, 1, 1],
      style: op.style,
      meta: { op: op.id },
    })
  }

  return h.toSVG({ padding: 30 })
}

/* ─── React component ─── */
export function WarpSpecializationDiagram() {
  const aRef = useRef<HTMLDivElement>(null)
  const bRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let dead = false
    import('heerich').then((mod) => {
      if (dead) return
      const { Heerich } = mod
      if (aRef.current) aRef.current.innerHTML = build(Heerich, AMPERE)
      if (bRef.current) bRef.current.innerHTML = build(Heerich, BLACKWELL)
    })
    return () => { dead = true }
  }, [])

  const css = useMemo(() => {
    const delays = [...AMPERE, ...BLACKWELL]
      .map(op => `.voxel-scene [data-op="${op.id}"] { animation-delay: ${op.delay}s; }`)
      .join('\n')

    return `
@keyframes voxelIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.voxel-scene svg {
  width: 100%;
  height: auto;
}
.voxel-scene polygon {
  opacity: 0;
  animation-name: voxelIn;
  animation-duration: 0.45s;
  animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
  animation-fill-mode: forwards;
}
${delays}
`
  }, [])

  return (
    <div className="w-full space-y-14">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Ampere */}
      <section>
        <h3 className="font-bold text-2xl text-gray-900 mb-1">Ampere-style</h3>
        <p className="text-sm text-gray-400 italic mb-5">
          Main loop &mdash; TMA and MMA share one warp
        </p>
        <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <div ref={aRef} className="voxel-scene min-w-[600px]" />
        </div>
        <div className="flex items-center mt-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 ml-2 tracking-widest">
            time &rarr;
          </span>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Blackwell */}
      <section>
        <h3 className="font-bold text-2xl text-gray-900 mb-1">Blackwell</h3>
        <p className="text-sm text-gray-400 italic mb-5">
          Warp specialization &mdash; dedicated TMA and MMA warps
        </p>
        <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <div ref={bRef} className="voxel-scene min-w-[600px]" />
        </div>
        <div className="flex items-center mt-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400 ml-2 tracking-widest">
            time &rarr;
          </span>
        </div>
      </section>

      {/* Legend */}
      <div className="flex flex-wrap gap-8 text-sm pt-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#8B4049' }} />
          <span className="text-gray-600">TMA (memory transfer)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#2C3E50' }} />
          <span className="text-gray-600">MMA (matrix compute)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: '#2C2C2C' }} />
          <span className="text-gray-600">Buffer slot</span>
        </div>
      </div>
    </div>
  )
}
