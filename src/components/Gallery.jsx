import { useState } from 'react'
import { X } from 'lucide-react'
import './Gallery.css'

const images = [
  { src: 'https://www.bandbkonni.com/images/unit-1.jpg', alt: 'Living Area', large: true },
  { src: 'https://www.bandbkonni.com/images/unit-3.jpg', alt: 'Bedroom' },
  { src: 'https://www.bandbkonni.com/images/unit-5.jpg', alt: 'Kitchen' },
  { src: 'https://www.bandbkonni.com/images/unit-7.jpg', alt: 'Conference Hall', tall: true },
  { src: 'https://www.bandbkonni.com/images/unit-9.jpg', alt: 'Dining Area' },
  { src: 'https://www.bandbkonni.com/images/unit-11.jpg', alt: 'Bathroom' },
  { src: 'https://www.bandbkonni.com/images/unit-13.jpg', alt: 'Balcony' },
  { src: 'https://www.bandbkonni.com/images/unit-15.jpg', alt: 'Exterior' },
  { src: 'https://www.bandbkonni.com/images/unit-17.jpg', alt: 'Garden' },
  { src: 'https://www.bandbkonni.com/images/unit-19.jpg', alt: 'Parking' },
  { src: 'https://www.bandbkonni.com/images/unit-21.jpg', alt: 'Reception' },
  { src: 'https://www.bandbkonni.com/images/wlcm-img.jpg', alt: 'Building' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section className="gallery section" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Gallery</span>
          <h2 className="section-title">Explore Our <span className="text-gradient">Spaces</span></h2>
          <p className="section-subtitle">
            Take a virtual tour through our beautifully designed apartments
          </p>
        </div>

        <div className="gallery-grid">
          {images.map((image, index) => (
            <div 
              className={`gallery-item ${image.large ? 'large' : ''} ${image.tall ? 'tall' : ''}`}
              key={index}
              onClick={() => setLightbox(image)}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
              <div className="gallery-overlay">
                <span>{image.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <img src={lightbox.src} alt={lightbox.alt} />
        </div>
      )}
    </section>
  )
}
