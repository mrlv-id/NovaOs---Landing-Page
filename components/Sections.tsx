import React, { useState, useEffect, useRef } from 'react';
import { HeroScene, LayerScene, FloatingIconScene } from './Scene3D';
import { 
    Layers, Zap, Shield, Smartphone, ArrowRight, Menu, X, Star,
    CreditCard, TrendingUp, Activity, Play, SkipForward, Heart, 
    Sun, Cloud, Search, Mail, MessageSquare, Phone, Calendar,
    Aperture, Repeat, Shuffle, Mic, MapPin, Footprints, Flame, Camera
} from 'lucide-react';
import { FeatureItem, ScreenSlide } from '../types';
import { useLanguage } from './LanguageContext';

// --- Utility Component: RevealOnScroll ---
interface RevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

const RevealOnScroll: React.FC<RevealProps> = ({ children, className = "", delay = 0, direction = 'up' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    const getHiddenClass = () => {
        switch (direction) {
            case 'up': return 'translate-y-12';
            case 'down': return '-translate-y-12';
            case 'left': return 'translate-x-12'; // Starts right, moves left
            case 'right': return '-translate-x-12'; // Starts left, moves right
            default: return 'translate-y-12';
        }
    };

    return (
        <div 
            ref={ref} 
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-1000 ease-out transform ${
                isVisible 
                ? 'opacity-100 translate-x-0 translate-y-0 blur-0' 
                : `opacity-0 blur-sm ${getHiddenClass()}`
            } ${className}`}
        >
            {children}
        </div>
    );
};

// --- Header / Navbar ---
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-nova-bg/95 backdrop-blur-md py-3 shadow-sm' : 'bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-6 md:px-[6vw] flex justify-between items-center">
        <div className="text-xl md:text-2xl font-bold tracking-tighter text-nova-dark z-50 relative">NovaOS</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium text-nova-grey">
          <a href="#features" className="hover:text-nova-dark transition-colors">{t.nav.features}</a>
          <a href="#technology" className="hover:text-nova-dark transition-colors">{t.nav.tech}</a>
          <a href="#interface" className="hover:text-nova-dark transition-colors">{t.nav.interface}</a>
        </div>

        <div className="hidden md:block">
            <button className="px-5 py-2 rounded-full border border-nova-dark text-nova-dark text-sm hover:bg-nova-dark hover:text-white transition-colors">
                {t.nav.beta}
            </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-nova-dark z-50 relative" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-nova-white z-40 flex flex-col items-center justify-center space-y-8 transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <a href="#features" className="text-2xl text-nova-dark font-medium" onClick={() => setIsOpen(false)}>{t.nav.features}</a>
          <a href="#technology" className="text-2xl text-nova-dark font-medium" onClick={() => setIsOpen(false)}>{t.nav.tech}</a>
          <a href="#interface" className="text-2xl text-nova-dark font-medium" onClick={() => setIsOpen(false)}>{t.nav.interface}</a>
          <button className="px-8 py-3 rounded-full bg-nova-dark text-white text-lg mt-4" onClick={() => setIsOpen(false)}>
                {t.nav.beta}
          </button>
      </div>
    </nav>
  );
};

// --- Hero Section ---
export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-[6vw] pt-24 md:pt-20 overflow-hidden">
      
      {/* Text Content */}
      <div className="w-full md:w-1/2 z-10 flex flex-col justify-center items-start space-y-6 md:space-y-8 order-2 md:order-1 mt-8 md:mt-0 pb-12 md:pb-0">
        <RevealOnScroll>
            <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[1.1] text-nova-dark">
            {t.hero.title1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-dark to-gray-500">{t.hero.title2}</span>.
            </h1>
        </RevealOnScroll>
        
        <RevealOnScroll delay={200}>
            <p className="text-base sm:text-lg md:text-[20px] font-light text-[#444444] max-w-[500px] leading-relaxed">
            {t.hero.subtitle}
            </p>
        </RevealOnScroll>
        
        <RevealOnScroll delay={400} className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-nova-dark text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg sm:shadow-none text-center">
                {t.hero.cta1}
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-nova-dark text-nova-dark font-medium hover:bg-nova-dark/5 transition-colors duration-200 text-center">
                {t.hero.cta2}
            </button>
            </div>
        </RevealOnScroll>
      </div>

      {/* 3D Model Container */}
      <div className="w-full md:w-1/2 h-[45vh] md:h-screen relative order-1 md:order-2 cursor-grab active:cursor-grabbing flex items-center justify-center">
         <div className="w-full h-full animate-fade-in">
            <HeroScene />
         </div>
      </div>
    </section>
  );
};

// --- Features Section ---
export const Features: React.FC = () => {
  const { t } = useLanguage();
  const features: FeatureItem[] = [
    {
      icon: <Layers size={24} />,
      title: t.features.f1_title,
      description: t.features.f1_desc
    },
    {
      icon: <Zap size={24} />,
      title: t.features.f2_title,
      description: t.features.f2_desc
    },
    {
      icon: <Shield size={24} />,
      title: t.features.f3_title,
      description: t.features.f3_desc
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 px-6 md:px-[6vw]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <RevealOnScroll key={idx} delay={idx * 150} className="h-full">
            <div 
                className="group bg-white p-8 rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 h-full border border-transparent hover:border-gray-100"
            >
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-nova-dark group-hover:bg-nova-accent/10 group-hover:text-nova-accent transition-colors mb-6">
                {feature.icon}
                </div>
                <h3 className="text-[20px] md:text-[22px] font-semibold mb-3 text-nova-dark">{feature.title}</h3>
                <p className="text-[15px] md:text-[16px] font-light text-[#666666] leading-relaxed">
                {feature.description}
                </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
};

// --- Tech Layers Section ---
export const TechLayers: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="technology" className="py-20 px-6 md:px-[6vw] flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      <div className="w-full md:w-1/2 space-y-6">
        <RevealOnScroll direction="right">
            <div className="inline-block px-3 py-1 bg-gray-200 rounded-full text-xs font-bold tracking-widest text-gray-600 uppercase mb-2">
                {t.tech.tag}
            </div>
        </RevealOnScroll>
        
        <RevealOnScroll delay={100} direction="right">
            <h2 className="text-3xl md:text-4xl font-bold text-nova-dark">{t.tech.title}</h2>
        </RevealOnScroll>
        
        <RevealOnScroll delay={200} direction="right">
            <p className="text-base md:text-lg font-light text-gray-600 max-w-md">
                {t.tech.desc}
            </p>
        </RevealOnScroll>

        <div className="space-y-4 mt-8">
            <RevealOnScroll delay={300} direction="right">
                <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-nova-accent shrink-0"></div>
                    <span className="text-sm md:text-base">{t.tech.p1}</span>
                </div>
            </RevealOnScroll>
            <RevealOnScroll delay={400} direction="right">
                <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-nova-accent shrink-0"></div>
                    <span className="text-sm md:text-base">{t.tech.p2}</span>
                </div>
            </RevealOnScroll>
            <RevealOnScroll delay={500} direction="right">
                <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-nova-accent shrink-0"></div>
                    <span className="text-sm md:text-base">{t.tech.p3}</span>
                </div>
            </RevealOnScroll>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-[350px] md:h-[500px] relative bg-gray-100 rounded-[32px] md:rounded-[40px] overflow-hidden shadow-inner">
        <RevealOnScroll delay={200} className="w-full h-full" direction="left">
             <LayerScene />
        </RevealOnScroll>
      </div>
    </section>
  );
};

// --- Interface Carousel Section ---
export const InterfaceShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);

  // Using 'key' for logic, 'title' for display
  const slides: ScreenSlide[] = [
    { id: 0, key: "home", title: t.interface.screens.home, imageColor: "bg-[#F3F4F6]" },
    { id: 1, key: "wallet", title: t.interface.screens.wallet, imageColor: "bg-[#F8F9FA]" },
    { id: 2, key: "music", title: t.interface.screens.music, imageColor: "bg-[#F1F0F0]" },
    { id: 3, key: "health", title: t.interface.screens.health, imageColor: "bg-[#ECFDF5]" },
    { id: 4, key: "camera", title: t.interface.screens.camera, imageColor: "bg-black" },
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const renderScreenUI = (key: string, title: string) => {
    switch(key) {
        case "home":
            return (
                <div className="h-full flex flex-col p-6 relative">
                    {/* Time & Weather Widget */}
                    <div className="mt-8 flex justify-between items-start">
                         <div className="flex flex-col">
                            <span className="text-4xl md:text-5xl font-light text-gray-800 tracking-tight">09:41</span>
                            <span className="text-sm text-gray-500 font-medium mt-1">Wednesday, Oct 24</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <Sun size={24} className="text-yellow-500 mb-1" />
                            <span className="text-xl font-medium text-gray-800">72°</span>
                         </div>
                    </div>

                    {/* Notification Pill */}
                    <div className="mt-8 w-full bg-white rounded-2xl p-4 shadow-sm flex items-center space-x-4 border border-gray-100/50">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-500">
                            <Calendar size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">Design Review</p>
                            <p className="text-xs text-gray-400">10:00 AM • Room 402</p>
                        </div>
                    </div>

                    {/* App Grid */}
                    <div className="mt-auto grid grid-cols-4 gap-4 mb-4">
                        {[
                            { i: <Mail size={20} />, c: "bg-gray-800 text-white" },
                            { i: <MessageSquare size={20} />, c: "bg-white text-gray-800 border border-gray-200" },
                            { i: <Phone size={20} />, c: "bg-green-500 text-white" },
                            { i: <Search size={20} />, c: "bg-gray-200 text-gray-600" }
                        ].map((app, idx) => (
                            <div key={idx} className={`aspect-square rounded-2xl flex items-center justify-center ${app.c} shadow-sm`}>
                                {app.i}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case "wallet":
            return (
                <div className="h-full flex flex-col p-6 relative bg-gray-50">
                    <h2 className="mt-6 text-2xl font-bold text-gray-900 mb-6">{title}</h2>
                    
                    {/* Main Card */}
                    <div className="w-full aspect-[1.58] bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
                         <div className="flex justify-between items-start z-10">
                            <span className="font-medium tracking-wide">Nova Card</span>
                            <Zap size={20} className="text-yellow-400" />
                         </div>
                         <div className="z-10">
                             <p className="text-gray-400 text-xs uppercase mb-1">Balance</p>
                             <p className="text-3xl font-bold tracking-tight">$12,450.00</p>
                         </div>
                         <div className="flex justify-between items-center z-10">
                            <p className="text-sm text-gray-400">**** 4829</p>
                            <div className="w-8 h-5 bg-white/20 rounded-md"></div>
                         </div>
                    </div>

                    {/* Transactions */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-gray-800">Recent</span>
                            <span className="text-xs text-blue-500">View All</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { n: "Coffee House", t: "Today", a: "-$4.50", i: <CreditCard size={16} /> },
                                { n: "Uber Ride", t: "Yesterday", a: "-$14.20", i: <MapPin size={16} /> },
                                { n: "Transfer", t: "Oct 21", a: "+$200.00", i: <TrendingUp size={16} />, green: true }
                            ].map((tr, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                            {tr.i}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{tr.n}</p>
                                            <p className="text-xs text-gray-400">{tr.t}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-medium ${tr.green ? 'text-green-500' : 'text-gray-800'}`}>{tr.a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case "music":
            return (
                 <div className="h-full flex flex-col p-6 relative">
                    <div className="mt-4 flex justify-between items-center text-gray-500">
                        <ArrowRight className="rotate-180" size={20} />
                        <span className="text-xs uppercase tracking-widest font-medium">Now Playing</span>
                        <Menu size={20} />
                    </div>

                    <div className="mt-8 w-full aspect-square bg-gray-200 rounded-[2rem] shadow-lg overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100 flex items-center justify-center">
                            <Activity size={48} className="text-gray-400 opacity-50" />
                         </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-gray-800">Midnight City</h3>
                        <p className="text-lg text-gray-500 font-medium">M83</p>
                    </div>

                    <div className="mt-8">
                        <div className="w-full h-1 bg-gray-200 rounded-full mb-2">
                            <div className="w-1/3 h-full bg-gray-800 rounded-full relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-800 rounded-full shadow"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>1:20</span>
                            <span>4:03</span>
                        </div>
                    </div>

                    <div className="mt-auto mb-6 flex justify-between items-center px-2">
                        <Shuffle size={20} className="text-gray-400" />
                        <div className="flex items-center space-x-6">
                             <SkipForward size={24} className="text-gray-800 rotate-180 fill-current" />
                             <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform">
                                <Play size={28} fill="currentColor" className="ml-1" />
                             </div>
                             <SkipForward size={24} className="text-gray-800 fill-current" />
                        </div>
                        <Repeat size={20} className="text-gray-400" />
                    </div>
                </div>
            )
        case "health":
            return (
                <div className="h-full flex flex-col p-6 relative bg-emerald-50/30">
                     <div className="mt-6 flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <span className="text-xs font-bold">AS</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/50 mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2 text-emerald-600">
                                <Flame size={18} fill="currentColor" />
                                <span className="text-sm font-bold uppercase">Move</span>
                            </div>
                            <span className="text-xs text-gray-400">340/500</span>
                        </div>
                        <div className="relative w-full h-32 flex items-center justify-center">
                             {/* Simplified Ring Representation */}
                             <div className="w-28 h-28 rounded-full border-[12px] border-gray-100 relative flex items-center justify-center">
                                 <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 border-t-transparent border-l-transparent -rotate-45"></div>
                                 <div className="flex flex-col items-center">
                                     <span className="text-2xl font-bold text-gray-800">340</span>
                                     <span className="text-[10px] text-gray-400 uppercase">KCAL</span>
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100/50">
                             <div className="flex flex-col space-y-3">
                                 <Footprints size={20} className="text-orange-500" />
                                 <div>
                                    <span className="text-xl font-bold text-gray-800 block">5,240</span>
                                    <span className="text-xs text-gray-400">Steps</span>
                                 </div>
                             </div>
                         </div>
                         <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100/50">
                             <div className="flex flex-col space-y-3">
                                 <Heart size={20} className="text-red-500" fill="currentColor" />
                                 <div>
                                    <span className="text-xl font-bold text-gray-800 block">72</span>
                                    <span className="text-xs text-gray-400">BPM</span>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            )
        case "camera":
            return (
                <div className="h-full flex flex-col relative bg-black text-white">
                    {/* Viewfinder Area */}
                    <div className="absolute inset-0 bg-gray-800">
                        {/* Simulated image content or grid */}
                        <div className="w-full h-full opacity-30 flex items-center justify-center">
                            <div className="w-full h-px bg-white/20 absolute top-1/3"></div>
                            <div className="w-full h-px bg-white/20 absolute top-2/3"></div>
                            <div className="h-full w-px bg-white/20 absolute left-1/3"></div>
                            <div className="h-full w-px bg-white/20 absolute left-2/3"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-yellow-400/50 rounded-lg"></div>
                        </div>
                    </div>

                    {/* Top Controls */}
                    <div className="relative z-10 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                         <Zap size={20} className="text-white" />
                         <span className="px-3 py-1 bg-black/40 rounded-full text-xs font-medium backdrop-blur-md">RAW</span>
                         <Aperture size={20} className="text-white" />
                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-auto relative z-10 pb-8 px-6 pt-12 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center">
                         {/* Zoom */}
                         <div className="flex space-x-6 mb-8 text-xs font-bold">
                             <span className="opacity-50">.5</span>
                             <span className="text-yellow-400">1x</span>
                             <span className="opacity-50">3</span>
                         </div>
                         
                         <div className="flex justify-between items-center w-full px-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-lg border border-white/20"></div>
                            
                            {/* Shutter */}
                            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-14 h-14 bg-white rounded-full transition-transform active:scale-90"></div>
                            </div>
                            
                            <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md">
                                <Repeat size={20} className="text-white" />
                            </div>
                         </div>
                         
                         {/* Modes */}
                         <div className="flex space-x-6 mt-8 text-xs font-medium tracking-wider uppercase text-white/50">
                             <span>Video</span>
                             <span className="text-yellow-400">Photo</span>
                             <span>Portrait</span>
                         </div>
                    </div>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <section id="interface" className="py-24 bg-white overflow-hidden">
      <div className="px-6 md:px-[6vw] mb-12 flex flex-col md:flex-row justify-between items-start md:items-end space-y-6 md:space-y-0">
        <RevealOnScroll className="max-w-xl">
            <div>
            <h2 className="text-3xl md:text-4xl font-bold text-nova-dark mb-2">{t.interface.title}</h2>
            <p className="text-base md:text-lg text-gray-500 font-light">{t.interface.subtitle}</p>
            </div>
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
            <div className="flex space-x-4">
                <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </button>
                <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ArrowRight size={20} />
                </button>
            </div>
        </RevealOnScroll>
      </div>

      <RevealOnScroll delay={300} direction="left">
        <div className="relative w-full pl-6 md:pl-[6vw] overflow-visible">
            <div 
            className="flex space-x-6 md:space-x-8 transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeSlide * 300}px)` }}
            >
            {slides.map((slide, idx) => (
                <div 
                    key={slide.id} 
                    className={`flex-shrink-0 w-[260px] md:w-[280px] h-[540px] md:h-[580px] rounded-[32px] border-8 border-gray-800 bg-gray-900 shadow-2xl relative overflow-hidden transition-all duration-500 ${idx === activeSlide ? 'scale-100 opacity-100' : 'scale-95 opacity-60'}`}
                >
                    {/* Simulated Screen Content */}
                    <div className={`w-full h-full ${slide.imageColor} overflow-hidden`}>
                        {/* Status Bar */}
                        {slide.key !== "home" && (
                            <div className={`absolute top-2 left-0 w-full px-6 flex justify-between items-center text-xs font-bold z-20 ${slide.key === "camera" ? 'text-white' : 'text-gray-900'}`}>
                                <span>9:41</span>
                                <div className="flex items-center space-x-1">
                                    <div className="h-3 w-3 bg-current rounded-full opacity-20"></div>
                                    <div className="h-3 w-3 bg-current rounded-full opacity-20"></div>
                                    <div className="h-3 w-3 bg-current rounded-full"></div>
                                </div>
                            </div>
                        )}
                        
                        {renderScreenUI(slide.key, slide.title)}
                    </div>
                </div>
            ))}
            </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

// --- Testimonial Section ---
export const Testimonial: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 md:py-32 px-6 md:px-[6vw] bg-white flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 pointer-events-none">
          <RevealOnScroll delay={500} direction="left" className="w-full h-full">
               <div className="w-full h-full opacity-50">
                   <FloatingIconScene />
               </div>
          </RevealOnScroll>
      </div>
      
      <div className="max-w-[700px] z-10">
         <RevealOnScroll>
            <div className="flex justify-center mb-6 text-nova-accent space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
         </RevealOnScroll>
         <RevealOnScroll delay={200}>
            <h3 className="text-2xl md:text-4xl font-bold text-nova-dark leading-tight mb-8">
            {t.testimonial.text}
            </h3>
         </RevealOnScroll>
         <RevealOnScroll delay={400}>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                    <img src="https://picsum.photos/seed/novaos/100/100" alt="User" className="w-full h-full object-cover" />
                </div>
                <p className="font-semibold text-nova-dark">Alex V.</p>
                <p className="text-sm text-gray-500">{t.testimonial.role}</p>
            </div>
         </RevealOnScroll>
      </div>
    </section>
  );
};

// --- CTA Section ---
export const CTA: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 md:py-32 px-6 md:px-[6vw] bg-[#E9F6FF] relative overflow-hidden flex flex-col items-center text-center">
       {/* Background decorative blobs */}
       <div className="absolute -left-20 top-20 w-64 h-64 md:w-96 md:h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
       <div className="absolute -right-20 bottom-20 w-64 h-64 md:w-96 md:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>

       <div className="z-10 max-w-2xl w-full">
           <RevealOnScroll>
                <h2 className="text-3xl md:text-5xl font-bold text-nova-dark mb-6">{t.cta.title}</h2>
           </RevealOnScroll>
           <RevealOnScroll delay={200}>
                <p className="text-base md:text-lg text-gray-600 mb-10 font-light px-4">
                    {t.cta.desc}
                </p>
           </RevealOnScroll>
           <RevealOnScroll delay={400}>
                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full px-4">
                        <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-nova-dark text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                            {t.cta.btn1}
                        </button>
                        <button className="w-full sm:w-auto px-10 py-4 rounded-2xl border border-nova-dark text-nova-dark font-semibold hover:bg-white transition-colors">
                            {t.cta.btn2}
                        </button>
                </div>
           </RevealOnScroll>
       </div>
    </section>
  );
};

// --- Footer ---
export const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-nova-dark text-white py-16 md:py-20 px-6 md:px-[6vw]">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
           <RevealOnScroll className="col-span-1 md:col-span-1">
               <h3 className="text-2xl font-bold mb-6 tracking-tighter">NovaOS</h3>
               <p className="text-gray-400 text-sm font-light leading-relaxed">
                   {t.footer.desc}
               </p>
           </RevealOnScroll>
           
           <RevealOnScroll delay={100}>
               <h4 className="font-semibold mb-4 text-gray-200">{t.footer.col1}</h4>
               <ul className="space-y-2 text-sm text-gray-400 font-light">
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.features}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.security}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.enterprise}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.roadmap}</a></li>
               </ul>
           </RevealOnScroll>

           <RevealOnScroll delay={200}>
               <h4 className="font-semibold mb-4 text-gray-200">{t.footer.col2}</h4>
               <ul className="space-y-2 text-sm text-gray-400 font-light">
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.about}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.careers}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.press}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.contact}</a></li>
               </ul>
           </RevealOnScroll>

           <RevealOnScroll delay={300}>
               <h4 className="font-semibold mb-4 text-gray-200">{t.footer.col3}</h4>
               <ul className="space-y-2 text-sm text-gray-400 font-light">
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.privacy}</a></li>
                   <li><a href="#" className="hover:text-white transition-colors block py-1">{t.footer.links.terms}</a></li>
               </ul>
           </RevealOnScroll>
       </div>
       <RevealOnScroll delay={400} className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 md:gap-0">
           <p className="text-center md:text-left">{t.footer.rights}</p>
           <div className="flex space-x-4">
               <Smartphone size={16} />
               <span>{t.footer.made}</span>
           </div>
       </RevealOnScroll>
    </footer>
  );
};