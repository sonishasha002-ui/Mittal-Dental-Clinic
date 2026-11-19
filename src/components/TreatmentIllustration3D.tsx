import { useId } from 'react';
import type { IllustrationKind } from '../data/clinicData';

export function TreatmentIllustration3D({
  kind,
  className = 'w-16 h-16',
}: {
  kind: IllustrationKind;
  className?: string;
}) {
  const uid = useId().replace(/:/g, '');

  const enamelGrad = `enamel-${uid}`;
  const tealGrad = `teal-${uid}`;
  const navyGrad = `navy-${uid}`;
  const metalGrad = `metal-${uid}`;

  const renderShape = () => {
    switch (kind) {
      case 'rct':
        return (
          <>
            <path
              d="M22 14C16 14 13 20 15 28C16.5 34 19 41 20 53C20.4 56.5 24 57 25.5 53C27.5 47 29 41 32 41C35 41 36.5 47 38.5 53C40 57 43.6 56.5 44 53C45 41 47.5 34 49 28C51 20 48 14 42 14C37.5 14 35.5 16.5 32 16.5C28.5 16.5 26.5 14 22 14Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.6"
            />
            <path d="M25 22C24 31 23 41 22.5 52" stroke={`url(#${tealGrad})`} strokeWidth="2.8" strokeLinecap="round" />
            <path d="M39 22C40 31 41 41 41.5 52" stroke={`url(#${tealGrad})`} strokeWidth="2.8" strokeLinecap="round" />
            <ellipse cx="32" cy="22" rx="7" ry="4" fill={`url(#${tealGrad})`} opacity="0.9" />
          </>
        );

      case 'implant':
        return (
          <>
            <path
              d="M21 11C17 11 15 16 17 22C18 25 20 28 22 29H42C44 28 46 25 47 22C49 16 47 11 43 11C39 11 36 13 32 13C28 13 25 11 21 11Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <rect x="25" y="29" width="14" height="6" rx="2" fill={`url(#${tealGrad})`} />
            <path d="M24 35H40L36 56C35.5 58 28.5 58 28 56L24 35Z" fill={`url(#${metalGrad})`} stroke="#082B48" strokeOpacity="0.35" strokeWidth="1.2" />
            <path d="M23 39H41M24 44H40M25 49H39M27 53.5H37" stroke="#061525" strokeOpacity="0.5" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );

      case 'extraction':
        return (
          <>
            <path
              d="M23 12C18 12 16 17 17.5 23C19 28 21 33 21.5 42C21.8 45 25 45.5 26 42.5C27.5 38 29 34 32 34C35 34 36.5 38 38 42.5C39 45.5 42.2 45 42.5 42C43 33 45 28 46.5 23C48 17 46 12 41 12C37 12 35 14 32 14C29 14 27 12 23 12Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path d="M15 48C21 44 43 44 49 48" stroke="#00D9FF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
            <path d="M32 6V10M27 8L32 4L37 8" stroke="#00D9FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'braces':
        return (
          <>
            <rect x="10" y="18" width="12" height="26" rx="5" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.4" />
            <rect x="26" y="16" width="12" height="28" rx="5" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.4" />
            <rect x="42" y="18" width="12" height="26" rx="5" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.4" />
            <path d="M7 31H57" stroke="#00D9FF" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="12.5" y="27.5" width="7" height="7" rx="1.5" fill={`url(#${navyGrad})`} />
            <rect x="28.5" y="27.5" width="7" height="7" rx="1.5" fill={`url(#${tealGrad})`} />
            <rect x="44.5" y="27.5" width="7" height="7" rx="1.5" fill={`url(#${navyGrad})`} />
          </>
        );

      case 'invisible-braces':
        return (
          <>
            <path
              d="M11 36C11 22 20 14 32 14C44 14 53 22 53 36C53 41 49 45 44 45C39 45 36 41 32 41C28 41 25 45 20 45C15 45 11 41 11 36Z"
              fill="#DFFAFF"
              fillOpacity="0.72"
              stroke={`url(#${tealGrad})`}
              strokeWidth="2.2"
            />
            <path d="M17 31C18 24 24 20 32 20C40 20 46 24 47 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="22" cy="30" r="2" fill="#00D9FF" opacity="0.85" />
            <circle cx="32" cy="27" r="2" fill="#00D9FF" opacity="0.85" />
            <circle cx="42" cy="30" r="2" fill="#00D9FF" opacity="0.85" />
          </>
        );

      case 'filling':
      case 'laser-filling':
        return (
          <>
            <path
              d="M21 15C16 15 14 21 16 28C17.5 34 20 40 21 51C21.5 54 25 54 26 51C27.5 46 29 42 32 42C35 42 36.5 46 38 51C39 54 42.5 54 43 51C44 40 46.5 34 48 28C50 21 48 15 43 15C39 15 36 17 32 17C28 17 25 15 21 15Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path d="M27 17C29 22 35 22 37 17" fill={`url(#${tealGrad})`} />
            {kind === 'laser-filling' && (
              <>
                <path d="M46 7L35 19" stroke="#00D9FF" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="34" cy="20" r="4" fill="#00D9FF" fillOpacity="0.45" />
                <circle cx="48" cy="6" r="3" fill="#176BFF" />
              </>
            )}
          </>
        );

      case 'scaling':
        return (
          <>
            <path
              d="M22 14C17 14 15 20 17 28C18.5 34 20.5 40 21.5 50C22 53 25 53 26.5 50C28 45 29.5 41 32 41C34.5 41 36 45 37.5 50C39 53 42 53 42.5 50C43.5 40 45.5 34 47 28C49 20 47 14 42 14C38 14 35.5 16.5 32 16.5C28.5 16.5 26 14 22 14Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path d="M12 25C16 21 18 29 22 25" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M42 25C46 21 48 29 52 25" stroke="#00D9FF" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="14" r="2.2" fill="#00D9FF" />
            <circle cx="14" cy="16" r="1.8" fill="#00C6B7" />
          </>
        );

      case 'xray':
        return (
          <>
            <rect x="11" y="10" width="42" height="44" rx="7" fill={`url(#${navyGrad})`} stroke="#00D9FF" strokeOpacity="0.45" strokeWidth="1.2" />
            <rect x="15" y="14" width="34" height="36" rx="4" fill="#082B48" stroke="#00D9FF" strokeOpacity="0.55" strokeWidth="1" />
            <path
              d="M25 20C22 20 20 24 21 29C22 33 23.5 37 24 44C24.3 46 26.5 46 27.5 44C29 40 30 37 32 37C34 37 35 40 36.5 44C37.5 46 39.7 46 40 44C40.5 37 42 33 43 29C44 24 42 20 39 20C36 20 34.5 21.5 32 21.5C29.5 21.5 28 20 25 20Z"
              fill="#DFFAFF"
              fillOpacity="0.92"
            />
            <path d="M17 31H47" stroke="#00D9FF" strokeWidth="1.4" strokeOpacity="0.75" />
          </>
        );

      case 'metal-free-crown':
      case 'zirconia-crown':
        return (
          <>
            <path
              d="M19 16C15 16 13 22 15 29C16.5 34 19 38 22 40H42C45 38 47.5 34 49 29C51 22 49 16 45 16C40 16 37 18.5 32 18.5C27 18.5 24 16 19 16Z"
              fill={`url(#${enamelGrad})`}
              stroke={`url(#${tealGrad})`}
              strokeWidth="2"
            />
            <path d="M22 44H42" stroke="#00D9FF" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 23C28 21 36 21 40 23" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            {kind === 'zirconia-crown' && (
              <polygon points="32,7 36,12 32,14 28,12" fill="#00D9FF" />
            )}
          </>
        );

      case 'cad-cam':
        return (
          <>
            <rect x="12" y="12" width="40" height="40" rx="8" fill="#082B48" stroke="#00D9FF" strokeOpacity="0.5" strokeWidth="1.5" />
            <path d="M12 24H52M12 40H52M24 12V52M40 12V52" stroke="#00D9FF" strokeOpacity="0.28" strokeWidth="1" />
            <path
              d="M23 20C20 20 19 24 20 29C21 33 23 36 25 38H39C41 36 43 33 44 29C45 24 44 20 41 20C38 20 36 22 32 22C28 22 26 20 23 20Z"
              fill={`url(#${tealGrad})`}
              fillOpacity="0.95"
            />
          </>
        );

      case 'fpd':
        return (
          <>
            <rect x="10" y="18" width="12" height="24" rx="4" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.4" />
            <rect x="26" y="16" width="12" height="22" rx="4" fill={`url(#${tealGrad})`} opacity="0.95" />
            <rect x="42" y="18" width="12" height="24" rx="4" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.4" />
            <path d="M16 42V52M48 42V52" stroke="#00D9FF" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
            <path d="M14 27H50" stroke="white" strokeWidth="1.8" strokeOpacity="0.8" />
          </>
        );

      case 'veneers':
      case 'laminates':
        return (
          <>
            <rect x="16" y="15" width="24" height="34" rx="8" fill={`url(#${enamelGrad})`} stroke="#082B48" strokeOpacity="0.22" strokeWidth="1.5" />
            <path
              d="M24 18C24 14 28 11 33 11H43C46 11 49 14 49 18V41C49 45 46 48 43 48H33C28 48 24 45 24 41V18Z"
              fill="#DFFAFF"
              fillOpacity="0.85"
              stroke={`url(#${tealGrad})`}
              strokeWidth="2"
            />
            <path d="M31 19V39" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'complete-denture':
      case 'partial-denture':
        return (
          <>
            <path
              d="M12 36C12 22 20 14 32 14C44 14 52 22 52 36C52 44 45 48 32 48C19 48 12 44 12 36Z"
              fill="#F3D6D9"
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path
              d="M17 34C17 24 23 19 32 19C41 19 47 24 47 34"
              fill="none"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {kind === 'partial-denture' && (
              <path d="M18 39H46" stroke={`url(#${tealGrad})`} strokeWidth="2.4" strokeLinecap="round" />
            )}
          </>
        );

      case 'whitening':
        return (
          <>
            <path
              d="M22 16C17 16 15 22 17 29C18.5 35 20.5 41 21.5 51C22 54 25 54 26.5 51C28 46 29.5 42 32 42C34.5 42 36 46 37.5 51C39 54 42 54 42.5 51C43.5 41 45.5 35 47 29C49 22 47 16 42 16C38 16 35.5 18.5 32 18.5C28.5 18.5 26 16 22 16Z"
              fill={`url(#${enamelGrad})`}
              stroke={`url(#${tealGrad})`}
              strokeWidth="1.8"
            />
            <path d="M32 6V11M46 10L43 14M18 10L21 14" stroke="#00D9FF" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );

      case 'pediatric':
        return (
          <>
            <path
              d="M24 19C19 19 17 24 19 30C20.5 35 22 40 23 49C23.5 52 26.5 52 27.5 49C28.8 45 30 42 32 42C34 42 35.2 45 36.5 49C37.5 52 40.5 52 41 49C42 40 43.5 35 45 30C47 24 45 19 40 19C36.5 19 34.5 21 32 21C29.5 21 27.5 19 24 19Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.25"
              strokeWidth="1.6"
            />
            <circle cx="27" cy="29" r="1.6" fill="#061525" />
            <circle cx="37" cy="29" r="1.6" fill="#061525" />
            <path d="M28 33.5C30 35.5 34 35.5 36 33.5" stroke="#00C6B7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        );

      case 'night-guard':
        return (
          <>
            <path
              d="M12 34C12 21 21 14 32 14C43 14 52 21 52 34C52 40 47 44 41 44C37 44 35 40 32 40C29 40 27 44 23 44C17 44 12 40 12 34Z"
              fill={`url(#${tealGrad})`}
              fillOpacity="0.28"
              stroke={`url(#${tealGrad})`}
              strokeWidth="2.4"
            />
            <path d="M22 10L25 14M32 8V13M42 10L39 14" stroke="#00D9FF" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'sealant':
        return (
          <>
            <path
              d="M21 16C16 16 14 22 16 29C17.5 35 20 41 21 51C21.5 54 25 54 26 51C27.5 46 29 42 32 42C35 42 36.5 46 38 51C39 54 42.5 54 43 51C44 41 46.5 35 48 29C50 22 48 16 43 16C39 16 36 18 32 18C28 18 25 16 21 16Z"
              fill={`url(#${enamelGrad})`}
              stroke="#082B48"
              strokeOpacity="0.22"
              strokeWidth="1.5"
            />
            <path d="M22 15C26 19 38 19 42 15" stroke={`url(#${tealGrad})`} strokeWidth="4" strokeLinecap="round" />
          </>
        );

      case 'consultation':
        return (
          <>
            <rect x="14" y="11" width="32" height="42" rx="6" fill="#DFFAFF" stroke="#082B48" strokeOpacity="0.25" strokeWidth="1.6" />
            <path d="M22 22H38M22 29H38M22 36H32" stroke="#082B48" strokeOpacity="0.65" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="42" r="9" fill={`url(#${tealGrad})`} />
            <path d="M40 42L43 45L49 39" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'online-consultation':
        return (
          <>
            <rect x="10" y="13" width="44" height="32" rx="6" fill={`url(#${navyGrad})`} stroke="#00D9FF" strokeOpacity="0.45" strokeWidth="1.2" />
            <rect x="14" y="17" width="36" height="24" rx="3" fill="#DFFAFF" />
            <circle cx="32" cy="27" r="5" fill={`url(#${tealGrad})`} />
            <path d="M24 38C25.5 34.5 28.5 33 32 33C35.5 33 38.5 34.5 40 38" stroke="#061525" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M24 49H40" stroke="#00D9FF" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );

      case 'post-op':
      default:
        return (
          <>
            <path
              d="M32 9L50 16V30C50 42 42 50 32 55C22 50 14 42 14 30V16L32 9Z"
              fill={`url(#${enamelGrad})`}
              stroke={`url(#${tealGrad})`}
              strokeWidth="2.2"
            />
            <path d="M32 23V39M24 31H40" stroke={`url(#${tealGrad})`} strokeWidth="3.5" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={enamelGrad} x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#EDF7FC" />
          <stop offset="100%" stopColor="#CBEFF7" />
        </linearGradient>
        <linearGradient id={tealGrad} x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D9FF" />
          <stop offset="100%" stopColor="#00C6B7" />
        </linearGradient>
        <linearGradient id={navyGrad} x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#176BFF" />
          <stop offset="100%" stopColor="#061525" />
        </linearGradient>
        <linearGradient id={metalGrad} x1="22" y1="32" x2="42" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EDF7FC" />
          <stop offset="50%" stopColor="#B8C7D4" />
          <stop offset="100%" stopColor="#7C92A4" />
        </linearGradient>
      </defs>
      {renderShape()}
    </svg>
  );
}
