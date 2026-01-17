import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import BackToTop from './components/BackToTop'
import Preloader from './components/Preloader'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import RoomsPage from './pages/RoomsPage'
import FacilitiesPage from './pages/FacilitiesPage'
import AttractionsPage from './pages/AttractionsPage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Router>
      <ScrollToTop />
      {loading && <Preloader />}
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/attractions" element={<AttractionsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </Router>
  )
}

export default App
