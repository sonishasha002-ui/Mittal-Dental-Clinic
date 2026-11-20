import { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, Save } from 'lucide-react';
import type { BranchInfo } from '../../data/clinicData';
import { useAuth } from '../../context/AuthContext';
import { useClinic } from '../../context/ClinicContext';
import { saveBranchRecord } from '../../services/clinicFirestore';

interface BranchFormCardProps {
  branch: BranchInfo;
  onSaved: (updated: BranchInfo) => void;
}

function BranchFormCard({ branch, onSaved }: BranchFormCardProps) {
  const { user } = useAuth();
  const [label, setLabel] = useState(branch.label);
  const [name, setName] = useState(branch.name);
  const [phone, setPhone] = useState(branch.phone);
  const [addressLinesText, setAddressLinesText] = useState(branch.addressLines.join('\n'));
  const [fullAddress, setFullAddress] = useState(branch.fullAddress);
  const [monSatText, setMonSatText] = useState(branch.hours.mondayToSaturday.join('\n'));
  const [sundayText, setSundayText] = useState(branch.hours.sunday.join('\n'));
  const [hoursNote, setHoursNote] = useState(branch.hours.note);
  const [mapsUrl, setMapsUrl] = useState(branch.mapsUrl);
  const [googleProfileUrl, setGoogleProfileUrl] = useState(branch.googleProfileUrl);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setLabel(branch.label);
    setName(branch.name);
    setPhone(branch.phone);
    setAddressLinesText(branch.addressLines.join('\n'));
    setFullAddress(branch.fullAddress);
    setMonSatText(branch.hours.mondayToSaturday.join('\n'));
    setSundayText(branch.hours.sunday.join('\n'));
    setHoursNote(branch.hours.note);
    setMapsUrl(branch.mapsUrl);
    setGoogleProfileUrl(branch.googleProfileUrl);
  }, [branch]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      const addressLines = addressLinesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const mondayToSaturday = monSatText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const sunday = sundayText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = await saveBranchRecord(
        {
          ...branch,
          label,
          name,
          phone,
          addressLines,
          fullAddress,
          mapsUrl,
          googleProfileUrl,
          hours: {
            ...branch.hours,
            mondayToSaturday,
            sunday,
            note: hoursNote,
          },
        },
        user.uid,
      );
      onSaved(updated);
      setSuccessMsg(`Saved ${branch.id === 'civil-lines' ? 'Civil Lines' : 'Zero Road'} branch details.`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save branch.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-700">
              {label}
            </p>
            <h3 className="text-base font-bold text-slate-900">{name}</h3>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Label *</label>
            <input
              type="text"
              required
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="text"
              required
              maxLength={25}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 tabular-nums"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Branch Name *</label>
          <input
            type="text"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Display Address Lines (one line per row) *
          </label>
          <textarea
            rows={3}
            required
            value={addressLinesText}
            onChange={(e) => setAddressLinesText(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Single-Line Full Address *
          </label>
          <input
            type="text"
            required
            maxLength={300}
            value={fullAddress}
            onChange={(e) => setFullAddress(e.target.value)}
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Monday–Saturday Timings (1 slot per line) *
            </label>
            <textarea
              rows={2}
              required
              value={monSatText}
              onChange={(e) => setMonSatText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sunday Timings (1 slot per line) *
            </label>
            <textarea
              rows={2}
              required
              value={sundayText}
              onChange={(e) => setSundayText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Branch Hours Note
          </label>
          <input
            type="text"
            maxLength={300}
            value={hoursNote}
            onChange={(e) => setHoursNote(e.target.value)}
            className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google Maps URL *
            </label>
            <input
              type="url"
              required
              maxLength={400}
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Google Business Profile URL *
            </label>
            <input
              type="url"
              required
              maxLength={400}
              value={googleProfileUrl}
              onChange={(e) => setGoogleProfileUrl(e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900"
            />
          </div>
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

        <div className="pt-1 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-semibold cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving Branch...' : 'Save Branch & Hours'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export function AdminBranchesSection() {
  const { branches, updateBranch } = useClinic();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Branch &amp; Opening Hours Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Independently update addresses, phone numbers, map links, and Monday–Saturday / Sunday schedules for Civil Lines and Zero Road.
        </p>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 items-start">
        {branches.map((branch) => (
          <BranchFormCard key={branch.id} branch={branch} onSaved={updateBranch} />
        ))}
      </div>
    </div>
  );
}
