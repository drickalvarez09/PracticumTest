import Icon from './Icon.jsx'
import { steps } from '../data/siteData.js'

// extra top margin so each card sits a bit lower than the last (md and up only)
const offsets = ['', 'md:mt-6', 'md:mt-12']

function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="bg-mist">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-20 lg:px-12">
        <h2 id="how-title" className="font-serif text-3xl sm:text-4xl">
          Three steps. No spreadsheets.
        </h2>
        <ol className="mt-8 flex flex-col gap-5 md:flex-row">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={`group min-w-0 rounded-2xl border-t-4 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:shadow-xl md:flex-1 ${
                offsets[index]
              } ${index === 1 ? 'border-coral' : 'border-teal'}`}
            >
              <span className="mb-3 grid size-12 place-items-center rounded-full bg-cream text-xl text-teal transition group-hover:bg-coral group-hover:text-white">
                <Icon name={step.icon} />
              </span>
              <h3 className="mb-2 font-serif text-xl">{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks
