import { SubjectId } from '../types/quiz';

interface SubjectDiagramProps {
  subjectId: SubjectId;
  className?: string;
}

export function SubjectDiagram({ subjectId, className = '' }: SubjectDiagramProps) {
  switch (subjectId) {
    case 'hindi':
      return (
        <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
          <rect x="22" y="12" width="38" height="40" rx="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.5" />
          <rect x="60" y="12" width="38" height="40" rx="3" fill="#F0F9FF" stroke="#334155" strokeWidth="1.5" />
          <line x1="30" y1="22" x2="52" y2="22" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="30" x2="50" y2="30" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="30" y1="37" x2="48" y2="37" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="68" y1="22" x2="90" y2="22" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="68" y1="30" x2="86" y2="30" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="68" y1="37" x2="88" y2="37" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
      );
    case 'english':
      return (
        <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
          <path
            d="M 24 44 L 38 18 L 52 44 M 29 36 H 47"
            stroke="#0284C7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="62" y="16" width="36" height="32" rx="4" fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" />
          <line x1="69" y1="26" x2="91" y2="26" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <line x1="69" y1="33" x2="88" y2="33" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="69" y1="40" x2="84" y2="40" stroke="#CBD5E1" strokeWidth="1.5" />
        </svg>
      );
    case 'maths':
      return (
        <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
          <line x1="12" y1="52" x2="108" y2="52" stroke="#CBD5E1" strokeWidth="1.25" />
          <line x1="22" y1="10" x2="22" y2="58" stroke="#CBD5E1" strokeWidth="1.25" />
          <path
            d="M 22 48 C 42 46, 52 18, 72 22 C 88 25, 96 14, 104 12 L 104 52 L 22 52 Z"
            fill="#E0F2FE"
          />
          <path
            d="M 22 48 C 42 46, 52 18, 72 22 C 88 25, 96 14, 104 12"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'physics':
      return (
        <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
          <line x1="10" y1="32" x2="110" y2="32" stroke="#CBD5E1" strokeWidth="1.25" />
          <path
            d="M 12 32 Q 24 10, 36 32 T 60 32 T 84 32 T 108 32"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 12 32 Q 24 48, 36 32 T 60 32 T 84 32 T 108 32"
            stroke="#64748B"
            strokeWidth="1.25"
            strokeDasharray="3 3"
          />
          <circle cx="36" cy="32" r="2.5" fill="#0F172A" />
          <circle cx="84" cy="32" r="2.5" fill="#0F172A" />
        </svg>
      );
    case 'chemistry':
      return (
        <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
          <path
            d="M 52 12 L 52 24 L 36 50 Q 34 54 39 54 L 81 54 Q 86 54 84 50 L 68 24 L 68 12"
            fill="#F0F9FF"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M 42 40 L 78 40 L 82 50 Q 83 52 79 52 L 41 52 Q 37 52 38 50 Z" fill="#38BDF8" fillOpacity="0.65" />
          <circle cx="54" cy="44" r="2.2" fill="#0284C7" />
          <circle cx="64" cy="46" r="1.8" fill="#0284C7" />
          <circle cx="60" cy="34" r="1.6" fill="#38BDF8" />
          <line x1="48" y1="12" x2="72" y2="12" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}
