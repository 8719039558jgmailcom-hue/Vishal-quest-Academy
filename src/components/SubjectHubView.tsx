import { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Crown,
  Flame,
  FlaskConical,
  Play,
  Shield,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import { getChapterNodesForSubject } from '../data/mpboardIndex';
import { AVATARS, SUBJECT_REALMS, getHeroLevelFromXP } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { SafeImage } from './SafeImage';
import { SubjectDiagram } from './SubjectDiagram';

interface SubjectHubViewProps {
  grade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  medium: Medium;
  adventurer: AdventurerState;
  onlineCount: number;
  onOpenBarracks: () => void;
  onOpenMultiplayer: () => void;
  onOpenLeaderboard: () => void;
  onOpenPractice: () => void;
  onOpenSubjectMap: (subjectId: SubjectId) => void;
  onStartGrandBoss: (grade: GradeLevel) => void;
}

const SUBJECT_PALETTE: Record<
  SubjectId,
  { headerBg: string; cardAccent: string; tagText: string }
> = {
  hindi: { headerBg: 'bg-[#FEF08A]', cardAccent: 'bg-[#EAB308]', tagText: 'text-[#854D0E]' },
  english: { headerBg: 'bg-[#BAE6FD]', cardAccent: 'bg-[#0284C7]', tagText: 'text-[#075985]' },
  maths: { headerBg: 'bg-[#DDD6FE]', cardAccent: 'bg-[#7C3AED]', tagText: 'text-[#5B21B6]' },
  physics: { headerBg: 'bg-[#FECDD3]', cardAccent: 'bg-[#E11D48]', tagText: 'text-[#9F1239]' },
  chemistry: { headerBg: 'bg-[#A7F3D0]', cardAccent: 'bg-[#059669]', tagText: 'text-[#065F46]' },
};

export function SubjectHubView({
  grade,
  onGradeChange,
  medium,
  adventurer,
  onlineCount,
  onOpenBarracks,
  onOpenMultiplayer,
  onOpenLeaderboard,
  onOpenPractice,
  onOpenSubjectMap,
  onStartGrandBoss,
}: SubjectHubViewProps) {
  const activeAvatar = AVATARS.find((a) => a.id === adventurer.avatarId) ?? AVATARS[0];
  const portraitSrc = adventurer.customAvatarUrl || activeAvatar.imagePath;
  const heroLevel = getHeroLevelFromXP(adventurer.totalXP);

  const gradeBossSeals = useMemo(
    () =>
      SUBJECT_REALMS.filter((r) => adventurer.bossesDefeated.includes(`${grade}-${r.id}`)).length,
    [adventurer.bossesDefeated, grade]
  );

  const totalGradeNodes = useMemo(
    () =>
      SUBJECT_REALMS.reduce((sum, r) => sum + getChapterNodesForSubject(grade, r.id).length, 0),
    [grade]
  );

  const clearedGradeNodes = useMemo(
    () =>
      SUBJECT_REALMS.reduce(
        (sum, r) =>
          sum +
          getChapterNodesForSubject(grade, r.id).filter(
            (node) => (adventurer.clearedStages[node.id] ?? 0) > 0
          ).length,
        0
      ),
    [adventurer.clearedStages, grade]
  );

  const grandBossUnlocked = gradeBossSeals >= 1;
  const grandBossCleared = adventurer.bossesDefeated.includes(`${grade}-grand-boss`);

  return (
    <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* 1. Mobile Player Stats & Level XP Card */}
      <section
        aria-label="Player level and daily streak"
        className="comic-card comic-xp-glow rounded-3xl overflow-hidden bg-white"
      >
        <div className="comic-banner-blue comic-gloss border-b-[2.5px] border-[#181C32] p-4 sm:p-5 text-white">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-extrabold text-[#FEF08A] mb-2.5">
            <span>
              {medium === 'hi'
                ? `प्लेयर कार्ड · Lv.${heroLevel.level}`
                : `BOARD QUEST PASS · LV.${heroLevel.level}`}
            </span>
            <span>{medium === 'hi' ? `कक्षा ${grade}वीं` : `CLASS ${grade}TH`}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={onOpenBarracks}
                aria-label="Open Hero Profile"
                className="w-16 h-16 rounded-2xl overflow-hidden border-[3px] border-[#181C32] shadow-[0_3px_0_#181C32] bg-[#FACC15] shrink-0 active:translate-y-[2px]"
              >
                <SafeImage
                  src={portraitSrc}
                  alt={adventurer.heroName}
                  className="w-full h-full object-cover"
                  fallbackTitle={adventurer.heroName}
                />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#FEF08A] truncate">
                  {heroLevel.title[medium]}
                </p>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white truncate leading-tight">
                  {adventurer.heroName}
                </h1>
                <p className="text-xs font-semibold text-[#DBEAFE] truncate">
                  {adventurer.bioTitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenLeaderboard}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] comic-btn-sm comic-gloss inline-flex items-center gap-1.5 text-xs font-extrabold shrink-0"
            >
              <Trophy className="w-4 h-4 text-[#181C32]" aria-hidden="true" />
              <span className="hidden sm:inline">{medium === 'hi' ? 'रैंकिंग' : 'Ranks'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-3.5">
          {/* XP Progress Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold tabular-nums">
              <span className="text-[#181C32]">
                {heroLevel.currentInLevel} / {heroLevel.neededForNext} XP{' '}
                {medium === 'hi' ? 'अगले लेवल हेतु' : 'to Next Level'}
              </span>
              <span className="text-[#2563EB]">{heroLevel.progressPercent}%</span>
            </div>
            <div className="h-3.5 w-full bg-slate-200 rounded-full border-2 border-[#181C32] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, heroLevel.progressPercent)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-[#10B981] comic-progress-fill"
              />
            </div>
          </div>

          {/* 3 Compact Arcade Stat Counters */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-[#FFFBEB] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'स्ट्रीक' : 'Streak'}</span>
              </p>
              <p className="font-mono text-base font-extrabold text-[#181C32] tabular-nums">
                {adventurer.dailyStreak}d
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#EFF6FF] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 inline-flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'अध्याय' : 'Cleared'}</span>
              </p>
              <p className="font-mono text-base font-extrabold text-[#181C32] tabular-nums">
                {clearedGradeNodes}/{totalGradeNodes}
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#FFF1F2] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 inline-flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#E11D48]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'मुहरें' : 'Seals'}</span>
              </p>
              <p className="font-mono text-base font-extrabold text-[#181C32] tabular-nums">
                {gradeBossSeals}/5
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Class 10th vs 12th Arcade Mode Switcher */}
      <section aria-label="Select board class" className="grid grid-cols-2 gap-3">
        {(['10', '12'] as GradeLevel[]).map((g) => {
          const active = grade === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
              className={`min-h-[52px] px-4 py-2.5 rounded-2xl comic-btn comic-gloss flex flex-col items-center justify-center text-center ${
                active ? 'bg-[#FACC15] text-[#181C32]' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="font-display text-base sm:text-lg font-bold leading-none">
                {medium === 'hi' ? `कक्षा ${g}वीं` : `Class ${g}th`}
              </span>
              <span className="text-[10px] font-bold opacity-80 mt-1">
                {medium === 'hi' ? 'MP बोर्ड NCERT' : 'MP Board NCERT'}
              </span>
            </button>
          );
        })}
      </section>

      {/* 3. Swipable Stage / Subject Quest Deck */}
      <section aria-labelledby="subject-deck-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 id="subject-deck-heading" className="font-display text-lg sm:text-xl font-bold text-[#181C32]">
              {medium === 'hi'
                ? `कक्षा ${grade}वीं विषय मिशन (स्वाइप करें)`
                : `Class ${grade}th Quest Stages`}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {medium === 'hi'
                ? 'कार्ड स्वाइप करें और किसी भी विषय में प्रवेश करें'
                : 'Swipe stage cards or tap Play to battle chapter bosses'}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#2563EB] md:hidden">
            {medium === 'hi' ? '← स्वाइप →' : '← Swipe →'}
          </span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3.5 pb-3 no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-5 md:overflow-visible">
          {SUBJECT_REALMS.map((realm, idx) => {
            const palette = SUBJECT_PALETTE[realm.id];
            const chNodes = getChapterNodesForSubject(grade, realm.id);
            const clearedCount = chNodes.filter(
              (n) => (adventurer.clearedStages[n.id] ?? 0) > 0
            ).length;
            const bossDone = adventurer.bossesDefeated.includes(`${grade}-${realm.id}`);
            const pct = chNodes.length > 0 ? Math.round((clearedCount / chNodes.length) * 100) : 0;

            return (
              <motion.article
                key={realm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="w-[78vw] max-w-[270px] md:w-auto md:max-w-none shrink-0 snap-center comic-card rounded-3xl overflow-hidden flex flex-col justify-between bg-white"
              >
                <div className={`${palette.headerBg} comic-gloss border-b-[2.5px] border-[#181C32] p-4 space-y-2`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-mono font-extrabold uppercase ${palette.tagText}`}>
                      STAGE {idx + 1}
                    </span>
                    {bossDone && (
                      <Crown className="w-4 h-4 text-[#D97706]" aria-label="Boss Seal Earned" />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-bold text-[#181C32]">
                      {realm.name[medium]}
                    </h3>
                    <SubjectDiagram subjectId={realm.id} className="w-16 h-12 shrink-0" />
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-3.5">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#181C32] line-clamp-2">
                      {grade === '10' ? realm.ncertBooks10[medium] : realm.ncertBooks12[medium]}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 tabular-nums">
                        <span>
                          {clearedCount}/{chNodes.length} {medium === 'hi' ? 'अध्याय' : 'Ch.'}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full border border-[#181C32] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(4, pct)}%` }}
                          transition={{ duration: 0.45, ease: 'easeOut' }}
                          className={`h-full ${palette.cardAccent} comic-progress-fill`}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenSubjectMap(realm.id)}
                    className="w-full min-h-[44px] px-3 py-2 text-xs font-extrabold text-[#181C32] bg-[#FACC15] hover:bg-[#FDE047] rounded-xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>{medium === 'hi' ? 'क्वेस्ट खेलें' : 'PLAY QUEST'}</span>
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Grand Boss Raid + Quick Practice & Multiplayer Actions */}
      <section aria-label="Featured boss raid and quick modes" className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 comic-card rounded-3xl bg-[#181C32] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-mono font-extrabold text-[#FACC15]">
              {medium === 'hi' ? '10-प्रहार महाबॉस चुनौती' : '10-STRIKE GRAND BOSS RAID'}
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
              {medium === 'hi'
                ? `कक्षा ${grade}वीं MP बोर्ड महासम्राट`
                : `Class ${grade}th Citadel Sovereign`}
            </h2>
            <p className="text-xs font-medium text-slate-300">
              {grandBossCleared
                ? medium === 'hi'
                  ? 'महाबॉस पराजित! रीमैच जीतकर बोनस XP अर्जित करें।'
                  : 'Citadel Sovereign defeated! Rematch for bonus XP.'
                : grandBossUnlocked
                  ? medium === 'hi'
                    ? 'अनलॉक हो चुका! 2023–2027 PYQ व IMP युद्ध लड़ें।'
                    : 'Unlocked! Test all 5 NCERT subjects in one epic raid.'
                  : medium === 'hi'
                    ? 'कोई 1 विषय बॉस मुहर जीतकर इसे अनलॉक करें (या अभी अभ्यास करें)!'
                    : 'Clear any 1 Subject Boss Seal to unlock — or test your skill!'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartGrandBoss(grade)}
            className="min-h-[48px] px-5 py-3 text-sm font-extrabold text-[#181C32] bg-[#FB7185] hover:bg-[#FDA4AF] rounded-2xl comic-btn comic-gloss inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap"
          >
            <Swords className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'महाबॉस युद्ध' : 'BOSS RAID'}</span>
          </button>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onOpenSubjectMap('chemistry')}
            className="min-h-[96px] p-4 rounded-3xl bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#181C32] comic-card comic-gloss flex flex-col justify-between text-left active:translate-y-[2px] transition-transform"
          >
            <div className="flex items-center justify-between w-full">
              <FlaskConical className="w-6 h-6 text-[#065F46]" aria-hidden="true" />
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">
                {medium === 'hi' ? 'केमिस्ट्री बीकर लैब' : 'Beaker Lab'}
              </p>
              <p className="text-[11px] font-bold text-[#065F46]">+30 XP / Reaction</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenMultiplayer}
            className="min-h-[96px] p-4 rounded-3xl bg-[#BAE6FD] hover:bg-[#7DD3FC] text-[#181C32] comic-card comic-gloss flex flex-col justify-between text-left active:translate-y-[2px] transition-transform"
          >
            <div className="flex items-center justify-between w-full">
              <Users className="w-6 h-6 text-[#075985]" aria-hidden="true" />
              <span className="font-mono text-[11px] font-extrabold text-[#075985]">
                {onlineCount} LIVE
              </span>
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">
                {medium === 'hi' ? 'लाइव द्वंद्व व स्क्वाड' : 'Quiz Duels'}
              </p>
              <p className="text-[11px] font-bold text-[#075985]">
                {medium === 'hi' ? 'दोस्तों से भिड़ें' : '1v1 & Squads'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenPractice}
            className="col-span-2 min-h-[54px] px-4 py-3 rounded-2xl bg-white hover:bg-[#F8FAFF] text-[#181C32] comic-btn-sm flex items-center justify-between gap-2"
          >
            <span className="text-xs sm:text-sm font-extrabold">
              {medium === 'hi'
                ? 'त्वरित अभ्यास डोजो (Kamre Mein Band Apahij, Ras, Alankar नोट्स)'
                : 'Quick Practice Dojo · NCERT Notes & 2027 Tricky Drills'}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
