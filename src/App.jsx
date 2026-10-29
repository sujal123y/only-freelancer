import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConfigProvider } from './context/ConfigContext';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import PortfolioSection from './components/PortfolioSection';
import AboutSection from './components/AboutSection';
import WorkflowSection from './components/WorkflowSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ClientDashboard from './pages/ClientDashboard';
import TeamDashboard from './pages/TeamDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import GalaxyBackground from './components/GalaxyBackground';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [introForcePlay, setIntroForcePlay] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [preselectedService, setPreselectedService] = useState('');
  const { user, loading: authLoading } = useAuth();

  // Scroll to top on page transition
  const navigate = (page, scrollTarget = null) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'home' && scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleDiscussService = (serviceName) => {
    setPreselectedService(serviceName);
    if (currentPage !== 'home') {
      navigate('home', 'contact');
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReplayIntro = () => {
    setIntroForcePlay(true);
    setShowIntro(true);
  };

  const renderCurrentPage = () => {
    if (currentPage === 'client') {
      if (!authLoading && !user) {
        return <AuthPage mode="client" onNavigate={navigate} />;
      }
      return (
        <>
          <Navbar onNavigate={navigate} activePage={currentPage} />
          <ClientDashboard onNavigate={navigate} />
          <Footer onNavigate={navigate} onReplayIntro={handleReplayIntro} />
        </>
      );
    }

    if (currentPage === 'team') {
      if (!authLoading && (!user || user.role === 'client')) {
        return <AuthPage mode="client" onNavigate={navigate} />;
      }
      return (
        <>
          <Navbar onNavigate={navigate} activePage={currentPage} />
          <TeamDashboard onNavigate={navigate} />
          <Footer onNavigate={navigate} onReplayIntro={handleReplayIntro} />
        </>
      );
    }

    if (currentPage === 'admin') {
      if (!authLoading && (!user || (user.role !== 'owner' && user.role !== 'admin'))) {
        return <AuthPage mode="admin" onNavigate={navigate} />;
      }
      return <AdminDashboard onNavigate={navigate} />;
    }

    if (currentPage === 'login') {
      return <AuthPage mode="client" onNavigate={navigate} />;
    }

    if (currentPage === 'admin-login') {
      return <AuthPage mode="admin" onNavigate={navigate} />;
    }

    if (currentPage === 'privacy') {
      return (
        <>
          <Navbar onNavigate={navigate} activePage={currentPage} />
          <PrivacyPolicy onNavigate={navigate} />
          <Footer onNavigate={navigate} onReplayIntro={handleReplayIntro} />
        </>
      );
    }

    if (currentPage === 'terms') {
      return (
        <>
          <Navbar onNavigate={navigate} activePage={currentPage} />
          <TermsOfService onNavigate={navigate} />
          <Footer onNavigate={navigate} onReplayIntro={handleReplayIntro} />
        </>
      );
    }

    // Default Home Page
    return (
      <>
        {showIntro && (
          <CinematicIntro
            forcePlay={introForcePlay}
            onComplete={() => {
              setShowIntro(false);
              setIntroForcePlay(false);
            }}
          />
        )}

        <Navbar onNavigate={navigate} activePage="home" />

        <main>
          <Hero
            onExploreWork={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            onStartProject={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          />

          <ServicesSection onDiscussProject={handleDiscussService} />

          <PortfolioSection onCommissionProject={handleDiscussService} />

          <AboutSection />

          <WorkflowSection />

          <ContactSection preselectedService={preselectedService} />
        </main>

        <Footer onNavigate={navigate} onReplayIntro={handleReplayIntro} />
      </>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      <GalaxyBackground />
      {renderCurrentPage()}
    </div>
  );

}

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </AuthProvider>
  );
}
