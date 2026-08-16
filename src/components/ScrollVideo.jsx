import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const CHAPTERS = [
  { id: 'ide', title: 'Ide', sub: 'Sketsa awal & narasi ruang', from: 0.0, to: 0.34 },
  { id: 'material', title: 'Material', sub: 'Bata, kayu, dan cahaya', from: 0.34, to: 0.67 },
  { id: 'ruang', title: 'Ruang', sub: 'Cara hidup di dalamnya', from: 0.67, to: 1.0 },
]

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E"

/**
 * Video scroll-scrub — video di-pin dan "diputar" mengikuti scroll.
 * Durasi scroll ±3× durasi video agar gerakannya terasa sinematik.
 */
export default function ScrollVideo({
  src = '/hero.mp4',
  label = 'Film Perusahaan',
  scrollFactor = 3,
}) {
  const scope = useRef(null)
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const activeChapterRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useGSAP(
    () => {
      const video = videoRef.current
      if (!video) return

      let scrubTrigger = null

      const initScrub = () => {
        if (scrubTrigger) return

        const duration = video.duration
        if (!Number.isFinite(duration) || duration <= 0) return

        video.pause()
        video.currentTime = 0

        scrubTrigger = ScrollTrigger.create({
          trigger: scope.current,
          start: 'top top',
          end: () => `+=${duration * scrollFactor * 100}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!video.paused) video.pause()

            video.currentTime = duration * self.progress

            if (progressRef.current && !Number.isNaN(duration)) {
              const pct = Math.round(self.progress * 100)
              progressRef.current.textContent = `${String(pct).padStart(2, '0')}%`
            }

              const active =
              CHAPTERS.find(
                (c) => self.progress >= c.from && self.progress < c.to,
              ) ?? CHAPTERS[CHAPTERS.length - 1]

            if (active.id !== activeChapterRef.current) {
              if (activeChapterRef.current) {
                gsap.to(
                  scope.current.querySelector(
                    `[data-chapter="${activeChapterRef.current}"]`,
                  ),
                  { opacity: 0, y: 12, duration: 0.25, ease: 'power2.out' },
                )
              }
              gsap.fromTo(
                scope.current.querySelector(`[data-chapter="${active.id}"]`),
                { opacity: 0, y: 12 },
                { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
              )
              activeChapterRef.current = active.id
            }
          },
        })
      }

      const onLoaded = () => {
        const unlock = video.play()
        if (unlock) {
          unlock.then(() => {
            video.pause()
            initScrub()
          }).catch(initScrub)
        } else {
          initScrub()
        }
      }

      const barsIn = () => {
        const top = scope.current.querySelector('[data-letterbox-top]')
        const bottom = scope.current.querySelector('[data-letterbox-bottom]')
        gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'top top+=4%',
            scrub: true,
          },
        })
          .fromTo(top, { yPercent: -100 }, { yPercent: 0, ease: 'none' })
          .fromTo(bottom, { yPercent: 100 }, { yPercent: 0, ease: 'none' }, '<')
      }

      const barsOut = () => {
        const top = scope.current.querySelector('[data-letterbox-top]')
        const bottom = scope.current.querySelector('[data-letterbox-bottom]')
        gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'bottom bottom-=4%',
            end: 'bottom bottom',
            scrub: true,
          },
        })
          .to(top, { yPercent: -100, ease: 'none' })
          .to(bottom, { yPercent: 100, ease: 'none' }, '<')
      }

      barsIn()
      barsOut()

      if (video.readyState >= 1) {
        onLoaded()
      } else {
        video.addEventListener('loadedmetadata', onLoaded, { once: true })
      }

      return () => {
        video.removeEventListener('loadedmetadata', onLoaded)
        scrubTrigger?.kill(true)
      }
    },
    { scope },
  )

  const formatTime = (t) => {
    if (!Number.isFinite(t)) return '00:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <section ref={scope} className="relative">
      <div className="relative h-svh w-full overflow-hidden bg-ink-900">
        {videoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,rgba(200,160,94,0.15),transparent_60%)]">
            <span className="font-mono text-xs tracking-[0.3em] text-paper/50 uppercase">
              video belum tersedia
            </span>
            <p className="max-w-xs text-center font-mono text-[10px] leading-relaxed text-paper/40">
              Letakkan file di <code className="text-accent">public/hero.mp4</code>
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,10,11,0.55)_100%)]" />
        <div
          className="pointer-events-none absolute inset-0 z-[15] opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: `url(${GRAIN})` }}
        />

        <div
          data-letterbox-top
          className="absolute inset-x-0 top-0 z-20 h-[7vh] -translate-y-full bg-ink-950"
        />
        <div
          data-letterbox-bottom
          className="absolute inset-x-0 bottom-0 z-20 h-[7vh] translate-y-full bg-ink-950"
        />

        <div className="pointer-events-none absolute inset-0 z-30 flex items-center">
          {CHAPTERS.map((chapter) => (
            <div
              key={chapter.id}
              data-chapter={chapter.id}
              className="ml-6 opacity-0 md:ml-16"
            >
              <p className="font-mono text-xs tracking-[0.35em] text-accent uppercase">
                {chapter.title}
              </p>
              <p className="mt-3 max-w-xs text-3xl font-bold tracking-tight text-paper md:text-5xl">
                {chapter.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between p-6 font-mono text-[10px] tracking-[0.3em] text-paper/80 uppercase md:p-8">
          <span className="border border-white/20 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm">
            {label}
          </span>
          <span
            ref={progressRef}
            className="border border-white/20 bg-ink-950/60 px-3 py-1.5 backdrop-blur-sm"
          >
            00%
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between p-6 md:p-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-paper/50 uppercase">
              Scroll untuk memutar
            </p>
            <p className="mt-2 text-2xl font-light text-paper/90 md:text-4xl">
              {videoError ? 'Preview Film' : 'Karya dalam Gerak'}
            </p>
          </div>
          <p className="hidden font-mono text-xs text-paper/50 md:block">
            {videoError ? '—:—' : formatTime(0)} /{' '}
            {formatTime(videoRef.current?.duration)}
          </p>
        </div>
      </div>
    </section>
  )
}