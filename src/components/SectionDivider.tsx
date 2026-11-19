export function SectionDivider({
  toClass,
  fromClass,
  flip = false,
  glow = true,
}: {
  toClass: string;
  fromClass: string;
  flip?: boolean;
  glow?: boolean;
}) {
  return (
    <div className={`relative w-full overflow-hidden leading-none select-none ${fromClass}`} aria-hidden="true">
      {glow && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/50 to-transparent" />
      )}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className={`block w-full h-10 sm:h-14 lg:h-16 ${flip ? 'scale-x-[-1]' : ''}`}
      >
        <path
          d="M0,18 C320,74 720,-8 1080,42 C1260,66 1380,44 1440,26 L1440,72 L0,72 Z"
          className={toClass}
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
