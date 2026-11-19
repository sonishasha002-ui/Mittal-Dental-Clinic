import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  MonitorCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import { CONCEPT_VISUALS } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { ImageWithFallback } from '../components/ImageWithFallback';

type CategoryFilter = 'all' | 'exterior' | 'reception' | 'treatment-area' | 'equipment';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Spaces' },
  { id: 'exterior', label: 'Clinic Exterior' },
  { id: 'reception', label: 'Reception & Interiors' },
  { id: 'treatment-area', label: 'Treatment Areas' },
  { id: 'equipment', label: 'Actual Equipment' },
];

const PLACEHOLDER_BLUEPRINTS: {
  category: 'exterior' | 'reception' | 'treatment-area' | 'equipment';
  title: string;
  subtitle: string;
}[] = [
  {
    category: 'exterior',
    title: 'Clinic Exterior',
    subtitle: 'Verified street-level entrance photos of Civil Lines & Zero Road branches.',
  },
  {
    category: 'reception',
    title: 'Reception & Waiting Lounge',
    subtitle: 'Calm, welcoming reception interiors designed for patient comfort.',
  },
  {
    category: 'treatment-area',
    title: 'Clinical Treatment Areas',
    subtitle: 'Clean, organized dental operatories maintained with strict hygiene protocols.',
  },
  {
    category: 'equipment',
    title: 'Diagnostic & Dental Equipment',
    subtitle: 'Digital X-ray, ultrasonic scaling, and modern restorative systems.',
  },
];

const CONCEPT_SHOWCASE = [
  {
    title: 'Modern Dental Studio Architecture',
    category: 'Interior Design Concept',
    url: CONCEPT_VISUALS.studio.url,
    alt: CONCEPT_VISUALS.studio.alt,
  },
  {
    title: 'Digital Radiography & Preventive Care',
    category: 'Diagnostic Concept',
    url: CONCEPT_VISUALS.general.url,
    alt: CONCEPT_VISUALS.general.alt,
  },
  {
    title: 'Endodontic Root Canal Precision',
    category: 'Clinical Concept',
    url: CONCEPT_VISUALS.rct.url,
    alt: CONCEPT_VISUALS.rct.alt,
  },
  {
    title: 'Dental Implant & Zirconia Prosthetics',
    category: 'Restorative Concept',
    url: CONCEPT_VISUALS.implant.url,
    alt: CONCEPT_VISUALS.implant.alt,
  },
  {
    title: 'Porcelain Veneers & Cosmetic Craft',
    category: 'Cosmetic Concept',
    url: CONCEPT_VISUALS.cosmetic.url,
    alt: CONCEPT_VISUALS.cosmetic.alt,
  },
  {
    title: 'Clear Aligners & Orthodontic Braces',
    category: 'Orthodontic Concept',
    url: CONCEPT_VISUALS.orthodontics.url,
    alt: CONCEPT_VISUALS.orthodontics.alt,
  },
];

