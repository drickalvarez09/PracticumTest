import { useState } from 'react'
import Icon from './Icon.jsx'
import TravelerStepper from './TravelerStepper.jsx'
import { btnSolid, btnOutline } from './buttonStyles.js'

function formatPrice(number) {
  return '$' + number.toLocaleString('en-US')
}

function TourCard({ tour, onBook }) {
  // Every card has its OWN travelers number, so changing one card
  // does not touch the others.
  const [travelers, setTravelers] = useState(2)

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-ink/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        tour.featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <img
        src={tour.image}
        alt={tour.alt}
        loading="lazy"
        className={`h-44 w-full bg-mist object-cover ${tour.featured ? 'lg:h-auto lg:min-h-64 lg:flex-1' : ''}`}
      />
      <div className={`flex flex-col gap-1.5 p-4 ${tour.featured ? '' : 'flex-1'}`}>
        {tour.badge && (
          <span className="self-start rounded-full bg-coral px-3 py-0.5 text-xs font-bold text-white">
            {tour.badge}
          </span>
        )}
        <h3 className="font-serif text-xl leading-tight">{tour.name}</h3>
        <p className="text-grey">{tour.description}</p>

        <div className="mt-2 flex items-center justify-between font-semibold">
          <span className="inline-flex items-center gap-1 text-teal">
            <Icon name="clock" /> <span className="text-ink">{tour.days} days</span>
          </span>
          <span className="font-serif text-xl text-teal-dark">{formatPrice(tour.price)} / person</span>
        </div>

        {/* The reused controlled component: value comes from our state,
            and onChange updates that state. */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Travelers</span>
          <TravelerStepper value={travelers} onChange={setTravelers} />
        </div>
        <p className="text-right text-sm text-grey">
          Total for {travelers}:{' '}
          <strong className="text-ink">{formatPrice(tour.price * travelers)}</strong>
        </p>

        <a
          href="#plan"
          onClick={() => onBook(tour.name)}
          className={`mt-auto ${tour.featured ? btnSolid : btnOutline}`}
        >
          Book this trip
        </a>
      </div>
    </article>
  )
}

export default TourCard
