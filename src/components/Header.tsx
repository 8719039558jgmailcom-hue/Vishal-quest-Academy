import { Flame, Languages, Music, Trophy, Volume2, VolumeX } from 'lucide-react';
import { Medium } from '../types/quiz';

export type ActiveView =
  | 'hub'
  | 'practice'
  | 'subject-map'
  | 'battle'
  | 'results'
  | 'barracks'
  | 'multiplayer';

interface HeaderProps {
  activeView: ActiveView;
  medium: Medium;
  totalXP: number;
  dailyStreak: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onMediumChange: (medium: Medium) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onNavigate: (view: ActiveView) => void;
}

export function Header({
  activeView,
  medium,
  totalXP,
  dailyStreak,
  soundEnabled,
  musicEnabled,
  onMediumChange,
  onToggleSound,
  onToggleMusic,
  onNavigate,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-12 sm:h-14 bg-[#FFFFFF] border-b-[2.5px] border-[#181C32] shadow-[0_3px_0_rgba(24,28,50,0.12)]">
      <div className="max-w-6xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Brand Emblem + Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('hub')}
          className="min-h-[44px] inline-flex items-center gap-2 text-left rounded-xl focus-visible:outline-2 focus-visible:outline-[#2563EB] shrink-0"
        >
          <span className="w-8 h-8 rounded-lg bg-[#FACC15] comic-gloss border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center font-display font-bold text-[#181C32] text-sm shrink-0">
            BQ
          </span>
          <span className="font-display font-bold text-[#181C32] text-base sm:text-lg tracking-tight leading-none whitespace-nowrap">
            {medium === 'hi' ? (
              <span>बोर्ड क्वेस्ट</span>
            ) : (
              <>
                <span className="sm:hidden">Board Quest</span>
                <span className="hidden sm:inline">बोर्ड क्वेस्ट · Board Quest</span>
              </>
            )}
          </span>
        </button>

        {/* Right: Live Compact Arcade HUD (XP + Streak + Medium Switch + Sound) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {activeView !== 'battle' && (
            <div className="hidden sm:flex items-center gap-2 mr-0.5 text-xs font-mono font-bold tabular-nums">
              <span className="inline-flex items-center gap-1 text-[#B45309]">
                <Trophy className="w-3.5 h-3.5 text-[#EAB308]" aria-hidden="true" />
                <span>{totalXP.toLocaleString()}</span>
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="inline-flex items-center gap-0.5 text-[#E11D48]">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" aria-hidden="true" />
                <span>{dailyStreak}d</span>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onMediumChange(medium === 'en' ? 'hi' : 'en')}
            aria-label={medium === 'en' ? 'Switch to Hindi medium' : 'Switch to English medium'}
            className="min-h-[38px] min-w-[44px] px-2.5 py-1 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#181C32] border-2 border-[#181C32] shadow-[0_2px_0_#181C32] active:translate-y-[2px] active:shadow-none font-bold text-xs inline-flex items-center justify-center gap-1 transition-transform comic-gloss"
          >
            <Languages className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
            <span>{medium === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={musicEnabled ? 'Mute background music' : 'Play background music'}
            className={`min-h-[38px] min-w-[38px] w-9 h-9 inline-flex rounded-lg border-2 border-[#181C32] shadow-[0_2px_0_#181C32] active:translate-y-[2px] active:shadow-none items-center justify-center transition-colors comic-gloss ${
              musicEnabled ? 'bg-[#FEF08A] text-[#181C32]' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <Music className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            className={`min-h-[38px] min-w-[38px] w-9 h-9 rounded-lg border-2 border-[#181C32] shadow-[0_2px_0_#181C32] active:translate-y-[2px] active:shadow-none flex items-center justify-center transition-colors comic-gloss ${
              soundEnabled ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
