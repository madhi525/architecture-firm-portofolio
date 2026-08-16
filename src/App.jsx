import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ScrollVideo from './components/ScrollVideo.jsx'
import Projects from './components/Projects.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <main className="min-h-svh">
      <Navbar />
      <Hero />
      <ScrollVideo />
      <Projects />
      <About />
      <Footer />
    </main>
  )
}