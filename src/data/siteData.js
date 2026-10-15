// All the content of the site lives here, so the components stay short.
// To add a tour, add one more object to the `tours` array. No JSX changes needed.

export const navLinks = [
  { label: 'Home', href: '#top' },
  { label: 'Packages', href: '#packages' },
  { label: 'How it works', href: '#how' },
  { label: 'Stories', href: '#stories' },
  { label: 'Plan', href: '#plan' },
]

// carousel photos in the hero
export const slides = [
  {
    id: 1,
    place: 'Tegallalang, Bali',
    alt: 'Rice terraces and palm trees in Bali at sunrise',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=70',
  },
  {
    id: 2,
    place: 'Oia, Santorini',
    alt: 'White buildings overlooking the sea in Santorini',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=70',
  },
  {
    id: 3,
    place: 'Fushimi Inari, Kyoto',
    alt: 'Red torii gates and temple in Kyoto',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1400&q=70',
  },
  {
    id: 4,
    place: 'Swiss Alps',
    alt: 'Snowy Swiss Alps above a green valley',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1400&q=70',
  },
  {
    id: 5,
    place: 'Maldives',
    alt: 'Overwater villas above turquoise lagoon in the Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1400&q=70',
  },
]

export const stats = [
  { id: 1, value: '48', label: 'countries' },
  { id: 2, value: '12k+', label: 'happy travelers' },
  { id: 3, value: '4.9', label: 'average rating' },
]

// the tour packages. `type` is what the filter buttons look at.
export const tours = [
  {
    id: 1,
    name: 'Island Escape, Palawan',
    description: 'Lagoon hopping, snorkeling and sunset boats.',
    type: 'beach',
    days: 7,
    price: 1150,
    badge: 'Best seller',
    featured: true, // the big 2x2 card
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=70',
    alt: 'Turquoise beach with white sand',
  },
  {
    id: 2,
    name: 'Neon Tokyo',
    description: 'Food, temples and tech.',
    type: 'city',
    days: 6,
    price: 1480,
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=70',
    alt: 'Tokyo street at night with neon signs',
  },
  {
    id: 3,
    name: 'Paris in Spring',
    description: 'Museums, markets, Seine.',
    type: 'city',
    days: 5,
    price: 1320,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=70',
    alt: 'Eiffel Tower in Paris',
  },
  {
    id: 4,
    name: 'Alpine Trails',
    description: 'Hut-to-hut hiking.',
    type: 'adventure',
    days: 8,
    price: 1690,
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=70',
    alt: 'Mountain lake with forest',
  },
  {
    id: 5,
    name: 'Siargao Surf Week',
    description: 'Lessons and island life.',
    type: 'beach',
    days: 5,
    price: 780,
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=70',
    alt: 'Tropical beach with clear water',
  },
  {
    id: 6,
    name: 'Venice & Verona',
    description: 'Canals and quiet piazzas.',
    type: 'city',
    days: 4,
    price: 990,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=70',
    alt: 'Venice canal with gondolas',
  },
]

// the buttons above the grid
export const filters = [
  { value: 'all', label: 'All' },
  { value: 'beach', label: 'Beach' },
  { value: 'city', label: 'City' },
  { value: 'adventure', label: 'Adventure' },
]

// "icon" is the name of an icon in Icon.jsx
export const steps = [
  { id: 1, icon: 'chat', title: 'Tell us your vibe', text: 'Share dates, budget and mood.' },
  { id: 2, icon: 'pin', title: 'Get a custom route', text: 'Your planner drafts it within 48 hours.' },
  { id: 3, icon: 'shield', title: 'Travel protected', text: '24/7 support and flexible rebooking.' },
]

export const reviews = [
  { id: 1, quote: 'Our guide knew a ramen shop that wasn’t on any list. Best meal of the year.', author: 'Mika R., Tokyo tour' },
  { id: 2, quote: 'Plans changed last minute and they rebooked everything in an hour.', author: 'Daniel & Joy, Palawan' },
  { id: 3, quote: 'Felt like traveling with a friend who happens to know everything.', author: 'Sofia L., Alpine Trails' },
]
