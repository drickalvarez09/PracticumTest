// This is a "controlled component". It keeps NO state of its own.
//   - `value`: the number to show (the parent gives it to us)
//   - `onChange`: a function we call to change the number (the parent decides what to do)
// The parent owns the number. We only show it, and tell the parent when a button is clicked.
// Same idea as QuantityStepper.
function TravelerStepper({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="Number of travelers">
      <button
        type="button"
        aria-label="Fewer travelers"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="size-8 cursor-pointer rounded-full border-2 border-black font-bold hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
      >
        −
      </button>
      <span className="w-6 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="More travelers"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="size-8 cursor-pointer rounded-full border-2 border-black font-bold hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
      >
        +
      </button>
    </div>
  )
}

export default TravelerStepper
