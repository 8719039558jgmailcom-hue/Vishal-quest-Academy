import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Crown, Sparkles, Star, Trophy, X } from 'lucide-react';
import { HeroLevelInfo } from '../data/questConfig';
import { Medium } from '../types/quiz';

interface LevelUpModalProps {
  levelUp: {
    previousLevel: number;
    newLevelInfo: HeroLevelInfo;
    totalXP: number;
  } | null;
  medium: Medium;
  onClose: () => void;
}

export function LevelUpModal({ levelUp, medium, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (!levelUp) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [levelUp, onClose]);

  return (
    <AnimatePresence>
      {levelUp && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="level-up-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#181C32]/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.78, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 12, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 24 }}
            className="w-full max-w-sm comic-card comic-gloss rounded-3xl bg-[#FEF08A] p-6 text-center space-y-4 relative overflow-hidden"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close level up notice"
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-xl bg-white border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center text-[#181C32]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>

            <motion.div
              initial={{ rotate: -14, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.08 }}
              className="mx-auto w-20 h-20 rounded-3xl bg-[#FACC15] border-[3px] border-[#181C32] shadow-[0_5px_0_#181C32] flex items-center justify-center relative"
            >
              <Crown className="w-10 h-10 text-[#181C32]" aria-hidden="true" />
              <Sparkles className="w-5 h-5 text-[#E11D48] absolute -top-2 -right-2" aria-hidden="true" />
            </motion.div>

            <div className="space-y-1">
              <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#B45309] flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#B45309]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'नया रैंक अनलॉक!' : 'NEW RANK UNLOCKED!'}</span>
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#B45309]" aria-hidden="true" />
              </p>
              <h2
                id="level-up-title"
                className="font-display text-3xl font-bold text-[#181C32] leading-tight"
              >
                {medium === 'hi'
                  ? `लेवल ${levelUp.newLevelInfo.level} प्राप्त!`
                  : `LEVEL UP! Lv.${levelUp.newLevelInfo.level}`}
              </h2>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border-2 border-[#181C32] space-y-1">
              <p className="font-mono text-xs font-extrabold text-[#2563EB] tabular-nums">
                Lv.{levelUp.previousLevel} → Lv.{levelUp.newLevelInfo.level}
              </p>
              <p className="font-display text-lg font-bold text-[#181C32]">
                {levelUp.newLevelInfo.title[medium]}
              </p>
              <p className="font-mono text-xs font-bold text-[#059669] inline-flex items-center justify-center gap-1 tabular-nums">
                <Trophy className="w-3.5 h-3.5 text-[#EAB308]" aria-hidden="true" />
                <span>{levelUp.totalXP.toLocaleString()} XP</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] px-5 py-3 text-sm font-extrabold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-2xl comic-btn"
            >
              {medium === 'hi' ? 'अभियान जारी रखें!' : 'KEEP QUESTING!'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
