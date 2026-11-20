import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck,
  Camera,
  Clock,
  ExternalLink,
  HeartHandshake,
  MapPin,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  CONCEPT_VISUALS,
  TREATMENTS,
  type TreatmentItem,
} from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { HeroToothCanvas } from '../components/HeroToothCanvas';
import { SectionDivider } from '../components/SectionDivider';
import { TreatmentIllustration3D } from '../components/TreatmentIllustration3D';
import { TreatmentModal } from '../components/TreatmentModal';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { buildPhoneHref } from '../services/clinicFirestore';
import {
  fetchGoogleReviewsSummary,
  type GoogleReviewsSummary,
} from '../services/googleReviews';

const HOME_WHY_PREVIEW = [
  {
    icon: HeartHandshake,
    title: 'Gentle & Patient-Friendly Care',
    text: 'Calm, unhurried dental appointments paced around your comfort and peace of mind.',
  },
  {
    icon: ShieldCheck,
    title: 'Cleanliness & Clinical Hygiene',
    text: 'Strict sterilization workflows and disciplined hygiene across every treatment area.',
  },
  {
    icon: Microscope,
    title: 'Modern Digital Diagnostics',
    text: 'Digital X-rays, ultrasonic scaling, and CAD/CAM prosthetic precision under one roof.',
  },
];

