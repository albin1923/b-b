import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useAnimations'
import './Rooms.css'

const rooms = [
  {
    id: 1,
    type: 'Apartment',
    name: '1 BHK Apartment',
    description: 'Perfect for couples or solo travelers. Fully furnished with modern amenities.',
    image: 'https://www.bandbkonni.com/images/unit-3.jpg',
    price: '2,500',
    amenities: ['1 Bedroom', '1 Bathroom', 'Kitchen', 'WiFi'],
  },
  {
    id: 2,
    type: 'Apartment',
    name: '2 BHK Apartment',
    description: 'Spacious apartments ideal for families or small groups.',
    image: 'https://www.bandbkonni.com/images/unit-5.jpg',
    price: '3,500',
    amenities: ['2 Bedrooms', '2 Bathrooms', 'Kitchen', 'Living Room'],
    featured: true,
  },
  {
    id: 3,
    type: 'Conference',
    name: 'Conference Hall',
    description: 'Mini conference hall perfect for meetings and small events.',
    image: 'https://www.bandbkonni.com/images/unit-7.jpg',
    price: '3,500',
    amenities: ['40 Capacity', 'Projector', 'AC', 'Audio System'],
  },
]

export default function Rooms() {
  const [sectionRef, isVisible] = useScrollReveal(0.1)

  return (
    <section className="rooms section" id="rooms" ref={sectionRef}>
      <div className="rooms-bg"></div>
      <div className="container">
        <div className={`section-header ${isVisible ? 'visible' : ''}`}>
          <span className="section-tag reveal">Our Accommodations</span>
          <h2 className="section-title reveal">Comfort Meets <span className="text-gradient">Elegance</span></h2>
          <p className="section-subtitle reveal">
            Choose from our range of fully furnished apartments designed for your comfort
          </p>
        </div>

        <div className={`rooms-grid ${isVisible ? 'visible' : ''}`}>
          {rooms.map((room, index) => (
            <div 
              className={`room-card ${room.featured ? 'featured' : ''}`} 
              key={room.id}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="room-image">
                <img src={room.image} alt={room.name} loading="lazy" />
                {room.featured && <span className="room-badge">Most Popular</span>}
              </div>
              <div className="room-content">
                <span className="room-type">{room.type}</span>
                <h3 className="room-title">{room.name}</h3>
                <p className="room-description">{room.description}</p>
                <ul className="room-amenities">
                  {room.amenities.map((amenity, i) => (
                    <li key={i}>{amenity}</li>
                  ))}
                </ul>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="price">₹{room.price}</span>
                    <span className="per">/night</span>
                  </div>
                  <Link to="/contact" className="btn btn-primary">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`group-booking ${isVisible ? 'visible' : ''}`}>
          <div className="group-content">
            <div className="group-icon">
              <Users size={32} />
            </div>
            <div className="group-text">
              <h3>Planning a Group Trip?</h3>
              <p>Book all apartments together and enjoy special group rates.</p>
            </div>
            <div className="group-price">
              <span className="from">Starting from</span>
              <span className="amount">₹15,000</span>
              <span className="per">/day for all units</span>
            </div>
            <Link to="/contact" className="btn btn-accent">
              <span>Enquire Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
