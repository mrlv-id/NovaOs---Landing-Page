import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'pt';

const translations = {
  en: {
    nav: { features: "Features", tech: "Technology", interface: "Interface", beta: "Get Beta" },
    hero: {
      title1: "Experience the",
      title2: "Fluid Future",
      subtitle: "NovaOS redefines mobile interaction with depth, motion, and intelligent minimalism. Your device, reimagined.",
      cta1: "Download Beta",
      cta2: "Learn More"
    },
    features: {
      f1_title: "Adaptive Layers", f1_desc: "Interface elements that stack and float based on priority and context.",
      f2_title: "Instant State", f2_desc: "Zero loading times. Apps resume exactly where you left them, instantly.",
      f3_title: "Privacy Core", f3_desc: "On-device processing for all sensitive data. Your life stays on your phone."
    },
    tech: {
      tag: "Architecture",
      title: "Built on pure performance.",
      desc: "The NovaOS kernel is stripped to the bare essentials. We removed legacy bloat to create a system that breathes.",
      p1: "Neural Engine Optimization",
      p2: "Real-time Fluid Rendering",
      p3: "Quantized Security Protocol"
    },
    interface: {
      title: "Interface",
      subtitle: "Beauty in utility.",
      screens: { home: "Home", wallet: "Wallet", music: "Music", health: "Health", camera: "Camera" }
    },
    testimonial: {
      text: "\"It feels less like a tool and more like an extension of thought. NovaOS is invisible technology at its finest.\"",
      role: "Product Designer"
    },
    cta: {
      title: "Ready to upgrade?",
      desc: "Join the beta today and shape the future of mobile computing. Limited spots available for the initial release.",
      btn1: "Download Beta Profile",
      btn2: "Join Waitlist"
    },
    footer: {
      desc: "Designed in California. Coded for the future.",
      col1: "Product", col2: "Company", col3: "Legal",
      rights: "© 2024 Nova Systems Inc. All rights reserved.",
      made: "Made with React & Three.js",
      links: { features: "Features", security: "Security", enterprise: "Enterprise", roadmap: "Roadmap", about: "About Us", careers: "Careers", press: "Press", contact: "Contact", privacy: "Privacy Policy", terms: "Terms of Service" }
    }
  },
  pt: {
    nav: { features: "Recursos", tech: "Tecnologia", interface: "Interface", beta: "Baixar Beta" },
    hero: {
      title1: "Vivencie um",
      title2: "Futuro Fluido",
      subtitle: "O NovaOS redefine a interação móvel com profundidade, movimento e um minimalismo inteligente. É o seu dispositivo, reimaginado.",
      cta1: "Baixar Beta",
      cta2: "Saiba Mais"
    },
    features: {
      f1_title: "Camadas Adaptativas", f1_desc: "Elementos de interface que se organizam e flutuam com base na prioridade e no contexto do momento.",
      f2_title: "Retomada Instantânea", f2_desc: "Zero tempo de carregamento. Seus aplicativos continuam exatamente de onde você parou, instantaneamente.",
      f3_title: "Privacidade Nativa", f3_desc: "Processamento local para todos os seus dados sensíveis. Sua vida permanece segura no seu dispositivo."
    },
    tech: {
      tag: "Arquitetura",
      title: "Construído para performance pura.",
      desc: "O kernel do NovaOS foi reduzido ao essencial. Eliminamos o peso de códigos legados para criar um sistema que realmente respira.",
      p1: "Otimização via Motor Neural",
      p2: "Renderização Fluida em Tempo Real",
      p3: "Protocolo de Segurança Quantizada"
    },
    interface: {
      title: "Interface",
      subtitle: "Beleza e utilidade em harmonia.",
      screens: { home: "Início", wallet: "Carteira", music: "Música", health: "Saúde", camera: "Câmera" }
    },
    testimonial: {
      text: "\"Parece menos uma ferramenta e mais uma extensão do meu pensamento. O NovaOS é o auge da tecnologia invisível.\"",
      role: "Designer de Produto"
    },
    cta: {
      title: "Pronto para o upgrade?",
      desc: "Participe do beta hoje e ajude a moldar o futuro da computação móvel. Vagas limitadas para o lançamento inicial.",
      btn1: "Baixar Perfil Beta",
      btn2: "Entrar na Lista de Espera"
    },
    footer: {
      desc: "Projetado na Califórnia. Codificado para o futuro.",
      col1: "Produto", col2: "Empresa", col3: "Legal",
      rights: "© 2024 Nova Systems Inc. Todos os direitos reservados.",
      made: "Desenvolvido com React & Three.js",
      links: { features: "Recursos", security: "Segurança", enterprise: "Corporativo", roadmap: "Roadmap", about: "Sobre Nós", careers: "Carreiras", press: "Imprensa", contact: "Contato", privacy: "Política de Privacidade", terms: "Termos de Uso" }
    }
  }
};

const LanguageContext = createContext<{ language: Language; setLanguage: (l: Language) => void; t: typeof translations['en'] } | undefined>(undefined);

export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
