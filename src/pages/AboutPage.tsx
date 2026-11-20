import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CONCEPT_VISUALS } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { WhyChooseUsSection } from '../components/WhyChooseUsSection';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { buildPhoneHref } from '../services/clinicFirestore';

export function AboutPage() {
  usePageMeta();
  const { clinicInfo, doctorProfile, branches, gallery } = useClinic();
  const exteriorPhoto = gallery.find((g) => g.category === 'exterior');

  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#00D9FF]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-6 space-y-5"
            >
              <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
                About {clinicInfo.name}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance leading-[1.1]">
                Patient-First Multispecialty Dental &amp; Orthodontic Care in Prayagraj
              </h1>
              <p className="text-sm sm:text-base text-[#DFFAFF]/85 leading-relaxed">
                {clinicInfo.description} Led by{' '}
                <strong className="font-semibold text-white">
                  {doctorProfile.name} ({doctorProfile.qualification})
                </strong>
                , our focus is clear diagnosis, gentle chairside pace, and enduring oral health.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/doctor"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold"
                >
                  <span>Meet {doctorProfile.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/treatments"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/16 border border-[#00D9FF]/35 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>Explore 24 Treatments</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl overflow-hidden border border-[#00D9FF]/30 bg-[#061525] shadow-[0_24px_60px_rgba(0,217,255,0.14)]">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <ImageWithFallback
                    src={CONCEPT_VISUALS.studio.url}
                    alt={CONCEPT_VISUALS.studio.alt}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5 border-t border-[#00D9FF]/20 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#00D9FF]">
                      {CONCEPT_VISUALS.studio.caption}
                    </p>
                    <p className="text-xs text-[#DFFAFF]/75 mt-0.5">
                      Cleanliness, comfort &amp; calm modern clinical atmosphere
                    </p>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#00D9FF] shrink-0" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cleanliness & Modern Technology Section */}
      <section className="py-16 sm:py-22 bg-gradient-to-b from-[#EDF7FC] to-[#DFFAFF] dark:from-[#071A2E] dark:to-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/30 shadow-xl bg-[#061525]">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <ImageWithFallback
                    src={CONCEPT_VISUALS.general.url}
                    alt={CONCEPT_VISUALS.general.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5 text-white border-t border-[#00D9FF]/20">
                  <p className="text-xs font-semibold text-[#00D9FF]">
                    {CONCEPT_VISUALS.general.caption}
                  </p>
                  <p className="text-xs text-[#DFFAFF]/75 mt-0.5">
                    Digital radiography, ultrasonic scaling &amp; precision CAD/CAM prosthetics
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF]">
                <ShieldCheck className="w-4 h-4" />
                <span>Clinical Standards &amp; Hygiene</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Sterility, Clarity &amp; Contemporary Dental Equipment
              </h2>
              <p className="text-sm sm:text-base text-[#061525]/80 dark:text-[#DFFAFF]/80 leading-relaxed">
                From routine consultations and digital X-rays to endodontic root canal therapy, dental implants, and clear aligners, every procedure follows structured instrument sterilization and transparent chairside guidance.
              </p>
              <ul className="space-y-3 text-sm text-[#061525]/85 dark:text-[#DFFAFF]/90 pt-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] mt-0.5 shrink-0" />
                  <span>Low-radiation Digital X-ray review right at chairside</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] mt-0.5 shrink-0" />
                  <span>Ultrasonic scaling, light-cured laser fillings &amp; CAD/CAM fixed teeth</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] mt-0.5 shrink-0" />
                  <span>Unrushed appointments helping children &amp; anxious patients feel comfortable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us — Full 6 Care Pillars */}
      <WhyChooseUsSection />

      {/* Authentic Clinic Exterior Frame & Two Centres */}
      <section className="py-16 sm:py-22 bg-[#EDF7FC] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide">
                Serving Prayagraj
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Two Convenient Centres in Civil Lines &amp; Zero Road
              </h2>
              <p className="text-sm sm:text-base text-[#061525]/78 dark:text-[#DFFAFF]/80 leading-relaxed">
                Patients across Prayagraj and outstation visitors can book at either our Civil Lines primary branch or our Zero Road centre.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="rounded-2xl bg-white/90 dark:bg-[#082B48]/75 border border-[#082B48]/12 dark:border-[#00D9FF]/22 p-5 space-y-2"
                  >
                    <p className="text-xs font-semibold text-[#00C6B7] dark:text-[#00D9FF]">
                      {branch.label}
                    </p>
                    <h3 className="font-display text-sm font-bold text-[#061525] dark:text-white">
                      {branch.id === 'civil-lines' ? 'Civil Lines' : 'Zero Road'}
                    </h3>
                    <p className="text-xs text-[#061525]/75 dark:text-[#DFFAFF]/78 leading-relaxed">
                      {branch.addressLines.join(' ')}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/locations"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold"
                >
                  <span>View Locations &amp; Branch Hours</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/30 text-xs sm:text-sm font-semibold text-[#061525] dark:text-white"
                >
                  <span>Book Consultation</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              {exteriorPhoto ? (
                <div className="relative w-full rounded-3xl overflow-hidden border border-[#00D9FF]/35 bg-[#061525] shadow-xl min-h-[320px]">
                  <ImageWithFallback
                    src={exteriorPhoto.imageDataUrl}
                    alt={exteriorPhoto.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#061525]/95 via-[#061525]/60 to-transparent text-white">
                    <p className="text-xs font-medium text-[#00D9FF] mb-1">
                      Authentic Clinic Photograph
                    </p>
                    <p className="font-display text-lg font-bold">{exteriorPhoto.title}</p>
                    {exteriorPhoto.caption && (
                      <p className="text-xs text-[#DFFAFF]/85 mt-1">{exteriorPhoto.caption}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-3xl border border-[#082B48]/14 dark:border-[#00D9FF]/28 bg-white/90 dark:bg-[#082B48]/75 backdrop-blur-xl p-7 sm:p-9 flex flex-col justify-between gap-6 min-h-[320px] shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#176BFF] to-[#00C6B7] text-white flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF]">
                      Verified Clinic Authenticity
                    </span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#061525] dark:text-white">
                      Authentic Clinic Exterior Frame
                    </h3>
                    <p className="text-sm text-[#061525]/75 dark:text-[#DFFAFF]/80 leading-relaxed">
                      Only verified street-level photographs uploaded by {clinicInfo.name} are shown as clinic exterior photos.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#082B48]/10 dark:border-white/12">
                    <Link
                      to="/gallery"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF] hover:underline min-h-[44px]"
                    >
                      <span>View Clinic Gallery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={buildPhoneHref(clinicInfo.phoneDisplay)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#061525] dark:text-[#DFFAFF] tabular-nums"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#00C6B7] dark:text-[#00D9FF]" />
                      <span>{clinicInfo.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
