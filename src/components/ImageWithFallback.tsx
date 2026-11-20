import { useEffect, useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  onClick,
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setErrored(false);
  }, [src]);

  if (!src || errored) {
    return (
      <div
        className="w-full h-full min-h-[160px] flex flex-col items-center justify-center gap-2 bg-[#082B48] text-[#DFFAFF]/70 p-4 text-center"
        aria-label={alt}
      >
        <ImageOff className="w-6 h-6 text-[#00D9FF]" aria-hidden="true" />
        <span className="text-xs font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      onClick={onClick}
      className={className}
    />
  );
}
