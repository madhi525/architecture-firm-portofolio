import { useEffect, useRef } from 'react'

const COLORS = ['#8052ff', '#ffb829', '#15846e', '#b053ff', '#4d7dff']

const LOBES = [
  { cx: -0.17, cy: 0.0, rx: 0.34, ry: 0.3 },
  { cx: 0.17, cy: 0.0, rx: 0.34, ry: 0.3 },
  { cx: 0.0, cy: 0.09, rx: 0.3, ry: 0.22 },
  { cx: 0.0, cy: 0.44, rx: 0.09, ry: 0.17 },
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
    x = (Math.random() - 0.5) * 1.2
    y = (Math.random() - 0.5) * 1.4
    tries++
  } while (!inShape(x, y) && tries < 200)
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
    opacity = 0.35 + Math.random() * 0.4
    size = 2.5 + Math.random() * 4
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
    x: ax * w,
    y: ay * h,
    ph: Math.random() * Math.PI * 2,
    spx: 0.15 + Math.random() * 0.25,
    spy: 0.15 + Math.random() * 0.25,
    amp: 1.5 + Math.random() * 2.5,
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
  return Math.min(900, Math.max(450, Math.round((w * h) / 700)))
}

export default function Particles({
  variant = 'constellation',
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
      for (const p of particles) {
        const x = p.ax * w + Math.sin(t * p.spx + p.ph) * p.amp
        const y = p.ay * h + Math.cos(t * p.spy + p.ph) * p.amp * 0.85
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(p.rot0 + Math.sin(t * 0.25 + p.ph) * 0.2)
        ctx.globalAlpha = p.opacity
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
  }, [variant])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}