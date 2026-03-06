import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import RatesSection from './components/RatesSection'
import FeaturesSection from './components/FeaturesSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'

function App() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <div className="section-divider" />
      <RatesSection />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <DownloadSection />
      <Footer />
    </main>
  )
}

export default App
