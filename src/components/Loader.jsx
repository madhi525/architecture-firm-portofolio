import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const MIN_DISPLAY = 900
const VIDEO_WEIGHT = 0.8
const FONTS_WEIGHT = 1 - VIDEO_WEIGHT
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Space+Mono:ital,wght@0,400;1,400&display=swap'

export default function Loader({ onComplete }) {
  const scope = useRef(null)
  const counterRef = useRef(null)
  const barRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = performance.now()
    let videoPct = 0
    let fontsPct = 0
    let lockProgress = false

    const paint = (pct) => {
      if (lockProgress) return
      const total = Math.min(
        100,
        Math.round(videoPct * VIDEO_WEIGHT + fontsPct * FONTS_WEIGHT),
      )
      setProgress(total)
      if (barRef.current) barRef.current.style.width = `${total}%`
      if (total >= 100) finish()
    }

    const finish = () => {
      if (lockProgress) return
      lockProgress = true
      const elapsed = performance.now() - startedAt
      const wait = Math.max(0, MIN_DISPLAY - elapsed)

      setTimeout(() => {
        const tl = gsap.timeline({ onComplete })
        tl.to('[data-loader-content]', {
          opacity: 0,
          y: -12,
          duration: 0.35,
          ease: 'power2.in',
        })
          .to(
            '[data-loader-top]',
            { yPercent: -100, duration: 0.9, ease: 'power4.inOut' },
            '-=0.1',
          )
          .to(
            '[data-loader-bottom]',
            { yPercent: 100, duration: 0.9, ease: 'power4.inOut' },
            '<',
          )
      }, wait)
    }

    const loadVideo = async () => {
      try {
        const res = await fetch('/hero.mp4', {
          signal: controller.signal,
          cache: 'force-cache',
        })
        if (!res.ok || !res.body) {
          videoPct = 100
          paint()
          return
        }
        const totalBytes = Number(res.headers.get('content-length')) || 0
        const reader = res.body.getReader()
        let loaded = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          loaded += value.byteLength
          videoPct = totalBytes ? (loaded / totalBytes) * 100 : 100
          paint()
        }
        videoPct = 100
        paint()
      } catch (err) {
        if (err.name !== 'AbortError') {
          videoPct = 100
          paint()
        }
      }
    }

    const loadFonts = async () => {
      try {
        await fetch(FONT_CSS, { signal: controller.signal })
        await Promise.all([
          document.fonts.load('300 16px Inter'),
          document.fonts.load('400 16px Inter'),
          document.fonts.load('600 16px Inter'),
          document.fonts.load('700 16px Inter'),
          document.fonts.load('400 16px "Space Mono"'),
        ])
        fontsPct = 100
      } catch (err) {
        fontsPct = 100
      }
      paint()
    }

    loadVideo()
    loadFonts()

    return () => controller.abort()
  }, [onComplete])

  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = String(progress).padStart(2, '0')
    }
  }, [progress])

  return (
    <section ref={scope} className="fixed inset-0 z-[100]">
      <div
        data-loader-top
        className="absolute inset-x-0 top-0 h-1/2 bg-ink-950"
      />
      <div
        data-loader-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink-950"
      />

      <div
        data-loader-content
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
      >
        <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
          Firma·Ars
        </p>
        <div className="flex items-baseline gap-2">
          <span
            ref={counterRef}
            className="font-mono text-6xl font-bold text-paper tabular-nums md:text-8xl"
          >
            00
          </span>
          <span className="font-mono text-lg text-paper/40">%</span>
        </div>
        <div className="h-px w-56 overflow-hidden bg-white/10">
          <div ref={barRef} className="h-full w-0 bg-accent transition-[width] duration-150 ease-linear" />
        </div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-paper/40 uppercase">
          Menyiapkan karya
        </p>
      </div>
    </section>
  )
}