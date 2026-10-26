'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Icon from './Icon.jsx'
import { navLinks } from '../data/siteData.js'

function Header() {
  // true = the phone menu is open
  const [menuOpen, setMenuOpen] = useState(false)
  const { status } = useSession()
  const [theme, setTheme] = useState('light')

  // The theme-init script in layout.jsx has already set the class; read it here.
  useEffect(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  }, [])

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    setTheme(isDark ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-light-gray bg-cream/90 px-4 py-3 backdrop-blur sm:px-8 lg:px-12">
      <a
        href="#top"
        aria-label="Wanderly home"
        className="inline-flex items-center gap-1.5 font-serif text-2xl font-bold text-teal-dark"
      >
        <Icon name="plane" className="size-6" /> Wanderly
      </a>

      {/* Menu button: only shows on phones (hidden on md and bigger screens) */}
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="nav"
        onClick={() => setMenuOpen(!menuOpen)}
        className="cursor-pointer rounded-full bg-band px-4 py-2 font-semibold text-on-band md:hidden"
      >
        {menuOpen ? 'Close' : 'Menu'}
      </button>

      {/* Phone: a menu under the header that shows only when menuOpen is true.
          md and bigger: a normal row of links that always shows. */}
      <nav
        id="nav"
        aria-label="Main"
        className={`${menuOpen ? 'flex' : 'hidden'} absolute top-full right-0 left-0 flex-col gap-1 border-b border-light-gray bg-cream px-4 pt-2 pb-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="py-2 font-medium hover:text-teal-dark md:py-0"
          >
            {link.label}
          </a>
        ))}

        <button
          type="button"
          aria-pressed={theme === 'dark'}
          onClick={toggleTheme}
          className="cursor-pointer rounded-full border-2 border-black px-3 py-1 text-sm font-semibold hover:bg-black hover:text-white"
        >
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>

        {status === 'authenticated' ? (
          <button
            type="button"
            onClick={() => signOut({ redirectTo: '/' })}
            className="cursor-pointer py-2 text-left font-medium hover:text-teal-dark md:py-0"
          >
            Sign out
          </button>
        ) : status === 'unauthenticated' ? (
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="py-2 font-medium hover:text-teal-dark md:py-0"
          >
            Sign in
          </Link>
        ) : null}
      </nav>
    </header>
  )
}

export default Header
