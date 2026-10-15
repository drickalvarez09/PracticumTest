// A "controlled component": it keeps NO state of its own.
//   - `value` is the number to show        (the parent gives it to us)
//   - `onChange` is what we call to change it (the parent decides what to do)
// So the parent owns the number, and this component only displays it and
// reports button clicks. Same idea as QuantityStepper.
function TravelerStepper({ value, onChange, min = 1, max = 10 }) {
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="Number of travelers">
      <button
        type="button"
        aria-label="Fewer travelers"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="size-8 cursor-pointer rounded-full border-2 border-ink font-bold hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
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
        className="size-8 cursor-pointer rounded-full border-2 border-ink font-bold hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        +
      </button>
    </div>
  )
}

export default TravelerStepper
