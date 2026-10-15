// Tailwind classes for our two button looks, shared so we don't repeat them.
const base =
  'inline-block rounded-full border-2 px-5 py-2.5 text-center font-semibold transition hover:-translate-y-0.5 cursor-pointer'

export const btnSolid = `${base} border-transparent bg-coral text-white shadow-lg shadow-coral/35 hover:bg-coral-dark`
export const btnOutline = `${base} border-ink text-ink hover:bg-ink hover:text-white`
