import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TreatmentItem } from '../data/clinicData';
import { useClinic } from '../context/ClinicContext';
import { TreatmentIllustration3D } from './TreatmentIllustration3D';
import { ImageWithFallback } from './ImageWithFallback';

export function TreatmentModal({
  item,
  onClose,
}: {
  item: TreatmentItem | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { doctorProfile } = useClinic();

  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#061525]/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="treatment-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#082B48] border border-[#082B48]/15 dark:border-[#00D9FF]/30 shadow-2xl"
          >
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#061525]">
              <ImageWithFallback
                src={item.visualUrl}
                alt={item.visualAlt}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061525] via-[#061525]/55 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 min-w-[44px] min-h-[44px] rounded-xl bg-[#061525]/80 border border-white/20 flex items-center justify-center text-white hover:bg-[#00D9FF] hover:text-[#061525] transition-colors cursor-pointer"
                aria-label="Close treatment details"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end gap-4 text-white">
                <div className="w-14 h-14 rounded-2xl bg-[#061525]/90 border border-[#00D9FF]/45 flex items-center justify-center p-2 shrink-0 shadow-[0_0_20px_rgba(0,217,255,0.25)]">
                  <TreatmentIllustration3D kind={item.illustration} className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#00D9FF] mb-0.5">
                    {item.categoryLabel}
                  </p>
                  <h3 id="treatment-modal-title" className="font-display text-xl sm:text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-sm sm:text-base text-[#061525]/85 dark:text-[#DFFAFF]/90 leading-relaxed">
                {item.clinicalSummary}
              </p>

              <div className="space-y-2.5 pt-2">
                <p className="text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF] uppercase tracking-wider">
                  What to Expect at Your Visit
                </p>
                <ul className="space-y-2">
                  {item.focusPoints.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 text-sm text-[#061525]/85 dark:text-[#DFFAFF]/85"
                    >
                      <Check className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF] mt-0.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-[#061525]/65 dark:text-[#DFFAFF]/65 pt-3 border-t border-[#082B48]/10 dark:border-white/12">
                Specific clinical suitability and treatment plans are determined following an in-clinic oral examination by {doctorProfile.name}.
              </p>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white hover:bg-[#DFFAFF]/50 dark:hover:bg-[#061525]/60 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = item.title;
                    onClose();
                    navigate(`/contact?treatment=${encodeURIComponent(title)}`);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
