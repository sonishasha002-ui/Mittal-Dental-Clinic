import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildPhoneHref } from '../services/clinicFirestore';

export function LocationsPage() {
  usePageMeta();
  const { clinicInfo, branches } = useClinic();

  return (
    <div>
      {/* Page Hero */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-br from-[#061525] via-[#082B48] to-[#04182D] text-white">
        <div
          className="pointer-events-none absolute -top-24 left-1/3 w-80 h-80 rounded-full bg-[#00D9FF]/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#00D9FF] uppercase">
            Clinic Locations &amp; Branch Hours
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
            Visit Civil Lines or Zero Road, Prayagraj
          </h1>
          <p className="text-sm sm:text-base text-[#DFFAFF]/82 max-w-2xl leading-relaxed">
            Both branches offer independent opening hour controls and direct Google Maps navigation. Call {clinicInfo.phoneDisplay} to verify slot availability before visiting.
          </p>
        </div>
      </section>

      {/* Two Branch Location Cards + Embedded Maps */}
      <section className="py-12 sm:py-18 bg-[#E7F8FB] dark:bg-[#061525] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {branches.map((branch) => (
              <article
                key={branch.id}
                className="rounded-3xl bg-white/95 dark:bg-[#082B48]/80 backdrop-blur-md border border-[#082B48]/12 dark:border-[#00D9FF]/25 p-6 sm:p-8 shadow-[0_14px_40px_rgba(8,43,72,0.08)] flex flex-col justify-between gap-6"
              >
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#00C6B7] dark:text-[#00D9FF] mb-1">
                        {branch.label}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-[#061525] dark:text-white">
                        {branch.name}
                      </h2>
                    </div>
                  </div>

                  {/* Verified Address */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#EDF7FC] dark:bg-[#061525]/70 border border-[#082B48]/10 dark:border-[#00D9FF]/18">
                    <MapPin className="w-5 h-5 text-[#00C6B7] dark:text-[#00D9FF] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#061525]/85 dark:text-[#DFFAFF]/85 leading-relaxed">
                      {branch.addressLines.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  </div>

                  {/* Embedded Google Map */}
                  {branch.embedMapUrl && (
                    <div className="rounded-2xl overflow-hidden border border-[#082B48]/12 dark:border-[#00D9FF]/22 bg-[#061525] h-52 sm:h-56">
                      <iframe
                        title={`${branch.name} Map`}
                        src={branch.embedMapUrl}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}

                  {/* Independently Editable Branch Timings */}
                  <div className="p-5 rounded-2xl bg-[#EDF7FC] dark:bg-[#061525]/70 border border-[#082B48]/10 dark:border-[#00D9FF]/18 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#061525] dark:text-white">
                        <Clock className="w-4 h-4 text-[#00C6B7] dark:text-[#00D9FF]" />
                        <span>Branch Opening Hours</span>
                      </div>
                      <span className="text-[11px] text-[#061525]/60 dark:text-[#00D9FF]/80">
                        Independently Editable
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-1 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-[#061525]/65 dark:text-[#DFFAFF]/65 mb-1">
                          Monday to Saturday
                        </p>
                        <div className="space-y-0.5 font-semibold text-[#061525] dark:text-white tabular-nums">
                          {branch.hours.mondayToSaturday.map((slot) => (
                            <div key={slot}>{slot}</div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#061525]/65 dark:text-[#DFFAFF]/65 mb-1">
                          Sunday
                        </p>
                        <div className="space-y-0.5 font-semibold text-[#061525] dark:text-white tabular-nums">
                          {branch.hours.sunday.map((slot) => (
                            <div key={slot}>{slot}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#061525]/65 dark:text-[#DFFAFF]/70 pt-2 border-t border-[#082B48]/10 dark:border-white/10">
                      {branch.hours.note}
                    </p>
                  </div>
                </div>

                {/* Branch Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to={`/contact?branch=${branch.id}`}
                    className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#176BFF] to-[#00C6B7] hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] text-white text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Book at {branch.id === 'civil-lines' ? 'Civil Lines' : 'Zero Road'}</span>
                  </Link>

                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/80 border border-[#082B48]/15 dark:border-[#00D9FF]/25 hover:border-[#00C6B7] dark:hover:border-[#00D9FF] text-xs font-semibold text-[#061525] dark:text-white transition-colors whitespace-nowrap"
                  >
                    <span>Google Maps Directions</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#00C6B7] dark:text-[#00D9FF]" />
                  </a>

                  <a
                    href={buildPhoneHref(branch.phone)}
                    className="inline-flex items-center gap-1.5 px-4 py-3 min-h-[44px] rounded-xl bg-[#EDF7FC] dark:bg-[#061525]/80 border border-[#082B48]/15 dark:border-[#00D9FF]/25 text-xs font-semibold text-[#061525] dark:text-white tabular-nums whitespace-nowrap"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#00C6B7] dark:text-[#00D9FF]" />
                    <span>{branch.phone}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Google Business Profile Patient Reviews Card */}
      <section className="py-12 sm:py-18 bg-[#F4FAFD] dark:bg-[#071B30] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061525] via-[#082B48] to-[#0A3558] border border-[#00D9FF]/28 p-7 sm:p-12 grid lg:grid-cols-12 gap-8 items-center shadow-[0_20px_60px_rgba(6,21,37,0.22)] text-white">
            <div className="relative lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00D9FF]">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Google Business Profiles</span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                Patient Reviews on Google
              </h2>
              <p className="text-sm sm:text-base text-[#DFFAFF]/85 leading-relaxed max-w-2xl">
                To uphold complete transparency, Mittal Dental Clinic does not display fabricated testimonials or unverified rating numbers on this website. Please view authentic patient feedback directly on our Google Business profiles.
              </p>
            </div>

            <div className="relative lg:col-span-5 flex flex-col gap-3">
              {branches.map((branch) => (
                <a
                  key={branch.id}
                  href={branch.googleProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-4 px-5 py-4 min-h-[48px] rounded-2xl bg-[#061525]/70 hover:bg-[#00D9FF]/15 border border-[#00D9FF]/28 hover:border-[#00D9FF]/65 text-sm font-semibold text-white transition-all"
                >
                  <span>
                    View Google Reviews ·{' '}
                    <span className="text-[#00D9FF]">
                      {branch.id === 'civil-lines' ? 'Civil Lines' : 'Zero Road'}
                    </span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-[#00D9FF] shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
