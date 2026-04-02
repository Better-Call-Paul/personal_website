'use client'

// ═══════════════════════════════════════════════════
// Blackwell B200 SM Architecture — 3D Oblique Diagram
// ═══════════════════════════════════════════════════

const PX = 13
const DEPTH = 0.8
const ANG = 75 * Math.PI / 180

/** Project grid (x, y) + depth to screen pixel */
function proj(x: number, y: number, d: number = 0): [number, number] {
  return [
    x * PX + d * PX * Math.cos(ANG),
    y * PX - d * PX * Math.sin(ANG),
  ]
}

/* ─── Colour palette ─── */
interface C3 { f: string; t: string; r: string }

const STROKE = '#18E76E'
const STROKE_W = 1.2
const TEXT_FILL = '#0A3018'

const COL: Record<string, C3> = {
  sm:     { f: '#287848', t: '#3C9860', r: '#1C6038' },
  l1i:    { f: '#6CF4A8', t: '#A0FFCC', r: '#4CD888' },
  sub:    { f: '#1C5830', t: '#2A7840', r: '#144420' },
  l0:     { f: '#44CC78', t: '#70E8A0', r: '#30B060' },
  warp:   { f: '#58E490', t: '#88F8B8', r: '#40C874' },
  disp:   { f: '#4CD880', t: '#78F0A8', r: '#38BC68' },
  reg:    { f: '#54E088', t: '#84F4B4', r: '#3CC470' },
  tmem:   { f: '#2C8850', t: '#44A868', r: '#207038' },
  cuda:   { f: '#34A060', t: '#50C078', r: '#268848' },
  tensor: { f: '#34A060', t: '#50C078', r: '#268848' },
  ldst:   { f: '#309858', t: '#4CB878', r: '#248040' },
  sfu:    { f: '#206838', t: '#348848', r: '#185028' },
  tma:    { f: '#287840', t: '#3C9858', r: '#1C6030' },
  l1d:    { f: '#6CF4A8', t: '#A0FFCC', r: '#4CD888' },
  tex:    { f: '#2C8850', t: '#44A868', r: '#207040' },
}

/* ─── 3D Box primitive ─── */
function Box({ x, y, w, h, c, label, ls = 7.5, d = DEPTH, fw = 700 }: {
  x: number; y: number; w: number; h: number; c: C3
  label?: string | string[]; ls?: number; d?: number; fw?: number
}) {
  const pts = (a: [number, number][]) => a.map(p => p.join(',')).join(' ')

  const front = [proj(x, y + h), proj(x + w, y + h), proj(x + w, y), proj(x, y)]
  const top   = [proj(x, y), proj(x + w, y), proj(x + w, y, d), proj(x, y, d)]
  const right = [proj(x + w, y + h), proj(x + w, y), proj(x + w, y, d), proj(x + w, y + h, d)]

  const cx = (front[0][0] + front[1][0]) / 2
  const cy = (front[0][1] + front[2][1]) / 2

  const lines = label == null ? [] : Array.isArray(label) ? label : [label]
  const lh = ls * 1.25
  const ty = cy - (lines.length - 1) * lh / 2

  return (
    <g>
      <polygon points={pts(right)} fill={c.r} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <polygon points={pts(top)}   fill={c.t} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <polygon points={pts(front)} fill={c.f} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      {lines.length > 0 && (
        <text textAnchor="middle" dominantBaseline="middle" fill={TEXT_FILL}
          fontSize={ls} fontWeight={fw} fontFamily="system-ui, sans-serif">
          {lines.map((l, i) => (
            <tspan key={i} x={cx} y={ty + i * lh}>{l}</tspan>
          ))}
        </text>
      )}
    </g>
  )
}

