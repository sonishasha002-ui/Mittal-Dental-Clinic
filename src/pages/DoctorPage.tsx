import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck,
  HeartHandshake,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { ImageWithFallback } from '../components/ImageWithFallback';

const CARE_PHILOSOPHY = [
  {
    icon: MessageSquareText,
    title: 'Transparent Explanations',
    description:
      'Every digital X-ray and clinical examination is explained in clear, everyday language before treatment begins.',
  },
  {
    icon: HeartHandshake,
    title: 'Gentle & Unhurried Pace',
    description:
      'Individual time is dedicated to patient comfort so children, seniors, and anxious visitors feel fully at ease.',
  },
  {
    icon: Sparkles,
    title: 'Multispecialty & Orthodontic Care',
    description:
      'Comprehensive preventive, restorative, endodontic, cosmetic, and orthodontic alignment planning under one roof.',
  },
];

export function DoctorPage() {
  usePageMeta();
  const { branches, gallery, openUploader } = useClinic();
  const doctorPortrait = gallery.find((g) => g.category === 'doctor-portrait');

  return (
    <div>
      {/* Split-Screen Medical Profile Hero */}
      <section className="relative overflow-hidden py-14 sm:py-22 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#0A3558] text-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#00D9FF]/14 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-10 w-80 h-80 rounded-full bg-[#176BFF]/16 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-4"
            >
              {doctorPortrait ? (
                <div className="rounded-3xl overflow-hidden border border-[#00D9FF]/40 bg-[#061525] shadow-[0_0_44px_rgba(0,217,255,0.2)] aspect-[3/4] max-w-sm mx-auto">
                  <ImageWithFallback
                    src={doctorPortrait.imageDataUrl}
                    alt={`${CLINIC_INFO.doctor.name} (${CLINIC_INFO.doctor.qualification})`}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-[#00D9FF]/30 bg-[#061525]/70 backdrop-blur-xl p-8 flex flex-col justify-between aspect-[4/4.4] max-w-sm mx-auto shadow-[0_0_44px_rgba(0,217,255,0.16)]">
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-7 h-7 text-[#00D9FF]" />
                    <span className="text-xs text-[#DFFAFF]/80 font-medium">
                      Verified Profile
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-5">
                      <div
                        className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#00D9FF]/45 to-[#176BFF]/45 blur-md"
                        aria-hidden="true"
                      />
                      <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#00D9FF] via-[#00C6B7] to-[#176BFF] border border-white/35 flex items-center justify-center shadow-[0_0_24px_rgba(0,217,255,0.45)]">
                        <span className="font-display text-2xl font-bold tracking-tight text-[#061525]">
                          RM
                        </span>
                      </div>
                    </div>
                    <h2 className="font-display text-xl font-bold text-white">
                      {CLINIC_INFO.doctor.name}
                    </h2>
                    <p className="text-sm font-medium text-[#00D9FF] mt-1">
                      {CLINIC_INFO.doctor.qualification}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openUploader('doctor-portrait')}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/8 hover:bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>Upload Authentic Portrait</span>
                  </button>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="lg:col-span-8 space-y-6"
            >
              <div>
                <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase mb-2">
                  Lead Dental Surgeon · Mittal Dental Clinic
                </p>
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
                  {CLINIC_INFO.doctor.name}
                </h1>
                <p className="text-base sm:text-xl font-semibold text-[#00D9FF] mt-1.5">
                  {CLINIC_INFO.doctor.qualification}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#DFFAFF]/85 leading-relaxed max-w-2xl">
                Dr. Rishabh Mittal leads patient care at Mittal Dental Clinic across both the Civil Lines and Zero Road centres in Prayagraj. Every consultation focuses on accurate diagnosis, plain-language explanation of treatment options, and attentive chairside comfort tailored to individual patient needs.
              </p>

              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#00D9FF]/20">
                <div className="p-5 rounded-2xl bg-[#061525]/60 border border-[#00D9FF]/22">
                  <p className="text-xs text-[#00D9FF] font-semibold mb-1">Academic Qualification</p>
                  <p className="font-display text-base font-bold text-white">
                    {CLINIC_INFO.doctor.qualification}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#061525]/60 border border-[#00D9FF]/22">
                  <p className="text-xs text-[#00D9FF] font-semibold mb-1">Clinical Focus</p>
                  <p className="font-display text-base font-bold text-white">
                    Multispecialty &amp; Orthodontic Care
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#061525]/60 border border-[#00D9FF]/22">
                  <p className="text-xs text-[#00D9FF] font-semibold mb-1">Direct Appointment Line</p>
                  <a
                    href={CLINIC_INFO.phoneHref}
                    className="font-display text-base font-bold text-white hover:text-[#00D9FF] transition-colors tabular-nums"
                  >
                    {CLINIC_INFO.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] via-[#00A8E8] to-[#00C6B7] text-white text-sm font-semibold hover:shadow-[0_0_24px_rgba(0,217,255,0.45)] transition-all"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Request Appointment</span>
                </Link>
                <a
                  href={CLINIC_INFO.phoneHref}
                  className="inline-flex items-center gap-2 px-5 py-3.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/16 border border-[#00D9FF]/35 text-white text-sm font-semibold tabular-nums transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#00D9FF]" />
                  <span>Call {CLINIC_INFO.phoneDisplay}</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Care Philosophy */}
      <section className="py-16 sm:py-20 bg-[#EDF7FC] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
              Care Philosophy
            </p>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
              Calm, Clear &amp; Patient-Centered Consultations
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {CARE_PHILOSOPHY.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl bg-white/90 dark:bg-[#082B48]/80 border border-[#082B48]/12 dark:border-[#00D9FF]/22 p-6 sm:p-7 space-y-4 shadow-[0_12px_36px_rgba(8,43,72,0.06)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#061525] border border-[#00D9FF]/35 text-[#00D9FF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#061525] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#061525]/75 dark:text-[#DFFAFF]/78 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual-Branch Association */}
      <section className="py-16 sm:py-20 bg-[#F4FAFD] dark:bg-[#071B30] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
                Consultation Centres
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#061525] dark:text-white">
                Available Across Both Prayagraj Branches
              </h2>
            </div>
            <Link
              to="/treatments"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] hover:underline"
            >
              <span>View Dental Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-3xl bg-white dark:bg-[#082B48]/80 border border-[#082B48]/12 dark:border-[#00D9FF]/25 p-6 sm:p-8 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#00C6B7] dark:text-[#00D9FF]">
                    {branch.label}
                  </p>
                  <h3 className="font-display text-lg font-bold text-[#061525] dark:text-white">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-[#061525]/78 dark:text-[#DFFAFF]/80 flex items-start gap-2 leading-relaxed">
                    <MapPin className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] shrink-0 mt-1" />
                    <span>{branch.fullAddress}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to={`/contact?branch=${branch.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs font-semibold"
                  >
                    <span>Book at {branch.id === 'civil-lines' ? 'Civil Lines' : 'Zero Road'}</span>
                  </Link>
                  <Link
                    to="/locations"
                    className="inline-flex items-center px-4 py-2.5 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white"
                  >
                    <span>See Timings</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
