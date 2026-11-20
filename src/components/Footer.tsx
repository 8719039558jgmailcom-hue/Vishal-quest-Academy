import { GradeLevel, Medium } from '../types/quiz';
import { ActiveView } from './Header';

interface FooterProps {
  activeView: ActiveView;
  medium: Medium;
  onNavigate: (view: ActiveView) => void;
  onJumpToGradeHub: (grade: GradeLevel) => void;
  onOpenLeaderboard?: () => void;
}

export function Footer({
  activeView,
  medium,
  onNavigate,
  onJumpToGradeHub,
  onOpenLeaderboard,
}: FooterProps) {
  if (activeView === 'battle') return null;

  return (
    <footer className="border-t-[2.5px] border-[#181C32] bg-white mt-8 pb-20 sm:pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-[#FACC15] comic-gloss border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center font-display font-bold text-[#181C32] text-xs shrink-0">
            BQ
          </span>
          <div>
            <p className="font-display font-bold text-[#181C32] text-sm leading-tight">
              {medium === 'hi' ? 'बोर्ड क्वेस्ट (Board Quest)' : 'बोर्ड क्वेस्ट · Board Quest'}
            </p>
            <p className="mt-0.5 font-semibold text-slate-600">
              {medium === 'hi'
                ? 'नई NCERT अध्याय क्वेस्ट · 10s बॉस युद्ध · MP बोर्ड कक्षा 10वीं व 12वीं'
                : 'New NCERT Arcade Quests · 10s Boss Battles · MP Board Class 10th & 12th'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-extrabold text-[#181C32]">
          <button
            type="button"
            onClick={() => onJumpToGradeHub('10')}
            className="min-h-[36px] px-3 py-1 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] comic-btn-sm transition-colors"
          >
            {medium === 'hi' ? 'कक्षा 10वीं' : 'Class 10th'}
          </button>
          <button
            type="button"
            onClick={() => onJumpToGradeHub('12')}
            className="min-h-[36px] px-3 py-1 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] comic-btn-sm transition-colors"
          >
            {medium === 'hi' ? 'कक्षा 12वीं' : 'Class 12th'}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="min-h-[36px] px-3 py-1 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] comic-btn-sm transition-colors"
          >
            {medium === 'hi' ? 'अभ्यास व लैब' : 'Practice & Lab'}
          </button>
          {onOpenLeaderboard && (
            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="min-h-[36px] px-3 py-1 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#181C32] comic-btn-sm transition-colors"
            >
              {medium === 'hi' ? 'रैंकिंग' : 'Leaderboard'}
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
