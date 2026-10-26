'use client'

import { useState } from 'react'
import Icon from './Icon.jsx'
import { slides } from '../data/siteData.js'

function Slideshow() {
  // which slide is showing right now (0 = the first one)
  const [current, setCurrent] = useState(0)

  // the % makes it go around: after the last slide, it goes back to the first
  function goTo(index) {
    setCurrent((index + slides.length) % slides.length)
  }

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      className="relative aspect-[4/3] overflow-hidden rounded-[40%_60%_50%_50%/30%_30%_50%_50%] bg-teal shadow-xl shadow-black/15 md:aspect-[1/1.05] md:rounded-[60%_40%_50%_50%/40%_50%_50%_60%]"
    >
      {/* All slides sit on top of each other. Only the current one can be seen. */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== current}
          className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className="size-full object-cover"
          />
          <span className="absolute bottom-14 left-1/2 inline-flex max-w-[90%] -translate-x-1/2 items-center gap-1 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap">
            <Icon name="pin" /> {slide.place}
          </span>
        </div>
      ))}

      <button
        type="button"
        aria-label="Previous destination"
        onClick={() => goTo(current - 1)}
        className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 shadow hover:bg-orange hover:text-on-accent"
      >
        <Icon name="left" />
      </button>
      <button
        type="button"
        aria-label="Next destination"
        onClick={() => goTo(current + 1)}
        className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 shadow hover:bg-orange hover:text-on-accent"
      >
        <Icon name="right" />
      </button>

      <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show ${slide.place}`}
            onClick={() => goTo(index)}
            className={`size-3 cursor-pointer rounded-full ${index === current ? 'bg-orange' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slideshow
