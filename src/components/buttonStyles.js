// The Tailwind classes for our two button looks, so we don't type them again and again.
const base =
  'inline-block rounded-full border-2 px-5 py-2.5 text-center font-semibold transition hover:-translate-y-0.5 cursor-pointer'

export const solidButton = `${base} border-transparent bg-orange text-white shadow-lg shadow-orange/35 hover:bg-dark-orange`
export const outlineButton = `${base} border-black text-black hover:bg-black hover:text-white`
