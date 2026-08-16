import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
  const [videoError, setVideoError] = useState(false)

  useGSAP(
    () => {
      const video = videoRef.current
      if (!video) return

      const onLoaded = () => {
        video.pause()
        video.currentTime = 0

        const tween = gsap.to(video, {
          currentTime: video.duration,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: () => `+=${video.duration * scrollFactor * 100}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current && !Number.isNaN(video.duration)) {
                const pct = Math.round(self.progress * 100)
                progressRef.current.textContent = `${String(pct).padStart(2, '0')}%`
              }
            },
          },
        })

        return () => tween.scrollTrigger?.kill()
      }

      if (video.readyState >= 1) {
        onLoaded()
      } else {
        video.addEventListener('loadedmetadata', onLoaded, { once: true })
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
            preload="metadata"
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover"
          />
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-6 font-mono text-[10px] tracking-[0.3em] text-paper/80 uppercase md:p-8">
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
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