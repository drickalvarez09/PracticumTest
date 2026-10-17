import Slideshow from './Slideshow.jsx'
import { stats } from '../data/siteData.js'
import { solidButton, outlineButton } from './buttonStyles.js'

function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto grid max-w-7xl items-center gap-6 px-4 pt-6 pb-12 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:pt-12 lg:px-12"
    >
      <div>
        <p className="mb-2 text-sm font-bold tracking-[0.15em] text-teal uppercase">
          Small-group &amp; private tours
        </p>
        <h1 id="hero-title" className="mb-4 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">
          Go where the <em className="text-orange">map</em> gets quiet.
        </h1>
        <p className="mb-4 text-lg">
          Wanderly Travel designs journeys around you: local guides, unhurried days, and zero
          tourist-trap itineraries.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#plan" className={solidButton}>
            Plan your trip
          </a>
          <a href="#packages" className={outlineButton}>
            Browse tours
          </a>
        </div>
      </div>

      {/* On phones the photo comes first (order-first). On md and bigger screens,
          order-none puts it back in its normal spot, the right column. */}
      <div className="order-first md:order-none">
        <Slideshow />
      </div>

      {/* The stats bar covers both columns on md and bigger screens */}
      <ul
        aria-label="Wanderly in numbers"
        className="mt-4 flex flex-col gap-4 rounded-2xl bg-black px-8 py-5 text-lg text-white sm:flex-row sm:justify-around md:col-span-2"
      >
        {stats.map((stat) => (
          <li key={stat.id} className="flex items-baseline gap-1.5">
            <strong className="font-serif text-3xl text-orange">{stat.value}</strong> {stat.label}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Hero
