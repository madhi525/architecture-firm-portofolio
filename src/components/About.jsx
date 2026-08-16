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
        { opacity: 0 },
        {
          opacity: 1,
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
    <section
      id="tentang"
      ref={scope}
      className="border-y border-white/10 bg-ink-900/40 py-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <p
          data-about
          className="mb-6 font-mono text-xs tracking-[0.35em] text-accent uppercase"
        >
          Tentang Studio
        </p>

        <h2
          data-about
          className="max-w-3xl text-3xl leading-snug font-bold tracking-tight md:text-5xl"
        >
          Kami percaya bangunan terbaik adalah yang{' '}
          <span className="text-paper/40">merespons tempat</span>, bukan
          sekadar berdiri di atasnya.
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          <div data-about>
            <h3 className="mb-4 font-mono text-xs tracking-[0.3em] text-paper/50 uppercase">
              Layanan
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 text-lg font-light"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div data-about className="md:col-span-2">
            <h3 className="mb-4 font-mono text-xs tracking-[0.3em] text-paper/50 uppercase">
              Angka
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border-l border-white/10 pl-4">
                  <p className="text-4xl font-bold text-accent md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] tracking-widest text-paper/50 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}