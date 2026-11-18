import { useCallback, useEffect, useState } from 'react';
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
  Languages,
  Music,
  Shield,
  ShieldAlert,
  Swords,
  Trophy,
  Volume2,
  VolumeX,
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
import { Battle3DStage } from './Battle3DStage';
import { SafeImage } from './SafeImage';

interface BattleArenaProps {
  encounter: ActiveEncounter;
  adventurer: AdventurerState;
  medium: Medium;
  onMediumChange: (medium: Medium) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
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
  { en: 'My armor cracks under your combo!', hi: 'तुम्हारे कॉम्बो से मेरा कवच दरक गया!' },
  { en: 'Formidable blade! Ready for my next trap?', hi: 'तेज़ वार! पर अगले गूढ़ प्रश्न से बचकर दिखाओ!' },
];

const MISS_TAUNTS: Array<{ en: string; hi: string }> = [
  { en: 'Walked right into my board trap!', hi: 'तुम मेरे बोर्ड जाल में फँस गए!' },
  { en: 'Feel that −25 HP counter-slash!', hi: 'यह लो −25 HP का करारा पलटवार!' },
  { en: 'Revise your NCERT scrolls, challenger!', hi: 'जाओ NCERT के पन्ने फिर से पढ़ो, योद्धा!' },
];

