import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const marqueeText =
  'Arsitektur · Interior · Perabotan · Masterplan · Konsultasi · '

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
      <div className="py-4">
        <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-light tracking-[0.3em] text-ash-gray uppercase">
          <span>{marqueeText.repeat(4)}</span>
          <span>{marqueeText.repeat(4)}</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div data-footer className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-[0.025em] text-saffron-spark uppercase">
              Mulai Percakapan
            </p>
            <h2 className="mt-4 text-5xl font-normal tracking-[-0.03em] uppercase md:text-7xl">
              Punya
              <br />
              <span className="text-ash-gray">Lahan?</span>
            </h2>
          </div>

          <div className="flex flex-col justify-end gap-8">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="mailto:studio@firmaars.example"
                className="rounded-[24px] bg-electric-iris px-7 py-3 text-sm font-semibold tracking-[0.025em] text-white uppercase transition-opacity hover:opacity-80"
              >
                Mulai Proyek Desain
              </a>
              <a
                href="#koleksi"
                className="group text-sm font-semibold tracking-[0.025em] text-ash-gray uppercase transition-colors hover:text-bone-white"
              >
                Lihat Koleksi Perabotan
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
            <div className="flex flex-wrap gap-x-4 text-xs font-light tracking-[0.1em] text-ash-gray uppercase">
              <span>Jakarta</span>
              <span>·</span>
              <span>Bali</span>
              <span>·</span>
              <span>Yogyakarta</span>
            </div>
            <a
              href="mailto:studio@firmaars.example"
              className="w-fit text-xl font-extralight text-bone-white underline-offset-8 transition-colors hover:text-saffron-spark hover:underline md:text-2xl"
            >
              studio@firmaars.example
              <span className="ml-3 inline-block transition-transform group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>
        </div>

        <div
          data-footer
          className="mt-20 flex flex-col items-center justify-between gap-4 text-xs font-light tracking-[0.1em] text-ash-gray uppercase md:flex-row"
        >
          <span>© {new Date().getFullYear()} Firma Ars</span>
          <span>Dibangun dengan React · GSAP · Tailwind</span>
        </div>
      </div>
    </footer>
  )
}