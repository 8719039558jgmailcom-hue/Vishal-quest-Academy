import { GradeLevel, Medium } from '../types/quiz';
import { ActiveView } from './Header';

interface FooterProps {
  medium: Medium;
  onNavigate: (view: ActiveView) => void;
  onJumpToGradeHub: (grade: GradeLevel) => void;
  onOpenLeaderboard?: () => void;
}

export function Footer({
  medium,
  onNavigate,
  onJumpToGradeHub,
  onOpenLeaderboard,
}: FooterProps) {
  return (
    <footer className="border-t border-slate-800 bg-[#0B1220] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
        <div>
          <p className="font-display font-semibold text-amber-400 text-sm">
            Vishal&apos;s Quest Academy
          </p>
          <p className="mt-0.5">
            {medium === 'hi'
              ? 'नई NCERT अध्याय-वार क्वेस्ट मैप · एमपी बोर्ड कक्षा 10वीं व 12वीं (PYQ 2023–2027 व लाइव द्वंद्व)'
              : 'New NCERT Chapter-Wise Quest Maps · MP Board Class 10th & 12th (PYQs 2023–2027 & Live Duels)'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => onJumpToGradeHub('10')}
            className="hover:text-white transition-colors"
          >
            {medium === 'hi' ? 'कक्षा 10वीं हब' : 'Class 10th Hub'}
          </button>
          <button
            type="button"
            onClick={() => onJumpToGradeHub('12')}
            className="hover:text-white transition-colors"
          >
            {medium === 'hi' ? 'कक्षा 12वीं हब' : 'Class 12th Hub'}
          </button>
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              {medium === 'hi' ? 'ग्लोबल लीडरबोर्ड' : 'Global Leaderboard'}
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('multiplayer')}
            className="hover:text-white transition-colors"
          >
            {medium === 'hi' ? 'मल्टीप्लेयर अखाड़ा' : 'Multiplayer Arena'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('barracks')}
            className="hover:text-white transition-colors"
          >
            {medium === 'hi' ? 'अवतार व प्रगति' : 'Hero Barracks'}
          </button>
        </div>
      </div>
    </footer>
  );
}
