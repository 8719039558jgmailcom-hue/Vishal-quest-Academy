import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  Flame,
  Heart,
  RotateCcw,
  ShieldAlert,
  Star,
  Trophy,
  XCircle,
} from 'lucide-react';
import { EncounterResult, Medium } from '../types/quiz';

interface VictoryReportProps {
  result: EncounterResult;
  medium: Medium;
  onReplay: () => void;
  onEnterNextChapter: () => void;
  onBackToMap: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function VictoryReport({
  result,
  medium,
  onReplay,
  onEnterNextChapter,
  onBackToMap,
}: VictoryReportProps) {
  const hasNextChapterButton =
    result.victory &&
    result.battleKind === 'chapter' &&
    result.subjectId !== 'grand-boss';

  const nextActionLabel = !result.nextChapterNodeId
    ? medium === 'hi'
      ? 'विषय महाबॉस चुनौती लड़ें'
      : 'Challenge Subject Final Boss'
    : medium === 'hi'
      ? `अध्याय ${(result.chapterOrder ?? 1) + 1} खेलें`
      : `Enter Chapter ${(result.chapterOrder ?? 1) + 1}`;

  return (
    <main className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6">
      <button
        type="button"
        onClick={onBackToMap}
        className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#181C32] bg-white rounded-xl comic-btn-sm"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>
          {result.subjectId === 'grand-boss'
            ? medium === 'hi'
              ? 'विषय हब पर लौटें'
              : 'Back to Quest Hub'
            : medium === 'hi'
              ? 'अध्याय मैप पर लौटें'
              : 'Back to Stage Map'}
        </span>
      </button>

      {/* Arcade Victory / Defeat Card */}
      <section
        aria-labelledby="victory-heading"
        className={`comic-card rounded-3xl overflow-hidden ${
          result.victory ? 'bg-[#FEF08A]' : 'bg-[#FFE4E6]'
        }`}
      >
        <div className="comic-banner-dark comic-gloss border-b-[2.5px] border-[#181C32] px-5 py-3 flex items-center justify-between gap-2 text-white">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-mono font-extrabold ${
              result.victory ? 'text-[#34D399]' : 'text-[#FB7185]'
            }`}
          >
            {result.victory ? (
              <Crown className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {result.victory
                ? medium === 'hi'
                  ? 'बोर्ड क्वेस्ट विजय!'
                  : 'STAGE CLEARED!'
                : medium === 'hi'
                  ? 'पुनः प्रयास करें!'
                  : 'RETRY STAGE!'}
            </span>
          </span>
          <span className="text-[11px] font-mono font-bold text-[#FACC15]">
            {medium === 'hi' ? `कक्षा ${result.grade}वीं` : `CLASS ${result.grade}TH`}
          </span>
        </div>

        <div className="p-5 sm:p-7 space-y-5 comic-gloss">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1" aria-label={`${result.stars} out of 3 stars`}>
                {[1, 2, 3].map((s) => (
                  <motion.span
                    key={s}
                    initial={{ scale: 0.35, rotate: -24, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 18,
                      delay: 0.08 + s * 0.11,
                    }}
                    className="inline-flex"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= result.stars ? 'text-[#D97706] fill-[#F59E0B]' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                  </motion.span>
                ))}
              </div>

              <h1
                id="victory-heading"
                className="font-display text-3xl sm:text-4xl font-bold text-[#181C32] leading-tight"
              >
                {result.victory
                  ? medium === 'hi'
                    ? `शानदार जीत! (${result.percentage}%)`
                    : `Victory! ${result.percentage}%`
                  : medium === 'hi'
                    ? `पराजय (${result.percentage}%)`
                    : `Defeated (${result.percentage}%)`}
              </h1>

              <p className="text-xs sm:text-sm font-bold text-[#181C32]/80">
                {result.title[medium]} ·{' '}
                {medium === 'hi' ? `कक्षा ${result.grade}वीं` : `Class ${result.grade}th`}
              </p>
            </div>

          <div className="grid grid-cols-2 gap-2.5 sm:w-72 shrink-0">
            <div className="p-3 rounded-2xl bg-white border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-[#D97706] flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>XP</span>
              </p>
              <p className="font-mono text-xl font-extrabold text-[#181C32] tabular-nums">
                +{result.totalXP}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-[#EA580C] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Combo</span>
              </p>
              <p className="font-mono text-xl font-extrabold text-[#181C32] tabular-nums">
                {result.maxStreak}x
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-[#059669] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{medium === 'hi' ? 'सही' : 'Hits'}</span>
              </p>
              <p className="font-mono text-xl font-extrabold text-[#181C32] tabular-nums">
                {result.correctCount}/{result.totalCount}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-[#2563EB] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                <span>HP</span>
              </p>
              <p className="font-mono text-xl font-extrabold text-[#181C32] tabular-nums">
                {result.playerHpRemaining}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {hasNextChapterButton && (
            <button
              type="button"
              onClick={onEnterNextChapter}
              className="min-h-[50px] flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-[#181C32] bg-[#34D399] hover:bg-[#10B981] rounded-2xl comic-btn comic-gloss"
            >
              <span>{nextActionLabel}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={onReplay}
            className="min-h-[50px] flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-[#181C32] bg-white hover:bg-[#F8FAFF] rounded-2xl comic-btn comic-gloss"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'फिर से खेलें' : 'PLAY AGAIN'}</span>
          </button>
        </div>
        </div>
      </section>

      {/* NCERT Review Cards */}
      <section aria-labelledby="battle-review-heading" className="space-y-3.5">
        <h2 id="battle-review-heading" className="font-display text-xl font-bold text-[#181C32]">
          {medium === 'hi' ? 'NCERT उत्तर समीक्षा' : 'NCERT Answer Review'}
        </h2>

        <div className="space-y-3.5">
          {result.questions.map((q, idx) => {
            const rec = result.records[idx];
            const isCorrect = rec?.isCorrect ?? false;
            const userIdx = rec?.selectedIndex;

            return (
              <article key={q.id} className="comic-card rounded-3xl p-4 sm:p-5 bg-white space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono font-extrabold text-[#2563EB]">
                    Q{idx + 1} · {q.sourceTag} · {q.ncertChapter[medium]}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-extrabold ${
                      isCorrect ? 'text-[#059669]' : 'text-[#E11D48]'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>
                      {isCorrect
                        ? `+${rec?.xpEarned ?? 0} XP`
                        : userIdx === undefined
                          ? medium === 'hi'
                            ? 'समय समाप्त'
                            : 'Timed Out'
                          : medium === 'hi'
                            ? 'गलत'
                            : 'Missed'}
                    </span>
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-[#181C32] leading-snug">
                  {q.prompt[medium]}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isRight = optIdx === q.correctIndex;
                    const isUserPick = optIdx === userIdx;

                    let boxClass = 'border-slate-300 bg-[#F8FAFF] text-slate-600';
                    if (isRight) {
                      boxClass = 'border-[#059669] bg-[#ECFDF5] text-[#181C32] font-bold';
                    } else if (isUserPick && !isRight) {
                      boxClass = 'border-[#E11D48] bg-[#FFF1F2] text-[#9F1239] font-bold';
                    }

                    return (
                      <div
                        key={`${q.id}-rev-${optIdx}`}
                        className={`px-3 py-2 rounded-xl border-2 text-xs sm:text-sm ${boxClass}`}
                      >
                        <span className="font-mono font-extrabold mr-1.5">
                          {OPTION_LETTERS[optIdx]}.
                        </span>
                        {opt[medium]}
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-200 leading-relaxed">
                  <strong className="text-[#181C32]">
                    {medium === 'hi' ? 'व्याख्या: ' : 'Note: '}
                  </strong>
                  {q.explanation[medium]}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