export function GalleryPage() {
  usePageMeta();
  const { gallery, deletePhoto, openUploader } = useClinic();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [lightboxItems, setLightboxItems] = useState<
    { url: string; title: string; caption?: string; id?: string }[]
  >([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayPhotos = useMemo(() => {
    return gallery.filter(
      (item) =>
        item.category !== 'doctor-portrait' &&
        (filter === 'all' || item.category === filter),
    );
  }, [gallery, filter]);

  const filteredBlueprints = PLACEHOLDER_BLUEPRINTS.filter(
    (bp) => filter === 'all' || bp.category === filter,
  );

  useEffect(() => {
    if (lightboxIndex === null || lightboxItems.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((i) => (i !== null ? (i + 1) % lightboxItems.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((i) =>
          i !== null ? (i - 1 + lightboxItems.length) % lightboxItems.length : null,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, lightboxItems.length]);

  const openPhotoLightbox = (idx: number) => {
    setLightboxItems(
      displayPhotos.map((p) => ({
        id: p.id,
        url: p.imageDataUrl,
        title: p.title,
        caption: p.caption,
      })),
    );
    setLightboxIndex(idx);
  };

  const openConceptLightbox = (idx: number) => {
    setLightboxItems(
      CONCEPT_SHOWCASE.map((c) => ({
        url: c.url,
        title: c.title,
        caption: `${c.category} — 3D visual illustration (not an actual clinic photograph)`,
      })),
    );
    setLightboxIndex(idx);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        deletePhoto(id);
        setLightboxIndex(null);
      }
    } catch {
      // ignore on failure
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#00D9FF]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
              Clinic Photo Gallery
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
              Authentic Glimpses of Our Prayagraj Centres
            </h1>
            <p className="text-sm sm:text-base text-[#DFFAFF]/82 leading-relaxed">
              Verified clinic photographs of Civil Lines and Zero Road appear here alongside 3D clinical care visualizations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openUploader('exterior')}
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] hover:shadow-[0_0_22px_rgba(0,217,255,0.4)] text-white text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer self-start lg:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Clinic Photograph</span>
          </button>
        </div>
      </section>

      {/* Authentic Clinic Media Gallery */}
      <section className="py-12 sm:py-18 bg-[#EDF7FC] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-[#082B48]/75 border border-[#082B48]/10 dark:border-[#00D9FF]/18 mb-10 backdrop-blur-md">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white shadow-[0_0_16px_rgba(0,217,255,0.28)]'
                    : 'text-[#061525]/75 dark:text-[#DFFAFF]/75 hover:text-[#061525] dark:hover:text-white hover:bg-[#DFFAFF]/60 dark:hover:bg-[#061525]/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {displayPhotos.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {displayPhotos.map((photo, idx) => (
                <figure
                  key={photo.id}
                  className="break-inside-avoid group relative rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/25 bg-white dark:bg-[#082B48]/75 shadow-[0_12px_36px_rgba(8,43,72,0.08)]"
                >
                  <div className="overflow-hidden">
                    <img
                      src={photo.imageDataUrl}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105 cursor-pointer"
                      onClick={() => openPhotoLightbox(idx)}
                    />
                  </div>
                  <div className="p-5 flex items-start justify-between gap-3 border-t border-[#082B48]/8 dark:border-white/10">
                    <div>
                      <p className="text-xs font-semibold text-[#00C6B7] dark:text-[#00D9FF] mb-0.5">
                        {photo.branchId === 'civil-lines'
                          ? 'Civil Lines'
                          : photo.branchId === 'zero-road'
                            ? 'Zero Road'
                            : 'Mittal Dental Clinic'}
                      </p>
                      <figcaption className="font-display text-sm font-bold text-[#061525] dark:text-white">
                        {photo.title}
                      </figcaption>
                      {photo.caption && (
                        <p className="text-xs text-[#061525]/70 dark:text-[#DFFAFF]/75 mt-1">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => openPhotoLightbox(idx)}
                        className="min-w-[44px] min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 flex items-center justify-center text-[#061525] dark:text-white hover:bg-[#DFFAFF] dark:hover:bg-[#00D9FF]/20 transition-colors cursor-pointer"
                        aria-label={`Zoom ${photo.title}`}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        className="min-w-[44px] min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 flex items-center justify-center text-[#061525]/65 dark:text-[#DFFAFF]/65 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                        aria-label={`Remove ${photo.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBlueprints.map((slot) => (
                <div
                  key={slot.category}
                  className="rounded-3xl border border-dashed border-[#082B48]/25 dark:border-[#00D9FF]/30 bg-white/85 dark:bg-[#082B48]/60 backdrop-blur-md p-6 flex flex-col justify-between gap-6 min-h-[220px] hover:border-[#00C6B7] dark:hover:border-[#00D9FF]/65 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#061525] border border-[#00D9FF]/30 text-[#00D9FF] flex items-center justify-center shadow-[0_0_18px_rgba(0,217,255,0.18)]">
                    {slot.category === 'exterior' && <Building2 className="w-5 h-5" />}
                    {slot.category === 'reception' && <Sparkles className="w-5 h-5" />}
                    {slot.category === 'treatment-area' && <Camera className="w-5 h-5" />}
                    {slot.category === 'equipment' && <MonitorCheck className="w-5 h-5" />}
                  </div>

                  <div>
                    <h2 className="font-display text-base font-bold text-[#061525] dark:text-white mb-1.5">
                      {slot.title}
                    </h2>
                    <p className="text-xs text-[#061525]/70 dark:text-[#DFFAFF]/75 leading-relaxed mb-4">
                      {slot.subtitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => openUploader(slot.category)}
                      className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF] hover:text-[#061525] dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add Authentic Photo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visual Concept Gallery (Explicitly Labeled as 3D Concept Renders) */}
      <section className="py-12 sm:py-18 bg-[#F4FAFD] dark:bg-[#071B30] border-t border-[#082B48]/10 dark:border-[#00D9FF]/15 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-1.5">
              3D Visual Showcase
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#061525] dark:text-white tracking-tight text-balance">
              Clinical &amp; Architectural Care Concepts
            </h2>
            <p className="text-xs sm:text-sm text-[#061525]/70 dark:text-[#DFFAFF]/75 mt-2">
              3D educational renders illustrating our dental treatments and hygiene-focused studio aesthetic. Click any image to inspect full-screen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONCEPT_SHOWCASE.map((concept, idx) => (
              <figure
                key={concept.title}
                onClick={() => openConceptLightbox(idx)}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/25 bg-white dark:bg-[#082B48]/80 shadow-[0_12px_36px_rgba(8,43,72,0.08)]"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#061525] relative">
                  <ImageWithFallback
                    src={concept.url}
                    alt={concept.alt}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#061525]/80 border border-[#00D9FF]/35 text-[#00D9FF] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </span>
                </div>
                <figcaption className="p-5 border-t border-[#082B48]/8 dark:border-white/10">
                  <p className="text-[11px] font-semibold text-[#176BFF] dark:text-[#00D9FF]">
                    {concept.category}
                  </p>
                  <p className="font-display text-sm font-bold text-[#061525] dark:text-white mt-0.5">
                    {concept.title}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Cinema Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && lightboxItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#061525]/92 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Gallery Lightbox"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-[#082B48] border border-[#00D9FF]/30 shadow-2xl"
            >
              <div className="relative bg-[#061525] flex items-center justify-center max-h-[75vh]">
                <img
                  src={lightboxItems[lightboxIndex].url}
                  alt={lightboxItems[lightboxIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain"
                />
                {lightboxItems.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] rounded-full bg-[#061525]/85 border border-[#00D9FF]/40 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#00D9FF] hover:text-[#061525] transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((lightboxIndex + 1) % lightboxItems.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] rounded-full bg-[#061525]/85 border border-[#00D9FF]/40 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#00D9FF] hover:text-[#061525] transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-3 right-3 min-w-[44px] min-h-[44px] rounded-full bg-[#061525]/85 border border-[#00D9FF]/40 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#00D9FF] hover:text-[#061525] transition-colors"
                  aria-label="Close lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 flex items-center justify-between gap-4 text-white">
                <div>
                  <h4 className="font-display text-base font-bold">
                    {lightboxItems[lightboxIndex].title}
                  </h4>
                  {lightboxItems[lightboxIndex].caption && (
                    <p className="text-xs text-[#DFFAFF]/75 mt-0.5">
                      {lightboxItems[lightboxIndex].caption}
                    </p>
                  )}
                </div>
                <span className="text-xs text-[#00D9FF] tabular-nums shrink-0">
                  {lightboxIndex + 1} / {lightboxItems.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
