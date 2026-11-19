import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { CLINIC_INFO, type BranchInfo } from '../data/clinicData';
import { NAV_ROUTES } from './Navbar';

export function Footer({ branches: _branches }: { branches?: BranchInfo[] }) {
  return (
    <footer className="relative bg-[#040F1B] text-white border-t border-[#00D9FF]/20">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/60 to-transparent"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 pb-12 border-b border-white/10">
          {/* Brand & Doctor */}
          <div className="max-w-md space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#176BFF] via-[#082B48] to-[#00D9FF] flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,217,255,0.3)]">
                <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none" aria-hidden="true">
                  <path
                    d="M10.5 7C7.8 7 6.5 9.6 7.3 13C7.9 15.6 9.3 18.1 9.8 23.2C10 24.9 11.7 25.3 12.6 23.4C13.8 20.8 14.5 18.2 16 18.2C17.5 18.2 18.2 20.8 19.4 23.4C20.3 25.3 22 24.9 22.2 23.2C22.7 18.1 24.1 15.6 24.7 13C25.5 9.6 24.2 7 21.5 7C19.3 7 17.9 8.2 16 8.2C14.1 8.2 12.7 7 10.5 7Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight group-hover:text-[#00D9FF] transition-colors">
                {CLINIC_INFO.name}
              </span>
            </Link>

            <p className="text-sm text-[#DFFAFF]/78 leading-relaxed">
              {CLINIC_INFO.description}
            </p>

            <div className="pt-1">
              <p className="font-display text-sm font-bold text-white">
                {CLINIC_INFO.doctor.name}
              </p>
              <p className="text-xs text-[#00D9FF]">{CLINIC_INFO.doctor.qualification}</p>
            </div>

            <a
              href={CLINIC_INFO.phoneHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#00D9FF] transition-colors tabular-nums pt-1 min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-[#00D9FF]" />
              <span>{CLINIC_INFO.phoneDisplay}</span>
            </a>
          </div>

          {/* Multi-Page Navigation Links */}
          <div className="md:min-w-[180px] space-y-3">
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-[#00D9FF]">
              Pages
            </h3>
            <ul className="space-y-1">
              {NAV_ROUTES.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center min-h-[36px] text-sm text-[#DFFAFF]/75 hover:text-[#00D9FF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#DFFAFF]/55">
          <p>
            © {new Date().getFullYear()} {CLINIC_INFO.name}, Prayagraj. All rights reserved.
          </p>
          <p>
            Please confirm branch-specific appointment timings via {CLINIC_INFO.phoneDisplay}.
          </p>
        </div>
      </div>
    </footer>
  );
}
