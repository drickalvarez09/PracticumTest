import { useState } from 'react'
import { btnSolid } from './buttonStyles.js'

// Shared look for every input / select / textarea
const inputClass =
  'w-full rounded-xl border-2 border-mist bg-white px-3 py-2.5 font-normal text-ink focus:border-teal focus:outline-none'

// A label + the input inside it + a spot for the error message
function Field({ label, error, className = '', children }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1 text-sm font-semibold ${className}`}>
      {label}
      {children}
      <small className="min-h-[1.1em] font-medium text-error">{error}</small>
    </label>
  )
}

// the earliest month you can pick, like "2026-10"
const thisMonth = new Date().toISOString().slice(0, 7)

// `destination` lives in the parent, because the "Book this trip" buttons
// on the cards need to fill it in. All the other fields live in here.
function PlanForm({ destination, onDestinationChange }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    month: '',
    travelers: '2',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  // One handler for all the simple fields: the input's `name` tells us which value to change
  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault() // stop the page from reloading

    const newErrors = {}
    if (values.name.trim().length < 2) newErrors.name = 'Please tell us your name.'
    if (!values.email.includes('@') || !values.email.includes('.')) {
      newErrors.email = 'Enter a valid email so we can reach you.'
    }
    if (destination.trim() === '') newErrors.destination = 'Where do you want to go?'
    if (values.month === '') newErrors.month = 'Pick a month.'
    else if (values.month < thisMonth) newErrors.month = 'That month already passed!'

    setErrors(newErrors)

    // no errors? show the thank-you and clear the form
    if (Object.keys(newErrors).length === 0) {
      const firstName = values.name.trim().split(' ')[0]
      setMessage(`Thanks ${firstName}! A planner will email you a ${destination} draft in 48 hours.`)
      setValues({ name: '', email: '', month: '', travelers: '2', notes: '' })
      onDestinationChange('')
    } else {
      setMessage('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-x-4 gap-y-2 rounded-2xl bg-white p-5 text-ink sm:grid-cols-2 sm:p-6"
    >
      <Field label="Your name" error={errors.name}>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Maria Santos"
          autoComplete="name"
          className={`${inputClass} ${errors.name ? 'border-error' : ''}`}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="maria@example.com"
          autoComplete="email"
          className={`${inputClass} ${errors.email ? 'border-error' : ''}`}
        />
      </Field>

      <Field label="Destination" error={errors.destination}>
        <input
          type="text"
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
          placeholder="e.g. Kyoto"
          className={`${inputClass} ${errors.destination ? 'border-error' : ''}`}
        />
      </Field>

      <Field label="Travel month" error={errors.month}>
        <input
          type="month"
          name="month"
          min={thisMonth}
          value={values.month}
          onChange={handleChange}
          className={`${inputClass} ${errors.month ? 'border-error' : ''}`}
        />
      </Field>

      <Field label="Travelers" className="sm:col-span-2">
        <select name="travelers" value={values.travelers} onChange={handleChange} className={inputClass}>
          <option>1</option>
          <option>2</option>
          <option>3–5</option>
          <option>6+</option>
        </select>
      </Field>

      <Field label={`Anything we should know? (${values.notes.length}/200)`} className="sm:col-span-2">
        <textarea
          name="notes"
          rows="3"
          maxLength="200"
          value={values.notes}
          onChange={handleChange}
          placeholder="Food allergies, honeymoon, hates early mornings..."
          className={`${inputClass} resize-y`}
        />
      </Field>

      {message && (
        <p role="status" className="rounded-xl bg-teal-light px-4 py-3 font-medium text-teal-dark sm:col-span-2">
          {message}
        </p>
      )}

      <button type="submit" className={`${btnSolid} sm:col-span-2`}>
        Plan your trip
      </button>
    </form>
  )
}

export default PlanForm
