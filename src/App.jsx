import { useState } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import StatusSection from './components/StatusSection'
import RatesSection from './components/RatesSection'
import FeaturesSection from './components/FeaturesSection'
import RoadmapSection from './components/RoadmapSection'
import DonateSection from './components/DonateSection'
import DownloadSection from './components/DownloadSection'
import Footer from './components/Footer'
import RegisterModal from './components/RegisterModal'

function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <main>
      <Navbar onRegisterClick={() => setIsRegisterOpen(true)} />
      <HeroSection onRegisterClick={() => setIsRegisterOpen(true)} />
      <StatusSection />
      <div className="section-divider" />
      <RatesSection />
      <div className="section-divider" />
      <FeaturesSection />
      <div className="section-divider" />
      <RoadmapSection />
      <div className="section-divider" />
      <DonateSection />
      <div className="section-divider" />
      <DownloadSection />
      <Footer />
      
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </main>
  )
}

export default App
