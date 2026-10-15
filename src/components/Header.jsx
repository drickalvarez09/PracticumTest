import { useState } from 'react'
import Icon from './Icon.jsx'
import { navLinks } from '../data/siteData.js'
import { btnSolid } from './buttonStyles.js'

function Header() {
  // true = the mobile dropdown menu is showing
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-mist bg-cream/90 px-4 py-3 backdrop-blur sm:px-8 lg:px-12">
      <a
        href="#top"
        aria-label="Wanderly home"
        className="inline-flex items-center gap-1.5 font-serif text-2xl font-bold text-teal-dark"
      >
        <Icon name="plane" className="size-6" /> Wanderly
      </a>

      {/* Menu button: only visible on phones (hidden from md and up) */}
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="nav"
        onClick={() => setMenuOpen(!menuOpen)}
        className="cursor-pointer rounded-full bg-ink px-4 py-2 font-semibold text-white md:hidden"
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>

      {/* Phone: a dropdown under the header, shown only when menuOpen.
          md and up: a normal row of links that is always visible. */}
      <nav
        id="nav"
        aria-label="Main"
        className={`${menuOpen ? 'flex' : 'hidden'} absolute top-full right-0 left-0 flex-col gap-1 border-b border-mist bg-cream px-4 pt-2 pb-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="py-2 font-medium hover:text-coral md:py-0"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