/* ─── One sub-processing block (SM partition) ─── */
function SubBlock({ bx, by, delay = 0 }: { bx: number; by: number; delay?: number }) {
  const W = 18
  const IX = bx + 0.4
  const IW = W - 0.8
  const LDST_W = 1.85
  const SFU_W = IW - 8 * LDST_W

  return (
    <g className="sm-anim" style={{ animationDelay: `${delay}s` }}>
      {/* Background frame — starts 1u above internals so its top face clears L0 */}
      <Box x={bx} y={by - 1} w={W} h={21} c={COL.sub} d={DEPTH + 0.3} />

      {/* Header bars — 1-unit gaps so 3D top faces never overlap */}
      <Box x={IX} y={by + 0.4} w={IW} h={0.9} c={COL.l0}
        label="L0 Instruction Cache" ls={6} />
      <Box x={IX} y={by + 2.3} w={IW} h={0.9} c={COL.warp}
        label="Warp Scheduler (32 thread/clk)" ls={5.5} />
      <Box x={IX} y={by + 4.2} w={IW} h={0.9} c={COL.disp}
        label="Dispatch Unit (32 thread/clk)" ls={5.5} />
      <Box x={IX} y={by + 6.1} w={IW} h={1.2} c={COL.reg}
        label="Register File (16,384 x 32-bit)" ls={6} />
      <Box x={IX} y={by + 8.3} w={IW} h={1.2} c={COL.tmem}
        label="64KB Tensor Memory (TMEM)" ls={6} />

      {/* Compute cores */}
      <Box x={IX} y={by + 10.5} w={7.5} h={7} c={COL.cuda}
        label={['CUDA', 'CORES']} ls={10} />
      <Box x={IX + 8} y={by + 10.5} w={IW - 8} h={7} c={COL.tensor}
        label={['TENSOR', 'CORES', '(5TH GEN)']} ls={9} />

      {/* LD/ST units */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i}
          x={IX + i * LDST_W} y={by + 18.5} w={LDST_W - 0.15} h={1.1}
          c={COL.ldst} label="LD/ST" ls={4} fw={600} />
      ))}

      {/* SFU */}
      <Box x={IX + 8 * LDST_W} y={by + 18.5} w={SFU_W} h={1.1} c={COL.sfu}
        label="SFU" ls={6} />
    </g>
  )
}

/* ─── Main component ─── */
export function SMArchitectureDiagram() {
  const W = 42
  const LX = 2
  const RX = 22
  const TOP_Y = 7
  const BOT_Y = 29

  return (
    <div className="w-full">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sm-anim {
          opacity: 0;
          animation: smFadeIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
      ` }} />

      <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
        <svg viewBox="-10 -18 575 760" className="w-full h-auto min-w-[550px]"
          xmlns="http://www.w3.org/2000/svg">

          {/* SM title bar */}
          <g className="sm-anim" style={{ animationDelay: '0s' }}>
            <Box x={0} y={0} w={W} h={2} c={COL.sm}
              label="Streaming Multiprocessor (SM)" ls={12} />
          </g>

          {/* L1 Instruction Cache */}
          <g className="sm-anim" style={{ animationDelay: '0.1s' }}>
            <Box x={1} y={3} w={W - 2} h={1.4} c={COL.l1i}
              label="L1 Instruction Cache" ls={9} />
          </g>

          {/* 4 sub-processing blocks (2×2 grid) */}
          <SubBlock bx={LX} by={TOP_Y} delay={0.2} />
          <SubBlock bx={RX} by={TOP_Y} delay={0.3} />
          <SubBlock bx={LX} by={BOT_Y} delay={0.4} />
          <SubBlock bx={RX} by={BOT_Y} delay={0.5} />

          {/* Tensor Memory Accelerator */}
          <g className="sm-anim" style={{ animationDelay: '0.6s' }}>
            <Box x={1} y={50.5} w={W - 2} h={1.4} c={COL.tma}
              label="Tensor Memory Accelerator (TMA)" ls={9} />
          </g>

          {/* L1 Data Cache / Shared Memory */}
          <g className="sm-anim" style={{ animationDelay: '0.7s' }}>
            <Box x={1} y={52.9} w={W - 2} h={1.4} c={COL.l1d}
              label="256 KB L1 Data Cache / Shared Memory" ls={8} />
          </g>

          {/* Tex units */}
          <g className="sm-anim" style={{ animationDelay: '0.8s' }}>
            {[1, 11.3, 21.6, 32].map((tx, i) => (
              <Box key={i} x={tx} y={55.3} w={9} h={1.3} c={COL.tex}
                label="Texture Unit" ls={8} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
