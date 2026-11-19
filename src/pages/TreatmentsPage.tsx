import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CalendarCheck, Search } from 'lucide-react';
import {
  TREATMENT_CATEGORIES,
  TREATMENTS,
  type TreatmentCategoryId,
  type TreatmentItem,
} from '../data/clinicData';
import { usePageMeta } from '../hooks/usePageMeta';
import { TreatmentIllustration3D } from '../components/TreatmentIllustration3D';
import { TreatmentModal } from '../components/TreatmentModal';
import { ImageWithFallback } from '../components/ImageWithFallback';

const DentalModelShowcaseCanvas = lazy(() =>
  import('../components/DentalModelShowcaseCanvas').then((m) => ({
    default: m.DentalModelShowcaseCanvas,
  })),
);

function TreatmentDirectoryCard({
  item,
  onLearnMore,
}: {
  item: TreatmentItem;
  onLearnMore: (item: TreatmentItem) => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-[#00D9FF]/35 via-[#176BFF]/20 to-[#00C6B7]/35 hover:from-[#00D9FF]/80 hover:via-[#176BFF]/55 hover:to-[#00C6B7]/80 shadow-[0_14px_40px_rgba(6,21,37,0.14)] hover:shadow-[0_20px_54px_rgba(0,217,255,0.22)] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-[#082B48] via-[#07223B] to-[#061525] overflow-hidden flex flex-col justify-between">
        <div>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#061525]">
            <ImageWithFallback
              src={item.visualUrl}
              alt={item.visualAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07223B] via-[#07223B]/20 to-transparent" />

            <div className="absolute bottom-3 left-4 w-12 h-12 rounded-xl bg-[#061525]/92 border border-[#00D9FF]/35 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(0,217,255,0.22)]">
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
            onClick={() => onLearnMore(item)}
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-semibold text-[#DFFAFF] hover:text-[#00D9FF] transition-colors cursor-pointer"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00D9FF] transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            to={`/contact?treatment=${encodeURIComponent(item.title)}`}
            className="inline-flex items-center gap-1 min-h-[44px] px-2 text-xs font-semibold text-[#00D9FF] hover:text-white transition-colors"
          >
            <span>Request</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function TreatmentsPage() {
  usePageMeta();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') as 'all' | TreatmentCategoryId | null;
  const validCat =
    initialCat && TREATMENT_CATEGORIES.some((c) => c.id === initialCat) ? initialCat : 'all';

  const [activeCategory, setActiveCategory] = useState<'all' | TreatmentCategoryId>(validCat);
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<TreatmentItem | null>(null);

  useEffect(() => {
    const paramCat = searchParams.get('category') as 'all' | TreatmentCategoryId | null;
    if (paramCat && TREATMENT_CATEGORIES.some((c) => c.id === paramCat)) {
      setActiveCategory(paramCat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat: 'all' | TreatmentCategoryId) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredTreatments = useMemo(() => {
    return TREATMENTS.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#00D9FF]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
              Dental Treatments &amp; Services
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
              Comprehensive Clinical Care Under One Roof
            </h1>
            <p className="text-sm sm:text-base text-[#DFFAFF]/82 leading-relaxed">
              Explore all 24 treatments across General Dentistry, Advanced Dentistry, Cosmetic Dentistry, Orthodontics, and Specialized Dentistry.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs sm:text-sm font-semibold self-start lg:self-auto whitespace-nowrap"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Consultation</span>
          </Link>
        </div>
      </section>

      {/* Main Filterable Directory */}
      <section className="py-12 sm:py-18 bg-[#F4FAFD] dark:bg-[#071B30] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            {/* 5-Category Segmented Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-[#061525]/75 border border-[#082B48]/10 dark:border-[#00D9FF]/18 backdrop-blur-md">
              {TREATMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 sm:px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white shadow-[0_0_18px_rgba(0,217,255,0.28)]'
                      : 'text-[#061525]/75 dark:text-[#DFFAFF]/75 hover:text-[#061525] dark:hover:text-white hover:bg-[#DFFAFF]/60 dark:hover:bg-[#082B48]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#082B48]/50 dark:text-[#00D9FF]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 24 treatments..."
                aria-label="Search dental treatments"
                className="w-full pl-10 pr-4 py-2.5 min-h-[44px] rounded-xl bg-white dark:bg-[#061525]/85 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-sm text-[#061525] dark:text-white placeholder:text-[#082B48]/45 dark:placeholder:text-[#DFFAFF]/45 focus:outline-none focus:border-[#176BFF] dark:focus:border-[#00D9FF]"
              />
            </div>
          </div>

          {filteredTreatments.length === 0 ? (
            <div className="rounded-3xl border border-[#082B48]/12 dark:border-[#00D9FF]/20 bg-white dark:bg-[#082B48]/60 p-12 text-center">
              <p className="text-sm font-medium text-[#061525]/75 dark:text-[#DFFAFF]/80 mb-4">
                No treatments match &ldquo;{query}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  handleCategoryChange('all');
                }}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTreatments.map((item) => (
                <TreatmentDirectoryCard
                  key={item.id}
                  item={item}
                  onLearnMore={setSelectedItem}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive 3D Clinical Dental Models Lab */}
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-[#DFFAFF]/75 bg-[#061525]">
            Loading interactive 3D dental explorer...
          </div>
        }
      >
        <DentalModelShowcaseCanvas />
      </Suspense>

      <TreatmentModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
