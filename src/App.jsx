import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ScrollVideo from './components/ScrollVideo.jsx'
import Projects from './components/Projects.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  return (
    <main className="min-h-svh">
      {!ready && <Loader onComplete={() => setReady(true)} />}
      <Navbar ready={ready} />
      <Hero ready={ready} />
      <ScrollVideo />
      <Projects />
      <About />
      <Footer />
    </main>
  )
}