import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import MobileActionBar from './components/common/MobileActionBar';
import CookieConsent from './components/common/CookieConsent';
import QuoteWizardModal from './components/quote/QuoteWizardModal';
import ScrollToTop from './components/common/ScrollToTop';

// Standard Pages
import HomePage from './pages/HomePage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CitiesPage from './pages/CitiesPage';
import CityDetailPage from './pages/CityDetailPage';
import CityServiceDetailPage from './pages/CityServiceDetailPage';
import VenuesPage from './pages/VenuesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CorporatePage from './pages/CorporatePage';
import QuotePage from './pages/QuotePage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';

// High-Impact SEO Cluster & Money Pages
import ClusterMoneyPage from './pages/ClusterMoneyPage';
import TopicHubPage from './pages/TopicHubPage';

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteModalConfig, setQuoteModalConfig] = useState({ initialOrgType: '', initialCity: '' });

  const handleOpenQuoteModal = (config = {}) => {
    setQuoteModalConfig(config);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200 selection:text-slate-900">
        
        {/* Navigation */}
        <Navbar onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Dynamic Main Routes */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />
            
            {/* Money Pages - Cluster 1: Toplantı */}
            <Route path="/toplanti-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sirket-toplantisi-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sirket-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/kurumsal-toplanti" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/yonetim-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/satis-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/motivasyon-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/yil-sonu-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/strateji-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/donem-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Money Pages - Cluster 2: Bayi */}
            <Route path="/bayi-toplantisi-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-bulusmasi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-lansmani" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-egitimi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-motivasyon-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/bayi-toplantisi-otelleri" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Money Pages - Cluster 3: Kongre & Konferans */}
            <Route path="/kongre-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/konferans-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sempozyum-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/zirve-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/calistay-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/panel-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/seminer-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/egitim-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Money Pages - Cluster 4: Kurumsal Etkinlik & Piknik */}
            <Route path="/kurumsal-organizasyon" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/kurumsal-etkinlik" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/kurumsal-piknik-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/kurumsal-piknik" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sirket-piknigi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/personel-etkinligi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/aile-gunu-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/team-building" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/gala-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/odul-toreni" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/lansman-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/acilis-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/roadshow-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Money Pages - Cluster 5: Kamu & Protokol */}
            <Route path="/kamu-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/protokol-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/resmi-toren-organizasyonu" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/kamu-toplantisi" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/acilis-toreni" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/temel-atma-toreni" element={<ClusterMoneyPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Topic Hub Guides */}
            <Route path="/rehber/:hubSlug" element={<TopicHubPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Organizations Catalog */}
            <Route path="/organizasyonlar" element={<OrganizationsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/organizasyonlar/:slug" element={<OrganizationDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Services Catalog */}
            <Route path="/hizmetler" element={<ServicesPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/hizmetler/:slug" element={<ServiceDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* 81 Cities Directory */}
            <Route path="/sehirler" element={<CitiesPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sehirler/:sehirSlug" element={<CityDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/sehirler/:sehirSlug/:hizmetSlug" element={<CityServiceDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Direct City Root SEO Routes e.g. /antalya/bayi-toplantisi or /istanbul */}
            <Route path="/:sehirSlug" element={<CityDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/:sehirSlug/:hizmetSlug" element={<CityServiceDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Venues Explorer */}
            <Route path="/mekanlar" element={<VenuesPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Projects & Case Studies */}
            <Route path="/projeler" element={<ProjectsPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/projeler/:slug" element={<ProjectDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Corporate */}
            <Route path="/kurumsal" element={<CorporatePage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Dedicated Fast Quote Portal */}
            <Route path="/teklif-al" element={<QuotePage />} />

            {/* Blog & Guides */}
            <Route path="/blog" element={<BlogPage onOpenQuoteModal={handleOpenQuoteModal} />} />
            <Route path="/blog/:slug" element={<BlogDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Contact */}
            <Route path="/iletisim" element={<ContactPage onOpenQuoteModal={handleOpenQuoteModal} />} />

            {/* Legal */}
            <Route path="/yasal" element={<LegalPage />} />
            <Route path="/yasal/:type" element={<LegalPage />} />

            {/* Admin Management & CRM */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer onOpenQuoteModal={() => handleOpenQuoteModal()} />

        {/* Global Floating Elements */}
        <WhatsAppButton />
        <MobileActionBar onOpenQuoteModal={() => handleOpenQuoteModal()} />
        <CookieConsent />

        {/* 7-Step Quick Quote Modal */}
        <QuoteWizardModal
          isOpen={isQuoteModalOpen}
          onClose={handleCloseQuoteModal}
          initialOrgType={quoteModalConfig.initialOrgType}
          initialCity={quoteModalConfig.initialCity}
        />
      </div>
    </Router>
  );
}
