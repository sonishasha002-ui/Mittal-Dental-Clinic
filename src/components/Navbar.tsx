import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, Moon, Phone, Sun, X } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import { buildPhoneHref } from '../services/clinicFirestore';

export const NAV_ROUTES = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Treatments', to: '/treatments' },
  { label: 'Doctor', to: '/doctor' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Locations', to: '/locations' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { clinicInfo } = useClinic();
  const phoneHref = buildPhoneHref(clinicInfo.phoneDisplay);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 14);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? 'bg-white/88 dark:bg-[#061525]/90 border-b border-[#082B48]/12 dark:border-[#00D9FF]/22 shadow-[0_8px_32px_rgba(6,21,37,0.12)]'
          : 'bg-white/75 dark:bg-[#061525]/75 border-b border-[#082B48]/8 dark:border-[#00D9FF]/12'
      }`}
    >
      {/* Top Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="h-[2.5px] w-full origin-left bg-gradient-to-r from-[#00D9FF] via-[#00C6B7] to-[#176BFF]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-[68px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Mark */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D9FF] rounded-lg min-h-[44px]"
        >
          <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#176BFF] via-[#082B48] to-[#00D9FF] flex items-center justify-center shadow-[0_0_16px_rgba(0,217,255,0.32)] group-hover:shadow-[0_0_22px_rgba(0,217,255,0.55)] transition-shadow shrink-0">
            <svg viewBox="0 0 32 32" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" aria-hidden="true">
              <path
                d="M10.5 7C7.8 7 6.5 9.6 7.3 13C7.9 15.6 9.3 18.1 9.8 23.2C10 24.9 11.7 25.3 12.6 23.4C13.8 20.8 14.5 18.2 16 18.2C17.5 18.2 18.2 20.8 19.4 23.4C20.3 25.3 22 24.9 22.2 23.2C22.7 18.1 24.1 15.6 24.7 13C25.5 9.6 24.2 7 21.5 7C19.3 7 17.9 8.2 16 8.2C14.1 8.2 12.7 7 10.5 7Z"
                fill="white"
              />
            </svg>
          </span>
          <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-[#061525] dark:text-white transition-colors">
            {clinicInfo.name}
          </span>
        </Link>

        {/* Zone 2: Clean Single-Line Multi-Page Navigation */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-5 xl:gap-6">
          {NAV_ROUTES.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00D9FF] ${
                  isActive
                    ? 'text-[#176BFF] dark:text-[#00D9FF]'
                    : 'text-[#061525]/75 dark:text-[#DFFAFF]/75 hover:text-[#176BFF] dark:hover:text-[#00D9FF]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-glow-indicator"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#00D9FF] to-[#176BFF] shadow-[0_0_8px_rgba(0,217,255,0.75)]"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Theme Toggle Pill (Always Visible Desktop & Mobile) + CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Functional Pill-Shaped Dark/Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`relative inline-flex items-center w-[58px] sm:w-[62px] h-8 p-1 rounded-full border transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D9FF] shrink-0 ${
              theme === 'dark'
                ? 'bg-[#082B48] border-[#00D9FF]/60 shadow-[0_0_16px_rgba(0,217,255,0.35)]'
                : 'bg-[#DFFAFF] border-[#176BFF]/30 shadow-xs'
            }`}
          >
            <span className="sr-only">
              {theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}
            </span>
            <Sun
              className={`w-3.5 h-3.5 ml-1 transition-colors duration-200 ${
                theme === 'light' ? 'text-[#176BFF]' : 'text-[#DFFAFF]/45'
              }`}
              aria-hidden="true"
            />
            <Moon
              className={`w-3.5 h-3.5 ml-auto mr-1 transition-colors duration-200 ${
                theme === 'dark' ? 'text-[#00D9FF]' : 'text-[#082B48]/40'
              }`}
              aria-hidden="true"
            />
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                theme === 'dark'
                  ? 'left-[29px] sm:left-[33px] bg-gradient-to-br from-[#00D9FF] to-[#176BFF] text-[#061525]'
                  : 'left-1 bg-white text-[#176BFF] border border-[#176BFF]/20'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Sun className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </motion.span>
          </button>

          <a
            href={phoneHref}
            className="hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] hover:text-[#176BFF] dark:hover:text-[#00D9FF] transition-colors whitespace-nowrap shrink-0 tabular-nums px-2 py-2 rounded-lg"
            aria-label={`Call ${clinicInfo.phoneDisplay}`}
          >
            <Phone className="w-3.5 h-3.5 text-[#00C6B7] dark:text-[#00D9FF]" aria-hidden="true" />
            <span>{clinicInfo.phoneDisplay}</span>
          </a>

          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 min-h-[40px] rounded-xl bg-gradient-to-r from-[#176BFF] via-[#00A8E8] to-[#00C6B7] hover:shadow-[0_0_22px_rgba(0,217,255,0.45)] text-white text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00D9FF]"
          >
            Book Appointment
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-[#061525] dark:text-white hover:bg-[#DFFAFF] dark:hover:bg-[#082B48] transition-colors cursor-pointer shrink-0"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-white/98 dark:bg-[#061525]/98 backdrop-blur-xl border-b border-[#082B48]/12 dark:border-[#00D9FF]/22 shadow-2xl max-h-[calc(100vh-56px)] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4">
              <nav aria-label="Mobile Navigation" className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {NAV_ROUTES.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#176BFF]/15 to-[#00D9FF]/15 border border-[#00D9FF]/45 text-[#176BFF] dark:text-[#00D9FF]'
                          : 'text-[#061525] dark:text-[#DFFAFF]/85 hover:bg-[#DFFAFF]/60 dark:hover:bg-[#082B48]'
                      }`
                    }
                  >
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-3 border-t border-[#082B48]/10 dark:border-[#00D9FF]/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm font-semibold text-[#061525] dark:text-white tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF]" />
                  <span>Call {clinicInfo.phoneDisplay}</span>
                </a>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-sm font-semibold text-center"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
