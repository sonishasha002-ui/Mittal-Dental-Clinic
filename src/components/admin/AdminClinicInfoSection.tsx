import { useEffect, useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClinic } from '../../context/ClinicContext';
import { saveClinicInfo, type ClinicInfoData } from '../../services/clinicFirestore';

export function AdminClinicInfoSection() {
  const { user } = useAuth();
  const { clinicInfo, setClinicInfoState } = useClinic();

  const [form, setForm] = useState<ClinicInfoData>(clinicInfo);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setForm(clinicInfo);
  }, [clinicInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);
    try {
      const saved = await saveClinicInfo(form, user.uid);
      setClinicInfoState(saved);
      setSuccessMsg('Clinic information saved to Firestore.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save clinic information.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Clinic Information Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage Mittal Dental Clinic’s official clinic description, city label, contact phone number, and WhatsApp enquiry number.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-2xs space-y-5"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Clinic Name *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              City / Region *
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={form.city}
              onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official Contact Number (Displayed) *
            </label>
            <input
              type="text"
              required
              maxLength={25}
              value={form.phoneDisplay}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneDisplay: e.target.value }))}
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 tabular-nums focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              WhatsApp Number (Country Code + Digits) *
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={form.whatsappNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, whatsappNumber: e.target.value }))}
              placeholder="919839580829"
              className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 tabular-nums focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Official Clinic Description *
          </label>
          <textarea
            rows={4}
            required
            maxLength={500}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-teal-600 focus:bg-white"
          />
          <p className="text-[11px] text-slate-400 mt-1 text-right tabular-nums">
            {form.description.length} / 500
          </p>
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-red-600" role="alert">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p
            role="status"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </p>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Clinic Information'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
