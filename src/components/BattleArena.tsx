import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Heart,
  HelpCircle,
  Shield,
  ShieldAlert,
  Swords,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react';
import { AVATARS, BOSS_PORTRAIT } from '../data/questConfig';
import {
  ActiveEncounter,
  AdventurerState,
  EncounterRecord,
  EncounterResult,
  Medium,
} from '../types/quiz';
import {
  playBossTauntSound,
  playComboChimeSound,
  playDamageSound,
  playStrikeSound,
  playVictoryFanfare,
} from '../utils/soundFx';
import { SafeImage } from './SafeImage';

interface BattleArenaProps {
  encounter: ActiveEncounter;
  adventurer: AdventurerState;
  medium: Medium;
  onComplete: (result: EncounterResult) => void;
  onExit: () => void;
}

interface BossTauntState {
  id: number;
  text: { en: string; hi: string };
  tone: 'smug' | 'hit' | 'tricky' | 'intro';
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;
const MAX_PLAYER_HP = 100;

const HIT_TAUNTS: Array<{ en: string; hi: string }> = [
  { en: 'Ack! Sharp NCERT strike!', hi: 'उफ़! सटीक NCERT प्रहार!' },
  { en: 'My armor cracks under your combo!', hi: 'तुम्हारे कॉम्बो से मेरा कवच टूट गया!' },
  { en: 'Fast hit! Ready for the next trap?', hi: 'तेज़ वार! अगले प्रश्न से बचकर दिखाओ!' },
];

const MISS_TAUNTS: Array<{ en: string; hi: string }> = [
  { en: 'Haha! Right into my board trap!', hi: 'हाहा! मेरे बोर्ड जाल में फँस गए!' },
  { en: 'Feel that −25 HP counter-slash!', hi: 'यह लो −25 HP का करारा पलटवार!' },
  { en: 'Revise your NCERT notes, challenger!', hi: 'जाओ NCERT के नोट्स फिर से पढ़ो!' },
];

export function BattleArena({
  encounter,
  adventurer,
  medium,
  onComplete,
  onExit,
}: BattleArenaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState<EncounterRecord[]>([]);
  const [playerHP, setPlayerHP] = useState(MAX_PLAYER_HP);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [questionElapsed, setQuestionElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);

  const [clashEffect, setClashEffect] = useState<{
    id: number;
    outcome: 'hit' | 'miss';
  } | null>(null);

  const [bossTaunt, setBossTaunt] = useState<BossTauntState>({
    id: 1,
    text: {
      en: 'Show me your NCERT mastery before time runs out!',
      hi: 'समय खत्म होने से पहले अपनी NCERT तैयारी दिखाओ!',
    },
    tone: 'intro',
  });

  const questions = encounter.questions;
  const totalCount = questions.length;
  const currentQ = questions[currentIndex];
  const currentRecord = records[currentIndex];
  const isAnswered = currentRecord !== undefined;

  const activeAvatar = AVATARS.find((a) => a.id === adventurer.avatarId) ?? AVATARS[0];
  const playerAvatarSrc = adventurer.customAvatarUrl || activeAvatar.imagePath;

  const damagePerStrike = Math.ceil(100 / Math.max(1, totalCount));
  const bossMaxHP = totalCount * 100;
  const bossDamageTaken = records.filter((r) => r.isCorrect).length * 100;
  const bossHP = Math.max(0, bossMaxHP - bossDamageTaken);
  const bossHpPercent = Math.round((bossHP / Math.max(1, bossMaxHP)) * 100);
  const playerHpPercent = Math.max(0, Math.round((playerHP / MAX_PLAYER_HP) * 100));

  const questionSeconds = Math.min(10, Math.max(10, encounter.secondsPerQuestion || 10));
  const remainingSeconds = Math.max(0, questionSeconds - questionElapsed);
  const timerPercent = Math.max(
    0,
    Math.round((remainingSeconds / questionSeconds) * 100)
  );
  const isLowTime = !isAnswered && remainingSeconds <= 3;

  useEffect(() => {
    if (!currentQ || isAnswered) return;
    if (currentQ.isTricky || currentQ.sourceTag === 'TRICKY 2027') {
      setBossTaunt({
        id: Date.now(),
        text: {
          en: 'Tricky Conceptual Trap incoming — read carefully!',
          hi: 'सावधान! गूढ़ अवधारणा प्रश्न आ रहा है — ध्यान से पढ़ो!',
        },
        tone: 'tricky',
      });
      playBossTauntSound(adventurer.soundEnabled);
    }
  }, [adventurer.soundEnabled, currentQ, isAnswered]);

  const finalizeBattle = useCallback(
    (
      finalRecords: EncounterRecord[],
      finalMaxStreak: number,
      finalHP: number,
      finalTime: number
    ) => {
      const correctCount = finalRecords.filter((r) => r.isCorrect).length;
      const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
      const victory = finalHP > 0 && percentage >= encounter.passThresholdPercent;

      let stars: 0 | 1 | 2 | 3 = 0;
      if (victory) {
        if (percentage >= 85) stars = 3;
        else if (percentage >= 65) stars = 2;
        else stars = 1;
      }

      const xpSum =
        finalRecords.reduce((sum, r) => sum + r.xpEarned, 0) +
        (victory ? (encounter.isBossBattle ? 250 : 100) : 0);

      if (victory) {
        playVictoryFanfare(adventurer.soundEnabled);
      }

      const result: EncounterResult = {
        id: `battle-${Date.now()}`,
        encounterId: encounter.id,
        grade: encounter.grade,
        subjectId: encounter.subjectId,
        battleKind: encounter.battleKind,
        chapterNodeId: encounter.chapterNodeId,
        chapterOrder: encounter.chapterOrder,
        nextChapterNodeId: encounter.nextChapterNodeId,
        isBossBattle: encounter.isBossBattle,
        victory,
        title: encounter.title,
        bossName: encounter.bossName,
        completedAt: new Date().toISOString(),
        questions,
        records: finalRecords,
        correctCount,
        totalCount,
        percentage,
        totalXP: xpSum,
        maxStreak: finalMaxStreak,
        stars,
        playerHpRemaining: finalHP,
        totalTimeSeconds: finalTime,
      };
      onComplete(result);
    },
    [
      adventurer.soundEnabled,
      encounter.battleKind,
      encounter.bossName,
      encounter.chapterNodeId,
      encounter.chapterOrder,
      encounter.grade,
      encounter.id,
      encounter.isBossBattle,
      encounter.nextChapterNodeId,
      encounter.passThresholdPercent,
      encounter.subjectId,
      encounter.title,
      onComplete,
      questions,
      totalCount,
    ]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTotalElapsed((t) => t + 1);
      if (!isAnswered) {
        setQuestionElapsed((q) => q + 1);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isAnswered]);

  const handleStrikeAnswer = useCallback(
    (selectedIndex: number | undefined) => {
      if (!currentQ || isAnswered) return;

      const isCorrect = selectedIndex === currentQ.correctIndex;
      const nextStreak = isCorrect ? streak + 1 : 0;
      const nextMaxStreak = Math.max(maxStreak, nextStreak);

      let xpEarned = 0;
      let nextHP = playerHP;
      const clashId = Date.now();
      setClashEffect({ id: clashId, outcome: isCorrect ? 'hit' : 'miss' });

      if (isCorrect) {
        playStrikeSound(adventurer.soundEnabled);
        if (nextStreak >= 2) {
          window.setTimeout(() => playComboChimeSound(adventurer.soundEnabled), 140);
        }
        const speedBonus = Math.max(
          0,
          Math.round(((questionSeconds - questionElapsed) / questionSeconds) * 40)
        );
        const comboBonus = Math.min(60, (nextStreak - 1) * 20);
        xpEarned = currentQ.points + speedBonus + comboBonus;

        const pick = HIT_TAUNTS[currentIndex % HIT_TAUNTS.length];
        setBossTaunt({
          id: clashId,
          text: { en: pick.en, hi: pick.hi },
          tone: 'hit',
        });
      } else {
        playDamageSound(adventurer.soundEnabled);
        window.setTimeout(() => playBossTauntSound(adventurer.soundEnabled), 120);
        nextHP = Math.max(0, playerHP - 25);

        const pick = MISS_TAUNTS[currentIndex % MISS_TAUNTS.length];
        setBossTaunt({
          id: clashId,
          text: { en: pick.en, hi: pick.hi },
          tone: 'smug',
        });
      }

      const rec: EncounterRecord = {
        questionId: currentQ.id,
        selectedIndex,
        isCorrect,
        timeTakenSeconds: questionElapsed,
        xpEarned,
        damageDealt: isCorrect ? damagePerStrike : 0,
      };

      setRecords((prev) => [...prev, rec]);
      setStreak(nextStreak);
      setMaxStreak(nextMaxStreak);
      setTotalXP((xp) => xp + xpEarned);
      setPlayerHP(nextHP);
    },
    [
      adventurer.soundEnabled,
      currentIndex,
      currentQ,
      damagePerStrike,
      questionSeconds,
      isAnswered,
      maxStreak,
      playerHP,
      questionElapsed,
      streak,
    ]
  );

  useEffect(() => {
    if (!clashEffect) return;
    const t = window.setTimeout(() => setClashEffect(null), 850);
    return () => window.clearTimeout(t);
  }, [clashEffect]);

  useEffect(() => {
    if (!isAnswered && questionElapsed >= questionSeconds) {
      handleStrikeAnswer(undefined);
    }
  }, [handleStrikeAnswer, isAnswered, questionElapsed, questionSeconds]);

  const handleAdvance = useCallback(() => {
    if (!isAnswered) return;
    if (playerHP <= 0 || currentIndex >= totalCount - 1) {
      finalizeBattle(records, maxStreak, playerHP, totalElapsed);
    } else {
      setCurrentIndex((i) => i + 1);
      setQuestionElapsed(0);
      setShowHint(false);
      setClashEffect(null);
    }
  }, [
    currentIndex,
    finalizeBattle,
    isAnswered,
    maxStreak,
    playerHP,
    records,
    totalCount,
    totalElapsed,
  ]);

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = handleAdvance;

  // Automatic 2-second advance after selecting an answer OR 10-second timeout
  useEffect(() => {
    if (!isAnswered) return;
    const autoNextTimer = window.setTimeout(() => {
      advanceRef.current();
    }, 2000);
    return () => window.clearTimeout(autoNextTimer);
  }, [isAnswered, currentIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key) && !isAnswered) {
        e.preventDefault();
        handleStrikeAnswer(Number(e.key) - 1);
      } else if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase()) && !isAnswered) {
        e.preventDefault();
        const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
        handleStrikeAnswer(map[e.key.toLowerCase()]);
      } else if (e.key === 'Enter' && isAnswered) {
        e.preventDefault();
        handleAdvance();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleAdvance, handleStrikeAnswer, isAnswered]);

  if (!currentQ) return null;

  const isTrickyQuestion = Boolean(currentQ.isTricky || currentQ.sourceTag === 'TRICKY 2027');

  return (
    <main className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 space-y-4">
      {/* Top Bar: Retreat + Stage Progress */}
      <div className="flex items-center justify-between gap-2">
        {!confirmExit ? (
          <button
            type="button"
            onClick={() => {
              if (records.length > 0) setConfirmExit(true);
              else onExit();
            }}
            className="min-h-[42px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[#181C32] bg-white rounded-xl comic-btn-sm"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'मैप पर लौटें' : 'Retreat'}</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#FFF1F2] border-2 border-[#E11D48] rounded-xl">
            <span className="text-xs font-bold text-[#181C32] px-1">
              {medium === 'hi' ? 'छोड़ें?' : 'Quit battle?'}
            </span>
            <button
              type="button"
              onClick={onExit}
              className="min-h-[34px] px-2.5 py-1 text-xs font-extrabold text-white bg-[#E11D48] rounded-lg"
            >
              {medium === 'hi' ? 'हाँ' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmExit(false)}
              className="min-h-[34px] px-2.5 py-1 text-xs font-extrabold text-[#181C32] bg-white border border-[#181C32] rounded-lg"
            >
              {medium === 'hi' ? 'नहीं' : 'Stay'}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs font-mono font-extrabold tabular-nums">
          <motion.span
            key={streak}
            initial={streak >= 2 ? { scale: 1.25 } : false}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="px-2.5 py-1.5 rounded-xl bg-[#FEF08A] comic-gloss border-2 border-[#181C32] text-[#181C32] inline-flex items-center gap-1"
          >
            <Flame className="w-3.5 h-3.5 text-[#F97316]" aria-hidden="true" />
            {streak}x
          </motion.span>
          <span className="px-2.5 py-1.5 rounded-xl bg-white border-2 border-[#181C32] text-[#181C32] inline-flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-[#EAB308]" aria-hidden="true" />+{totalXP}
          </span>
        </div>
      </div>

      {/* 2D Comic Versus Arena Card */}
      <motion.section
        aria-label="2D comic battle stage"
        animate={
          clashEffect
            ? clashEffect.outcome === 'miss'
              ? { x: [0, -8, 8, -5, 5, 0] }
              : { y: [0, -4, 2, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden comic-card rounded-3xl bg-[#181C32] text-white p-4 space-y-3"
      >
        {/* Dramatic 2D Comic Clash Overlay */}
        <AnimatePresence>
          {clashEffect && (
            <motion.div
              key={clashEffect.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.04 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{ duration: 0.22 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#181C32]/75 px-4"
            >
              <div
                className={`px-5 py-3 rounded-2xl border-[3px] border-[#181C32] shadow-[0_6px_0_#181C32] flex items-center gap-3 ${
                  clashEffect.outcome === 'hit' ? 'bg-[#34D399]' : 'bg-[#FB7185]'
                } text-[#181C32]`}
              >
                <Swords className="w-7 h-7 shrink-0" aria-hidden="true" />
                <p className="font-display text-base sm:text-lg font-bold">
                  {clashEffect.outcome === 'hit'
                    ? medium === 'hi'
                      ? 'सटीक प्रहार! −100 बॉस HP!'
                      : 'CRITICAL HIT! −100 BOSS HP!'
                    : medium === 'hi'
                      ? 'बॉस पलटवार! −25 HP!'
                      : 'COUNTER-SLASH! −25 HP!'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fighters VS Row */}
        <div className="grid grid-cols-11 gap-2 items-center">
          {/* Player Side (5 cols) */}
          <motion.div
            animate={
              clashEffect?.outcome === 'hit'
                ? { x: [0, 14, 0] }
                : clashEffect?.outcome === 'miss'
                  ? { x: [0, -8, 0] }
                  : { x: 0 }
            }
            transition={{ duration: 0.28 }}
            className="col-span-5 flex items-center gap-2.5 min-w-0"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-[#38BDF8] bg-[#FACC15] shrink-0">
              <SafeImage
                src={playerAvatarSrc}
                alt={adventurer.heroName}
                className="w-full h-full object-cover"
                fallbackTitle={adventurer.heroName}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="font-display font-bold text-xs sm:text-sm text-white truncate">
                {adventurer.heroName}
              </p>
              <div className="h-3 bg-slate-800 rounded-full border border-slate-600 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 comic-progress-fill ${
                    playerHP > 50 ? 'bg-[#34D399]' : playerHP > 25 ? 'bg-[#FACC15]' : 'bg-[#FB7185]'
                  }`}
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
              <p className="font-mono text-[10px] sm:text-xs font-bold text-[#34D399] inline-flex items-center gap-1 tabular-nums">
                <Heart className="w-3 h-3 fill-current" aria-hidden="true" />
                {playerHP}/100 HP
              </p>
            </div>
          </motion.div>

          {/* Center VS & Clock (1 col -> 1 span centered) */}
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            <span className="font-display text-xs sm:text-sm font-extrabold text-[#FACC15]">VS</span>
          </div>

          {/* Boss Side (5 cols) */}
          <motion.div
            animate={
              clashEffect?.outcome === 'hit'
                ? { x: [0, 8, -6, 0] }
                : clashEffect?.outcome === 'miss'
                  ? { x: [0, -14, 0] }
                  : { x: 0 }
            }
            transition={{ duration: 0.28 }}
            className="col-span-5 flex items-center gap-2.5 min-w-0 justify-end"
          >
            <div className="flex-1 min-w-0 space-y-1 text-right">
              <p className="font-display font-bold text-xs sm:text-sm text-[#FACC15] truncate">
                {encounter.bossName[medium]}
              </p>
              <div className="h-3 bg-slate-800 rounded-full border border-slate-600 overflow-hidden">
                <div
                  className="h-full bg-[#FB7185] transition-all duration-300 ml-auto comic-progress-fill"
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
              <p className="font-mono text-[10px] sm:text-xs font-bold text-[#FDA4AF] tabular-nums">
                {bossHP}/{bossMaxHP} HP
              </p>
            </div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-[#FB7185] bg-[#1E1B2E] shrink-0">
              <SafeImage
                src={BOSS_PORTRAIT}
                alt={encounter.bossName[medium]}
                className="w-full h-full object-cover"
                fallbackTitle="Boss"
              />
            </div>
          </motion.div>
        </div>

        {/* Speech Bubble Boss Taunt */}
        <motion.div
          key={bossTaunt.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            bossTaunt.tone === 'hit'
              ? 'bg-[#064E3B] border-[#34D399] text-[#ECFDF5]'
              : bossTaunt.tone === 'smug'
                ? 'bg-[#881337] border-[#FB7185] text-[#FFF1F2]'
                : bossTaunt.tone === 'tricky'
                  ? 'bg-[#78350F] border-[#FACC15] text-[#FEF9C3]'
                  : 'bg-slate-800 border-slate-600 text-slate-100'
          }`}
        >
          <span className="shrink-0" aria-hidden="true">
            {bossTaunt.tone === 'hit' ? (
              <Zap className="w-4 h-4 text-[#34D399]" />
            ) : bossTaunt.tone === 'smug' ? (
              <Flame className="w-4 h-4 text-[#FB7185]" />
            ) : bossTaunt.tone === 'tricky' ? (
              <ShieldAlert className="w-4 h-4 text-[#FACC15]" />
            ) : (
              <Shield className="w-4 h-4 text-[#38BDF8]" />
            )}
          </span>
          <p className="truncate">&ldquo;{bossTaunt.text[medium]}&rdquo;</p>
        </motion.div>
      </motion.section>

      {/* Main Tap-to-Answer Question Card */}
      <section aria-label="Active quiz question" className="comic-card rounded-3xl p-4 sm:p-6 bg-white space-y-4">
        {/* Timer + Strike Meta */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 text-xs font-mono font-extrabold tabular-nums">
            <span className="text-[#181C32]">
              Q {currentIndex + 1}/{totalCount}
            </span>
            <motion.span
              animate={isLowTime ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={isLowTime ? { repeat: Infinity, duration: 0.65 } : undefined}
              className={`px-2.5 py-0.5 rounded-lg border-2 border-[#181C32] inline-flex items-center gap-1 ${
                isLowTime
                  ? 'bg-[#FB7185] text-white'
                  : 'bg-[#FEF08A] text-[#181C32]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{remainingSeconds}s / 10s</span>
            </motion.span>
          </div>

          <div className="h-3.5 bg-slate-200 rounded-full border-2 border-[#181C32] overflow-hidden">
            <div
              className={`h-full transition-all duration-300 comic-progress-fill ${
                isLowTime ? 'bg-[#E11D48]' : 'bg-[#FACC15]'
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b-2 border-slate-200 text-xs">
          <span
            className={`font-mono font-extrabold inline-flex items-center gap-1 ${
              isTrickyQuestion ? 'text-[#E11D48]' : 'text-[#2563EB]'
            }`}
          >
            {isTrickyQuestion && <Brain className="w-3.5 h-3.5" aria-hidden="true" />}
            {currentQ.sourceTag} · {currentQ.ncertChapter[medium]}
          </span>

          {currentQ.hint && !isAnswered && !showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-[#D97706] hover:underline"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{medium === 'hi' ? 'संकेत देखें' : 'Hint'}</span>
            </button>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#181C32] leading-snug">
          {currentQ.prompt[medium]}
        </h2>

        {showHint && currentQ.hint && !isAnswered && (
          <div className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-[#181C32] text-xs font-semibold text-[#181C32]">
            <strong className="text-[#D97706]">
              {medium === 'hi' ? 'संकेत: ' : 'Hint: '}
            </strong>
            {currentQ.hint[medium]}
          </div>
        )}

        {/* 4 Big Thumb-Friendly Tap Option Cards */}
        <div role="radiogroup" aria-label="Battle answers" className="grid grid-cols-1 gap-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentRecord?.selectedIndex === idx;
            const isCorrectOpt = currentQ.correctIndex === idx;

            let cardStyle = 'bg-[#F8FAFF] hover:bg-[#EFF6FF] text-[#181C32]';
            let badgeStyle = 'bg-white text-[#181C32]';

            if (isAnswered) {
              if (isCorrectOpt) {
                cardStyle = 'bg-[#A7F3D0] text-[#181C32]';
                badgeStyle = 'bg-[#059669] text-white';
              } else if (isSelected && !isCorrectOpt) {
                cardStyle = 'bg-[#FECDD3] text-[#181C32]';
                badgeStyle = 'bg-[#E11D48] text-white';
              } else {
                cardStyle = 'bg-slate-100 text-slate-400 opacity-75';
              }
            }

            return (
              <button
                key={`${currentQ.id}-opt-${idx}`}
                type="button"
                disabled={isAnswered}
                onClick={() => handleStrikeAnswer(idx)}
                className={`w-full min-h-[56px] flex items-center justify-between gap-3 px-3.5 py-3 rounded-2xl text-left comic-btn-sm comic-gloss ${cardStyle}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-xl border-2 border-[#181C32] font-mono text-xs font-extrabold flex items-center justify-center shrink-0 ${badgeStyle}`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-bold leading-snug">
                    {opt[medium]}
                  </span>
                </div>

                {isAnswered && (isCorrectOpt || isSelected) && (
                  <span className="shrink-0">
                    {isCorrectOpt ? (
                      <CheckCircle2 className="w-5 h-5 text-[#059669]" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#E11D48]" aria-hidden="true" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Button */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`p-4 rounded-2xl border-2 border-[#181C32] space-y-3 ${
              currentRecord.isCorrect ? 'bg-[#ECFDF5]' : 'bg-[#FFF1F2]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs font-extrabold">
              <span className={currentRecord.isCorrect ? 'text-[#059669]' : 'text-[#E11D48]'}>
                {currentRecord.isCorrect
                  ? medium === 'hi'
                    ? 'सही प्रहार!'
                    : 'DIRECT STRIKE!'
                  : currentRecord.selectedIndex === undefined
                    ? medium === 'hi'
                      ? `समय समाप्त! सही उत्तर: ${OPTION_LETTERS[currentQ.correctIndex]}`
                      : `TIME UP! Answer: ${OPTION_LETTERS[currentQ.correctIndex]}`
                    : medium === 'hi'
                      ? `गलत! सही उत्तर: ${OPTION_LETTERS[currentQ.correctIndex]}`
                      : `MISSED! Answer: ${OPTION_LETTERS[currentQ.correctIndex]}`}
              </span>
              <span className="font-mono text-[#D97706] tabular-nums">
                {currentRecord.isCorrect ? `+${currentRecord.xpEarned} XP` : '+0 XP'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#181C32] leading-relaxed">
              {currentQ.explanation[medium]}
            </p>

            {/* 2-Second Auto-Next Progress Bar + Fast Skip */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#2563EB]">
                <span>
                  {playerHP <= 0 || currentIndex >= totalCount - 1
                    ? medium === 'hi'
                      ? '2 सेकंड में परिणाम खुल रहा है...'
                      : 'Loading results in 2s...'
                    : medium === 'hi'
                      ? '2 सेकंड में अगला प्रश्न...'
                      : 'Auto-next in 2s...'}
                </span>
                <span>2.0s</span>
              </div>
              <div className="h-2.5 bg-white rounded-full border-2 border-[#181C32] overflow-hidden">
                <motion.div
                  key={`autonext-${currentQ.id}`}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 2, ease: 'linear' }}
                  className="h-full w-full origin-left bg-[#2563EB] comic-progress-fill"
                />
              </div>
              <button
                type="button"
                onClick={handleAdvance}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#181C32] bg-[#FACC15] hover:bg-[#FDE047] rounded-2xl comic-btn-sm comic-gloss"
              >
                <span>
                  {playerHP <= 0 || currentIndex >= totalCount - 1
                    ? medium === 'hi'
                      ? 'अभी परिणाम देखें'
                      : 'SEE RESULTS NOW'
                    : medium === 'hi'
                      ? 'अभी अगला प्रश्न →'
                      : 'NEXT NOW'}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
