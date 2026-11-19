import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WHY_CHOOSE_ITEMS } from '../data/clinicData';

gsap.registerPlugin(ScrollTrigger);

function AnimatedPillarIcon({ id }: { id: string }) {
  switch (id) {
    case 'gentle-approach':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <path
            d="M24 40C24 40 9 30.5 9 19.5C9 14.2 13.2 10 18.5 10C21.6 10 24 11.7 24 14C24 11.7 26.4 10 29.5 10C34.8 10 39 14.2 39 19.5C39 30.5 24 40 24 40Z"
            stroke="#00D9FF"
            strokeWidth="2.4"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:scale-105 origin-center"
          />
          <path d="M18 22H30M24 16V28" stroke="#00C6B7" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'individual-attention':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <circle cx="24" cy="16" r="6" stroke="#00D9FF" strokeWidth="2.4" />
          <path d="M12 37C12 30.4 17.4 26 24 26C30.6 26 36 30.4 36 37" stroke="#00C6B7" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="37" cy="14" r="3" stroke="#00D9FF" strokeWidth="2" />
        </svg>
      );
    case 'anxiety-reduction':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="15" stroke="#00C6B7" strokeWidth="2.2" />
          <path d="M15 25C18 21 21 21 24 25C27 29 30 29 33 25" stroke="#00D9FF" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="24" r="20" stroke="#00D9FF" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      );
    case 'cleanliness':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <path
            d="M24 7L38 12.5V23.5C38 32.5 31.8 39 24 42C16.2 39 10 32.5 10 23.5V12.5L24 7Z"
            stroke="#00C6B7"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          <path d="M18 24L22.2 28.2L30.5 19.5" stroke="#00D9FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'clear-explanations':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <rect x="9" y="10" width="30" height="22" rx="5" stroke="#00C6B7" strokeWidth="2.3" />
          <path d="M17 32L14 39L23 32" stroke="#00C6B7" strokeWidth="2.3" strokeLinejoin="round" />
          <path d="M16 18H32M16 24H26" stroke="#00D9FF" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'modern-equipment':
    default:
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" aria-hidden="true">
          <rect x="10" y="10" width="28" height="20" rx="4" stroke="#00C6B7" strokeWidth="2.3" />
          <path d="M17 20H21L23.5 15L26.5 25L29 20H32" stroke="#00D9FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 38H30M24 30V38" stroke="#00C6B7" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );
  }
}

export function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.why-card', {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="py-20 lg:py-28 bg-[#E5F8FD] dark:bg-[#08243E] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-[#176BFF] dark:text-[#00D9FF] tracking-wide mb-2">
            Why Choose Mittal Dental Clinic
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#061525] dark:text-white tracking-tight text-balance mb-4">
            Thoughtful Dental Care Centered on Comfort &amp; Clarity
          </h2>
          <p className="text-base text-[#061525]/75 dark:text-[#DFFAFF]/80 leading-relaxed">
            Every visit is structured to reduce dental anxiety, maintain disciplined clinical cleanliness, and give you clear explanations at every step.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="why-card group rounded-3xl bg-white/85 dark:bg-[#061525]/80 backdrop-blur-md border border-[#082B48]/12 dark:border-[#00D9FF]/22 hover:border-[#00C6B7] dark:hover:border-[#00D9FF]/65 p-7 shadow-[0_12px_36px_rgba(8,43,72,0.06)] dark:shadow-[0_12px_36px_rgba(0,217,255,0.08)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between gap-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#061525] border border-[#00D9FF]/30 shadow-[0_0_20px_rgba(0,217,255,0.18)] flex items-center justify-center group-hover:shadow-[0_0_26px_rgba(0,217,255,0.35)] transition-shadow">
                  <AnimatedPillarIcon id={item.id} />
                </div>
                <span className="font-mono text-xs font-semibold text-[#176BFF] dark:text-[#00D9FF] tabular-nums">
                  {item.number}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-[#061525] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#061525]/75 dark:text-[#DFFAFF]/78 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
