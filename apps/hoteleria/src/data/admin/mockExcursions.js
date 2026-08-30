// Mock excursions data for hotel admin — info + schedules + capacity (cupos)
const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (d, n) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export const EXCURSION_CATEGORIES = ['Cultural', 'Nature', 'Beach', 'Cruise', 'Food', 'Photography']

export const mockExcursions = [
  {
    id: 'city-tour',
    name: 'Miami City Tour',
    category: 'Cultural',
    description: 'Explore the vibrant streets of Miami, from Art Deco buildings to Little Havana.',
    duration: '4 hours',
    price: 75,
    difficulty: 'Easy',
    location: 'Downtown Miami',
    meetingPoint: 'Hotel Lobby',
    guide: 'Carlos M.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600&q=80',
    included: ['Air-conditioned transport', 'Professional guide', 'Hotel pickup & drop-off'],
    status: 'active',
    departures: [
      { id: 'city-1', date: fmt(today), time: '09:00', capacity: 15, booked: 13 },
      { id: 'city-2', date: fmt(today), time: '14:00', capacity: 15, booked: 6 },
      { id: 'city-3', date: fmt(addDays(today, 1)), time: '09:00', capacity: 15, booked: 4 }
    ]
  },
  {
    id: 'everglades',
    name: 'Everglades Adventure',
    category: 'Nature',
    description: 'Airboat ride and wildlife spotting in the unique Everglades ecosystem.',
    duration: 'Full day',
    price: 149,
    difficulty: 'Moderate',
    location: 'Everglades National Park',
    meetingPoint: 'Hotel Lobby',
    guide: 'Diego R.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1564689510742-4e9c7584181d?w=600&q=80',
    included: ['Airboat ride', 'Alligator show', 'Lunch included', 'National park fees'],
    status: 'active',
    departures: [
      { id: 'ever-1', date: fmt(today), time: '08:00', capacity: 12, booked: 12 },
      { id: 'ever-2', date: fmt(addDays(today, 2)), time: '08:00', capacity: 12, booked: 5 }
    ]
  },
  {
    id: 'beach-day',
    name: 'Beach & Snorkeling',
    category: 'Beach',
    description: 'Relax on pristine beaches and discover underwater wonders with snorkeling gear.',
    duration: '6 hours',
    price: 95,
    difficulty: 'Easy',
    location: 'Key Biscayne',
    meetingPoint: 'Marina Dock 3',
    guide: 'Sofía L.',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
    included: ['Snorkeling gear', 'Beach chairs & umbrellas', 'Refreshments', 'Boat transfer'],
    status: 'active',
    departures: [
      { id: 'beach-1', date: fmt(today), time: '09:30', capacity: 20, booked: 9 },
      { id: 'beach-2', date: fmt(today), time: '13:30', capacity: 20, booked: 14 },
      { id: 'beach-3', date: fmt(addDays(today, 1)), time: '09:30', capacity: 20, booked: 2 }
    ]
  },
  {
    id: 'sunset-cruise',
    name: 'Sunset Yacht Cruise',
    category: 'Cruise',
    description: 'Sail into the sunset aboard a luxury yacht with champagne and gourmet appetizers.',
    duration: '3 hours',
    price: 189,
    difficulty: 'Easy',
    location: 'Biscayne Bay',
    meetingPoint: 'Marina Dock 1',
    guide: 'Martín G.',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&q=80',
    included: ['Champagne & wine', 'Gourmet appetizers', 'Live music', 'Professional crew'],
    status: 'active',
    departures: [
      { id: 'sun-1', date: fmt(today), time: '17:30', capacity: 8, booked: 7 },
      { id: 'sun-2', date: fmt(addDays(today, 1)), time: '17:30', capacity: 8, booked: 3 },
      { id: 'sun-3', date: fmt(addDays(today, 3)), time: '18:00', capacity: 8, booked: 0 }
    ]
  },
  {
    id: 'food-tour',
    name: 'Culinary Experience',
    category: 'Food',
    description: 'Taste the best of Miami cuisine with a guided food tour through iconic neighborhoods.',
    duration: '4 hours',
    price: 110,
    difficulty: 'Easy',
    location: 'Wynwood & Little Havana',
    meetingPoint: 'Hotel Lobby',
    guide: 'Lucía P.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    included: ['6 food tastings', 'Local drinks', 'Expert foodie guide', 'Walking tour'],
    status: 'active',
    departures: [
      { id: 'food-1', date: fmt(today), time: '11:00', capacity: 10, booked: 8 },
      { id: 'food-2', date: fmt(addDays(today, 2)), time: '17:00', capacity: 10, booked: 1 }
    ]
  },
  {
    id: 'photo-tour',
    name: 'Photography Tour',
    category: 'Photography',
    description: "Capture stunning shots of Miami's most photogenic spots with a professional photographer.",
    duration: '3 hours',
    price: 85,
    difficulty: 'Easy',
    location: 'South Beach',
    meetingPoint: 'Hotel Lobby',
    guide: 'Ana T.',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    included: ['Professional photographer', 'Edited photos', 'Instagram spots', 'Tips & tricks'],
    status: 'inactive',
    departures: [
      { id: 'photo-1', date: fmt(addDays(today, 1)), time: '06:30', capacity: 6, booked: 0 },
      { id: 'photo-2', date: fmt(addDays(today, 1)), time: '17:00', capacity: 6, booked: 2 }
    ]
  }
]

export const isToday = (dateStr) => dateStr === fmt(today)
