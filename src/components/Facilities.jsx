import { 
  Car, Wifi, Shield, Sun, Droplets, Wind, Utensils, Tv,
  Coffee, Shirt, TreePine, Dumbbell, Users, Flame, Zap, Smartphone
} from 'lucide-react'
import './Facilities.css'

const facilities = [
  { icon: Car, name: 'Basement Parking', desc: 'Secure parking' },
  { icon: Wifi, name: 'Free WiFi', desc: 'High-speed internet' },
  { icon: Shield, name: '24/7 Security', desc: 'CCTV surveillance' },
  { icon: Sun, name: 'Solar Energy', desc: 'Eco-friendly power' },
  { icon: Droplets, name: 'Rainwater Harvest', desc: 'Water conservation' },
  { icon: Wind, name: 'Air Conditioning', desc: 'Climate control' },
  { icon: Utensils, name: 'Kitchen Facility', desc: 'Fully equipped' },
  { icon: Tv, name: 'Smart TV', desc: 'Entertainment' },
  { icon: Coffee, name: 'Reception', desc: '24/7 assistance' },
  { icon: Shirt, name: 'Laundry', desc: 'Washing machine' },
  { icon: TreePine, name: 'Roof Garden', desc: 'Relaxation space' },
  { icon: Dumbbell, name: 'Badminton Court', desc: 'Recreation' },
  { icon: Users, name: 'Conference Hall', desc: 'Meeting space' },
  { icon: Flame, name: 'Fire Safety', desc: 'Full protection' },
  { icon: Zap, name: 'Power Backup', desc: 'Uninterrupted power' },
  { icon: Smartphone, name: 'Intercom', desc: 'Easy communication' },
]

export default function Facilities() {
  return (
    <section className="facilities section" id="facilities">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Amenities</span>
          <h2 className="section-title">World-Class <span className="text-gradient">Facilities</span></h2>
          <p className="section-subtitle">
            Everything you need for a comfortable and memorable stay
          </p>
        </div>

        <div className="facilities-grid">
          {facilities.map((facility, index) => (
            <div className="facility-card" key={index}>
              <div className="facility-icon">
                <facility.icon size={28} />
              </div>
              <h3>{facility.name}</h3>
              <p>{facility.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
