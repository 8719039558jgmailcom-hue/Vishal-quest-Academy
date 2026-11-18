import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
  fallbackSubtitle?: string;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#0F172A] border border-slate-700 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-8 h-8 text-amber-400 mb-3" aria-hidden="true" />
        <p className="font-display font-semibold text-white text-base">{fallbackTitle}</p>
        {fallbackSubtitle && (
          <p className="text-xs text-slate-400 mt-1">{fallbackSubtitle}</p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
