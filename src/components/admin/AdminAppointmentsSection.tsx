import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Phone,
  RefreshCw,
  Save,
  Search,
  Trash2,
} from 'lucide-react';
import {
  deleteAppointment,
  updateAppointmentStatus,
  type AdminAppointmentRecord,
  type AppointmentStatus,
} from '../../services/clinicFirestore';

interface AdminAppointmentsSectionProps {
  appointments: AdminAppointmentRecord[];
  loading: boolean;
  errorMsg?: string;
  onRefresh: () => Promise<void>;
  onUpdated: (updated: AdminAppointmentRecord) => void;
  onDeleted: (id: string) => void;
}

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'pending_clinic_confirmation', label: 'Pending Confirmation' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_BADGE: Record<AppointmentStatus, string> = {
  pending_clinic_confirmation: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-sky-50 text-sky-700 border-sky-200',
  cancelled: 'bg-slate-100 text-slate-600 border-slate-200',
};

function AppointmentItemCard({
  appt,
  onUpdated,
  onDeleted,
}: {
  appt: AdminAppointmentRecord;
  onUpdated: (updated: AdminAppointmentRecord) => void;
  onDeleted: (id: string) => void;
}) {
  const [status, setStatus] = useState<AppointmentStatus>(appt.status);
  const [adminNotes, setAdminNotes] = useState(appt.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setStatus(appt.status);
    setAdminNotes(appt.adminNotes || '');
  }, [appt.status, appt.adminNotes]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback('');
    try {
      await updateAppointmentStatus(appt.id, status, adminNotes);
      onUpdated({
        ...appt,
        status,
        adminNotes: adminNotes.trim(),
        updatedAt: new Date().toISOString(),
      });
      setFeedback('Saved');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAppointment(appt.id);
      onDeleted(appt.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-bold text-slate-900">{appt.patientName}</h3>
            <span className="font-mono text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md tabular-nums">
              {appt.referenceCode}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md border text-[11px] font-semibold ${
                STATUS_BADGE[appt.status]
              }`}
            >
              {STATUS_OPTIONS.find((s) => s.value === appt.status)?.label || appt.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
            <a
              href={`tel:${appt.mobileNumber.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 font-semibold text-slate-800 hover:text-teal-700 tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>{appt.mobileNumber}</span>
            </a>
            <span>
              <strong>Branch:</strong>{' '}
              {appt.branchId === 'civil-lines' ? 'Civil Lines' : 'Zero Road'}
            </span>
            <span>
              <strong>Service:</strong> {appt.treatment}
            </span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {appt.preferredDate} · {appt.preferredTime}
              </span>
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={deleting}
          onClick={() => void handleDelete()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg border border-red-200 hover:bg-red-50 disabled:opacity-50 text-xs font-semibold text-red-600 self-start shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{deleting ? 'Deleting...' : 'Delete'}</span>
        </button>
      </div>

      {appt.message && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-700">
          <span className="font-semibold text-slate-800">Patient Note:</span> {appt.message}
        </div>
      )}

      <div className="grid sm:grid-cols-12 gap-3 items-end pt-1 border-t border-slate-100">
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Confirmation Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-5">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Internal Desk Notes (Admin Only)
          </label>
          <input
            type="text"
            maxLength={500}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="e.g., Confirmed 5:30 PM slot by phone"
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-3 flex items-center justify-end gap-2">
          {feedback === 'Saved' && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved</span>
            </span>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold w-full sm:w-auto cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Update'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminAppointmentsSection({
  appointments,
  loading,
  errorMsg,
  onRefresh,
  onUpdated,
  onDeleted,
}: AdminAppointmentsSectionProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [branchFilter, setBranchFilter] = useState<'all' | 'civil-lines' | 'zero-road'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return appointments.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (branchFilter !== 'all' && item.branchId !== branchFilter) return false;
      if (!q) return true;
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.mobileNumber.toLowerCase().includes(q) ||
        item.referenceCode.toLowerCase().includes(q) ||
        item.treatment.toLowerCase().includes(q)
      );
    });
  }, [appointments, search, statusFilter, branchFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Appointment Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Private patient consultation requests accessible exclusively to authorized clinic administrators.
          </p>
        </div>
        <button
          type="button"
          disabled={refreshing}
          onClick={() => void handleRefresh()}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs grid sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name, mobile, treatment, or ref code..."
            className="w-full pl-9 pr-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | AppointmentStatus)}
            aria-label="Filter by status"
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={branchFilter}
            onChange={(e) =>
              setBranchFilter(e.target.value as 'all' | 'civil-lines' | 'zero-road')
            }
            aria-label="Filter by branch"
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900"
          >
            <option value="all">All Branches</option>
            <option value="civil-lines">Civil Lines</option>
            <option value="zero-road">Zero Road</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700"
        >
          Unable to synchronize appointment requests: {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-8 text-sm text-slate-500">
          Loading private appointment records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-10 text-center space-y-1.5">
          <p className="text-sm font-semibold text-slate-800">No matching appointment requests</p>
          <p className="text-xs text-slate-500">
            New requests submitted on the Contact page will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((appt) => (
            <AppointmentItemCard
              key={appt.id}
              appt={appt}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
