import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const MIN_DISPLAY = 900
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&display=swap'

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
    let fontsPct = 0
    let lockProgress = false

    const paint = () => {
      if (lockProgress) return
      setProgress(Math.round(fontsPct))
      if (barRef.current) barRef.current.style.width = `${fontsPct}%`
      if (fontsPct >= 100) finish()
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

    const loadFonts = async () => {
      try {
        await fetch(FONT_CSS, { signal: controller.signal })
        await Promise.all([
          document.fonts.load('200 16px Inter'),
          document.fonts.load('400 16px Inter'),
          document.fonts.load('600 16px Inter'),
          document.fonts.load('700 16px Inter'),
        ])
        fontsPct = 100
      } catch (err) {
        fontsPct = 100
      }
      paint()
    }

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
        className="absolute inset-x-0 top-0 h-1/2 bg-void"
      />
      <div
        data-loader-bottom
        className="absolute inset-x-0 bottom-0 h-1/2 bg-void"
      />

      <div
        data-loader-content
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
      >
        <p className="text-xs font-semibold tracking-[0.35em] text-saffron-spark uppercase">
          Firma·Ars
        </p>
        <div className="flex items-baseline gap-2">
          <span
            ref={counterRef}
            className="text-6xl font-normal text-bone-white tabular-nums md:text-8xl"
          >
            00
          </span>
          <span className="text-lg font-extralight text-ash-gray">%</span>
        </div>
        <div className="h-px w-56 overflow-hidden bg-white/10">
          <div
            ref={barRef}
            className="h-full w-0 bg-electric-iris transition-[width] duration-150 ease-linear"
          />
        </div>
        <p className="text-[10px] font-light tracking-[0.3em] text-ash-gray uppercase">
          Menyiapkan karya
        </p>
      </div>
    </section>
  )
}