import { useState } from 'react'
import Packages from './Packages.jsx'
import HowItWorks from './HowItWorks.jsx'
import Stories from './Stories.jsx'
import PlanForm from './PlanForm.jsx'

function MainContent() {
  // Two components use the destination: the "Book this trip" buttons
  // (inside Packages) set it, and PlanForm shows it.
  // When two components need the same data, we keep it in their parent. That is here.
  const [destination, setDestination] = useState('')

  return (
    <main>
      <Packages onBook={setDestination} />
      <HowItWorks />
      <Stories />

      <section
        id="plan"
        aria-labelledby="plan-title"
        className="bg-gradient-to-br from-teal-dark to-teal px-4 py-12 text-white sm:px-8 md:py-16 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <h2 id="plan-title" className="mb-2 font-serif text-3xl sm:text-4xl">
              Plan your trip
            </h2>
            <p>Tell us where you’re dreaming of. We’ll send a draft itinerary, no payment needed.</p>
          </div>
          <PlanForm destination={destination} onDestinationChange={setDestination} />
        </div>
      </section>
    </main>
  )
}

export default MainContent
