import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services, stats } from '../data/projects.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function About() {
  const scope = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-about]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: scope.current, start: 'top 70%', once: true },
        },
      )
    },
    { scope },
  )

  return (
    <section id="tentang" ref={scope} className="mx-auto max-w-6xl px-6 py-28 md:px-10">
      <div className="grid gap-14 md:grid-cols-2">
        <div>
          <p
            data-about
            className="mb-6 text-sm font-semibold tracking-[0.025em] text-saffron-spark uppercase"
          >
            Tentang Studio
          </p>
          <h2
            data-about
            className="text-3xl leading-tight font-normal tracking-[-0.02em] md:text-5xl"
          >
            Kami percaya bangunan terbaik adalah yang{' '}
            <span className="text-ash-gray">merespons tempat</span>, bukan
            sekadar berdiri di atasnya.
          </h2>
        </div>

        <div className="flex flex-col justify-end">
          <p
            data-about
            className="max-w-md text-lg leading-relaxed font-extralight text-ash-gray"
          >
            Firma yang bekerja di persimpangan antara material, iklim, dan
            cara manusia menghuni tempat. Dari sketsa pertama hingga
            furnitur terakhir, kami menjaga satu benang merah: ruang yang
            berbicara pelan — dan bertahan lama.
          </p>

          <div data-about className="mt-14">
            <h3 className="mb-5 text-sm font-semibold tracking-[0.025em] text-ash-gray uppercase">
              Layanan
            </h3>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 text-lg font-extralight"
                >
                  <span className="h-1.5 w-1.5 rotate-45 bg-electric-iris" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div data-about className="mt-14 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-normal text-saffron-spark md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs font-light tracking-[0.1em] text-ash-gray uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}