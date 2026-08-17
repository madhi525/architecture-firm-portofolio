import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Particles from './Particles.jsx'

gsap.registerPlugin(useGSAP)

export default function Hero({ ready = false }) {
  const scope = useRef(null)

  useGSAP(
    () => {
      if (!ready) return

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
    { scope, dependencies: [ready] },
  )

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden px-6 pt-28 pb-16 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-2">
        <div>
          <p
            data-hero-meta
            className="mb-6 text-sm font-semibold tracking-[0.025em] text-saffron-spark uppercase"
          >
            Studio Arsitektur & Interior — Est. 2013
          </p>

          <h1 className="text-[13vw] leading-[0.95] font-normal tracking-[-0.04em] uppercase md:text-[7.5vw]">
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Merancang
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block text-ash-gray">
                Ruang &
              </span>
            </span>
            <span className="block overflow-hidden">
              <span data-hero-line className="block">
                Narasi
              </span>
            </span>
          </h1>

          <p
            data-hero-meta
            className="mt-8 max-w-md text-lg leading-relaxed font-extralight text-ash-gray"
          >
            Firma arsitektur dengan dua sumber pendapatan: jasa desain
            interior dan kurasi perabotan. Merancang ruang yang berbicara
            pelan — dan mengisinya dengan furnitur yang bertahan lama.
          </p>

          <div
            data-hero-meta
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href="#kontak"
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
        </div>

        <div
          data-hero-meta
          className="relative h-[42vh] min-h-[280px] md:h-[65vh]"
        >
          <Particles />
        </div>
      </div>

      <div
        data-hero-scroll
        className="absolute bottom-8 left-6 flex items-center gap-3 text-[10px] font-light tracking-[0.3em] text-ash-gray uppercase md:left-10"
      >
        <span className="h-px w-10 bg-silver-mist" />
        Scroll
      </div>
    </section>
  )
}