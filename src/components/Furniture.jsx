import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { furniture } from '../data/furniture.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function Furniture() {
  const scope = useRef(null)

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-furniture]',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
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
    <section
      id="koleksi"
      ref={scope}
      className="mx-auto max-w-6xl px-6 py-28 md:px-10"
    >
      <div className="mb-14 grid items-end gap-8 md:grid-cols-2">
        <div>
          <p className="mb-6 text-sm font-semibold tracking-[0.025em] text-saffron-spark uppercase">
            Koleksi Perabotan
          </p>
          <h2 className="text-4xl font-normal tracking-[-0.03em] uppercase md:text-6xl">
            Perabotan, <span className="text-ash-gray">Kurasi</span>
          </h2>
        </div>
        <p className="max-w-sm justify-self-end text-base leading-relaxed font-extralight text-ash-gray md:text-right">
          Jalur pendapatan kedua — furnitur yang melengkapi setiap ruang
          yang kami rancang. Bahan lokal, perajin terpercaya.
        </p>
      </div>

      <ul>
        {furniture.map((item) => (
          <li
            key={item.id}
            data-furniture
            className="group grid cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[6rem_1fr_auto_auto_auto]"
          >
            <span className="text-sm font-extralight text-ash-gray">
              {item.id}
            </span>
            <div>
              <h3 className="text-2xl font-normal tracking-[-0.02em] transition-colors group-hover:text-saffron-spark md:text-4xl">
                {item.name}
              </h3>
              <p className="mt-1 text-sm font-extralight text-silver-mist">
                {item.note}
              </p>
            </div>
            <span className="hidden text-sm font-semibold tracking-[0.025em] text-electric-iris uppercase md:block">
              {item.category}
            </span>
            <span className="hidden text-sm font-extralight text-ash-gray md:block">
              {item.year}
            </span>
            <span className="text-xl text-ash-gray transition-all group-hover:translate-x-1.5 group-hover:text-bone-white">
              →
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm font-extralight text-ash-gray">
        Katalog diperbarui berkala — foto & detail produk menyusul.
      </p>
    </section>
  )
}