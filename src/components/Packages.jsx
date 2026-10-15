import { useState } from 'react'
import TourCard from './TourCard.jsx'
import { tours, filters } from '../data/siteData.js'

function Packages({ onBook }) {
  // which filter button is selected: 'all', 'beach', 'city' or 'adventure'
  const [activeFilter, setActiveFilter] = useState('all')

  // Work out which tours to show. We never change the `tours` array itself,
  // we just make a shorter list from it each time the component renders.
  const visibleTours =
    activeFilter === 'all' ? tours : tours.filter((tour) => tour.type === activeFilter)

  return (
    <section
      id="packages"
      aria-labelledby="packages-title"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-20 lg:px-12"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 id="packages-title" className="font-serif text-3xl sm:text-4xl">
          Tour packages
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tours">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`cursor-pointer rounded-full border-2 border-ink px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-ink hover:text-white ${
                activeFilter === filter.value ? 'bg-ink text-white' : 'text-ink'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-grey" aria-live="polite">
        Showing {visibleTours.length} {visibleTours.length === 1 ? 'tour' : 'tours'}
      </p>

      {/* 1 column on phones, 2 from sm, 3 from lg. "grid-flow-dense" fills gaps. */}
      <div className="grid grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} onBook={onBook} />
        ))}
      </div>
    </section>
  )
}

export default Packages
