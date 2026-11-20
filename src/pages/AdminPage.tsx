import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CalendarClock,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  fetchAppointments,
  seedInitialClinicDataIfMissing,
  subscribeAppointments,
  type AdminAppointmentRecord,
} from '../services/clinicFirestore';
import { AdminLoginView } from '../components/admin/AdminLoginView';
import {
  AdminOverviewSection,
  type AdminSectionId,
} from '../components/admin/AdminOverviewSection';
import { AdminDoctorSection } from '../components/admin/AdminDoctorSection';
import { AdminGallerySection } from '../components/admin/AdminGallerySection';
import { AdminClinicInfoSection } from '../components/admin/AdminClinicInfoSection';
import { AdminBranchesSection } from '../components/admin/AdminBranchesSection';
import { AdminAppointmentsSection } from '../components/admin/AdminAppointmentsSection';

const SIDEBAR_ITEMS: { id: AdminSectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'doctor', label: 'Doctor & Portrait', icon: Stethoscope },
  { id: 'gallery', label: 'Gallery Management', icon: ImageIcon },
  { id: 'clinic-info', label: 'Clinic Information', icon: Building2 },
  { id: 'branches', label: 'Branches & Hours', icon: MapPin },
  { id: 'appointments', label: 'Appointments', icon: CalendarClock },
];

export function AdminPage() {
  usePageMeta(
    'Clinic Admin Portal — Mittal Dental Clinic, Prayagraj',
    'Protected administrator dashboard for Mittal Dental Clinic, Prayagraj.',
  );

  const { user, isAdmin, authReady, authBusy, logout } = useAuth();
  const { clinicInfo, doctorProfile, branches, gallery } = useClinic();

  const [activeSection, setActiveSection] = useState<AdminSectionId>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState<AdminAppointmentRecord[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState('');

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setAppointmentsError('');
    try {
      const list = await fetchAppointments();
      setAppointments(list);
    } catch (err) {
      setAppointmentsError(
        err instanceof Error ? err.message : 'Unable to refresh appointment requests.',
      );
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      setAppointments([]);
      setLoadingAppointments(false);
      return;
    }

    let active = true;
    setLoadingAppointments(true);
    setAppointmentsError('');

    void seedInitialClinicDataIfMissing(user.uid).catch((err) => {
      if (!active) return;
      console.error('Initial clinic seeding warning:', err);
    });

    const unsubAppointments = subscribeAppointments(
      (list) => {
        if (!active) return;
        setAppointments(list);
        setAppointmentsError('');
        setLoadingAppointments(false);
      },
      (errMsg) => {
        if (!active) return;
        setAppointmentsError(errMsg);
        setLoadingAppointments(false);
      },
    );

    return () => {
      active = false;
      unsubAppointments();
    };
  }, [authReady, user, isAdmin]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-700 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="w-5 h-5 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
          <span>Verifying administrator session...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLoginView />;
  }

  const handleNavClick = (id: AdminSectionId) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  const pendingBadgeCount = appointments.filter(
    (a) => a.status === 'pending_clinic_confirmation',
  ).length;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between bg-slate-900 text-slate-100">
      <div>
        <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/35 text-teal-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-300 truncate">
              Admin Dashboard
            </p>
            <p className="text-sm font-bold text-white truncate">{clinicInfo.name}</p>
          </div>
        </div>

        <nav aria-label="Admin Dashboard Navigation" className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 min-h-[42px] rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.id === 'appointments' && pendingBadgeCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums ${
                      active ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {pendingBadgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-slate-800/70">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Signed In Admin
          </p>
          <p className="text-xs font-medium text-slate-200 truncate mt-0.5">
            {user.email || user.displayName || user.uid}
          </p>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 min-h-[40px] rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          type="button"
          onClick={() => void logout()}
          disabled={authBusy}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[42px] rounded-xl bg-slate-800 hover:bg-red-600/90 text-xs font-semibold text-slate-100 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-68 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="w-72 max-w-[85vw] h-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center cursor-pointer"
              aria-label="Close admin menu"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (Mobile + Desktop context header) */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700 truncate">
                Clinic Administration
              </p>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {SIDEBAR_ITEMS.find((s) => s.id === activeSection)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              disabled={authBusy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {activeSection === 'overview' && (
            <AdminOverviewSection
              clinicInfo={clinicInfo}
              doctorProfile={doctorProfile}
              branches={branches}
              gallery={gallery}
              appointments={appointments}
              loadingAppointments={loadingAppointments}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === 'doctor' && <AdminDoctorSection />}

          {activeSection === 'gallery' && <AdminGallerySection />}

          {activeSection === 'clinic-info' && <AdminClinicInfoSection />}

          {activeSection === 'branches' && <AdminBranchesSection />}

          {activeSection === 'appointments' && (
            <AdminAppointmentsSection
              appointments={appointments}
              loading={loadingAppointments}
              errorMsg={appointmentsError}
              onRefresh={loadAppointments}
              onUpdated={(updated) =>
                setAppointments((prev) =>
                  prev.map((item) => (item.id === updated.id ? updated : item)),
                )
              }
              onDeleted={(id) =>
                setAppointments((prev) => prev.filter((item) => item.id !== id))
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}
