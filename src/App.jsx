import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Rooms from './components/Rooms'
import Facilities from './components/Facilities'
import Guests from './components/Guests'
import Attractions from './components/Attractions'
import Gallery from './components/Gallery'
import Offers from './components/Offers'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BackToTop from './components/BackToTop'
import Preloader from './components/Preloader'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && <Preloader />}
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Facilities />
        <Guests />
        <Attractions />
        <Gallery />
        <Offers />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}

export default App
