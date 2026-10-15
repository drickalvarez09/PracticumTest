import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import MainContent from './components/MainContent.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <div id="top">
      <a
        href="#packages"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to packages
      </a>
      <Header />
      <Hero />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
