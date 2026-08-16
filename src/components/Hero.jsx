import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Hero() {
  const scope = useRef(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '[data-hero-line]',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.12 },
      )
        .fromTo(
          '[data-hero-meta]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          '-=0.5',
        )
        .fromTo(
          '[data-hero-scroll]',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.3',
        )
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden px-6 pt-32 pb-16 md:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,160,94,0.12),transparent_55%)]" />

      <p
        data-hero-meta
        className="mb-6 font-mono text-xs tracking-[0.35em] text-accent uppercase"
      >
        Studio Arsitektur — Est. 2013
      </p>

      <h1 className="text-[13vw] leading-[0.9] font-bold tracking-tight uppercase md:text-[9vw]">
        <span className="block overflow-hidden">
          <span data-hero-line className="block">
            Merancang
          </span>
        </span>
        <span className="block overflow-hidden">
          <span data-hero-line className="block text-paper/40">
            Ruang &
          </span>
        </span>
        <span className="block overflow-hidden">
          <span data-hero-line className="block">
            <span className="text-accent">Narasi</span>
          </span>
        </span>
      </h1>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <p
          data-hero-meta
          className="max-w-md text-sm leading-relaxed text-paper/70"
        >
          Firma arsitektur yang bekerja di persimpangan antara material,
          iklim, dan cara manusia menghuni tempat. Kami merancang bangunan
          yang berbicara pelan — dan bertahan lama.
        </p>
        <div data-hero-meta className="flex gap-3">
          {['JKT', 'BALI', 'DIY'].map((city) => (
            <span
              key={city}
              className="rounded-full border border-white/15 px-4 py-1.5 font-mono text-[10px] tracking-widest"
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      <div
        data-hero-scroll
        className="mt-14 flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-paper/50 uppercase"
      >
        <span className="h-px w-10 bg-paper/40" />
        Scroll
      </div>
    </section>
  )
}