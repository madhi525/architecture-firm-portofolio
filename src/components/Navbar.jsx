import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const links = [
  { label: 'Proyek', href: '#proyek' },
  { label: 'Tentang', href: '#tentang' },
  { label: 'Kontak', href: '#kontak' },
]

export default function Navbar({ ready = false }) {
  useGSAP(
    () => {
      if (!ready) return
      gsap.fromTo(
        '[data-nav]',
        { y: -32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
      )
    },
    { dependencies: [ready] },
  )

  return (
    <header
      data-nav
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm tracking-[0.3em] uppercase">
          Firma<span className="text-accent">·</span>Ars
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs tracking-widest text-paper/70 uppercase transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#kontak"
          className="rounded-full border border-accent/60 px-4 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors hover:bg-accent hover:text-ink-950"
        >
          Mulai Proyek
        </a>
      </nav>
    </header>
  )
}