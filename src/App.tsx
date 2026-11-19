import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GalleryUploadModal } from './components/GalleryUploadModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { DoctorPage } from './pages/DoctorPage';
import { GalleryPage } from './pages/GalleryPage';
import { LocationsPage } from './pages/LocationsPage';
import { ContactPage } from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function AppShell() {
  const { branches } = useClinic();

  return (
    <div className="min-h-screen flex flex-col bg-[#EDF7FC] dark:bg-[#061525] text-[#061525] dark:text-white transition-colors duration-300 overflow-x-hidden">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/doctor" element={<DoctorPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer branches={branches} />
      <FloatingWhatsApp />
      <GalleryUploadModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ClinicProvider>
        <AppShell />
      </ClinicProvider>
    </ThemeProvider>
  );
}