export function HomePage() {
  usePageMeta();
  const { clinicInfo, doctorProfile, branches, gallery } = useClinic();
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);
  const [googleSummary, setGoogleSummary] = useState<GoogleReviewsSummary | null>(null);
  const phoneHref = buildPhoneHref(clinicInfo.phoneDisplay);

  useEffect(() => {
    const controller = new AbortController();
    fetchGoogleReviewsSummary(controller.signal).then((summary) => {
      if (!controller.signal.aborted) {
        setGoogleSummary(summary);
      }
    });
    return () => controller.abort();
  }, []);

  const featuredTreatments = TREATMENTS.filter((t) => t.featuredOnHome).slice(0, 6);
  const galleryPortrait = gallery.find((g) => g.category === 'doctor-portrait');
  const doctorPortraitSrc = (doctorProfile.portraitUrl || galleryPortrait?.imageDataUrl || '').trim();
  const uploadedClinicPhotos = gallery
    .filter((g) => g.category !== 'doctor-portrait')
    .slice(0, 3);

  return (
    <div>
      {/* 1. CINEMATIC 3D HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-28 -left-24 w-[28rem] h-[28rem] rounded-full bg-[#176BFF]/22 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/4 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[#00D9FF]/16 blur-3xl"
          aria-hidden="true"
        />

        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 sm:h-44 opacity-25"
          aria-hidden="true"
        >
          <path
            d="M0,224 C240,140 480,290 720,210 C960,130 1200,250 1440,170"
            fill="none"
            stroke="url(#homeHeroWave1)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="homeHeroWave1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#176BFF" stopOpacity="0" />
              <stop offset="45%" stopColor="#00D9FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00C6B7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-22">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-5 sm:space-y-6"
            >
              <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
                {clinicInfo.name} · Prayagraj
              </p>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.55rem] font-extrabold text-white leading-[1.08] tracking-tight text-balance">
                Your Smile Deserves
                <span className="block bg-gradient-to-r from-[#00D9FF] via-[#DFFAFF] to-[#00C6B7] bg-clip-text text-transparent">
                  The Best Care.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-[#DFFAFF]/85 leading-relaxed max-w-xl">
                Premium Multispecialty Dental &amp; Orthodontic Care in Prayagraj.
              </p>

              <p className="text-sm sm:text-base font-medium text-[#DFFAFF]/90">
                <strong className="font-semibold text-white">{doctorProfile.name}</strong>
                <span className="mx-2 text-[#00D9FF]" aria-hidden="true">/</span>
                <span className="text-[#00D9FF]">{doctorProfile.qualification}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] via-[#00A8E8] to-[#00C6B7] hover:shadow-[0_0_28px_rgba(0,217,255,0.5)] text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book Appointment</span>
                </Link>

                <Link
                  to="/treatments"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white/8 hover:bg-white/14 border border-[#00D9FF]/35 text-white text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
                >
                  <span>Explore Treatments</span>
                  <ArrowRight className="w-4 h-4 text-[#00D9FF]" />
                </Link>

                <a
                  href={phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#061525]/70 hover:bg-[#00D9FF]/20 border border-[#00C6B7]/45 text-[#DFFAFF] text-sm font-semibold transition-colors duration-200 tabular-nums whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-[#00D9FF]" />
                  <span>Call Now</span>
                </a>
              </div>

              <div className="pt-5 border-t border-white/12 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#DFFAFF]/78">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
                  <span>Civil Lines &amp; Zero Road, Prayagraj</span>
                </span>
                <span aria-hidden="true" className="text-[#00D9FF]/45">·</span>
                <a
                  href={phoneHref}
                  className="font-semibold text-white hover:text-[#00D9FF] transition-colors tabular-nums"
                >
                  {clinicInfo.phoneDisplay}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 h-[310px] sm:h-[420px] lg:h-[520px]"
            >
              <HeroToothCanvas />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider fromClass="bg-[#04182D]" toClass="text-[#EDF7FC] dark:text-[#071A2E]" />

      {/* 2. CONCISE CLINIC INTRO */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-[#EDF7FC] to-[#DFFAFF] dark:from-[#071A2E] dark:to-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide">
                Multispecialty Dental &amp; Orthodontic Centre
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Thoughtful Dentistry Built Around Patient Comfort
              </h2>
              <p className="text-sm sm:text-base text-[#061525]/80 dark:text-[#DFFAFF]/80 leading-relaxed">
                {clinicInfo.description} Serving families across Prayagraj from Civil Lines and Zero Road, our clinic emphasizes gentle handling, clear clinical communication, and modern dental systems.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] transition-all"
                >
                  <span>About Our Clinic</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/locations"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white/85 dark:bg-[#082B48] border border-[#082B48]/15 dark:border-[#00D9FF]/30 text-[#061525] dark:text-white text-xs sm:text-sm font-semibold hover:border-[#00D9FF] transition-colors"
                >
                  <span>2 Branches in Prayagraj</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/30 shadow-[0_20px_56px_rgba(6,21,37,0.16)] bg-[#061525]">
                <div className="aspect-[16/10] w-full overflow-hidden">
                  <ImageWithFallback
                    src={CONCEPT_VISUALS.studio.url}
                    alt={CONCEPT_VISUALS.studio.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5 bg-gradient-to-t from-[#061525] via-[#061525]/92 to-[#061525]/75 text-white flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-[#00D9FF]">
                      {CONCEPT_VISUALS.studio.caption}
                    </p>
                    <p className="text-xs text-[#DFFAFF]/80 mt-0.5">
                      Modern sterile care environments at Civil Lines &amp; Zero Road
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-[#00D9FF] shrink-0" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED TREATMENTS PREVIEW (6 POPULAR SERVICES) */}
      <section className="py-16 sm:py-22 bg-[#F4FAFD] dark:bg-[#071B30] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
                Featured Dental Services
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Specialized Care Across Five Disciplines
              </h2>
            </div>
            <Link
              to="/treatments"
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all self-start sm:self-auto whitespace-nowrap"
            >
              <span>View All 24 Treatments</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTreatments.map((item) => (
              <article
                key={item.id}
                className="group rounded-3xl overflow-hidden bg-gradient-to-br from-[#082B48] via-[#07223B] to-[#061525] border border-[#00D9FF]/25 hover:border-[#00D9FF]/65 shadow-[0_14px_40px_rgba(6,21,37,0.16)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#061525]">
                    <ImageWithFallback
                      src={item.visualUrl}
                      alt={item.visualAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07223B] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 w-12 h-12 rounded-xl bg-[#061525]/90 border border-[#00D9FF]/40 flex items-center justify-center p-1.5 shadow-[0_0_16px_rgba(0,217,255,0.22)]">
                      <TreatmentIllustration3D kind={item.illustration} className="w-9 h-9" />
                    </div>
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#061525]/80 backdrop-blur-md text-[11px] font-semibold text-[#00D9FF] border border-[#00D9FF]/25">
                      {item.categoryLabel}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-[#00D9FF] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#DFFAFF]/78 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTreatment(item)}
                    className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-[#DFFAFF] hover:text-[#00D9FF] transition-colors cursor-pointer"
                  >
                    <span>Treatment Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00D9FF]" />
                  </button>
                  <Link
                    to={`/contact?treatment=${encodeURIComponent(item.title)}`}
                    className="text-xs font-semibold text-[#00D9FF] hover:text-white transition-colors py-2"
                  >
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SHORT DOCTOR INTRO */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#0A3558] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-4">
              {doctorPortraitSrc ? (
                <div className="rounded-3xl overflow-hidden border border-[#00D9FF]/35 bg-[#061525] aspect-[4/4.3] max-w-xs mx-auto shadow-[0_0_36px_rgba(0,217,255,0.2)]">
                  <ImageWithFallback
                    src={doctorPortraitSrc}
                    alt={`${doctorProfile.name} (${doctorProfile.qualification})`}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-[#00D9FF]/30 bg-[#061525]/70 backdrop-blur-xl p-8 text-center max-w-xs mx-auto shadow-[0_0_40px_rgba(0,217,255,0.14)]">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00D9FF] via-[#00C6B7] to-[#176BFF] flex items-center justify-center shadow-[0_0_24px_rgba(0,217,255,0.4)]">
                    <span className="font-display text-2xl font-bold text-[#061525]">RM</span>
                  </div>
                  <p className="font-display text-lg font-bold text-white">
                    {doctorProfile.name}
                  </p>
                  <p className="text-xs font-medium text-[#00D9FF] mt-1">
                    {doctorProfile.qualification}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-8 space-y-5">
              <p className="text-sm font-semibold text-[#00D9FF] tracking-wide">
                Lead Dental Surgeon
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                {doctorProfile.name} — {doctorProfile.qualification}
              </h2>
              <p className="text-sm sm:text-base text-[#DFFAFF]/85 leading-relaxed max-w-2xl">
                Leading clinical care at both the Civil Lines and Zero Road centres in Prayagraj, {doctorProfile.name} combines clear diagnostic explanations with attentive, anxiety-sensitive dental treatment.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/doctor"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all"
                >
                  <span>View Doctor Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/16 border border-[#00D9FF]/35 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>Request Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US PREVIEW */}
      <section className="py-16 sm:py-20 bg-[#E5F8FD] dark:bg-[#08243E] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
                Patient Care Standards
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Why Families Trust Mittal Dental Clinic
              </h2>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] hover:underline"
            >
              <span>Read All 6 Care Pillars</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {HOME_WHY_PREVIEW.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-3xl bg-white/90 dark:bg-[#061525]/80 border border-[#082B48]/12 dark:border-[#00D9FF]/22 p-6 sm:p-7 space-y-4 shadow-[0_10px_30px_rgba(8,43,72,0.06)]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#061525] border border-[#00D9FF]/35 text-[#00D9FF] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#061525] dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#061525]/75 dark:text-[#DFFAFF]/78 leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="py-16 sm:py-20 bg-[#EDF7FC] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
                Clinic Visuals &amp; Photo Library
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Inside Our Care Spaces
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all self-start sm:self-auto"
            >
              <Camera className="w-4 h-4" />
              <span>Open Gallery</span>
            </Link>
          </div>

          {uploadedClinicPhotos.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {uploadedClinicPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  to="/gallery"
                  className="group rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/25 bg-white dark:bg-[#082B48] shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={photo.imageDataUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-sm font-bold text-[#061525] dark:text-white">
                      {photo.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  img: CONCEPT_VISUALS.studio.url,
                  alt: CONCEPT_VISUALS.studio.alt,
                  title: 'Sterile Dental Studio Concept',
                  label: 'Reception & Interiors',
                },
                {
                  img: CONCEPT_VISUALS.general.url,
                  alt: CONCEPT_VISUALS.general.alt,
                  title: 'Digital Radiography & Ultrasonic Care',
                  label: 'Modern Equipment Concept',
                },
                {
                  img: CONCEPT_VISUALS.cosmetic.url,
                  alt: CONCEPT_VISUALS.cosmetic.alt,
                  title: 'Restorative & Ceramic Craftsmanship',
                  label: 'Clinical Design Showcase',
                },
              ].map((card) => (
                <Link
                  key={card.title}
                  to="/gallery"
                  className="group rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/25 bg-white dark:bg-[#082B48] shadow-md"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#061525]">
                    <ImageWithFallback
                      src={card.img}
                      alt={card.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-[11px] font-semibold text-[#176BFF] dark:text-[#00D9FF]">
                      {card.label}
                    </p>
                    <p className="font-display text-sm font-bold text-[#061525] dark:text-white mt-0.5">
                      {card.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. TWO PRAYAGRAJ BRANCH PREVIEWS */}
      <section className="py-16 sm:py-20 bg-[#F4FAFD] dark:bg-[#071B30] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
                Two Accessible Centres
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
                Civil Lines &amp; Zero Road, Prayagraj
              </h2>
            </div>
            <Link
              to="/locations"
              className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] hover:underline"
            >
              <span>Maps &amp; Editable Hours</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-3xl bg-white/90 dark:bg-[#082B48]/80 border border-[#082B48]/12 dark:border-[#00D9FF]/25 p-6 sm:p-8 flex flex-col justify-between gap-5 shadow-[0_12px_36px_rgba(8,43,72,0.06)]"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#00C6B7] dark:text-[#00D9FF]">
                    {branch.label}
                  </p>
                  <h3 className="font-display text-xl font-bold text-[#061525] dark:text-white">
                    {branch.name}
                  </h3>
                  <p className="text-sm text-[#061525]/78 dark:text-[#DFFAFF]/80 leading-relaxed flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] shrink-0 mt-1" />
                    <span>{branch.fullAddress}</span>
                  </p>
                  <div className="text-xs text-[#061525]/70 dark:text-[#DFFAFF]/75 flex items-start gap-2 tabular-nums pt-1">
                    <Clock className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] shrink-0 mt-0.5" />
                    <span>
                      Mon–Sat: {branch.hours.mondayToSaturday.join(' · ')} · Sun:{' '}
                      {branch.hours.sunday.join(' · ')}
                    </span>
                  </div>
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
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white hover:border-[#00D9FF] transition-colors"
                  >
                    <span>Directions &amp; Hours</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PATIENT REVIEWS & TESTIMONIALS */}
      <section
        id="patient-reviews"
        aria-label="Patient Reviews and Testimonials"
        className="relative overflow-hidden py-16 sm:py-20 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#061E34] text-white border-t border-[#00D9FF]/20"
      >
        <div
          className="pointer-events-none absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#00D9FF]/12 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 w-72 h-72 rounded-full bg-[#176BFF]/14 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header + Verified Google Rating & Count Summary Card */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <p className="text-sm font-semibold text-[#00D9FF] tracking-wide">
                Patient Reviews &amp; Testimonials
              </p>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Verified Patient Feedback on Google
              </h2>
              <p className="text-sm sm:text-base text-[#DFFAFF]/80 leading-relaxed">
                To keep every review completely authentic, no unverified ratings, counts, or patient testimonials are fabricated here. Actual Google review metrics and verified feedback can be inserted as supplied.
              </p>
            </div>

            <div className="rounded-2xl bg-[#061525]/75 backdrop-blur-xl border border-[#00D9FF]/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5 shadow-[0_12px_36px_rgba(0,217,255,0.12)] shrink-0">
              {(() => {
                const liveRating =
                  googleSummary?.status === 'ok' && typeof googleSummary.rating === 'number'
                    ? googleSummary.rating
                    : null;
                const liveCount =
                  googleSummary?.status === 'ok' &&
                  typeof googleSummary.userRatingCount === 'number'
                    ? googleSummary.userRatingCount
                    : null;
                const reviewLink =
                  (googleSummary?.status === 'ok' && googleSummary.googleMapsUri) ||
                  branches[0]?.googleProfileUrl ||
                  'https://www.google.com/maps/search/?api=1&query=Mittal+Dental+Clinic+Prayagraj';

                return (
                  <>
                    <div className="space-y-1.5">
                      <div
                        className="flex items-center gap-1.5"
                        aria-label={
                          liveRating !== null
                            ? `Google rating ${liveRating.toFixed(1)} out of 5`
                            : 'Google star rating placeholder'
                        }
                      >
                        <div className="flex items-center gap-1" aria-hidden="true">
                          {[1, 2, 3, 4, 5].map((n) => {
                            if (liveRating === null) {
                              return (
                                <Star
                                  key={n}
                                  className="w-4 h-4 text-[#00D9FF]/75"
                                />
                              );
                            }

                            const fillPct = Math.round(
                              Math.max(0, Math.min(1, liveRating - (n - 1))) * 100,
                            );
                            const gradId = `google-rating-star-${n}`;

                            return (
                              <svg
                                key={n}
                                viewBox="0 0 24 24"
                                className="w-4 h-4"
                                fill="none"
                                stroke="#00D9FF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <defs>
                                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset={`${fillPct}%`} stopColor="#00D9FF" />
                                    <stop
                                      offset={`${fillPct}%`}
                                      stopColor="#00D9FF"
                                      stopOpacity="0.14"
                                    />
                                  </linearGradient>
                                </defs>
                                <polygon
                                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                  fill={`url(#${gradId})`}
                                  strokeOpacity={fillPct > 0 ? 1 : 0.35}
                                />
                              </svg>
                            );
                          })}
                        </div>
                        <span className="ml-1.5 text-xs font-semibold text-[#00D9FF] tabular-nums">
                          {liveRating !== null
                            ? `Google Rating: ${liveRating.toFixed(1)}/5`
                            : 'Google Rating: [Awaiting Verified Score]'}
                        </span>
                      </div>
                      <p className="text-xs text-[#DFFAFF]/78 tabular-nums">
                        {liveCount !== null
                          ? `Total Google Reviews: ${liveCount.toLocaleString('en-IN')}`
                          : 'Total Google Reviews: [Verified Review Count Pending]'}
                      </p>
                    </div>

                    <a
                      href={reviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] hover:shadow-[0_0_20px_rgba(0,217,255,0.42)] text-white text-xs font-semibold whitespace-nowrap transition-all"
                    >
                      <span>Read Reviews on Google</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* 9. APPOINTMENT CTA BAND */}
      <section className="py-14 sm:py-18 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#041222] text-white border-t border-[#00D9FF]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-[#00D9FF]">
            Ready For Your Visit?
          </p>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white text-balance">
            Schedule Your Consultation in Civil Lines or Zero Road
          </h2>
          <p className="text-sm sm:text-base text-[#DFFAFF]/80 max-w-2xl mx-auto">
            Request an appointment online or speak directly with our Prayagraj clinic desk on{' '}
            <span className="font-semibold text-white tabular-nums">{clinicInfo.phoneDisplay}</span>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] via-[#00A8E8] to-[#00C6B7] text-white text-sm font-semibold hover:shadow-[0_0_26px_rgba(0,217,255,0.45)] transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Appointment</span>
            </Link>
            <a
              href={phoneHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/16 border border-[#00D9FF]/35 text-white text-sm font-semibold tabular-nums transition-colors"
            >
              <Phone className="w-4 h-4 text-[#00D9FF]" />
              <span>{clinicInfo.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>

      <TreatmentModal item={selectedTreatment} onClose={() => setSelectedTreatment(null)} />
    </div>
  );
}
