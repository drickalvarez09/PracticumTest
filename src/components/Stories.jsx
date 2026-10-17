import Icon from './Icon.jsx'
import { reviews } from '../data/siteData.js'

function Stories() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-8 md:py-20 lg:px-12"
    >
      <h2 id="stories-title" className="font-serif text-3xl sm:text-4xl">
        Traveler stories
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {reviews.map((review, index) => (
          // the middle review is teal and sits a little lower
          <blockquote
            key={review.id}
            className={`m-0 rounded-2xl p-6 font-serif text-lg shadow-xl shadow-black/10 ${
              index === 1 ? 'bg-teal text-white md:translate-y-5' : 'bg-white'
            }`}
          >
            <p className="mb-2 flex text-yellow" aria-label="5 out of 5 stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <Icon key={n} name="star" />
              ))}
            </p>
            “{review.quote}”
            <footer className={`mt-4 font-sans text-sm ${index === 1 ? 'text-teal-light' : 'text-gray'}`}>
              {review.author}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export default Stories
