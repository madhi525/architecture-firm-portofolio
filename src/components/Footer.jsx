import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const marqueeText = 'Arsitektur · Interior · Masterplan · Konsultasi · '

export default function Footer() {
  const scope = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-footer]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: scope.current, start: 'top 85%', once: true },
        },
      )
    },
    { scope },
  )

  return (
    <footer ref={scope} id="kontak" className="overflow-hidden">
      <div className="border-y border-white/10 bg-ink-900/60 py-4">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-mono text-xs tracking-[0.3em] text-paper/40 uppercase">
          <span>{marqueeText.repeat(4)}</span>
          <span>{marqueeText.repeat(4)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div data-footer className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
              Mulai Percakapan
            </p>
            <h2 className="mt-4 text-5xl font-bold tracking-tight uppercase md:text-7xl">
              Punya
              <br />
              <span className="text-paper/40">Lahan?</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-6">
            <a
              href="mailto:studio@firmaars.example"
              className="group text-xl font-light underline-offset-8 transition-colors hover:text-accent hover:underline md:text-2xl"
            >
              studio@firmaars.example
              <span className="ml-3 inline-block transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
            <div className="flex flex-wrap gap-4 font-mono text-[10px] tracking-widest text-paper/50 uppercase">
              <span>Jakarta</span>
              <span>·</span>
              <span>Bali</span>
              <span>·</span>
              <span>Yogyakarta</span>
            </div>
          </div>
        </div>

        <div
          data-footer
          className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[10px] tracking-widest text-paper/40 uppercase md:flex-row"
        >
          <span>© {new Date().getFullYear()} Firma Ars</span>
          <span>Dibangun dengan React · GSAP · Tailwind</span>
        </div>
      </div>
    </footer>
  )
}