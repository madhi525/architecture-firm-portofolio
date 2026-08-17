import { useEffect, useRef } from 'react'

const COLORS = ['#8052ff', '#ffb829', '#15846e', '#b053ff', '#4d7dff']

export default function Particles({ density = 90, className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf = 0
    let particles = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const spawn = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.012,
        size: 3 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.12 + Math.random() * 0.4,
      }))
    }

    const resize = () => {
      const { clientWidth, clientHeight } = canvas
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      spawn()
    }

    const tick = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (p.x < -24) p.x = w + 24
        if (p.x > w + 24) p.x = -24
        if (p.y < -24) p.y = h + 24
        if (p.y > h + 24) p.y = -24
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
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
  }, [density])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}