import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  Flame,
  Heart,
  Languages,
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
  onMediumChange: (medium: Medium) => void;
  onReplay: () => void;
  onEnterNextChapter: () => void;
  onBackToMap: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function VictoryReport({
  result,
  medium,
  onMediumChange,
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
      ? `अध्याय ${(result.chapterOrder ?? 1) + 1} में प्रवेश करें`
      : `Enter Chapter ${(result.chapterOrder ?? 1) + 1}`;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>
            {result.subjectId === 'grand-boss'
              ? medium === 'hi'
                ? 'विषय हब पर लौटें'
                : 'Back to Subject Hubs'
              : medium === 'hi'
                ? 'अध्याय मैप पर लौटें'
                : 'Back to Chapter Quest Map'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onMediumChange(medium === 'en' ? 'hi' : 'en')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-lg"
        >
          <Languages className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <span>{medium === 'en' ? 'हिन्दी माध्यम' : 'English Medium'}</span>
        </button>
      </div>

      {/* Victory / Defeat Summary Card */}
      <section
        aria-labelledby="victory-heading"
        className={`rounded-xl border p-6 sm:p-8 ${
          result.victory
            ? 'bg-[#162033] border-amber-400/70'
            : 'bg-[#162033] border-red-700/70'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1" aria-label={`${result.stars} out of 3 stars`}>
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`w-6 h-6 ${
                      s <= result.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-semibold ${
                  result.victory
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                    : 'bg-red-950/60 border-red-700 text-red-300'
                }`}
              >
                {result.victory ? (
                  <Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>
                  {result.victory
                    ? result.battleKind === 'subject-boss' || result.battleKind === 'grand-boss'
                      ? medium === 'hi'
                        ? 'महाबॉस पराजित · मुहर अर्जित!'
                        : 'BOSS DEFEATED · SEAL EARNED!'
                      : medium === 'hi'
                        ? 'अध्याय विजयी · अगला अध्याय खुला!'
                        : 'CHAPTER CLEARED · NEXT NODE UNLOCKED!'
                    : medium === 'hi'
                      ? 'पराजय · पुनः प्रयास करें'
                      : 'DEFEATED · REGROUP & RETRY'}
                </span>
              </span>
            </div>

            <h1
              id="victory-heading"
              className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight"
            >
              {result.victory
                ? medium === 'hi'
                  ? `शानदार विजय! (${result.percentage}%)`
                  : `Victory! ${result.percentage}% Accuracy`
                : medium === 'hi'
                  ? `चुनौती अधूरी (${result.percentage}%)`
                  : `Fell in Battle (${result.percentage}%)`}
            </h1>

            <p className="text-sm text-slate-300">
              {result.title[medium]} ·{' '}
              {medium === 'hi' ? `कक्षा ${result.grade}वीं` : `Class ${result.grade}th`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {hasNextChapterButton && (
                <button
                  type="button"
                  onClick={onEnterNextChapter}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{nextActionLabel}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={onReplay}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'फिर से लड़ें' : 'Replay Battle'}</span>
              </button>
            </div>
          </div>

          {/* 4 Gamified Score Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'अर्जित XP' : 'XP Earned'}</span>
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
                +{result.totalXP}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-orange-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'अधिकतम कॉम्बो' : 'Max Combo'}</span>
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
                {result.maxStreak}x
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'सही प्रहार' : 'Strikes Landed'}</span>
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
                {result.correctCount} / {result.totalCount}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-sky-400 flex items-center gap-1.5">
                <Heart className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'शेष HP' : 'Remaining HP'}</span>
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white tabular-nums">
                {result.playerHpRemaining} HP
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bilingual PYQ & NCERT Battle Review */}
      <section aria-labelledby="battle-review-heading" className="space-y-4">
        <div>
          <h2 id="battle-review-heading" className="font-display text-2xl font-bold text-white">
            {medium === 'hi' ? 'युद्ध समीक्षा एवं NCERT व्याख्या' : 'Battle Log & NCERT Explanations'}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {medium === 'hi'
              ? 'हर प्रश्न के MP बोर्ड वर्ष (2023–2027) और सटीक व्याख्या का विश्लेषण करें।'
              : 'Review each question’s MP Board PYQ/IMP source tag and full explanation.'}
          </p>
        </div>

        <div className="space-y-4">
          {result.questions.map((q, idx) => {
            const rec = result.records[idx];
            const isCorrect = rec?.isCorrect ?? false;
            const userIdx = rec?.selectedIndex;

            return (
              <article
                key={q.id}
                className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-400 tabular-nums">
                    <span className="font-semibold text-white">Strike {idx + 1}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="font-semibold text-amber-400">{q.sourceTag}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{q.ncertChapter[medium]}</span>
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold tabular-nums">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        <span className="text-emerald-300">
                          {medium === 'hi' ? 'सही' : 'Hit'} (+{rec?.xpEarned ?? 0} XP)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-400" aria-hidden="true" />
                        <span className="text-red-300">
                          {userIdx === undefined
                            ? medium === 'hi'
                              ? 'समय समाप्त'
                              : 'Timed Out'
                            : medium === 'hi'
                              ? 'गलत'
                              : 'Missed'}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                  {q.prompt[medium]}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isRight = optIdx === q.correctIndex;
                    const isUserPick = optIdx === userIdx;

                    let boxClass = 'border-slate-700 bg-[#0F172A] text-slate-400';
                    if (isRight) {
                      boxClass = 'border-emerald-500 bg-emerald-950/60 text-white font-medium';
                    } else if (isUserPick && !isRight) {
                      boxClass = 'border-red-500 bg-red-950/60 text-red-200';
                    }

                    return (
                      <div
                        key={`${q.id}-rev-${optIdx}`}
                        className={`px-3.5 py-2.5 rounded-lg border text-sm flex items-center justify-between gap-2 ${boxClass}`}
                      >
                        <span>
                          <span className="font-mono font-semibold mr-2">
                            {OPTION_LETTERS[optIdx]}.
                          </span>
                          {opt[medium]}
                        </span>
                        {isRight && (
                          <span className="text-xs font-semibold text-emerald-300 shrink-0">
                            {medium === 'hi' ? 'सही' : 'Answer'}
                          </span>
                        )}
                        {isUserPick && !isRight && (
                          <span className="text-xs font-semibold text-red-300 shrink-0">
                            {medium === 'hi' ? 'आपका चयन' : 'Picked'}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-700/80 text-sm text-slate-300 leading-relaxed">
                  <span className="font-semibold text-amber-300">
                    {medium === 'hi' ? 'व्याख्या: ' : 'Explanation: '}
                  </span>
                  {q.explanation[medium]}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
