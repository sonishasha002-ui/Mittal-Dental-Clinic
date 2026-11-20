import { useEffect, useState } from 'react';
import { CheckCircle2, ImagePlus, Save, Trash2, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClinic } from '../../context/ClinicContext';
import {
  compressImageFileToDataUrl,
  saveDoctorProfile,
  type DoctorProfileData,
} from '../../services/clinicFirestore';

export function AdminDoctorSection() {
  const { user } = useAuth();
  const { doctorProfile, setDoctorProfileState } = useClinic();

  const [form, setForm] = useState<DoctorProfileData>(doctorProfile);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!isDirty) {
      setForm(doctorProfile);
    }
  }, [doctorProfile, isDirty]);

  const updateForm = (updater: (prev: DoctorProfileData) => DoctorProfileData) => {
    setIsDirty(true);
    setSuccessMsg('');
    setForm(updater);
  };

  const handlePortraitFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.target;
    const file = inputEl.files?.[0];
    if (!file) return;
    setErrorMsg('');
    setSuccessMsg('');
    setCompressing(true);
    try {
      const dataUrl = await compressImageFileToDataUrl(file);
      updateForm((prev) => ({ ...prev, portraitUrl: dataUrl }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not process image file.');
    } finally {
      setCompressing(false);
      inputEl.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);
    try {
      const saved = await saveDoctorProfile(form, user.uid);
      setIsDirty(false);
      setDoctorProfileState(saved);
      setForm(saved);
      setSuccessMsg('Doctor profile and portrait published to Firestore.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save doctor profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Doctor Profile &amp; Portrait Management
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage Dr. Rishabh Mittal’s credentials, biography, clinical scope, and official portrait shown on the public website.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Portrait Preview & Upload */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Doctor Portrait</h3>
            <UserCheck className="w-4 h-4 text-teal-600" />
          </div>

          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
            {form.portraitUrl ? (
              <img
                src={form.portraitUrl}
                alt={form.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 text-teal-300 flex items-center justify-center text-xl font-bold">
                  RM
                </div>
                <p className="text-xs text-slate-500">
                  No portrait uploaded yet. Public site currently displays verified initials badge.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2.5">
            <label className="block w-full">
              <span className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors cursor-pointer">
                <ImagePlus className="w-4 h-4" />
                <span>{compressing ? 'Optimizing Image...' : 'Upload Portrait Photo'}</span>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePortraitFile}
                disabled={compressing}
                className="sr-only"
              />
            </label>

            {form.portraitUrl && (
              <button
                type="button"
                onClick={() => updateForm((prev) => ({ ...prev, portraitUrl: '' }))}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Portrait</span>
              </button>
            )}

            {form.portraitUrl !== doctorProfile.portraitUrl && (
              <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                Portrait changed. Tap &ldquo;Save Doctor Profile&rdquo; to publish it to the public website.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Or Paste HTTPS Portrait URL
            </label>
            <input
              type="url"
              value={form.portraitUrl.startsWith('https://') ? form.portraitUrl : ''}
              onChange={(e) => updateForm((prev) => ({ ...prev, portraitUrl: e.target.value }))}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portrait Caption
            </label>
            <input
              type="text"
              maxLength={220}
              value={form.portraitCaption}
              onChange={(e) => updateForm((prev) => ({ ...prev, portraitCaption: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Right: Profile Fields */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Doctor Name *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => updateForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Qualification *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={form.qualification}
                onChange={(e) => updateForm((prev) => ({ ...prev, qualification: e.target.value }))}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Title *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={form.roleTitle}
                onChange={(e) => updateForm((prev) => ({ ...prev, roleTitle: e.target.value }))}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Clinical Focus / Scope *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={form.clinicalScope}
                onChange={(e) => updateForm((prev) => ({ ...prev, clinicalScope: e.target.value }))}
                className="w-full px-3.5 py-2.5 min-h-[42px] rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Biography Summary *
            </label>
            <textarea
              rows={5}
              required
              maxLength={1200}
              value={form.bio}
              onChange={(e) => updateForm((prev) => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 leading-relaxed focus:outline-none focus:border-teal-600 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1 text-right tabular-nums">
              {form.bio.length} / 1200
            </p>
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-600" role="alert">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving || compressing}
              className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Doctor Profile'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
