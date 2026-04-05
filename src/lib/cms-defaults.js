const now = new Date().toISOString()

export const defaultNewsItems = [
  {
    id: 'news-1',
    title: 'Grand Opening of New Suites',
    date: '2026-03-20',
    excerpt: 'We are excited to unveil our newly designed suites with modern finishes.',
    content:
      'Our newest suites are now open, featuring upgraded interiors, better work-friendly spaces, and refreshed amenities for long and short stays.',
    imageUrl: '/images/slider-1.png',
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'news-2',
    title: 'Winter Specials for Groups',
    date: '2025-12-15',
    excerpt: 'Exclusive group rates are available this winter season.',
    content:
      'Planning travel with family or pilgrims? Contact us for special pricing on group bookings and extended stays during the season.',
    imageUrl: '/images/slider-2.png',
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'news-3',
    title: 'Open House Event',
    date: '2025-11-02',
    excerpt: 'Join us for a guided tour and refreshments.',
    content:
      'Visit our property, explore room options, and speak directly with our team about long-term and short-term accommodation plans.',
    imageUrl: '/images/slider-3.png',
    published: true,
    createdAt: now,
    updatedAt: now,
  },
]

export const defaultGalleryItems = [
  {
    id: 'gallery-1',
    title: 'Studio Room',
    alt: 'Studio room interior',
    category: 'Rooms',
    caption: 'Comfortable studio setup for solo travelers and couples.',
    imageUrl: '/images/rooms/studio.jpg',
    layout: 'large',
    visible: true,
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gallery-2',
    title: '1 BHK Apartment',
    alt: 'One bedroom apartment',
    category: 'Rooms',
    caption: '1 BHK apartment with modern amenities.',
    imageUrl: '/images/rooms/1bhk.jpg',
    layout: 'normal',
    visible: true,
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gallery-3',
    title: '2 BHK Apartment',
    alt: 'Two bedroom apartment',
    category: 'Rooms',
    caption: 'Spacious 2 BHK layout ideal for families.',
    imageUrl: '/images/rooms/2bhk.jpg',
    layout: 'large',
    visible: true,
    featured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gallery-4',
    title: 'Conference Hall',
    alt: 'Conference hall setup',
    category: 'Facilities',
    caption: 'Mini conference hall for meetings and gatherings.',
    imageUrl: '/images/rooms/conference.jpg',
    layout: 'tall',
    visible: true,
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gallery-5',
    title: 'Dormitory',
    alt: 'Dormitory room',
    category: 'Rooms',
    caption: 'Dormitory option for groups and pilgrim teams.',
    imageUrl: '/images/rooms/dormitory.jpg',
    layout: 'normal',
    visible: true,
    featured: false,
    createdAt: now,
    updatedAt: now,
  },
]

export function buildDefaultCmsData() {
  return {
    news: defaultNewsItems,
    gallery: defaultGalleryItems,
  }
}
