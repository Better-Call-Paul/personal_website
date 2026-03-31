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

const COL: Record<string, C3> = {
  sm:     { f: '#333333', t: '#444444', r: '#222222' },
  l1i:    { f: '#D4942A', t: '#E8A83E', r: '#B07C18' },
  sub:    { f: '#1A4858', t: '#255868', r: '#103848' },
  l0:     { f: '#3A6080', t: '#4E7494', r: '#2A5070' },
  warp:   { f: '#D08020', t: '#E49434', r: '#B06818' },
  disp:   { f: '#A06018', t: '#B4742C', r: '#884E10' },
  reg:    { f: '#4878A8', t: '#5C8CBC', r: '#386898' },
  tmem:   { f: '#285868', t: '#3C6C7C', r: '#184858' },
  cuda:   { f: '#5A7020', t: '#6E8434', r: '#4A6010' },
  tensor: { f: '#5A7020', t: '#6E8434', r: '#4A6010' },
  ldst:   { f: '#385878', t: '#4C6C8C', r: '#284868' },
  sfu:    { f: '#802028', t: '#94343C', r: '#681018' },
  tma:    { f: '#404040', t: '#545454', r: '#2E2E2E' },
  l1d:    { f: '#40A028', t: '#54B43C', r: '#309018' },
  tex:    { f: '#606060', t: '#747474', r: '#4C4C4C' },
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
      <polygon points={pts(right)} fill={c.r} stroke="#0004" strokeWidth={0.3} />
      <polygon points={pts(top)}   fill={c.t} stroke="#0004" strokeWidth={0.3} />
      <polygon points={pts(front)} fill={c.f} stroke="#0004" strokeWidth={0.3} />
      {lines.length > 0 && (
        <text textAnchor="middle" dominantBaseline="middle" fill="#fff"
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
      {/* Background frame */}
      <Box x={bx} y={by} w={W} h={17} c={COL.sub} d={DEPTH + 0.3} />

      {/* Header bars — spaced out so 3D faces don't overlap */}
      <Box x={IX} y={by + 0.4} w={IW} h={0.9} c={COL.l0}
        label="L0 Instruction Cache" ls={6} />
      <Box x={IX} y={by + 1.8} w={IW} h={0.9} c={COL.warp}
        label="Warp Scheduler (32 thread/clk)" ls={5.5} />
      <Box x={IX} y={by + 3.2} w={IW} h={0.9} c={COL.disp}
        label="Dispatch Unit (32 thread/clk)" ls={5.5} />
      <Box x={IX} y={by + 4.6} w={IW} h={1.2} c={COL.reg}
        label="Register File (16,384 x 32-bit)" ls={6} />
      <Box x={IX} y={by + 6.3} w={IW} h={1.2} c={COL.tmem}
        label="64KB Tensor Memory (TMEM)" ls={6} />

      {/* Compute cores */}
      <Box x={IX} y={by + 8} w={7.5} h={7} c={COL.cuda}
        label={['CUDA', 'CORES']} ls={10} />
      <Box x={IX + 8} y={by + 8} w={IW - 8} h={7} c={COL.tensor}
        label={['TENSOR', 'CORES', '(5TH GEN)']} ls={9} />

      {/* LD/ST units */}
      {Array.from({ length: 8 }, (_, i) => (
        <Box key={i}
          x={IX + i * LDST_W} y={by + 15.5} w={LDST_W - 0.15} h={1.1}
          c={COL.ldst} label="LD/ST" ls={4} fw={600} />
      ))}

      {/* SFU */}
      <Box x={IX + 8 * LDST_W} y={by + 15.5} w={SFU_W} h={1.1} c={COL.sfu}
        label="SFU" ls={6} />
    </g>
  )
}

/* ─── Main component ─── */
export function SMArchitectureDiagram() {
  const W = 42
  const LX = 2
  const RX = 22
  const TOP_Y = 5
  const BOT_Y = 24

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
        <svg viewBox="-10 -18 575 640" className="w-full h-auto min-w-[550px]"
          xmlns="http://www.w3.org/2000/svg">

          {/* SM title bar */}
          <g className="sm-anim" style={{ animationDelay: '0s' }}>
            <Box x={0} y={0} w={W} h={2} c={COL.sm}
              label="Streaming Multiprocessor (SM)" ls={12} />
          </g>

          {/* L1 Instruction Cache */}
          <g className="sm-anim" style={{ animationDelay: '0.1s' }}>
            <Box x={1} y={2.8} w={W - 2} h={1.4} c={COL.l1i}
              label="L1 Instruction Cache" ls={9} />
          </g>

          {/* 4 sub-processing blocks (2×2 grid) */}
          <SubBlock bx={LX} by={TOP_Y} delay={0.2} />
          <SubBlock bx={RX} by={TOP_Y} delay={0.3} />
          <SubBlock bx={LX} by={BOT_Y} delay={0.4} />
          <SubBlock bx={RX} by={BOT_Y} delay={0.5} />

          {/* Tensor Memory Accelerator */}
          <g className="sm-anim" style={{ animationDelay: '0.6s' }}>
            <Box x={1} y={42.5} w={W - 2} h={1.4} c={COL.tma}
              label="Tensor Memory Accelerator (TMA)" ls={9} />
          </g>

          {/* L1 Data Cache / Shared Memory */}
          <g className="sm-anim" style={{ animationDelay: '0.7s' }}>
            <Box x={1} y={44.5} w={W - 2} h={1.4} c={COL.l1d}
              label="256 KB L1 Data Cache / Shared Memory" ls={8} />
          </g>

          {/* Tex units */}
          <g className="sm-anim" style={{ animationDelay: '0.8s' }}>
            {[1, 11.3, 21.6, 32].map((tx, i) => (
              <Box key={i} x={tx} y={46.5} w={9} h={1.3} c={COL.tex}
                label="Tex" ls={8} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  )
}
