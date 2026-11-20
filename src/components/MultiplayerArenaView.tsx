import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Crown,
  Flame,
  Heart,
  LogOut,
  MessageSquare,
  Send,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { AVATARS, SUBJECT_REALMS, getHeroLevelFromXP } from '../data/questConfig';
import {
  AdventurerState,
  DuelRoom,
  GradeLevel,
  LeaderboardEntry,
  Medium,
  StudySquad,
  SubjectId,
} from '../types/quiz';
import {
  playDamageSound,
  playPortalTransitionSound,
  playStrikeSound,
  playVictoryFanfare,
} from '../utils/soundFx';
import { SafeImage } from './SafeImage';

export type MultiplayerTab = 'duels' | 'squads' | 'leaderboard';

interface MultiplayerArenaViewProps {
  adventurer: AdventurerState;
  grade: GradeLevel;
  medium: Medium;
  initialTab?: MultiplayerTab;
  connected: boolean;
  onlineCount: number;
  leaderboard: LeaderboardEntry[];
  squads: StudySquad[];
  duels: DuelRoom[];
  lastError: string | null;
  onClearError: () => void;
  onBackToHub: () => void;
  onCreateSquad: (name: string, grade: GradeLevel, focusSubject: SubjectId | 'all') => void;
  onJoinSquad: (codeOrId: string) => void;
  onLeaveSquad: (squadId: string) => void;
  onSendSquadChat: (squadId: string, text: string) => void;
  onCreateDuel: (title: string, grade: GradeLevel, subjectId: SubjectId | 'all') => void;
  onJoinDuel: (codeOrId: string) => void;
  onStartDuel: (roomId: string) => void;
  onAnswerDuel: (roomId: string, round: number, selectedIndex: number) => void;
  onSendDuelTaunt: (roomId: string, emoji: string, text: string) => void;
  onLeaveDuel: (roomId: string) => void;
}

