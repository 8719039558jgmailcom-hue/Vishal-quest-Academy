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
  { tag: 'STREAK', en: 'Unstoppable streak!', hi: 'अजेय स्ट्रीक!' },
  { tag: 'TRAP', en: 'Bring a harder NCERT trap!', hi: 'और कठिन प्रश्न लाओ!' },
  { tag: 'GUARD', en: 'Formidable strike!', hi: 'शानदार प्रहार!' },
] as const;

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function MultiplayerArenaView({
  adventurer,
  grade,
  medium,
  initialTab = 'duels',
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

  // Duel builder state
  const [duelTitle, setDuelTitle] = useState('');
  const [duelGrade, setDuelGrade] = useState<GradeLevel>(grade);
  const [duelSubject, setDuelSubject] = useState<SubjectId | 'all'>('all');
  const [duelJoinCode, setDuelJoinCode] = useState('');

  // Squad builder state
  const [squadName, setSquadName] = useState('');
  const [squadGrade, setSquadGrade] = useState<GradeLevel>(grade);
  const [squadSubject, setSquadSubject] = useState<SubjectId | 'all'>('all');
  const [squadJoinCode, setSquadJoinCode] = useState('');
  const [chatDraft, setChatDraft] = useState('');

  // Leaderboard filter
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | '10' | '12'>('all');

  const resolveAvatarSrc = (avatarId: string, customUrl: string | null) => {
    if (customUrl) return customUrl;
    return (AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]).imagePath;
  };

  // Current active duel that this hero is inside
  const activeDuel = useMemo(
    () => duels.find((d) => d.participants.some((p) => p.heroId === adventurer.heroId)),
    [adventurer.heroId, duels]
  );

  // Current squad that this hero belongs to
  const mySquad = useMemo(
    () => squads.find((s) => s.members.some((m) => m.heroId === adventurer.heroId)),
    [adventurer.heroId, squads]
  );

  const filteredLeaderboard = useMemo(() => {
    if (leaderboardFilter === 'all') return leaderboard;
    return leaderboard.filter((entry) => entry.grade === leaderboardFilter);
  }, [leaderboard, leaderboardFilter]);

  const handleDuelAnswerClick = (roomId: string, round: number, idx: number, isCorrectChoice: boolean) => {
    if (isCorrectChoice) {
      playStrikeSound(adventurer.soundEnabled);
    } else {
      playDamageSound(adventurer.soundEnabled);
    }
    onAnswerDuel(roomId, round, idx);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Real-Time Connection Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{medium === 'hi' ? 'विषय हब पर लौटें' : 'Back to Subject Hubs'}</span>
        </button>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            {connected ? (
              <Wifi className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" aria-hidden="true" />
            )}
            <span>{connected ? (medium === 'hi' ? 'लाइव जुड़ा' : 'Live Sync') : 'Reconnecting'}</span>
          </span>
          <span className="text-slate-600" aria-hidden="true">
            |
          </span>
          <span className="text-amber-300 tabular-nums">
            {onlineCount} {medium === 'hi' ? 'ऑनलाइन नायक' : 'Heroes Online'}
          </span>
        </div>
      </div>

      {/* Arena Title + Tab Navigation */}
      <section className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-semibold text-amber-400">
            {medium === 'hi'
              ? 'रियल-टाइम मल्टीप्लेयर अखाड़ा'
              : 'Real-Time Multiplayer Sanctuary'}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">
            {medium === 'hi'
              ? 'लाइव क्विज़ द्वंद्व, स्टडी स्क्वाड व ग्लोबल रैंकिंग'
              : 'Live Quiz Duels, Study Squads & Global Leaderboard'}
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Multiplayer sections"
          className="inline-flex flex-wrap p-1 bg-[#0B1220] border border-slate-700 rounded-xl gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'duels'}
            onClick={() => handleTabSwitch('duels')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'duels'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Swords className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'लाइव द्वंद्व' : 'Live Quiz Duels'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'squads'}
            onClick={() => handleTabSwitch('squads')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'squads'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'स्टडी स्क्वाड' : 'Study Squads'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'leaderboard'}
            onClick={() => handleTabSwitch('leaderboard')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'लीडरबोर्ड' : 'Global Leaderboard'}</span>
          </button>
        </div>
      </section>

      {lastError && (
        <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-700 text-xs sm:text-sm text-red-100 flex items-center justify-between gap-3">
          <span>{lastError}</span>
          <button
            type="button"
            onClick={onClearError}
            className="text-xs font-semibold text-red-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================== TAB 1: LIVE QUIZ DUELS ==================== */}
      {activeTab === 'duels' && (
        <section aria-label="Live Quiz Duels" className="space-y-6">
          {activeDuel ? (
            <div className="bg-[#162033] border border-amber-400/60 rounded-xl p-6 space-y-6">
              {/* Duel Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                <div>
                  <p className="text-xs font-mono text-amber-400">
                    {medium === 'hi' ? 'द्वंद्व कक्ष कोड:' : 'Room Code:'}{' '}
                    <span className="font-bold text-white">{activeDuel.code}</span> ·{' '}
                    {medium === 'hi' ? `कक्षा ${activeDuel.grade}वीं` : `Class ${activeDuel.grade}th`}
                  </p>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                    {activeDuel.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {activeDuel.status === 'active' && (
                    <span className="font-mono text-lg font-bold text-amber-400 inline-flex items-center gap-1.5 tabular-nums">
                      <Clock className="w-5 h-5" aria-hidden="true" />
                      {activeDuel.roundSecondsRemaining}s · R{activeDuel.currentRound + 1}/
                      {activeDuel.totalRounds}
                    </span>
                  )}

                  {activeDuel.status === 'waiting' && activeDuel.hostHeroId === adventurer.heroId && (
                    <button
                      type="button"
                      onClick={() => onStartDuel(activeDuel.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      <Swords className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {activeDuel.participants.length > 1
                          ? medium === 'hi'
                            ? 'द्वंद्व प्रारंभ करें'
                            : 'Start Live Duel'
                          : medium === 'hi'
                            ? 'सोलो अभ्यास प्रारंभ करें'
                            : 'Start Round Now'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onLeaveDuel(activeDuel.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-[#0F172A] border border-slate-700 hover:border-red-400 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'बाहर निकलें' : 'Leave Room'}</span>
                  </button>
                </div>
              </div>

              {/* Participants Live HP & Score Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeDuel.participants.map((p) => {
                  const isMe = p.heroId === adventurer.heroId;
                  const isWinner = activeDuel.status === 'finished' && activeDuel.winnerHeroId === p.heroId;
                  return (
                    <div
                      key={p.heroId}
                      className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                        isWinner
                          ? 'bg-amber-400/10 border-amber-400'
                          : isMe
                            ? 'bg-[#0F172A] border-sky-500/70'
                            : 'bg-[#0F172A] border-slate-700'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                        <SafeImage
                          src={resolveAvatarSrc(p.avatarId, p.customAvatarUrl)}
                          alt={p.heroName}
                          className="w-full h-full object-cover"
                          fallbackTitle={p.heroName}
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-sm text-white truncate">
                            {p.heroName} {isMe ? '(You)' : ''}
                          </p>
                          <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                            {p.score} pts
                          </span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              p.hp > 50 ? 'bg-emerald-500' : p.hp > 25 ? 'bg-amber-400' : 'bg-red-500'
                            }`}
                            style={{ width: `${p.hp}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 tabular-nums">
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <Heart className="w-3 h-3 fill-current" aria-hidden="true" />
                            {p.hp} HP
                          </span>
                          <span>
                            {p.answeredCurrent
                              ? p.lastAnswerCorrect
                                ? 'Hit!'
                                : 'Missed'
                              : activeDuel.status === 'active'
                                ? 'Thinking...'
                                : `${p.correctCount} hits`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Waiting Lobby State */}
              {activeDuel.status === 'waiting' && (
                <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-700 text-center space-y-2">
                  <p className="text-sm text-slate-200 font-semibold">
                    {medium === 'hi'
                      ? `अपने दोस्तों को कक्ष कोड "${activeDuel.code}" भेजें, या होस्ट बटन से अभी शुरू करें।`
                      : `Share Duel Code "${activeDuel.code}" with classmates so they can join before the host starts!`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {medium === 'hi'
                      ? 'विजेता को +250 बोनस XP और ग्लोबल द्वंद्व जीत मिलती है।'
                      : 'Duel Winner claims +250 Bonus XP and a Global Duel Victory on the Leaderboard.'}
                  </p>
                </div>
              )}

              {/* Active Question Combat */}
              {activeDuel.status === 'active' && activeDuel.currentQuestion && (
                <div className="p-6 rounded-xl bg-[#0F172A] border border-slate-700 space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-amber-400">
                      {activeDuel.currentQuestion.sourceTag} ·{' '}
                      {activeDuel.currentQuestion.ncertChapter[medium]}
                    </span>
                    <span className="font-mono">
                      Round {activeDuel.currentRound + 1}/{activeDuel.totalRounds}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white leading-relaxed">
                    {activeDuel.currentQuestion.prompt[medium]}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
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
                          className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl border text-left transition-colors ${
                            disabled
                              ? isCorrectOpt
                                ? 'border-emerald-600 bg-emerald-950/50 text-emerald-100'
                                : 'border-slate-800 bg-[#0B1220] text-slate-500'
                              : 'border-slate-700 bg-[#162033] text-slate-100 hover:border-amber-400'
                          }`}
                        >
                          <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-600 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {OPTION_LETTERS[idx]}
                          </span>
                          <span className="text-sm font-medium">{opt[medium]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Finished Duel Result */}
              {activeDuel.status === 'finished' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onAnimationComplete={() => {
                    if (activeDuel.winnerHeroId === adventurer.heroId) {
                      playVictoryFanfare(adventurer.soundEnabled);
                    }
                  }}
                  className="p-6 rounded-xl bg-amber-400/10 border border-amber-400/70 text-center space-y-2"
                >
                  <Crown className="w-8 h-8 text-amber-400 mx-auto" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-bold text-white">
                    {activeDuel.winnerHeroId === adventurer.heroId
                      ? medium === 'hi'
                        ? 'द्वंद्व विजयी! +250 बोनस XP अर्जित'
                        : 'DUEL VICTORY! +250 Bonus XP Earned!'
                      : activeDuel.winnerHeroId
                        ? `${
                            activeDuel.participants.find(
                              (p) => p.heroId === activeDuel.winnerHeroId
                            )?.heroName ?? 'Challenger'
                          } Wins!`
                        : medium === 'hi'
                          ? 'बराबरी पर समाप्त!'
                          : 'Draw! Well Fought!'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {medium === 'hi'
                      ? 'सभी खिलाड़ियों के स्कोर ग्लोबल लीडरबोर्ड में जुड़ चुके हैं।'
                      : 'All duel rewards have been synced to the Global Leaderboard.'}
                  </p>
                </motion.div>
              )}

              {/* Live Tactical Taunt Bar */}
              <div className="pt-2 border-t border-slate-700/80 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 mr-1">
                    {medium === 'hi' ? 'लाइव युद्ध संदेश:' : 'Send Combat Callout:'}
                  </span>
                  {DUEL_TAUNT_PRESETS.map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => onSendDuelTaunt(activeDuel.id, t.tag, t[medium])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#0F172A] border border-slate-700 hover:border-amber-400 text-slate-200 rounded-lg"
                    >
                      {t.tag === 'CLASH' ? (
                        <Swords className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      ) : t.tag === 'STREAK' ? (
                        <Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                      ) : t.tag === 'TRAP' ? (
                        <Zap className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      )}
                      <span>{t[medium]}</span>
                    </button>
                  ))}
                </div>

                {activeDuel.taunts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeDuel.taunts.slice(-4).map((t) => (
                      <span
                        key={t.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[#0B1220] border border-slate-700 text-slate-200 inline-flex items-center gap-1.5"
                      >
                        <strong className="text-amber-400">{t.fromHeroName}:</strong>
                        <span className="font-mono text-[10px] text-sky-300">[{t.emoji}]</span>
                        <span>{t.text}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Create or Join Duel Box */}
              <div className="lg:col-span-5 bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold text-white">
                    {medium === 'hi' ? 'नया लाइव द्वंद्व बनाएँ' : 'Host a Live Quiz Duel'}
                  </h2>

                  <div className="space-y-3">
                    <input
                      type="text"
                      maxLength={40}
                      value={duelTitle}
                      onChange={(e) => setDuelTitle(e.target.value)}
                      placeholder={
                        medium === 'hi'
                          ? 'द्वंद्व का नाम (जैसे: भौतिकी युद्ध)'
                          : 'Duel Title (e.g. Physics Showdown)'
                      }
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {(['10', '12'] as GradeLevel[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setDuelGrade(g)}
                          className={`py-2 text-xs font-bold rounded-lg border ${
                            duelGrade === g
                              ? 'bg-sky-600 border-sky-400 text-white'
                              : 'bg-[#0B1220] border-slate-700 text-slate-300'
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
                      className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="all">
                        {medium === 'hi' ? 'सभी 5 विषय (मिश्रित)' : 'All 5 Subjects (Mixed)'}
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
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      <Swords className="w-4 h-4" aria-hidden="true" />
                      <span>{medium === 'hi' ? 'द्वंद्व कक्ष बनाएँ' : 'Create Duel Room'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-700/80 space-y-3">
                  <p className="text-xs font-semibold text-slate-300">
                    {medium === 'hi' ? 'कक्ष कोड से जुड़ें:' : 'Join with Duel Code:'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={duelJoinCode}
                      onChange={(e) => setDuelJoinCode(e.target.value.toUpperCase())}
                      placeholder="DUEL-XXXX"
                      className="flex-1 min-w-0 px-3 py-2 text-sm font-mono bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (duelJoinCode.trim()) onJoinDuel(duelJoinCode.trim());
                      }}
                      className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
                    >
                      {medium === 'hi' ? 'जुड़ें' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Open Server Duel Lobbies */}
              <div className="lg:col-span-7 bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-white">
                    {medium === 'hi' ? 'खुले लाइव द्वंद्व कक्ष' : 'Active Duel Arenas'}
                  </h2>
                  <span className="font-mono text-xs text-slate-400 tabular-nums">
                    {duels.length} {medium === 'hi' ? 'कक्ष' : 'Rooms'}
                  </span>
                </div>

                {duels.length === 0 ? (
                  <div className="p-8 rounded-xl bg-[#0F172A] border border-slate-800 text-center space-y-2">
                    <Swords className="w-8 h-8 text-amber-400 mx-auto" aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-200">
                      {medium === 'hi'
                        ? 'अभी कोई सक्रिय द्वंद्व कक्ष नहीं है। बाईं ओर से अपना द्वंद्व बनाएँ!'
                        : 'No active duel rooms right now. Create one on the left and invite friends!'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {duels.map((d) => (
                      <div
                        key={d.id}
                        className="p-4 rounded-xl bg-[#0F172A] border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                            <span className="font-bold">{d.code}</span>
                            <span>·</span>
                            <span>Class {d.grade}th</span>
                            <span>·</span>
                            <span className="uppercase">{d.status}</span>
                          </div>
                          <p className="font-bold text-white text-sm">{d.title}</p>
                          <p className="text-xs text-slate-400">
                            {d.participants.length} {medium === 'hi' ? 'खिलाड़ी' : 'challengers'} (
                            {d.participants.map((p) => p.heroName).join(', ')})
                          </p>
                        </div>

                        {d.status === 'waiting' && (
                          <button
                            type="button"
                            onClick={() => onJoinDuel(d.id)}
                            className="px-4 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg whitespace-nowrap shrink-0"
                          >
                            {medium === 'hi' ? 'युद्ध में शामिल हों' : 'Join Duel'}
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

      {/* ==================== TAB 2: STUDY SQUADS ==================== */}
      {activeTab === 'squads' && (
        <section aria-label="Study Squads" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: My Squad Room OR Create/Join */}
          <div className="lg:col-span-5 bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-white">
                {medium === 'hi' ? 'स्टडी स्क्वाड बनाएँ' : 'Form a Study Squad'}
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  maxLength={32}
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  placeholder={
                    medium === 'hi' ? 'स्क्वाड का नाम (जैसे: भोपाल रैंकर्स)' : 'Squad Name (e.g. Board Conquerors)'
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />

                <div className="grid grid-cols-2 gap-2">
                  {(['10', '12'] as GradeLevel[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSquadGrade(g)}
                      className={`py-2 text-xs font-bold rounded-lg border ${
                        squadGrade === g
                          ? 'bg-sky-600 border-sky-400 text-white'
                          : 'bg-[#0B1220] border-slate-700 text-slate-300'
                      }`}
                    >
                      {medium === 'hi' ? `कक्षा ${g}वीं` : `Class ${g}th`}
                    </button>
                  ))}
                </div>

                <select
                  aria-label="Squad Focus Subject"
                  value={squadSubject}
                  onChange={(e) => setSquadSubject(e.target.value as SubjectId | 'all')}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">
                    {medium === 'hi' ? 'सभी विषय अभियान' : 'All 5 Subjects'}
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
                    onCreateSquad(squadName, squadGrade, squadSubject);
                    setSquadName('');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  <span>{medium === 'hi' ? 'नया स्क्वाड बनाएँ' : 'Create Study Squad'}</span>
                </button>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-700/80 space-y-3">
              <p className="text-xs font-semibold text-slate-300">
                {medium === 'hi' ? 'स्क्वाड कोड से जुड़ें:' : 'Join via Squad Code:'}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={squadJoinCode}
                  onChange={(e) => setSquadJoinCode(e.target.value.toUpperCase())}
                  placeholder="SQ-XXXX"
                  className="flex-1 min-w-0 px-3 py-2 text-sm font-mono bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (squadJoinCode.trim()) {
                      onJoinSquad(squadJoinCode.trim());
                      setSquadJoinCode('');
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg"
                >
                  {medium === 'hi' ? 'जुड़ें' : 'Join'}
                </button>
              </div>
            </div>

            {/* Directory of Open Squads */}
            {squads.length > 0 && (
              <div className="pt-4 border-t border-slate-700/80 space-y-2.5">
                <p className="text-xs font-semibold text-slate-400">
                  {medium === 'hi' ? 'सक्रिय स्टडी स्क्वाड' : 'Active Study Squads'}
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {squads.map((sq) => {
                    const isMember = sq.members.some((m) => m.heroId === adventurer.heroId);
                    return (
                      <div
                        key={sq.id}
                        className="p-3 rounded-lg bg-[#0F172A] border border-slate-700 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{sq.name}</p>
                          <p className="text-[11px] font-mono text-amber-400">
                            {sq.code} · {sq.members.length} members · {sq.squadXP} XP
                          </p>
                        </div>
                        {!isMember && (
                          <button
                            type="button"
                            onClick={() => onJoinSquad(sq.id)}
                            className="px-2.5 py-1 text-xs font-semibold bg-amber-400 text-slate-950 rounded shrink-0"
                          >
                            {medium === 'hi' ? 'जुड़ें' : 'Join'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Active Squad Hall + Live Squad Chat */}
          <div className="lg:col-span-7 bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-5">
            {mySquad ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
                  <div>
                    <p className="text-xs font-mono text-amber-400">
                      Squad Code: <strong className="text-white">{mySquad.code}</strong> · Squad XP:{' '}
                      {mySquad.squadXP.toLocaleString()}
                    </p>
                    <h3 className="font-display text-xl font-bold text-white mt-0.5">
                      {mySquad.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onLeaveSquad(mySquad.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-[#0F172A] border border-slate-700 hover:border-red-400 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'स्क्वाड छोड़ें' : 'Leave Squad'}</span>
                  </button>
                </div>

                {/* Squad Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mySquad.members.map((m) => (
                    <div
                      key={m.heroId}
                      className="p-3 rounded-lg bg-[#0F172A] border border-slate-700 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                        <SafeImage
                          src={resolveAvatarSrc(m.avatarId, m.customAvatarUrl)}
                          alt={m.heroName}
                          className="w-full h-full object-cover"
                          fallbackTitle={m.heroName}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{m.heroName}</p>
                        <p className="text-[11px] text-slate-400 tabular-nums">
                          Class {m.grade}th · {m.totalXP.toLocaleString()} XP ·{' '}
                          <span className={m.isOnline ? 'text-emerald-400' : 'text-slate-500'}>
                            {m.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Real-Time Squad Chat */}
                <div className="space-y-3 pt-2 border-t border-slate-700/80">
                  <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'लाइव स्क्वाड चैट' : 'Live Squad Strategy Chat'}</span>
                  </p>

                  <div className="h-60 overflow-y-auto bg-[#0B1220] border border-slate-800 rounded-xl p-4 space-y-2.5">
                    {mySquad.messages.map((msg) => {
                      const isMine = msg.heroId === adventurer.heroId;
                      return (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-lg text-xs max-w-[85%] ${
                            isMine
                              ? 'ml-auto bg-amber-400/15 border border-amber-400/40 text-amber-50'
                              : 'bg-[#162033] border border-slate-700 text-slate-200'
                          }`}
                        >
                          <p className="font-bold text-amber-300 mb-0.5">{msg.heroName}</p>
                          <p>{msg.text}</p>
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
                      placeholder={
                        medium === 'hi'
                          ? 'अध्याय युक्ति या प्रश्न साझा करें...'
                          : 'Share a chapter tip or challenge your squad...'
                      }
                      className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{medium === 'hi' ? 'भेजें' : 'Send'}</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-10 text-center space-y-2">
                <Users className="w-9 h-9 text-sky-400 mx-auto" aria-hidden="true" />
                <h3 className="font-display text-lg font-bold text-white">
                  {medium === 'hi'
                    ? 'अभी आप किसी स्टडी स्क्वाड में नहीं हैं'
                    : 'Join or Form a Study Squad'}
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  {medium === 'hi'
                    ? 'बाईं ओर से एक नया स्टडी स्क्वाड बनाएँ या किसी मित्र के स्क्वाड कोड से जुड़कर लाइव चैट करें।'
                    : 'Create a Study Squad or enter a friend’s squad code on the left to study chapters together in real time.'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================== TAB 3: GLOBAL LEADERBOARD ==================== */}
      {activeTab === 'leaderboard' && (
        <motion.section
          key="global-leaderboard-panel"
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Global Leaderboard"
          className="bg-[#162033] border border-amber-400/50 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-white">
                {medium === 'hi' ? 'विश्व रैंकिंग (Global Leaderboard)' : 'Global Academy Rankings'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {medium === 'hi'
                  ? 'अध्याय क्वेस्ट, बॉस युद्ध व लाइव द्वंद्व से अर्जित वास्तविक XP।'
                  : 'Real-time scores earned across chapter quests, Boss Battles, and Live Quiz Duels.'}
              </p>
            </div>

            <div className="inline-flex p-1 bg-[#0B1220] border border-slate-700 rounded-lg gap-1">
              {(['all', '10', '12'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLeaderboardFilter(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    leaderboardFilter === f
                      ? 'bg-amber-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {f === 'all'
                    ? medium === 'hi'
                      ? 'सभी'
                      : 'All Grades'
                    : medium === 'hi'
                      ? `कक्षा ${f}वीं`
                      : `Class ${f}th`}
                </button>
              ))}
            </div>
          </div>

          {filteredLeaderboard.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              {medium === 'hi'
                ? 'इस श्रेणी में अभी कोई नायक पंजीकृत नहीं है।'
                : 'No heroes recorded in this bracket yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-[#0F172A] text-xs font-semibold text-slate-400">
                    <th className="py-3.5 px-5">#</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'नायक' : 'Hero'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'कक्षा' : 'Grade'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'बॉस मुहर' : 'Boss Seals'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'द्वंद्व जीत' : 'Duel Wins'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'स्ट्रीक' : 'Streak'}</th>
                    <th className="py-3.5 px-5 text-right">Total XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredLeaderboard.map((entry, idx) => {
                    const isSelf = entry.heroId === adventurer.heroId;
                    const lv = getHeroLevelFromXP(entry.totalXP);
                    return (
                      <motion.tr
                        key={entry.heroId}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.22, delay: Math.min(idx * 0.04, 0.35) }}
                        className={isSelf ? 'bg-amber-400/10' : 'hover:bg-slate-800/40'}
                      >
                        <td className="py-3.5 px-5 font-mono font-bold text-amber-400 tabular-nums">
                          {idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `#${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                              <SafeImage
                                src={resolveAvatarSrc(entry.avatarId, entry.customAvatarUrl)}
                                alt={entry.heroName}
                                className="w-full h-full object-cover"
                                fallbackTitle={entry.heroName}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate">
                                {entry.heroName}{' '}
                                {isSelf && (
                                  <span className="text-xs font-normal text-amber-400">(You)</span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                Lv.{lv.level} · {entry.bioTitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-300">
                          Class {entry.grade}th
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-200 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                            {entry.bossesDefeatedCount}/12
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-sky-300 tabular-nums">
                          {entry.duelWins}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-orange-300 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                            {entry.dailyStreak}d
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-mono font-bold text-amber-400 tabular-nums">
                          {entry.totalXP.toLocaleString()} XP
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.section>
      )}
    </main>
  );
}
