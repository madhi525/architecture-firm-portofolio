import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects } from '../data/projects.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Projects() {
  const scope = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-project]',
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 75%',
            once: true,
          },
        },
      )
    },
    { scope },
  )

  return (
    <section id="proyek" ref={scope} className="mx-auto max-w-6xl px-6 py-28 md:px-10">
      <div className="mb-14 flex items-end justify-between">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.35em] text-accent uppercase">
            Selected Works
          </p>
          <h2 className="text-4xl font-bold tracking-tight uppercase md:text-6xl">
            Proyek
          </h2>
        </div>
        <p className="hidden max-w-xs text-right text-sm leading-relaxed text-paper/50 md:block">
          Empat karya terpilih — dari hunian tepi tebing hingga ruang
          komunal yang dibangun bersama perajin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            data-project
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-ink-900"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <div className="flex h-full w-full items-end bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                <span className="font-mono text-6xl font-bold text-paper/10 transition-colors duration-500 group-hover:text-accent/30">
                  {project.id}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-paper/50 uppercase">
                <span>{project.category}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-paper/50">{project.location}</p>
              <p className="mt-4 text-sm leading-relaxed text-paper/60">
                {project.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}