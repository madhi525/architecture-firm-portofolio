import { useEffect, useRef } from 'react'

const COLORS = ['#8052ff', '#ffb829', '#15846e', '#b053ff', '#4d7dff']

const LOBES = [
  { cx: -0.23, cy: -0.02, rx: 0.18, ry: 0.26 },
  { cx: 0.23, cy: -0.02, rx: 0.18, ry: 0.26 },
  { cx: 0.0, cy: 0.2, rx: 0.13, ry: 0.09 },
  { cx: 0.0, cy: 0.38, rx: 0.06, ry: 0.11 },
]

function inShape(x, y) {
  for (const l of LOBES) {
    const dx = (x - l.cx) / l.rx
    const dy = (y - l.cy) / l.ry
    if (dx * dx + dy * dy <= 1) return true
  }
  return false
}

function sampleShape() {
  let x = 0
  let y = 0
  let tries = 0
  do {
    x = (Math.random() - 0.5) * 1.0
    y = (Math.random() - 0.5) * 1.2
    tries++
  } while (!inShape(x, y) && tries < 300)
  x += (Math.random() - 0.5) * 0.08
  y += (Math.random() - 0.5) * 0.08
  return { x, y }
}

function makeParticle(kind, w, h) {
  const inBrain = kind === 'constellation' && Math.random() < 0.78
  let ax
  let ay
  let opacity
  let size

  if (kind === 'constellation' && inBrain) {
    const s = sampleShape()
    ax = s.x + 0.5
    ay = s.y + 0.5
    opacity = 0.35 + Math.random() * 0.45
    size = 3 + Math.random() * 5
  } else if (kind === 'constellation') {
    ax = Math.random()
    ay = Math.random()
    opacity = 0.12 + Math.random() * 0.23
    size = 2 + Math.random() * 2.5
  } else {
    ax = Math.random()
    ay = Math.random()
    opacity = 0.08 + Math.random() * 0.17
    size = 1.5 + Math.random() * 2.5
  }

  return {
    ax,
    ay,
    core: kind === 'constellation' && inBrain,
    ph: Math.random() * Math.PI * 2,
    ph2: Math.random() * Math.PI * 2,
    spx: 0.2 + Math.random() * 0.3,
    spy: 0.2 + Math.random() * 0.3,
    amp: 2.5 + Math.random() * 4.5,
    fq: 0.3 + Math.random() * 0.9,
    rot0: Math.random() * Math.PI * 2,
    size,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    opacity,
  }
}

function densityFor(kind, w, h) {
  if (kind === 'ambient') {
    return Math.min(110, Math.max(50, Math.round((w * h) / 14000)))
  }
  return Math.min(900, Math.max(450, Math.round((w * h) / 550)))
}

export default function Particles({
  variant = 'constellation',
  progressRef = null,
  className = '',
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let particles = []
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = Array.from(
        { length: densityFor(variant, w, h) },
        () => makeParticle(variant, w, h),
      )
    }

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      const t = performance.now() / 1000
      const scrollable = variant === 'constellation' && progressRef
      const prog = scrollable ? progressRef.current : 0
      const th = prog * Math.PI * 0.6
      const cosT = Math.cos(th)
      const sinT = Math.sin(th)
      const scale = 1 + prog * 0.45
      const fade = 1 - prog * 0.35
      const S = Math.min(w, h)

      for (const p of particles) {
        let x
        let y
        if (p.core) {
          const dx = p.ax - 0.5
          const dy = p.ay - 0.5
          const rx = (dx * cosT - dy * sinT) * scale
          const ry = (dx * sinT + dy * cosT) * scale
          x = 0.5 * w + rx * S
          y = 0.5 * h + ry * S
        } else {
          x = p.ax * w
          y = p.ay * h
        }
        x += Math.sin(t * p.spx + p.ph) * p.amp
        y += Math.cos(t * p.spy + p.ph) * p.amp * 0.85
        const twinkle =
          variant === 'constellation'
            ? 0.75 + 0.25 * Math.sin(t * p.fq + p.ph2)
            : 1
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(p.rot0 + Math.sin(t * 0.3 + p.ph) * 0.25)
        ctx.globalAlpha = p.opacity * twinkle * fade
        ctx.strokeStyle = p.color
        ctx.lineWidth = 1
        const s = p.size
        ctx.beginPath()
        ctx.moveTo(0, -s / 2)
        ctx.lineTo(s / 2, s / 2)
        ctx.lineTo(-s / 2, s / 2)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    tick()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [variant, progressRef])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}