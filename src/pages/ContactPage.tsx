import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { TREATMENTS } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  buildPhoneHref,
  buildWhatsappHref,
  submitAppointmentRequest,
} from '../services/clinicFirestore';

interface SubmittedConfirmation {
  referenceCode: string;
  patientName: string;
  branchName: string;
  treatment: string;
  preferredDate: string;
  preferredTime: string;
}

export function ContactPage() {
  usePageMeta();
  const { clinicInfo, doctorProfile, branches } = useClinic();
  const [searchParams] = useSearchParams();

  const initialBranchParam = searchParams.get('branch');
  const initialTreatmentParam = searchParams.get('treatment');

  const [selectedBranchId, setSelectedBranchId] = useState<'civil-lines' | 'zero-road'>(
    initialBranchParam === 'zero-road' ? 'zero-road' : 'civil-lines',
  );
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [treatment, setTreatment] = useState(() => {
    if (
      initialTreatmentParam &&
      TREATMENTS.some((t) => t.title.toLowerCase() === initialTreatmentParam.toLowerCase())
    ) {
      return initialTreatmentParam;
    }
    return 'Dental Consultation';
  });
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM – 12:00 PM');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState<{
    appointment: SubmittedConfirmation;
    notice: string;
  } | null>(null);

  useEffect(() => {
    const b = searchParams.get('branch');
    if (b === 'civil-lines' || b === 'zero-road') {
      setSelectedBranchId(b);
    }
    const tr = searchParams.get('treatment');
    if (tr && TREATMENTS.some((t) => t.title.toLowerCase() === tr.toLowerCase())) {
      setTreatment(tr);
    }
  }, [searchParams]);

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];
  const availableSlots = activeBranch
    ? [...activeBranch.hours.mondayToSaturday, ...activeBranch.hours.sunday.map((s) => `Sunday: ${s}`)]
    : ['10:00 AM – 12:00 PM', '4:00 PM – 8:00 PM'];

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(preferredTime)) {
      setPreferredTime(availableSlots[0]);
    }
  }, [selectedBranchId, branches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const created = await submitAppointmentRequest({
        patientName,
        mobileNumber,
        branchId: selectedBranchId,
        branchName: activeBranch ? activeBranch.name : selectedBranchId,
        treatment,
        preferredDate,
        preferredTime,
        message,
      });

      setConfirmedRecord({
        appointment: {
          referenceCode: created.referenceCode,
          patientName: created.patientName,
          branchName: created.branchName,
          treatment: created.treatment,
          preferredDate: created.preferredDate,
          preferredTime: created.preferredTime,
        },
        notice: `Your appointment request has been received by ${clinicInfo.name}. Final slot confirmation will be provided by the clinic desk on ${clinicInfo.phoneDisplay}.`,
      });
      setPatientName('');
      setMobileNumber('');
      setMessage('');
    } catch (err) {
      let friendlyMsg = `Submission error. Please call ${clinicInfo.phoneDisplay}.`;
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message) as { error?: string };
          friendlyMsg = parsed.error || err.message;
        } catch {
          friendlyMsg = err.message;
        }
      }
      setErrorMsg(friendlyMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#176BFF]/18 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
            Contact &amp; Appointment Request
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
            Book Your Consultation in Prayagraj
          </h1>
          <p className="text-sm sm:text-base text-[#DFFAFF]/82 max-w-2xl leading-relaxed">
            Request an appointment at Civil Lines or Zero Road, or contact {doctorProfile.name}’s clinic desk directly on {clinicInfo.phoneDisplay}.
          </p>
        </div>
      </section>

      {/* Main Contact & Appointment Section */}
      <section className="py-12 sm:py-20 bg-[#EDF7FC] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Direct Call, WhatsApp & Verified Branch Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-[#061525] via-[#082B48] to-[#0A3558] text-white border border-[#00D9FF]/30 p-6 sm:p-7 space-y-5 shadow-xl">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#176BFF] to-[#00C6B7] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#00D9FF]">Official Clinic Contact</p>
                    <a
                      href={buildPhoneHref(clinicInfo.phoneDisplay)}
                      className="font-display text-xl sm:text-2xl font-bold text-white hover:text-[#00D9FF] transition-colors tabular-nums"
                    >
                      {clinicInfo.phoneDisplay}
                    </a>
                    <p className="text-xs text-[#DFFAFF]/72 mt-1">
                      Tap to call directly for toothache support or slot confirmation.
                    </p>
                  </div>
                </div>

                {activeBranch && (
                  <div className="pt-4 border-t border-white/12 space-y-3 text-xs text-[#DFFAFF]/82">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">{activeBranch.name}</p>
                        <p className="mt-0.5 leading-relaxed">{activeBranch.fullAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">Selected Branch Hours</p>
                        <p className="tabular-nums mt-0.5">
                          Mon–Sat: {activeBranch.hours.mondayToSaturday.join(' · ')}
                        </p>
                        <p className="tabular-nums">
                          Sunday: {activeBranch.hours.sunday.join(' · ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={buildPhoneHref(clinicInfo.phoneDisplay)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs font-semibold tabular-nums"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={buildWhatsappHref(clinicInfo.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/16 border border-[#00D9FF]/35 text-white text-xs font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#00D9FF]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Appointment Request Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#00D9FF]/50 via-[#176BFF]/30 to-[#00C6B7]/45 shadow-[0_20px_70px_rgba(6,21,37,0.14)]">
                <div className="rounded-[calc(1.5rem-1px)] bg-white dark:bg-[#082B48]/95 text-[#061525] dark:text-white p-6 sm:p-10">
                  {confirmedRecord ? (
                    <div className="space-y-6 py-4" role="status" aria-live="polite">
                      <div className="w-14 h-14 rounded-2xl bg-[#061525] border border-[#00D9FF]/35 text-[#00D9FF] flex items-center justify-center shadow-[0_0_24px_rgba(0,217,255,0.28)]">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF] mb-1">
                          Appointment Request Logged · Ref {confirmedRecord.appointment.referenceCode}
                        </p>
                        <h2 className="font-display text-2xl font-bold text-[#061525] dark:text-white mb-2">
                          Thank You, {confirmedRecord.appointment.patientName}
                        </h2>
                        <p className="text-sm text-[#061525]/80 dark:text-[#DFFAFF]/85 leading-relaxed">
                          {confirmedRecord.notice}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#EDF7FC] dark:bg-[#061525]/75 border border-[#082B48]/12 dark:border-[#00D9FF]/22 p-5 grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-[#061525]/60 dark:text-[#DFFAFF]/60">Selected Branch</p>
                          <p className="font-semibold text-[#061525] dark:text-white">
                            {confirmedRecord.appointment.branchName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#061525]/60 dark:text-[#DFFAFF]/60">Treatment / Service</p>
                          <p className="font-semibold text-[#061525] dark:text-white">
                            {confirmedRecord.appointment.treatment}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#061525]/60 dark:text-[#DFFAFF]/60">Preferred Date</p>
                          <p className="font-semibold text-[#061525] dark:text-white tabular-nums">
                            {confirmedRecord.appointment.preferredDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#061525]/60 dark:text-[#DFFAFF]/60">Preferred Time</p>
                          <p className="font-semibold text-[#061525] dark:text-white tabular-nums">
                            {confirmedRecord.appointment.preferredTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setConfirmedRecord(null)}
                          className="px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs font-semibold transition-all cursor-pointer"
                        >
                          Submit Another Request
                        </button>
                        <a
                          href={buildPhoneHref(clinicInfo.phoneDisplay)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white tabular-nums"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#00C6B7] dark:text-[#00D9FF]" />
                          <span>Call {clinicInfo.phoneDisplay}</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="patientName" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                            Patient Name *
                          </label>
                          <input
                            id="patientName"
                            type="text"
                            required
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45 focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                          />
                        </div>

                        <div>
                          <label htmlFor="mobileNumber" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                            Mobile Number *
                          </label>
                          <input
                            id="mobileNumber"
                            type="tel"
                            required
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            placeholder="10-digit mobile number"
                            className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45 tabular-nums focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                          Select Branch *
                        </span>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {branches.map((branch) => {
                            const isSelected = selectedBranchId === branch.id;
                            return (
                              <button
                                key={branch.id}
                                type="button"
                                onClick={() => setSelectedBranchId(branch.id)}
                                className={`text-left p-3.5 min-h-[56px] rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#DFFAFF] dark:bg-[#061525] border-[#00C6B7] dark:border-[#00D9FF] text-[#061525] dark:text-white shadow-[0_0_16px_rgba(0,217,255,0.18)]'
                                    : 'bg-[#EDF7FC] dark:bg-[#061525]/55 border-[#082B48]/12 dark:border-white/15 text-[#061525]/75 dark:text-[#DFFAFF]/75 hover:border-[#00C6B7]/60 dark:hover:border-[#00D9FF]/45'
                                }`}
                              >
                                <p className="text-xs font-bold text-[#061525] dark:text-white">
                                  {branch.id === 'civil-lines' ? 'Civil Lines (Primary)' : 'Zero Road (Second Branch)'}
                                </p>
                                <p className="text-[11px] text-[#061525]/70 dark:text-[#DFFAFF]/70 mt-0.5 line-clamp-1">
                                  {branch.addressLines[0]} {branch.addressLines[1]}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="treatmentSelect" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                          Select Treatment *
                        </label>
                        <select
                          id="treatmentSelect"
                          value={treatment}
                          onChange={(e) => setTreatment(e.target.value)}
                          className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                        >
                          {TREATMENTS.map((item) => (
                            <option key={item.id} value={item.title}>
                              {item.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="preferredDate" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                            Preferred Date *
                          </label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                              id="preferredDate"
                              type="date"
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={preferredDate}
                              onChange={(e) => setPreferredDate(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white tabular-nums focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="preferredTime" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                            Preferred Time *
                          </label>
                          <select
                            id="preferredTime"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white tabular-nums focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                          >
                            {availableSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="additionalMessage" className="block text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] mb-1.5">
                          Additional Message (Optional)
                        </label>
                        <div className="relative">
                          <MessageSquare className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] absolute left-3.5 top-3.5 pointer-events-none" />
                          <textarea
                            id="additionalMessage"
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share symptoms, questions, or outstation travel dates if helpful"
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45 focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
                          />
                        </div>
                      </div>

                      {errorMsg && (
                        <p className="text-xs font-semibold text-red-500" role="alert">
                          {errorMsg}
                        </p>
                      )}

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-xs text-[#061525]/65 dark:text-[#DFFAFF]/70">
                          Final appointment confirmation is coordinated by the clinic desk at {clinicInfo.phoneDisplay}.
                        </p>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] via-[#00A8E8] to-[#00C6B7] hover:shadow-[0_0_24px_rgba(0,217,255,0.45)] disabled:opacity-60 text-white text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{submitting ? 'Sending Request...' : 'Request an Appointment'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
