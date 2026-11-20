import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import type { BranchInfo, GalleryPhotoRecord } from '../../data/clinicData';
import type {
  AdminAppointmentRecord,
  ClinicInfoData,
  DoctorProfileData,
} from '../../services/clinicFirestore';

export type AdminSectionId =
  | 'overview'
  | 'doctor'
  | 'gallery'
  | 'clinic-info'
  | 'branches'
  | 'appointments';

interface AdminOverviewSectionProps {
  clinicInfo: ClinicInfoData;
  doctorProfile: DoctorProfileData;
  branches: BranchInfo[];
  gallery: GalleryPhotoRecord[];
  appointments: AdminAppointmentRecord[];
  loadingAppointments: boolean;
  onNavigate: (section: AdminSectionId) => void;
}

const STATUS_BADGE: Record<string, string> = {
  pending_clinic_confirmation: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-sky-50 text-sky-700 border-sky-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

const STATUS_LABEL: Record<string, string> = {
  pending_clinic_confirmation: 'Pending Confirmation',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function AdminOverviewSection({
  clinicInfo,
  doctorProfile,
  branches,
  gallery,
  appointments,
  loadingAppointments,
  onNavigate,
}: AdminOverviewSectionProps) {
  const pendingCount = appointments.filter(
    (a) => a.status === 'pending_clinic_confirmation',
  ).length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const recentAppointments = appointments.slice(0, 5);

  const metrics = [
    {
      label: 'Pending Appointments',
      value: loadingAppointments ? '—' : String(pendingCount),
      sub: `${appointments.length} total logged requests`,
      icon: Clock3,
      tone: 'text-amber-600 bg-amber-50 border-amber-200',
      target: 'appointments' as AdminSectionId,
    },
    {
      label: 'Confirmed Visits',
      value: loadingAppointments ? '—' : String(confirmedCount),
      sub: 'Verified at clinic desk',
      icon: CheckCircle2,
      tone: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      target: 'appointments' as AdminSectionId,
    },
    {
      label: 'Gallery Photographs',
      value: String(gallery.length),
      sub: 'Active clinic media library',
      icon: ImageIcon,
      tone: 'text-sky-600 bg-sky-50 border-sky-200',
      target: 'gallery' as AdminSectionId,
    },
    {
      label: 'Clinic Branches',
      value: String(branches.length),
      sub: 'Civil Lines & Zero Road',
      icon: MapPin,
      tone: 'text-teal-600 bg-teal-50 border-teal-200',
      target: 'branches' as AdminSectionId,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          Central control panel for {clinicInfo.name} ({clinicInfo.city}).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => onNavigate(m.target)}
              className="text-left rounded-2xl bg-white border border-slate-200 hover:border-teal-400 p-5 transition-colors shadow-2xs cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500">{m.label}</span>
                <span
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${m.tone}`}
                >
                  <Icon className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{m.value}</p>
              <p className="text-xs text-slate-500 mt-1">{m.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Recent Appointments + Quick Profiles */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CalendarClock className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Appointment Requests</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {loadingAppointments ? (
              <div className="p-6 text-sm text-slate-500">Loading appointment requests...</div>
            ) : recentAppointments.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No patient appointment requests have been submitted yet.
              </div>
            ) : (
              recentAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900">
                        {appt.patientName}
                      </span>
                      <span className="text-xs text-slate-500 tabular-nums">
                        {appt.mobileNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {appt.treatment} · {appt.branchId === 'civil-lines' ? 'Civil Lines' : 'Zero Road'} ·{' '}
                      <span className="tabular-nums">
                        {appt.preferredDate} ({appt.preferredTime})
                      </span>
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-semibold self-start sm:self-center whitespace-nowrap ${
                      STATUS_BADGE[appt.status] || STATUS_BADGE.pending_clinic_confirmation
                    }`}
                  >
                    {STATUS_LABEL[appt.status] || appt.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Doctor Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('doctor')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Edit Profile
              </button>
            </div>
            <div className="flex items-center gap-3.5 pt-1">
              {doctorProfile.portraitUrl ? (
                <img
                  src={doctorProfile.portraitUrl}
                  alt={doctorProfile.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-teal-300 flex items-center justify-center font-bold text-base shrink-0">
                  RM
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-900">{doctorProfile.name}</p>
                <p className="text-xs font-medium text-teal-700">{doctorProfile.qualification}</p>
                <p className="text-xs text-slate-500 mt-0.5">{doctorProfile.clinicalScope}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Clinic Contact Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('clinic-info')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Edit Info
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <span className="font-semibold text-slate-800">Phone:</span>{' '}
                <span className="tabular-nums">{clinicInfo.phoneDisplay}</span>
              </p>
              <p>
                <span className="font-semibold text-slate-800">WhatsApp:</span>{' '}
                <span className="tabular-nums">+{clinicInfo.whatsappNumber}</span>
              </p>
              <p className="text-slate-500 pt-1 line-clamp-2">{clinicInfo.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
