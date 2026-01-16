import { useState } from 'react'
import { MapPin, Church } from 'lucide-react'
import './Attractions.css'

const touristSpots = [
  { name: 'Konni Elephant Training Centre', distance: '2 km', image: 'https://www.bandbkonni.com/images/nar-by1.jpg' },
  { name: 'Adavi Eco Tourism', distance: '10 km', image: 'https://www.bandbkonni.com/images/nar-by3.jpg' },
  { name: 'Gavi Forest', distance: '55 km', image: 'https://www.bandbkonni.com/images/nar-by5.jpg' },
  { name: 'Perunthenaruvi Waterfall', distance: '25 km', image: 'https://www.bandbkonni.com/images/nar-by7.jpg' },
]

const pilgrimSpots = [
  { name: 'Sabarimala Temple', distance: '65 km', image: 'https://www.bandbkonni.com/images/nar-by9.jpg' },
  { name: 'Mannadi Temple', distance: '5 km', image: 'https://www.bandbkonni.com/images/nar-by11.jpg' },
  { name: 'Aranmula Parthasarathy', distance: '15 km', image: 'https://www.bandbkonni.com/images/nar-by13.jpg' },
  { name: 'Pandalam Palace', distance: '12 km', image: 'https://www.bandbkonni.com/images/nar-by15.jpg' },
]

export default function Attractions() {
  const [activeTab, setActiveTab] = useState('tourist')

  const spots = activeTab === 'tourist' ? touristSpots : pilgrimSpots

  return (
    <section className="attractions section" id="attractions">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Nearby <span className="text-gradient">Attractions</span></h2>
          <p className="section-subtitle">
            Discover the beauty and spirituality of central Travancore
          </p>
        </div>

        <div className="attractions-tabs">
          <button 
            className={`tab-btn ${activeTab === 'tourist' ? 'active' : ''}`}
            onClick={() => setActiveTab('tourist')}
          >
            <MapPin size={20} />
            <span>Tourist Spots</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pilgrim' ? 'active' : ''}`}
            onClick={() => setActiveTab('pilgrim')}
          >
            <Church size={20} />
            <span>Pilgrim Centers</span>
          </button>
        </div>

        <div className="attractions-grid">
          {spots.map((spot, index) => (
            <div className="attraction-card" key={index}>
              <div className="attraction-image">
                <img src={spot.image} alt={spot.name} />
              </div>
              <div className="attraction-content">
                <h4>{spot.name}</h4>
                <p><MapPin size={14} /> {spot.distance} away</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
