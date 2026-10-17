import Icon from './Icon.jsx'
import { navLinks } from '../data/siteData.js'

function Footer() {
  // the footer links are the same as the header links, without "Home"
  const links = navLinks.filter((link) => link.label !== 'Home')

  return (
    <footer className="flex flex-col gap-4 bg-black px-4 py-6 text-silver sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8 lg:px-12">
      <p className="inline-flex items-center gap-1.5 font-serif text-2xl font-bold text-white">
        <Icon name="plane" className="size-6" /> Wanderly
      </p>
      <ul className="flex flex-wrap gap-5">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="transition-colors hover:text-orange">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <small>&copy; 2026 Wanderly Travel. Test project, not a real business.</small>
    </footer>
  )
}

export default Footer
