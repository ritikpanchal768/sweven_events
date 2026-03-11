import { Event, AddOn } from '../types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'ELECTRO PULSE FESTIVAL 2026',
    subtitle: 'The Ultimate Electronic Music Experience',
    description: 'Join us for the most anticipated electronic music festival of the year featuring world-renowned DJs and immersive stage production. Experience 12 hours of non-stop music across 3 stages with cutting-edge visuals and sound.',
    category: 'Music',
    date: '2026-03-15',
    endDate: '2026-03-16',
    time: '18:00',
    venue: 'Skyline Arena',
    city: 'Los Angeles',
    address: '1234 Festival Boulevard, Los Angeles, CA 90015',
    image: 'https://images.unsplash.com/photo-1737107917840-ea155fb60498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZCUyMHB1cnBsZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzA1Njc5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1737107917840-ea155fb60498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBjcm93ZCUyMHB1cnBsZSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzA1Njc5OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: true,
    totalSeats: 5000,
    seatsLeft: 847,
    tags: ['EDM', 'Festival', 'Live Music'],
    organizer: {
      name: 'Sweven Events International'
    },
    ticketTiers: [
      {
        id: 't1-1',
        name: 'General Admission',
        price: 89,
        description: 'Access to all stages and general standing areas',
        seatsAvailable: 450,
        totalSeats: 3000,
        features: ['All stages access', 'Standing area', 'Food court access']
      },
      {
        id: 't1-2',
        name: 'VIP Experience',
        price: 249,
        description: 'Premium viewing areas, VIP lounge, and complimentary drinks',
        seatsAvailable: 89,
        totalSeats: 1000,
        features: ['VIP lounge access', 'Premium viewing area', 'Complimentary drinks', 'Exclusive merch', 'Fast-track entry']
      },
      {
        id: 't1-3',
        name: 'Platinum Backstage',
        price: 599,
        description: 'Ultimate VIP experience with backstage access',
        seatsAvailable: 12,
        totalSeats: 100,
        features: ['Backstage access', 'Meet & greet', 'Premium bar', 'Dedicated host', 'Gift package', 'VIP parking']
      }
    ],
    speakers: [
      {
        id: 's1-1',
        name: 'DJ Nebula',
        title: 'Headliner',
        bio: 'Grammy-nominated electronic artist with over 100M streams',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
      },
      {
        id: 's1-2',
        name: 'SYNTHWAVE',
        title: 'Main Stage',
        bio: 'Award-winning producer and live performer',
        image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400'
      }
    ],
    schedule: [
      { id: 'sch1-1', time: '18:00', title: 'Doors Open', description: 'Check-in and venue access' },
      { id: 'sch1-2', time: '19:00', title: 'Opening Act', description: 'Emerging artists showcase', speaker: 'Various Artists' },
      { id: 'sch1-3', time: '21:00', title: 'SYNTHWAVE Live', description: 'Main stage performance', speaker: 'SYNTHWAVE' },
      { id: 'sch1-4', time: '23:30', title: 'DJ Nebula Headliner Set', description: 'Closing headliner performance', speaker: 'DJ Nebula' }
    ],
    faqs: [
      { question: 'What is the minimum age?', answer: '18+ with valid ID required at entry' },
      { question: 'Is re-entry allowed?', answer: 'No re-entry once you leave the venue' },
      { question: 'What items are prohibited?', answer: 'No outside food, drinks, or professional cameras' }
    ]
  },
  {
    id: '2',
    title: 'TECH SUMMIT 2026',
    subtitle: 'Innovation • AI • Future',
    description: 'The premier technology conference bringing together industry leaders, innovators, and visionaries. Explore the latest in AI, blockchain, and emerging technologies through keynotes, workshops, and networking.',
    category: 'Conference',
    date: '2026-04-22',
    endDate: '2026-04-24',
    time: '09:00',
    venue: 'Innovation Center',
    city: 'San Francisco',
    address: '500 Tech Drive, San Francisco, CA 94105',
    image: 'https://images.unsplash.com/photo-1761223976372-f2324a8e2812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMG1vZGVybiUyMHN0YWdlfGVufDF8fHx8MTc3MDU2Nzk5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1761223976372-f2324a8e2812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29uZmVyZW5jZSUyMG1vZGVybiUyMHN0YWdlfGVufDF8fHx8MTc3MDU2Nzk5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: false,
    totalSeats: 2000,
    seatsLeft: 456,
    tags: ['Technology', 'AI', 'Networking'],
    organizer: {
      name: 'TechForward Events'
    },
    ticketTiers: [
      {
        id: 't2-1',
        name: 'Standard Pass',
        price: 399,
        description: 'Access to all sessions and expo hall',
        seatsAvailable: 234,
        totalSeats: 1500,
        features: ['All sessions', 'Expo hall', 'Conference materials', 'Lunch included']
      },
      {
        id: 't2-2',
        name: 'Premium Pass',
        price: 899,
        description: 'Includes workshops and VIP networking events',
        seatsAvailable: 78,
        totalSeats: 400,
        features: ['Everything in Standard', 'Workshop access', 'VIP networking', 'Speaker dinner', 'Premium swag']
      }
    ],
    schedule: [
      { id: 'sch2-1', time: '09:00', title: 'Registration & Breakfast', description: 'Check-in and networking breakfast' },
      { id: 'sch2-2', time: '10:00', title: 'Keynote: Future of AI', description: 'Opening keynote address' },
      { id: 'sch2-3', time: '14:00', title: 'Workshop Sessions', description: 'Hands-on technical workshops' },
      { id: 'sch2-4', time: '18:00', title: 'Networking Mixer', description: 'Evening networking event' }
    ],
    faqs: [
      { question: 'Are meals included?', answer: 'Yes, lunch is included for all pass types' },
      { question: 'Can I switch sessions?', answer: 'Yes, you can attend any session with your pass' }
    ]
  },
  {
    id: '3',
    title: 'STARTUP EXPO & NETWORKING',
    subtitle: 'Connect. Pitch. Invest.',
    description: 'The ultimate networking event for entrepreneurs, investors, and startup enthusiasts. Discover emerging companies, attend pitch competitions, and connect with key players in the startup ecosystem.',
    category: 'Business',
    date: '2026-03-28',
    time: '10:00',
    venue: 'Metro Convention Hall',
    city: 'New York',
    address: '789 Business Plaza, New York, NY 10001',
    image: 'https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudHxlbnwxfHx8fDE3NzA1NTk3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ldHdvcmtpbmclMjBldmVudHxlbnwxfHx8fDE3NzA1NTk3NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: false,
    totalSeats: 800,
    seatsLeft: 234,
    tags: ['Business', 'Startups', 'Networking'],
    organizer: {
      name: 'Venture Network'
    },
    ticketTiers: [
      {
        id: 't3-1',
        name: 'Entrepreneur',
        price: 149,
        description: 'Full event access for startup founders',
        seatsAvailable: 156,
        totalSeats: 500,
        features: ['Expo access', 'Pitch viewing', 'Networking sessions', 'Event app access']
      },
      {
        id: 't3-2',
        name: 'Investor',
        price: 299,
        description: 'Premium access with investor lounge',
        seatsAvailable: 45,
        totalSeats: 200,
        features: ['VIP lounge', 'Private meetings', 'Startup database', 'Priority seating', 'Exclusive dinner']
      }
    ],
    faqs: [
      { question: 'Can I exhibit my startup?', answer: 'Exhibitor packages available separately' },
      { question: 'Is there parking?', answer: 'Discounted parking available for attendees' }
    ]
  },
  {
    id: '4',
    title: 'GLOBAL FOOD FESTIVAL',
    subtitle: 'A Culinary Journey Around the World',
    description: 'Experience authentic cuisines from 30+ countries, cooking demonstrations by celebrity chefs, live music, and cultural performances in a vibrant outdoor setting.',
    category: 'Food & Drink',
    date: '2026-05-10',
    endDate: '2026-05-12',
    time: '12:00',
    venue: 'Riverside Park',
    city: 'Chicago',
    address: 'Riverside Park, Chicago, IL 60614',
    image: 'https://images.unsplash.com/photo-1760822399066-029921fe429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBvdXRkb29yfGVufDF8fHx8MTc3MDUxMDgzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1760822399066-029921fe429c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZmVzdGl2YWwlMjBvdXRkb29yfGVufDF8fHx8MTc3MDUxMDgzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: false,
    totalSeats: 10000,
    seatsLeft: 3421,
    tags: ['Food', 'Family', 'Outdoor'],
    organizer: {
      name: 'Global Taste Events'
    },
    ticketTiers: [
      {
        id: 't4-1',
        name: 'Day Pass',
        price: 35,
        description: 'Single day admission with food vouchers',
        seatsAvailable: 2841,
        totalSeats: 7000,
        features: ['Festival entry', '$20 food vouchers', 'Cooking demos', 'Live entertainment']
      },
      {
        id: 't4-2',
        name: 'Weekend Pass',
        price: 89,
        description: 'All 3 days with premium benefits',
        seatsAvailable: 580,
        totalSeats: 3000,
        features: ['3-day access', '$75 food vouchers', 'Chef meet & greets', 'Priority seating', 'Recipe book']
      }
    ],
    faqs: [
      { question: 'Are children allowed?', answer: 'Yes! Children under 12 free with adult' },
      { question: 'What if it rains?', answer: 'Event continues rain or shine with covered areas' }
    ]
  },
  {
    id: '5',
    title: 'CHAMPIONS CUP FINALS',
    subtitle: 'The Ultimate Showdown',
    description: 'Witness sporting history as the top teams compete for the championship title. Electric atmosphere, world-class athletes, and unforgettable moments await.',
    category: 'Sports',
    date: '2026-06-20',
    time: '19:30',
    venue: 'Grand Stadium',
    city: 'Miami',
    address: '1 Stadium Way, Miami, FL 33125',
    image: 'https://images.unsplash.com/photo-1762445964939-123200d655ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwbmlnaHR8ZW58MXx8fHwxNzcwNTY3OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1762445964939-123200d655ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwbmlnaHR8ZW58MXx8fHwxNzcwNTY3OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: true,
    totalSeats: 45000,
    seatsLeft: 8934,
    tags: ['Sports', 'Live Event', 'Championship'],
    organizer: {
      name: 'Sports Premier League'
    },
    ticketTiers: [
      {
        id: 't5-1',
        name: 'Upper Bowl',
        price: 79,
        description: 'Great view from upper sections',
        seatsAvailable: 5234,
        totalSeats: 30000,
        features: ['Upper level seating', 'Stadium access', 'Concessions available']
      },
      {
        id: 't5-2',
        name: 'Lower Bowl',
        price: 199,
        description: 'Premium lower level seating',
        seatsAvailable: 1200,
        totalSeats: 10000,
        features: ['Lower level seats', 'Better viewing angle', 'Club access']
      },
      {
        id: 't5-3',
        name: 'VIP Suite',
        price: 599,
        description: 'Luxury suite experience',
        seatsAvailable: 23,
        totalSeats: 500,
        features: ['Private suite', 'Catering included', 'Premium bar', 'Parking pass', 'Memorabilia']
      }
    ],
    faqs: [
      { question: 'Can I bring bags?', answer: 'Small clear bags only per stadium policy' },
      { question: 'Is parking included?', answer: 'Parking passes sold separately' }
    ]
  },
  {
    id: '6',
    title: 'MODERN ART EXHIBITION',
    subtitle: 'Contemporary Masters Gallery',
    description: 'An exclusive showcase of contemporary art featuring emerging and established artists. Interactive installations, guided tours, and artist talks.',
    category: 'Arts & Culture',
    date: '2026-04-05',
    endDate: '2026-05-15',
    time: '10:00',
    venue: 'Metropolitan Gallery',
    city: 'New York',
    address: '234 Art Avenue, New York, NY 10021',
    image: 'https://images.unsplash.com/photo-1569342380852-035f42d9ca41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NzA0NzI5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bannerImage: 'https://images.unsplash.com/photo-1569342380852-035f42d9ca41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwZXhoaWJpdGlvbnxlbnwxfHx8fDE3NzA0NzI5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isFeatured: false,
    totalSeats: 500,
    seatsLeft: 178,
    tags: ['Art', 'Exhibition', 'Culture'],
    organizer: {
      name: 'Metropolitan Arts Foundation'
    },
    ticketTiers: [
      {
        id: 't6-1',
        name: 'General Entry',
        price: 25,
        description: 'Self-guided exhibition access',
        seatsAvailable: 123,
        totalSeats: 400,
        features: ['Exhibition access', 'Audio guide', 'Gift shop discount']
      },
      {
        id: 't6-2',
        name: 'Guided Experience',
        price: 65,
        description: 'Expert-led tour with artist Q&A',
        seatsAvailable: 55,
        totalSeats: 100,
        features: ['Guided tour', 'Artist talk', 'Catalog included', 'Wine reception']
      }
    ],
    faqs: [
      { question: 'Photography allowed?', answer: 'Non-flash photography permitted in most areas' },
      { question: 'How long is the tour?', answer: 'Guided tours are approximately 90 minutes' }
    ]
  }
];

export const addOns: AddOn[] = [
  {
    id: 'addon-1',
    name: 'Event Merchandise Pack',
    price: 35,
    description: 'Exclusive t-shirt, poster, and collectible badge'
  },
  {
    id: 'addon-2',
    name: 'Premium Parking Pass',
    price: 25,
    description: 'Reserved parking spot near venue entrance'
  },
  {
    id: 'addon-3',
    name: 'Digital Photo Package',
    price: 15,
    description: 'Professional event photos delivered digitally'
  },
  {
    id: 'addon-4',
    name: 'VIP Lounge Access',
    price: 50,
    description: 'One-day access to exclusive VIP lounge area'
  }
];