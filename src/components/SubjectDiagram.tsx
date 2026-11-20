import { SubjectId } from '../types/quiz';

interface SubjectDiagramProps {
  subjectId: SubjectId;
  className?: string;
}

export function SubjectDiagram({ subjectId, className = '' }: SubjectDiagramProps) {
  switch (subjectId) {
    case 'hindi':
      return (
        <svg viewBox="0 0 80 64" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="10" width="32" height="44" rx="5" fill="#FEF08A" stroke="#181C32" strokeWidth="3" />
          <rect x="40" y="10" width="32" height="44" rx="5" fill="#FFFFFF" stroke="#181C32" strokeWidth="3" />
          <line x1="15" y1="22" x2="33" y2="22" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="15" y1="31" x2="31" y2="31" stroke="#181C32" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="40" x2="29" y2="40" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="47" y1="22" x2="65" y2="22" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="47" y1="31" x2="63" y2="31" stroke="#181C32" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="47" y1="40" x2="60" y2="40" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'english':
      return (
        <svg viewBox="0 0 80 64" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="12" width="34" height="40" rx="8" fill="#BAE6FD" stroke="#181C32" strokeWidth="3" />
          <path
            d="M 16 42 L 25 20 L 34 42 M 19 35 H 31"
            stroke="#181C32"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="46" y="16" width="26" height="32" rx="6" fill="#FDE047" stroke="#181C32" strokeWidth="3" />
          <line x1="52" y1="26" x2="66" y2="26" stroke="#181C32" strokeWidth="2.8" strokeLinecap="round" />
          <line x1="52" y1="34" x2="64" y2="34" stroke="#E11D48" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    case 'maths':
      return (
        <svg viewBox="0 0 80 64" fill="none" className={className} aria-hidden="true">
          <rect x="8" y="8" width="64" height="48" rx="10" fill="#DDD6FE" stroke="#181C32" strokeWidth="3" />
          <path
            d="M 18 46 L 42 16 L 62 46 Z"
            fill="#FACC15"
            stroke="#181C32"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="54" cy="22" r="7" fill="#38BDF8" stroke="#181C32" strokeWidth="2.8" />
        </svg>
      );
    case 'physics':
      return (
        <svg viewBox="0 0 80 64" fill="none" className={className} aria-hidden="true">
          <circle cx="40" cy="32" r="24" fill="#FEE2E2" stroke="#181C32" strokeWidth="3" />
          <path
            d="M 43 13 L 26 34 H 39 L 35 51 L 54 29 H 41 L 43 13 Z"
            fill="#FACC15"
            stroke="#181C32"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'chemistry':
      return (
        <svg viewBox="0 0 80 64" fill="none" className={className} aria-hidden="true">
          <path
            d="M 32 10 L 32 22 L 16 48 Q 14 54 20 54 L 60 54 Q 66 54 64 48 L 48 22 L 48 10 Z"
            fill="#FFFFFF"
            stroke="#181C32"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 23 36 H 57 L 62 48 Q 63 51 59 51 H 21 Q 17 51 18 48 Z"
            fill="#34D399"
            stroke="#181C32"
            strokeWidth="2.5"
          />
          <circle cx="35" cy="43" r="3" fill="#FEF08A" stroke="#181C32" strokeWidth="1.8" />
          <circle cx="47" cy="45" r="2.5" fill="#FEF08A" stroke="#181C32" strokeWidth="1.8" />
          <line x1="27" y1="10" x2="53" y2="10" stroke="#181C32" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
  }
}
