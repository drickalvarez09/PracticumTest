import { useState } from 'react'
import Icon from './Icon.jsx'
import TravelerStepper from './TravelerStepper.jsx'
import { solidButton, outlineButton } from './buttonStyles.js'

function formatPrice(number) {
  return '$' + number.toLocaleString('en-US')
}

function TourCard({ tour, onBook }) {
  // Every card has its OWN travelers number,
  // so changing one card does not change the others.
  const [travelers, setTravelers] = useState(2)

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        tour.featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <img
        src={tour.image}
        alt={tour.alt}
        loading="lazy"
        className={`h-44 w-full bg-light-gray object-cover ${tour.featured ? 'lg:h-auto lg:min-h-64 lg:flex-1' : ''}`}
      />
      <div className={`flex flex-col gap-1.5 p-4 ${tour.featured ? '' : 'flex-1'}`}>
        {tour.badge && (
          <span className="self-start rounded-full bg-orange px-3 py-0.5 text-xs font-bold text-on-accent">
            {tour.badge}
          </span>
        )}
        <h3 className="font-serif text-xl leading-tight">{tour.name}</h3>
        <p className="text-gray">{tour.description}</p>

        <div className="mt-2 flex items-center justify-between font-semibold">
          <span className="inline-flex items-center gap-1 text-teal">
            <Icon name="clock" /> <span className="text-black">{tour.days} days</span>
          </span>
          <span className="font-serif text-xl text-teal-dark">{formatPrice(tour.price)} / person</span>
        </div>

        {/* The same stepper is used on every card. `value` is our number,
            and `onChange` changes our number. */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Travelers</span>
          <TravelerStepper value={travelers} onChange={setTravelers} />
        </div>
        <p className="text-right text-sm text-gray">
          Total for {travelers}:{' '}
          <strong className="text-black">{formatPrice(tour.price * travelers)}</strong>
        </p>

        <a
          href="#plan"
          onClick={() => onBook(tour.name)}
          className={`mt-auto ${tour.featured ? solidButton : outlineButton}`}
        >
          Book this trip
        </a>
      </div>
    </article>
  )
}

export default TourCard
