'use client'

const PX = 13, DEPTH = 0.8, ANG = 75 * Math.PI / 180
const STROKE = '#18E76E', STROKE_W = 1.2, TXT = '#0A3018'

function proj(x: number, y: number, d = 0): [number, number] {
  return [x * PX + d * PX * Math.cos(ANG), y * PX - d * PX * Math.sin(ANG)]
}

interface C3 { f: string; t: string; r: string }

const C: Record<string, C3> = {
  sm: { f: '#287848', t: '#3C9860', r: '#1C6038' },
  l1i: { f: '#6CF4A8', t: '#A0FFCC', r: '#4CD888' },
  sub: { f: '#1C5830', t: '#2A7840', r: '#144420' },
  l0: { f: '#44CC78', t: '#70E8A0', r: '#30B060' },
  warp: { f: '#58E490', t: '#88F8B8', r: '#40C874' },
  disp: { f: '#4CD880', t: '#78F0A8', r: '#38BC68' },
  reg: { f: '#54E088', t: '#84F4B4', r: '#3CC470' },
  tmem: { f: '#2C8850', t: '#44A868', r: '#207038' },
  cuda: { f: '#34A060', t: '#50C078', r: '#268848' },
  tensor: { f: '#34A060', t: '#50C078', r: '#268848' },
  ldst: { f: '#309858', t: '#4CB878', r: '#248040' },
  sfu: { f: '#206838', t: '#348848', r: '#185028' },
  tma: { f: '#287840', t: '#3C9858', r: '#1C6030' },
  l1d: { f: '#6CF4A8', t: '#A0FFCC', r: '#4CD888' },
  tex: { f: '#2C8850', t: '#44A868', r: '#207040' },
}

function B({ x, y, w, h, c, label, ls = 7.5, d = DEPTH, fw = 700 }: {
  x: number; y: number; w: number; h: number; c: C3
  label?: string | string[]; ls?: number; d?: number; fw?: number
}) {
  const p = (a: [number, number][]) => a.map(v => v.join(',')).join(' ')
  const front = [proj(x, y + h), proj(x + w, y + h), proj(x + w, y), proj(x, y)]
  const top = [proj(x, y), proj(x + w, y), proj(x + w, y, d), proj(x, y, d)]
  const right = [proj(x + w, y + h), proj(x + w, y), proj(x + w, y, d), proj(x + w, y + h, d)]
  const cx = (front[0][0] + front[1][0]) / 2
  const cy = (front[0][1] + front[2][1]) / 2
  const lines = label == null ? [] : Array.isArray(label) ? label : [label]
  const lh = ls * 1.25, ty = cy - (lines.length - 1) * lh / 2

  return (
    <g>
      <polygon points={p(right)} fill={c.r} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <polygon points={p(top)} fill={c.t} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      <polygon points={p(front)} fill={c.f} stroke={STROKE} strokeWidth={STROKE_W} strokeLinejoin="round" />
      {lines.length > 0 && (
        <text textAnchor="middle" dominantBaseline="middle" fill={TXT}
          fontSize={ls} fontWeight={fw} fontFamily="system-ui, sans-serif">
          {lines.map((l, i) => <tspan key={i} x={cx} y={ty + i * lh}>{l}</tspan>)}
        </text>
      )}
    </g>
  )
}

function Sub({ bx, by, delay = 0 }: { bx: number; by: number; delay?: number }) {
  const W = 18, IX = bx + 0.4, IW = W - 0.8, LW = 1.85, SW = IW - 8 * LW
  return (
    <g className="sm-anim" style={{ animationDelay: `${delay}s` }}>
      <B x={bx} y={by - 1} w={W} h={21} c={C.sub} d={DEPTH + 0.3} />
      <B x={IX} y={by + 0.4} w={IW} h={0.9} c={C.l0} label="L0 Instruction Cache" ls={6} />
      <B x={IX} y={by + 2.3} w={IW} h={0.9} c={C.warp} label="Warp Scheduler (32 thread/clk)" ls={5.5} />
      <B x={IX} y={by + 4.2} w={IW} h={0.9} c={C.disp} label="Dispatch Unit (32 thread/clk)" ls={5.5} />
      <B x={IX} y={by + 6.1} w={IW} h={1.2} c={C.reg} label="Register File (16,384 x 32-bit)" ls={6} />
      <B x={IX} y={by + 8.3} w={IW} h={1.2} c={C.tmem} label="64KB Tensor Memory (TMEM)" ls={6} />
      <B x={IX} y={by + 10.5} w={7.5} h={7} c={C.cuda} label={['CUDA', 'CORES']} ls={10} />
      <B x={IX + 8} y={by + 10.5} w={IW - 8} h={7} c={C.tensor} label={['TENSOR', 'CORES', '(5TH GEN)']} ls={9} />
      {Array.from({ length: 8 }, (_, i) => (
        <B key={i} x={IX + i * LW} y={by + 18.5} w={LW - 0.15} h={1.1} c={C.ldst} label="LD/ST" ls={4} fw={600} />
      ))}
      <B x={IX + 8 * LW} y={by + 18.5} w={SW} h={1.1} c={C.sfu} label="SFU" ls={6} />
    </g>
  )
}

export function SMArchitectureDiagram() {
  const W = 42, LX = 2, RX = 22, TY = 7, BY = 29
  return (
    <div className="w-full max-w-xl mx-auto">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smFadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
        .sm-anim { opacity: 0; animation: smFadeIn 0.5s cubic-bezier(0.22,0.61,0.36,1) forwards }
      ` }} />
      <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
        <svg viewBox="-10 -18 575 760" className="w-full h-auto min-w-[550px]" xmlns="http://www.w3.org/2000/svg">
          <g className="sm-anim"><B x={0} y={0} w={W} h={2} c={C.sm} label="Streaming Multiprocessor (SM)" ls={12} /></g>
          <g className="sm-anim" style={{ animationDelay: '0.1s' }}><B x={1} y={3} w={W - 2} h={1.4} c={C.l1i} label="L1 Instruction Cache" ls={9} /></g>
          <Sub bx={LX} by={TY} delay={0.2} />
          <Sub bx={RX} by={TY} delay={0.3} />
          <Sub bx={LX} by={BY} delay={0.4} />
          <Sub bx={RX} by={BY} delay={0.5} />
          <g className="sm-anim" style={{ animationDelay: '0.6s' }}><B x={1} y={50.5} w={W - 2} h={1.4} c={C.tma} label="Tensor Memory Accelerator (TMA)" ls={9} /></g>
          <g className="sm-anim" style={{ animationDelay: '0.7s' }}><B x={1} y={52.9} w={W - 2} h={1.4} c={C.l1d} label="256 KB L1 Data Cache / Shared Memory" ls={8} /></g>
          <g className="sm-anim" style={{ animationDelay: '0.8s' }}>
            {[1, 11.3, 21.6, 32].map((tx, i) => <B key={i} x={tx} y={55.3} w={9} h={1.3} c={C.tex} label="Texture Unit" ls={8} />)}
          </g>
        </svg>
      </div>
    </div>
  )
}
