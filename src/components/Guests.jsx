import { Users, Briefcase, Heart, Globe } from 'lucide-react'
import './Guests.css'

const guests = [
  {
    icon: Heart,
    title: 'Pilgrims',
    description: 'Gateway to Sabarimala and other sacred temples',
    image: 'https://www.bandbkonni.com/images/unit-9.jpg',
  },
  {
    icon: Users,
    title: 'Families',
    description: 'Perfect for family gatherings and celebrations',
    image: 'https://www.bandbkonni.com/images/unit-11.jpg',
  },
  {
    icon: Briefcase,
    title: 'Business',
    description: 'Ideal for corporate stays and meetings',
    image: 'https://www.bandbkonni.com/images/unit-13.jpg',
  },
  {
    icon: Globe,
    title: 'NRIs',
    description: 'A home away from home in Kerala',
    image: 'https://www.bandbkonni.com/images/unit-15.jpg',
  },
]

export default function Guests() {
  return (
    <section className="guests section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Who We Serve</span>
          <h2 className="section-title" style={{ color: 'white' }}>
            Perfect For <span className="text-gradient">Everyone</span>
          </h2>
        </div>

        <div className="guests-grid">
          {guests.map((guest, index) => (
            <div className="guest-card" key={index}>
              <div className="guest-image">
                <img src={guest.image} alt={guest.title} />
              </div>
              <div className="guest-overlay"></div>
              <div className="guest-content">
                <div className="guest-icon">
                  <guest.icon size={24} />
                </div>
                <h3>{guest.title}</h3>
                <p>{guest.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
