import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

const links = [
  { label: 'Koleksi', href: '#koleksi' },
  { label: 'Proyek', href: '#proyek' },
  { label: 'Tentang', href: '#tentang' },
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
      className="fixed inset-x-0 top-0 z-50 opacity-0"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#top" className="flex items-center gap-2.5">
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            aria-hidden="true"
          >
            <path d="M7 0L14 12H0L7 0Z" fill="#8052ff" />
          </svg>
          <span className="text-sm font-semibold tracking-[0.025em] uppercase">
            Firma·Ars
          </span>
        </a>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold tracking-[0.025em] text-ash-gray uppercase transition-colors hover:text-bone-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#kontak"
          className="rounded-[24px] bg-electric-iris px-5 py-2.5 text-sm font-semibold tracking-[0.025em] text-white uppercase transition-opacity hover:opacity-80"
        >
          Mulai Proyek Desain
        </a>
      </nav>
    </header>
  )
}