export function BattleArena({
  encounter,
  adventurer,
  medium,
  onMediumChange,
  onToggleSound,
  onToggleMusic,
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
      en: 'Show me your NCERT mastery before the clock strikes zero!',
      hi: 'समय शून्य होने से पहले अपनी NCERT तैयारी दिखाओ!',
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

  const remainingSeconds = Math.max(0, encounter.secondsPerQuestion - questionElapsed);
  const timerPercent = Math.max(
    0,
    Math.round((remainingSeconds / encounter.secondsPerQuestion) * 100)
  );
  const isLowTime = !isAnswered && remainingSeconds <= 8;

  // Trigger a tactical boss warning when landing on a Tricky Conceptual Trap question
  useEffect(() => {
    if (!currentQ || isAnswered) return;
    if (currentQ.isTricky || currentQ.sourceTag === 'TRICKY 2027') {
      setBossTaunt({
        id: Date.now(),
        text: {
          en: 'Beware! Tricky Conceptual Trap incoming — read every word!',
          hi: 'सावधान! गूढ़ अवधारणा जाल आ रहा है — हर शब्द ध्यान से पढ़ो!',
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
          Math.round(
            ((encounter.secondsPerQuestion - questionElapsed) / encounter.secondsPerQuestion) * 40
          )
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
      encounter.secondsPerQuestion,
      isAnswered,
      maxStreak,
      playerHP,
      questionElapsed,
      streak,
    ]
  );

  // Clear sword clash animation burst after 900ms
  useEffect(() => {
    if (!clashEffect) return;
    const t = window.setTimeout(() => setClashEffect(null), 900);
    return () => window.clearTimeout(t);
  }, [clashEffect]);

  useEffect(() => {
    if (!isAnswered && questionElapsed >= encounter.secondsPerQuestion) {
      handleStrikeAnswer(undefined);
    }
  }, [encounter.secondsPerQuestion, handleStrikeAnswer, isAnswered, questionElapsed]);

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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Combat Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!confirmExit ? (
          <button
            type="button"
            onClick={() => {
              if (records.length > 0) setConfirmExit(true);
              else onExit();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-[#162033] border border-slate-700 hover:border-slate-500 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{medium === 'hi' ? 'पीछे हटें' : 'Retreat to Map'}</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 p-1.5 bg-red-950/70 border border-red-700 rounded-lg">
            <span className="text-xs text-red-100 px-1.5">
              {medium === 'hi' ? 'युद्ध छोड़ें?' : 'Abandon battle?'}
            </span>
            <button
              type="button"
              onClick={onExit}
              className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 rounded"
            >
              {medium === 'hi' ? 'हाँ' : 'Retreat'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmExit(false)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 rounded"
            >
              {medium === 'hi' ? 'लड़ें' : 'Fight On'}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onMediumChange(medium === 'en' ? 'hi' : 'en')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-lg"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>{medium === 'en' ? 'हिन्दी माध्यम' : 'English Medium'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={adventurer.musicEnabled ? 'Mute music' : 'Unmute music'}
            className={`px-2.5 h-9 rounded-lg bg-[#162033] border text-xs font-semibold flex items-center gap-1.5 ${
              adventurer.musicEnabled
                ? 'border-slate-700 text-amber-300'
                : 'border-slate-700 text-slate-500'
            }`}
          >
            <Music className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">
              {adventurer.musicEnabled ? 'BGM' : 'Muted'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={adventurer.soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="w-9 h-9 rounded-lg bg-[#162033] border border-slate-700 text-slate-200 flex items-center justify-center"
          >
            {adventurer.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Combatants Status & Animated 3D Warrior Boss Stage */}
      <motion.section
        aria-label="Battle combatants status"
        animate={
          clashEffect
            ? clashEffect.outcome === 'miss'
              ? { x: [0, -8, 8, -5, 5, 0] }
              : { y: [0, -3, 2, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden bg-[#162033] border border-slate-700/80 rounded-xl p-5 sm:p-6 space-y-4"
      >
        {/* Sword Clash Animated Overlay */}
        <AnimatePresence>
          {clashEffect && (
            <motion.div
              key={clashEffect.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1.06 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#0B1220]/55"
            >
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-[#0B1220]/95 border border-amber-400/70 shadow-2xl">
                <motion.div
                  initial={{ rotate: -45, x: -24 }}
                  animate={{ rotate: 0, x: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                >
                  <Swords
                    className={`w-9 h-9 ${
                      clashEffect.outcome === 'hit' ? 'text-amber-400' : 'text-red-400'
                    }`}
                    aria-hidden="true"
                  />
                </motion.div>
                <div className="text-center">
                  <p
                    className={`font-display text-lg font-bold ${
                      clashEffect.outcome === 'hit' ? 'text-emerald-300' : 'text-red-300'
                    }`}
                  >
                    {clashEffect.outcome === 'hit'
                      ? medium === 'hi'
                        ? 'सटीक तलवार प्रहार! −100 बॉस HP'
                        : 'CRITICAL CLASH! −100 BOSS HP'
                      : medium === 'hi'
                        ? 'बॉस का पलटवार! −25 HP'
                        : 'BOSS COUNTER-SLASH! −25 HP'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left: Player Avatar & HP */}
          <motion.div
            animate={
              clashEffect?.outcome === 'hit'
                ? { x: [0, 18, 0] }
                : clashEffect?.outcome === 'miss'
                  ? { x: [0, -10, 0] }
                  : { x: 0 }
            }
            transition={{ duration: 0.32 }}
            className="md:col-span-5 flex items-center gap-4"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-sky-400 shrink-0">
              <SafeImage
                src={playerAvatarSrc}
                alt={adventurer.heroName}
                className="w-full h-full object-cover"
                fallbackTitle={adventurer.heroName}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display font-bold text-white text-sm sm:text-base truncate">
                  {adventurer.heroName}
                </p>
                <span className="font-mono text-xs font-semibold text-emerald-400 inline-flex items-center gap-1 tabular-nums">
                  <Heart className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                  {playerHP}/100 HP
                </span>
              </div>
              <div className="h-2.5 bg-[#0B1220] rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-200 ${
                    playerHP > 50 ? 'bg-emerald-500' : playerHP > 25 ? 'bg-amber-400' : 'bg-red-500'
                  }`}
                  style={{ width: `${playerHpPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 tabular-nums">
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  {streak}x Combo
                </span>
                <span className="inline-flex items-center gap-1 text-sky-300 font-mono font-semibold">
                  <Trophy className="w-3.5 h-3.5" aria-hidden="true" />+{totalXP} XP
                </span>
              </div>
            </div>
          </motion.div>

          {/* Center: Countdown Clock */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-slate-700/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {encounter.isBossBattle
                ? medium === 'hi'
                  ? 'बॉस टाइमर'
                  : 'Boss Timer'
                : medium === 'hi'
                  ? 'समय'
                  : 'Timer'}
            </p>
            <p
              className={`font-mono text-2xl sm:text-3xl font-bold tabular-nums mt-0.5 flex items-center gap-1.5 ${
                isLowTime ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              <Clock className="w-5 h-5" aria-hidden="true" />
              <span>{remainingSeconds}s</span>
            </p>
            <p className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
              {currentIndex + 1} / {totalCount}
            </p>
          </div>

          {/* Right: Boss Guardian HP & Portrait */}
          <motion.div
            animate={
              clashEffect?.outcome === 'hit'
                ? { x: [0, 10, -8, 6, 0] }
                : clashEffect?.outcome === 'miss'
                  ? { x: [0, -18, 0] }
                  : { x: 0 }
            }
            transition={{ duration: 0.32 }}
            className="md:col-span-5 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0 space-y-1.5 text-right">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold text-red-400 tabular-nums">
                  {bossHP}/{bossMaxHP} HP
                </span>
                <p className="font-display font-bold text-amber-300 text-sm sm:text-base truncate">
                  {encounter.bossName[medium]}
                </p>
              </div>
              <div className="h-2.5 bg-[#0B1220] rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-red-500 transition-all duration-200 ml-auto"
                  style={{ width: `${bossHpPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 truncate">
                {medium === 'hi'
                  ? 'सही उत्तर = बॉस पर प्रहार · गलत = −25 HP'
                  : 'Correct = −100 Boss HP · Wrong = −25 Player HP'}
              </p>
            </div>
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-500/80 shrink-0">
              <SafeImage
                src={BOSS_PORTRAIT}
                alt={encounter.bossName[medium]}
                className="w-full h-full object-cover"
                fallbackTitle="Boss"
              />
            </div>
          </motion.div>
        </div>

        {/* Realistic 3D Hero vs Armored Warrior Boss Combat Stage */}
        <Battle3DStage
          avatarId={adventurer.avatarId}
          clashEffect={clashEffect}
          bossHpPercent={bossHpPercent}
          playerHpPercent={playerHpPercent}
        />

        {/* Dynamic Boss Taunt Banner */}
        <motion.div
          key={bossTaunt.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border text-xs sm:text-sm ${
            bossTaunt.tone === 'hit'
              ? 'bg-emerald-950/35 border-emerald-700/60 text-emerald-100'
              : bossTaunt.tone === 'smug'
                ? 'bg-red-950/40 border-red-700/60 text-red-100'
                : bossTaunt.tone === 'tricky'
                  ? 'bg-amber-950/40 border-amber-600/70 text-amber-100'
                  : 'bg-[#0F172A] border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="shrink-0" aria-hidden="true">
              {bossTaunt.tone === 'hit' ? (
                <Zap className="w-4 h-4 text-emerald-400" />
              ) : bossTaunt.tone === 'smug' ? (
                <Flame className="w-4 h-4 text-red-400" />
              ) : bossTaunt.tone === 'tricky' ? (
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              ) : (
                <Shield className="w-4 h-4 text-sky-400" />
              )}
            </span>
            <p className="truncate">
              <span className="font-semibold text-amber-300 mr-1.5">
                {encounter.bossName[medium]}:
              </span>
              &ldquo;{bossTaunt.text[medium]}&rdquo;
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Main Battle Question Card */}
      <section
        aria-label="Active combat question"
        className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 sm:p-8 space-y-6"
      >
        {/* Timer Bar */}
        <div className="h-2 bg-[#0B1220] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isLowTime ? 'bg-red-500' : 'bg-amber-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Question Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
            <span
              className={`font-semibold inline-flex items-center gap-1 ${
                isTrickyQuestion ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {isTrickyQuestion && <Brain className="w-3.5 h-3.5" aria-hidden="true" />}
              {currentQ.sourceTag}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentQ.ncertChapter[medium]}</span>
            <span aria-hidden="true">·</span>
            <span>+{currentQ.points} XP</span>
          </div>

          {currentQ.hint && !isAnswered && !showHint && (
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{medium === 'hi' ? 'संकेत स्क्रॉल खोलें' : 'Reveal Scroll Hint'}</span>
            </button>
          )}
        </div>

        {/* Question Prompt */}
        <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
          {currentQ.prompt[medium]}
        </h2>

        {showHint && currentQ.hint && !isAnswered && (
          <div className="p-3.5 rounded-lg bg-[#0F172A] border border-amber-500/40 text-xs sm:text-sm text-amber-100">
            <span className="font-semibold text-amber-400">
              {medium === 'hi' ? 'संकेत: ' : 'Hint: '}
            </span>
            {currentQ.hint[medium]}
          </div>
        )}

        {/* 4 Combat Strike Option Buttons */}
        <div role="radiogroup" aria-label="Battle answers" className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentRecord?.selectedIndex === idx;
            const isCorrectOpt = currentQ.correctIndex === idx;

            let btnStyle =
              'border-slate-700 bg-[#0F172A] text-slate-100 hover:border-amber-400 hover:bg-slate-800';
            let badgeStyle = 'border-slate-600 bg-slate-800 text-slate-200';
            let statusLabel: string | null = null;

            if (isAnswered) {
              if (isCorrectOpt) {
                btnStyle = 'border-emerald-500 bg-emerald-950/60 text-white';
                badgeStyle = 'border-emerald-500 bg-emerald-600 text-white';
                statusLabel = medium === 'hi' ? 'सही प्रहार' : 'Critical Hit';
              } else if (isSelected && !isCorrectOpt) {
                btnStyle = 'border-red-500 bg-red-950/60 text-white';
                badgeStyle = 'border-red-500 bg-red-600 text-white';
                statusLabel = medium === 'hi' ? 'चूक गए' : 'Missed';
              } else {
                btnStyle = 'border-slate-800 bg-[#0B1220] text-slate-500';
              }
            }

            return (
              <motion.button
                key={`${currentQ.id}-opt-${idx}`}
                whileTap={!isAnswered ? { scale: 0.99 } : undefined}
                type="button"
                disabled={isAnswered}
                onClick={() => handleStrikeAnswer(idx)}
                className={`w-full min-h-[56px] flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${btnStyle}`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-snug">
                    {opt[medium]}
                  </span>
                </div>

                {statusLabel && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 whitespace-nowrap">
                    {isCorrectOpt ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" aria-hidden="true" />
                    )}
                    <span className={isCorrectOpt ? 'text-emerald-300' : 'text-red-300'}>
                      {statusLabel}
                    </span>
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Combat Outcome & Explanation */}
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            role="status"
            className={`p-5 rounded-xl border space-y-3 ${
              currentRecord.isCorrect
                ? 'bg-emerald-950/40 border-emerald-700/70'
                : 'bg-red-950/35 border-red-800/70'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {currentRecord.isCorrect ? (
                  <Swords className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                )}
                <p className="text-sm font-bold text-white">
                  {currentRecord.isCorrect
                    ? medium === 'hi'
                      ? 'सटीक प्रहार! बॉस को भारी क्षति!'
                      : 'Direct Strike! Boss takes −100 HP!'
                    : currentRecord.selectedIndex === undefined
                      ? medium === 'hi'
                        ? `समय समाप्त! बॉस का पलटवार (−25 HP) · सही उत्तर: ${OPTION_LETTERS[currentQ.correctIndex]}`
                        : `Time Expired! Boss counter-attacks (−25 HP) · Answer: ${OPTION_LETTERS[currentQ.correctIndex]}`
                      : medium === 'hi'
                        ? `गलत उत्तर! (−25 HP) · सही विकल्प: ${OPTION_LETTERS[currentQ.correctIndex]}`
                        : `Counter-Attack! (−25 Player HP) · Answer: ${OPTION_LETTERS[currentQ.correctIndex]}`}
                </p>
              </div>

              <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                {currentRecord.isCorrect ? `+${currentRecord.xpEarned} XP` : '+0 XP'}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {currentQ.explanation[medium]}
            </p>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={handleAdvance}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>
                  {playerHP <= 0 || currentIndex >= totalCount - 1
                    ? medium === 'hi'
                      ? 'युद्ध परिणाम देखें'
                      : 'Finish Battle & Claim XP'
                    : medium === 'hi'
                      ? 'अगला प्रहार'
                      : 'Next Strike'}
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
