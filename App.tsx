import React from 'react';
import { 
  Navbar, 
  Hero, 
  Features, 
  TechLayers, 
  InterfaceShowcase, 
  Testimonial, 
  CTA, 
  Footer 
} from './components/Sections';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { Globe } from 'lucide-react';

const TranslateButton = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <button 
      onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
      className="fixed bottom-6 left-6 z-50 bg-nova-dark text-white px-4 py-3 rounded-full shadow-xl hover:scale-105 transition-transform font-medium flex items-center space-x-2 border border-gray-700"
    >
      <Globe size={18} />
      <span>{language === 'en' ? 'Traduzir para PT' : 'Translate to EN'}</span>
    </button>
  )
}

const AppContent = () => {
  return (
    <div className="min-h-screen bg-nova-bg text-nova-dark selection:bg-nova-accent selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <TechLayers />
        <InterfaceShowcase />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
      <TranslateButton />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App;