const DUEL_TAUNT_PRESETS = [
  { tag: 'CLASH', en: 'Too slow!', hi: 'बहुत धीमे हो!' },
  { tag: 'STREAK', en: 'Unstoppable!', hi: 'अजेय स्ट्रीक!' },
  { tag: 'TRAP', en: 'Harder trap!', hi: 'कठिन प्रश्न लाओ!' },
  { tag: 'GUARD', en: 'Nice strike!', hi: 'शानदार प्रहार!' },
] as const;

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function MultiplayerArenaView({
  adventurer,
  grade,
  medium,
  initialTab = 'leaderboard',
  connected,
  onlineCount,
  leaderboard,
  squads,
  duels,
  lastError,
  onClearError,
  onBackToHub,
  onCreateSquad,
  onJoinSquad,
  onLeaveSquad,
  onSendSquadChat,
  onCreateDuel,
  onJoinDuel,
  onStartDuel,
  onAnswerDuel,
  onSendDuelTaunt,
  onLeaveDuel,
}: MultiplayerArenaViewProps) {
  const [activeTab, setActiveTab] = useState<MultiplayerTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabSwitch = (nextTab: MultiplayerTab) => {
    if (nextTab !== activeTab) {
      playPortalTransitionSound(adventurer.soundEnabled);
    }
    setActiveTab(nextTab);
  };

  const [duelTitle, setDuelTitle] = useState('');
  const [duelGrade, setDuelGrade] = useState<GradeLevel>(grade);
  const [duelSubject, setDuelSubject] = useState<SubjectId | 'all'>('all');
  const [duelJoinCode, setDuelJoinCode] = useState('');

  const [squadName, setSquadName] = useState('');
  const [squadGrade, setSquadGrade] = useState<GradeLevel>(grade);
  const [squadSubject, setSquadSubject] = useState<SubjectId | 'all'>('all');
  const [squadJoinCode, setSquadJoinCode] = useState('');
  const [chatDraft, setChatDraft] = useState('');

  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | '10' | '12'>('all');

  const resolveAvatarSrc = (avatarId: string, customUrl: string | null) => {
    if (customUrl) return customUrl;
    return (AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]).imagePath;
  };

  const activeDuel = useMemo(
    () => duels.find((d) => d.participants.some((p) => p.heroId === adventurer.heroId)),
    [adventurer.heroId, duels]
  );

  const mySquad = useMemo(
    () => squads.find((s) => s.members.some((m) => m.heroId === adventurer.heroId)),
    [adventurer.heroId, squads]
  );

  const filteredLeaderboard = useMemo(() => {
    if (leaderboardFilter === 'all') return leaderboard;
    return leaderboard.filter((entry) => entry.grade === leaderboardFilter);
  }, [leaderboard, leaderboardFilter]);

  const handleDuelAnswerClick = (
    roomId: string,
    round: number,
    idx: number,
    isCorrectChoice: boolean
  ) => {
    if (isCorrectChoice) {
      playStrikeSound(adventurer.soundEnabled);
    } else {
      playDamageSound(adventurer.soundEnabled);
    }
    onAnswerDuel(roomId, round, idx);
  };

  return (
    <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToHub}
          className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#181C32] bg-white rounded-xl comic-btn-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{medium === 'hi' ? 'हब पर लौटें' : 'Quest Hub'}</span>
        </button>

        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border-2 border-[#181C32] text-xs font-mono font-bold">
          <span className="inline-flex items-center gap-1 text-[#181C32]">
            {connected ? (
              <Wifi className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
            )}
            <span>{connected ? 'LIVE' : 'SYNC'}</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[#2563EB] tabular-nums">
            {onlineCount} {medium === 'hi' ? 'ऑनलाइन' : 'Online'}
          </span>
        </div>
      </div>

      {/* Header + 3 Arcade Tab Switchers */}
      <section className="comic-card rounded-3xl overflow-hidden bg-white">
        <div className="comic-banner-dark comic-gloss border-b-[2.5px] border-[#181C32] p-4 sm:p-5 text-white">
          <p className="text-[11px] font-mono font-extrabold text-[#FACC15]">
            {medium === 'hi' ? 'ग्लोबल अखाड़ा व रैंकिंग' : 'BOARD QUEST ARENA · RANKS & SQUADS'}
          </p>
          <h1 className="font-display text-2xl font-bold text-white leading-tight mt-0.5">
            {medium === 'hi'
              ? 'ग्लोबल लीडरबोर्ड, द्वंद्व व स्क्वाड'
              : 'Global Leaderboard, Duels & Squads'}
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Multiplayer sections"
          className="p-3.5 sm:p-4 grid grid-cols-3 gap-2 bg-[#FFF1F2]"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'leaderboard'}
            onClick={() => handleTabSwitch('leaderboard')}
            className={`min-h-[46px] px-2 py-2 rounded-2xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-1.5 text-xs font-extrabold ${
              activeTab === 'leaderboard' ? 'bg-[#FACC15] text-[#181C32]' : 'bg-white text-[#181C32]'
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{medium === 'hi' ? 'रैंकिंग' : 'Ranks'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'duels'}
            onClick={() => handleTabSwitch('duels')}
            className={`min-h-[46px] px-2 py-2 rounded-2xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-1.5 text-xs font-extrabold ${
              activeTab === 'duels' ? 'bg-[#FB7185] text-[#181C32]' : 'bg-white text-[#181C32]'
            }`}
          >
            <Swords className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{medium === 'hi' ? 'लाइव द्वंद्व' : 'Duels'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'squads'}
            onClick={() => handleTabSwitch('squads')}
            className={`min-h-[46px] px-2 py-2 rounded-2xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-1.5 text-xs font-extrabold ${
              activeTab === 'squads' ? 'bg-[#38BDF8] text-[#181C32]' : 'bg-white text-[#181C32]'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{medium === 'hi' ? 'स्टडी स्क्वाड' : 'Squads'}</span>
          </button>
        </div>
      </section>

      {lastError && (
        <div className="p-3.5 rounded-2xl bg-[#FFF1F2] border-2 border-[#E11D48] text-xs font-bold text-[#9F1239] flex items-center justify-between gap-2">
          <span>{lastError}</span>
          <button type="button" onClick={onClearError} className="underline shrink-0">
            Dismiss
          </button>
        </div>
      )}

      {/* ==================== TAB 1: GLOBAL LEADERBOARD ==================== */}
      {activeTab === 'leaderboard' && (
        <motion.section
          key="global-leaderboard-panel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          aria-label="Global Leaderboard"
          className="space-y-4"
        >
          {/* Grade Filter Pills */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="font-display text-lg font-bold text-[#181C32]">
              {medium === 'hi' ? 'चैंपियन रैंकिंग' : 'Academy Rankings'}
            </h2>
            <div className="inline-flex p-1 bg-white border-2 border-[#181C32] rounded-xl gap-1">
              {(['all', '10', '12'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLeaderboardFilter(f)}
                  className={`min-h-[34px] px-3 py-1 text-xs font-extrabold rounded-lg ${
                    leaderboardFilter === f ? 'bg-[#FACC15] text-[#181C32]' : 'text-slate-600'
                  }`}
                >
                  {f === 'all'
                    ? medium === 'hi'
                      ? 'सभी'
                      : 'All'
                    : medium === 'hi'
                      ? `${f}वीं`
                      : `Class ${f}th`}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile-Friendly Ranked Card List */}
          {filteredLeaderboard.length === 0 ? (
            <div className="comic-card rounded-3xl p-8 text-center text-sm font-bold text-slate-600 bg-white">
              {medium === 'hi'
                ? 'इस श्रेणी में अभी कोई खिलाड़ी नहीं है।'
                : 'No champions recorded in this bracket yet.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredLeaderboard.map((entry, idx) => {
                const isSelf = entry.heroId === adventurer.heroId;
                const lv = getHeroLevelFromXP(entry.totalXP);
                const rankBg =
                  idx === 0
                    ? 'bg-[#FEF08A]'
                    : idx === 1
                      ? 'bg-[#E2E8F0]'
                      : idx === 2
                        ? 'bg-[#FED7AA]'
                        : isSelf
                          ? 'bg-[#DBEAFE]'
                          : 'bg-white';

                return (
                  <motion.div
                    key={entry.heroId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.16, delay: Math.min(idx * 0.03, 0.25) }}
                    className={`comic-card-sm comic-gloss rounded-2xl p-3 flex items-center justify-between gap-3 ${rankBg}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`w-9 h-9 rounded-xl border-2 border-[#181C32] font-mono text-xs font-extrabold flex items-center justify-center shrink-0 tabular-nums ${
                          idx === 0
                            ? 'bg-[#FACC15] text-[#181C32]'
                            : idx === 1
                              ? 'bg-[#CBD5E1] text-[#181C32]'
                              : idx === 2
                                ? 'bg-[#FB923C] text-[#181C32]'
                                : 'bg-[#181C32] text-[#FACC15]'
                        }`}
                      >
                        {idx === 0 ? <Crown className="w-4 h-4" aria-hidden="true" /> : `#${idx + 1}`}
                      </span>
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#181C32] shrink-0 bg-white">
                        <SafeImage
                          src={resolveAvatarSrc(entry.avatarId, entry.customAvatarUrl)}
                          alt={entry.heroName}
                          className="w-full h-full object-cover"
                          fallbackTitle={entry.heroName}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm sm:text-base text-[#181C32] truncate">
                          {entry.heroName}{' '}
                          {isSelf && <span className="text-xs text-[#2563EB]">(You)</span>}
                        </p>
                        <p className="text-[11px] font-bold text-slate-600 truncate tabular-nums">
                          Lv.{lv.level} · Cl.{entry.grade} · {entry.bossesDefeatedCount}/12 Seals ·{' '}
                          {entry.dailyStreak}d
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono text-sm sm:text-base font-extrabold text-[#181C32] tabular-nums">
                        {entry.totalXP.toLocaleString()}
                      </p>
                      <p className="text-[10px] font-mono font-bold text-[#D97706]">XP</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>
      )}

      {/* ==================== TAB 2: LIVE QUIZ DUELS ==================== */}
      {activeTab === 'duels' && (
        <section aria-label="Live Quiz Duels" className="space-y-4">
          {activeDuel ? (
            <div className="comic-card rounded-3xl p-4 sm:p-6 bg-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-200">
                <div>
                  <p className="text-xs font-mono font-extrabold text-[#2563EB]">
                    CODE: {activeDuel.code} · Class {activeDuel.grade}th
                  </p>
                  <h2 className="font-display text-xl font-bold text-[#181C32]">
                    {activeDuel.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {activeDuel.status === 'active' && (
                    <span className="font-mono text-sm font-extrabold text-[#E11D48] inline-flex items-center gap-1 tabular-nums">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      {activeDuel.roundSecondsRemaining}s · R{activeDuel.currentRound + 1}/
                      {activeDuel.totalRounds}
                    </span>
                  )}

                  {activeDuel.status === 'waiting' && activeDuel.hostHeroId === adventurer.heroId && (
                    <button
                      type="button"
                      onClick={() => onStartDuel(activeDuel.id)}
                      className="min-h-[42px] px-3.5 py-2 text-xs font-extrabold text-[#181C32] bg-[#FACC15] rounded-xl comic-btn-sm inline-flex items-center gap-1.5"
                    >
                      <Swords className="w-4 h-4" aria-hidden="true" />
                      <span>{medium === 'hi' ? 'शुरू करें' : 'Start Duel'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onLeaveDuel(activeDuel.id)}
                    className="min-h-[42px] px-3 py-2 text-xs font-extrabold text-[#E11D48] bg-[#FFF1F2] rounded-xl comic-btn-sm inline-flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'छोड़ें' : 'Leave'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeDuel.participants.map((p) => {
                  const isMe = p.heroId === adventurer.heroId;
                  const isWinner =
                    activeDuel.status === 'finished' && activeDuel.winnerHeroId === p.heroId;
                  return (
                    <div
                      key={p.heroId}
                      className={`p-3 rounded-2xl border-2 border-[#181C32] flex items-center gap-3 ${
                        isWinner ? 'bg-[#FEF08A]' : isMe ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFF]'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#181C32] shrink-0">
                        <SafeImage
                          src={resolveAvatarSrc(p.avatarId, p.customAvatarUrl)}
                          alt={p.heroName}
                          className="w-full h-full object-cover"
                          fallbackTitle={p.heroName}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-xs sm:text-sm text-[#181C32] truncate">
                            {p.heroName} {isMe ? '(You)' : ''}
                          </p>
                          <span className="font-mono text-xs font-extrabold text-[#D97706] tabular-nums">
                            {p.score} pts
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-200 rounded-full border border-[#181C32] overflow-hidden">
                          <div
                            className={`h-full ${
                              p.hp > 50 ? 'bg-[#10B981]' : p.hp > 25 ? 'bg-[#FACC15]' : 'bg-[#E11D48]'
                            }`}
                            style={{ width: `${p.hp}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 tabular-nums">
                          <span className="inline-flex items-center gap-1 text-[#059669]">
                            <Heart className="w-3 h-3 fill-current" aria-hidden="true" />
                            {p.hp} HP
                          </span>
                          <span>
                            {p.answeredCurrent
                              ? p.lastAnswerCorrect
                                ? 'Hit!'
                                : 'Missed'
                              : `${p.correctCount} hits`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeDuel.status === 'waiting' && (
                <div className="p-4 rounded-2xl bg-[#EFF6FF] border-2 border-[#181C32] text-center space-y-1">
                  <p className="text-sm font-bold text-[#181C32]">
                    {medium === 'hi'
                      ? `दोस्तों को कोड "${activeDuel.code}" भेजें या होस्ट बटन से शुरू करें!`
                      : `Share Duel Code "${activeDuel.code}" or tap Start Duel above!`}
                  </p>
                </div>
              )}

              {activeDuel.status === 'active' && activeDuel.currentQuestion && (
                <div className="p-4 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] space-y-3">
                  {/* Live 10-Second Duel Countdown Meter */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full border border-[#181C32] overflow-hidden">
                    <div
                      className={`h-full comic-progress-fill transition-all duration-300 ${
                        activeDuel.roundSecondsRemaining <= 3 ? 'bg-[#E11D48]' : 'bg-[#2563EB]'
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, (activeDuel.roundSecondsRemaining / 10) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs font-mono font-extrabold text-[#2563EB]">
                    {activeDuel.currentQuestion.sourceTag} ·{' '}
                    {activeDuel.currentQuestion.ncertChapter[medium]}
                  </p>
                  <h3 className="text-base font-bold text-[#181C32]">
                    {activeDuel.currentQuestion.prompt[medium]}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {activeDuel.currentQuestion.options.map((opt, idx) => {
                      const me = activeDuel.participants.find(
                        (p) => p.heroId === adventurer.heroId
                      );
                      const disabled = Boolean(me?.answeredCurrent);
                      const isCorrectOpt = activeDuel.currentQuestion?.correctIndex === idx;

                      return (
                        <button
                          key={`${activeDuel.currentQuestion?.id}-dopt-${idx}`}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            handleDuelAnswerClick(
                              activeDuel.id,
                              activeDuel.currentRound,
                              idx,
                              isCorrectOpt
                            )
                          }
                          className={`w-full min-h-[48px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left comic-btn-sm ${
                            disabled
                              ? isCorrectOpt
                                ? 'bg-[#A7F3D0] text-[#181C32]'
                                : 'bg-slate-200 text-slate-500'
                              : 'bg-white text-[#181C32]'
                          }`}
                        >
                          <span className="w-7 h-7 rounded-lg bg-[#FACC15] border-2 border-[#181C32] font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                            {OPTION_LETTERS[idx]}
                          </span>
                          <span className="text-xs sm:text-sm font-bold">{opt[medium]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeDuel.status === 'finished' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onAnimationComplete={() => {
                    if (activeDuel.winnerHeroId === adventurer.heroId) {
                      playVictoryFanfare(adventurer.soundEnabled);
                    }
                  }}
                  className="p-5 rounded-2xl bg-[#FEF08A] border-2 border-[#181C32] text-center space-y-1.5"
                >
                  <Crown className="w-8 h-8 text-[#D97706] mx-auto" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold text-[#181C32]">
                    {activeDuel.winnerHeroId === adventurer.heroId
                      ? medium === 'hi'
                        ? 'द्वंद्व जीत! +250 बोनस XP'
                        : 'DUEL VICTORY! +250 XP!'
                      : activeDuel.winnerHeroId
                        ? `${
                            activeDuel.participants.find(
                              (p) => p.heroId === activeDuel.winnerHeroId
                            )?.heroName ?? 'Challenger'
                          } Wins!`
                        : 'Draw!'}
                  </h3>
                </motion.div>
              )}

              {/* Live Callout Taunts */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-200">
                <div className="flex flex-wrap items-center gap-1.5">
                  {DUEL_TAUNT_PRESETS.map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => onSendDuelTaunt(activeDuel.id, t.tag, t[medium])}
                      className="min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1 text-xs font-extrabold bg-[#F8FAFF] text-[#181C32] rounded-xl comic-btn-sm"
                    >
                      <Zap className="w-3 h-3 text-[#2563EB]" aria-hidden="true" />
                      <span>{t[medium]}</span>
                    </button>
                  ))}
                </div>
                {activeDuel.taunts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {activeDuel.taunts.slice(-4).map((t) => (
                      <span
                        key={t.id}
                        className="text-xs px-2.5 py-1 rounded-lg bg-[#EFF6FF] border border-[#181C32] text-[#181C32] font-semibold"
                      >
                        <strong>{t.fromHeroName}:</strong> {t.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-5 comic-card rounded-3xl p-4 sm:p-5 bg-white space-y-4">
                <h2 className="font-display text-lg font-bold text-[#181C32]">
                  {medium === 'hi' ? 'नया द्वंद्व बनाएँ' : 'Host Live Duel'}
                </h2>
                <div className="space-y-2.5">
                  <input
                    type="text"
                    maxLength={40}
                    value={duelTitle}
                    onChange={(e) => setDuelTitle(e.target.value)}
                    placeholder={medium === 'hi' ? 'द्वंद्व का नाम...' : 'Duel Title...'}
                    className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold rounded-xl comic-input"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {(['10', '12'] as GradeLevel[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDuelGrade(g)}
                        className={`min-h-[42px] text-xs font-extrabold rounded-xl comic-btn-sm ${
                          duelGrade === g ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFF] text-[#181C32]'
                        }`}
                      >
                        {medium === 'hi' ? `कक्षा ${g}वीं` : `Class ${g}th`}
                      </button>
                    ))}
                  </div>
                  <select
                    aria-label="Duel Subject"
                    value={duelSubject}
                    onChange={(e) => setDuelSubject(e.target.value as SubjectId | 'all')}
                    className="w-full min-h-[44px] px-3 py-2 text-sm font-semibold rounded-xl comic-input"
                  >
                    <option value="all">
                      {medium === 'hi' ? 'सभी 5 विषय' : 'All 5 Subjects'}
                    </option>
                    {SUBJECT_REALMS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name[medium]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      onCreateDuel(duelTitle, duelGrade, duelSubject);
                      setDuelTitle('');
                    }}
                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold text-[#181C32] bg-[#FACC15] rounded-2xl comic-btn"
                  >
                    <Swords className="w-4 h-4" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'कक्ष बनाएँ' : 'Create Duel Room'}</span>
                  </button>
                </div>

                <div className="pt-3 border-t-2 border-dashed border-slate-200 space-y-2">
                  <p className="text-xs font-extrabold text-[#181C32]">
                    {medium === 'hi' ? 'कोड से जुड़ें:' : 'Join by Code:'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={duelJoinCode}
                      onChange={(e) => setDuelJoinCode(e.target.value.toUpperCase())}
                      placeholder="DUEL-XXXX"
                      className="flex-1 min-w-0 min-h-[44px] px-3 py-2 text-sm font-mono font-bold rounded-xl comic-input"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (duelJoinCode.trim()) onJoinDuel(duelJoinCode.trim());
                      }}
                      className="min-h-[44px] px-4 py-2 text-xs font-extrabold bg-[#38BDF8] text-[#181C32] rounded-xl comic-btn-sm"
                    >
                      {medium === 'hi' ? 'जुड़ें' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 comic-card rounded-3xl p-4 sm:p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-[#181C32]">
                    {medium === 'hi' ? 'खुले लाइव द्वंद्व' : 'Open Duel Rooms'}
                  </h2>
                  <span className="font-mono text-xs font-extrabold text-[#2563EB]">
                    {duels.length} Rooms
                  </span>
                </div>

                {duels.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] text-center space-y-1.5">
                    <Swords className="w-7 h-7 text-[#E11D48] mx-auto" aria-hidden="true" />
                    <p className="text-xs sm:text-sm font-bold text-slate-600">
                      {medium === 'hi'
                        ? 'कोई खुला कक्ष नहीं। नया कक्ष बनाएँ!'
                        : 'No active duel rooms right now. Create one to invite friends!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {duels.map((d) => (
                      <div
                        key={d.id}
                        className="p-3.5 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-[11px] font-mono font-extrabold text-[#2563EB]">
                            {d.code} · Class {d.grade}th · {d.status.toUpperCase()}
                          </p>
                          <p className="font-bold text-sm text-[#181C32]">{d.title}</p>
                          <p className="text-xs text-slate-600">
                            {d.participants.map((p) => p.heroName).join(', ')}
                          </p>
                        </div>
                        {d.status === 'waiting' && (
                          <button
                            type="button"
                            onClick={() => onJoinDuel(d.id)}
                            className="min-h-[42px] px-4 py-2 text-xs font-extrabold bg-[#FACC15] text-[#181C32] rounded-xl comic-btn-sm shrink-0"
                          >
                            {medium === 'hi' ? 'शामिल हों' : 'Join Duel'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================== TAB 3: STUDY SQUADS ==================== */}
      {activeTab === 'squads' && (
        <section aria-label="Study Squads" className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-5 comic-card rounded-3xl p-4 sm:p-5 bg-white space-y-4">
            <h2 className="font-display text-lg font-bold text-[#181C32]">
              {medium === 'hi' ? 'स्टडी स्क्वाड बनाएँ' : 'Form a Study Squad'}
            </h2>
            <div className="space-y-2.5">
              <input
                type="text"
                maxLength={32}
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                placeholder={medium === 'hi' ? 'स्क्वाड का नाम...' : 'Squad Name...'}
                className="w-full min-h-[44px] px-3.5 py-2 text-sm font-semibold rounded-xl comic-input"
              />
              <div className="grid grid-cols-2 gap-2">
                {(['10', '12'] as GradeLevel[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSquadGrade(g)}
                    className={`min-h-[42px] text-xs font-extrabold rounded-xl comic-btn-sm ${
                      squadGrade === g ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFF] text-[#181C32]'
                    }`}
                  >
                    {medium === 'hi' ? `कक्षा ${g}वीं` : `Class ${g}th`}
                  </button>
                ))}
              </div>
              <select
                aria-label="Squad Subject"
                value={squadSubject}
                onChange={(e) => setSquadSubject(e.target.value as SubjectId | 'all')}
                className="w-full min-h-[44px] px-3 py-2 text-sm font-semibold rounded-xl comic-input"
              >
                <option value="all">{medium === 'hi' ? 'सभी विषय' : 'All Subjects'}</option>
                {SUBJECT_REALMS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name[medium]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  onCreateSquad(squadName, squadGrade, squadSubject);
                  setSquadName('');
                }}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold text-[#181C32] bg-[#FACC15] rounded-2xl comic-btn"
              >
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>{medium === 'hi' ? 'स्क्वाड बनाएँ' : 'Create Study Squad'}</span>
              </button>
            </div>

            <div className="pt-3 border-t-2 border-dashed border-slate-200 space-y-2">
              <p className="text-xs font-extrabold text-[#181C32]">
                {medium === 'hi' ? 'स्क्वाड कोड से जुड़ें:' : 'Join via Code:'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={squadJoinCode}
                  onChange={(e) => setSquadJoinCode(e.target.value.toUpperCase())}
                  placeholder="SQ-XXXX"
                  className="flex-1 min-w-0 min-h-[44px] px-3 py-2 text-sm font-mono font-bold rounded-xl comic-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (squadJoinCode.trim()) {
                      onJoinSquad(squadJoinCode.trim());
                      setSquadJoinCode('');
                    }
                  }}
                  className="min-h-[44px] px-4 py-2 text-xs font-extrabold bg-[#38BDF8] text-[#181C32] rounded-xl comic-btn-sm"
                >
                  {medium === 'hi' ? 'जुड़ें' : 'Join'}
                </button>
              </div>
            </div>

            {squads.length > 0 && (
              <div className="pt-3 border-t-2 border-slate-200 space-y-2 max-h-52 overflow-y-auto">
                {squads.map((sq) => {
                  const isMember = sq.members.some((m) => m.heroId === adventurer.heroId);
                  return (
                    <div
                      key={sq.id}
                      className="p-2.5 rounded-xl bg-[#F8FAFF] border-2 border-[#181C32] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#181C32] truncate">{sq.name}</p>
                        <p className="text-[11px] font-mono font-bold text-[#2563EB]">
                          {sq.code} · {sq.members.length} · {sq.squadXP} XP
                        </p>
                      </div>
                      {!isMember && (
                        <button
                          type="button"
                          onClick={() => onJoinSquad(sq.id)}
                          className="min-h-[36px] px-3 py-1 text-xs font-extrabold bg-[#FACC15] text-[#181C32] rounded-lg border-2 border-[#181C32] shrink-0"
                        >
                          {medium === 'hi' ? 'जुड़ें' : 'Join'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 comic-card rounded-3xl p-4 sm:p-5 bg-white space-y-4">
            {mySquad ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
                  <div>
                    <p className="text-xs font-mono font-extrabold text-[#2563EB]">
                      {mySquad.code} · {mySquad.squadXP.toLocaleString()} XP
                    </p>
                    <h3 className="font-display text-xl font-bold text-[#181C32]">{mySquad.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onLeaveSquad(mySquad.id)}
                    className="min-h-[40px] px-3 py-1.5 text-xs font-extrabold text-[#E11D48] bg-[#FFF1F2] rounded-xl comic-btn-sm inline-flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'छोड़ें' : 'Leave'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mySquad.members.map((m) => (
                    <div
                      key={m.heroId}
                      className="p-2.5 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] flex items-center gap-2.5"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-[#181C32] shrink-0">
                        <SafeImage
                          src={resolveAvatarSrc(m.avatarId, m.customAvatarUrl)}
                          alt={m.heroName}
                          className="w-full h-full object-cover"
                          fallbackTitle={m.heroName}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#181C32] truncate">{m.heroName}</p>
                        <p className="text-[11px] font-bold text-slate-600">
                          Cl.{m.grade} · {m.totalXP} XP · {m.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 pt-2 border-t-2 border-slate-200">
                  <p className="text-xs font-extrabold text-[#181C32] flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'लाइव चैट' : 'Squad Chat'}</span>
                  </p>
                  <div className="h-52 overflow-y-auto bg-[#F8FAFF] border-2 border-[#181C32] rounded-2xl p-3 space-y-2">
                    {mySquad.messages.map((msg) => {
                      const isMine = msg.heroId === adventurer.heroId;
                      return (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-xl border-2 border-[#181C32] text-xs max-w-[85%] ${
                            isMine ? 'ml-auto bg-[#FEF08A]' : 'bg-white'
                          }`}
                        >
                          <p className="font-extrabold text-[#2563EB]">{msg.heroName}</p>
                          <p className="text-[#181C32] font-medium">{msg.text}</p>
                        </div>
                      );
                    })}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!chatDraft.trim()) return;
                      onSendSquadChat(mySquad.id, chatDraft.trim());
                      setChatDraft('');
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      maxLength={260}
                      value={chatDraft}
                      onChange={(e) => setChatDraft(e.target.value)}
                      placeholder={medium === 'hi' ? 'संदेश लिखें...' : 'Message your squad...'}
                      className="flex-1 min-w-0 min-h-[44px] px-3 py-2 text-sm font-medium rounded-xl comic-input"
                    />
                    <button
                      type="submit"
                      className="min-h-[44px] px-4 py-2 text-xs font-extrabold text-[#181C32] bg-[#FACC15] rounded-xl comic-btn-sm inline-flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{medium === 'hi' ? 'भेजें' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-2">
                <Users className="w-8 h-8 text-[#2563EB] mx-auto" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-[#181C32]">
                  {medium === 'hi' ? 'स्टडी स्क्वाड से जुड़ें' : 'Join a Study Squad'}
                </h3>
                <p className="text-xs font-semibold text-slate-600 max-w-sm mx-auto">
                  {medium === 'hi'
                    ? 'दोस्तों के साथ पढ़ाई करने के लिए नया स्क्वाड बनाएँ या कोड दर्ज करें।'
                    : 'Create a Study Squad or enter a friend’s code to team up and chat live.'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
