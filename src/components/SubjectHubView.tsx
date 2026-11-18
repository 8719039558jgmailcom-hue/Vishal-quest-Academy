import { useMemo } from 'react';
import {
  Crown,
  Flame,
  Languages,
  Music,
  Trophy,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { getChapterNodesForSubject } from '../data/mpboardIndex';
import { AVATARS, SUBJECT_REALMS, getHeroLevelFromXP } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { SafeImage } from './SafeImage';
import { WorldHub3DCanvas } from './WorldHub3DCanvas';

interface SubjectHubViewProps {
  grade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  medium: Medium;
  onMediumChange: (medium: Medium) => void;
  adventurer: AdventurerState;
  onlineCount: number;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenBarracks: () => void;
  onOpenMultiplayer: () => void;
  onOpenLeaderboard: () => void;
  onOpenSubjectMap: (subjectId: SubjectId) => void;
  onStartGrandBoss: (grade: GradeLevel) => void;
}

export function SubjectHubView({
  grade,
  onGradeChange,
  medium,
  onMediumChange,
  adventurer,
  onlineCount,
  onToggleSound,
  onToggleMusic,
  onOpenBarracks,
  onOpenMultiplayer,
  onOpenLeaderboard,
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
    <main className="w-full flex flex-col">
      {/* Slim Solid Hero Telemetry & Medium Control Ribbon above the 3D World */}
      <section
        aria-label="Hero Sanctuary Bar"
        className="w-full bg-[#0D1526] border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Custom Avatar + Unboxed Hero Stats */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onOpenBarracks}
              aria-label="Customize avatar and hero profile"
              className="w-10 h-10 rounded-lg overflow-hidden border border-amber-400 shrink-0 hover:opacity-90 transition-opacity"
            >
              <SafeImage
                src={portraitSrc}
                alt={adventurer.heroName}
                className="w-full h-full object-cover"
                fallbackTitle={adventurer.heroName}
              />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                <span className="font-display font-bold text-white truncate max-w-[160px]">
                  {adventurer.heroName}
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="text-amber-400 font-semibold whitespace-nowrap">
                  Lv.{heroLevel.level} {heroLevel.title[medium]}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-[11px] text-slate-400 tabular-nums flex-wrap">
                <span className="inline-flex items-center gap-1 text-slate-200 font-mono">
                  <Trophy className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  {adventurer.totalXP.toLocaleString()} XP
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1 text-slate-200 font-mono">
                  <Flame className="w-3 h-3 text-orange-400" aria-hidden="true" />
                  {adventurer.dailyStreak}d
                </span>
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="hidden sm:inline font-mono text-slate-300">
                  {medium === 'hi'
                    ? `${clearedGradeNodes}/${totalGradeNodes} अध्याय`
                    : `${clearedGradeNodes}/${totalGradeNodes} Chapters`}
                </span>
                <span className="text-slate-600 hidden md:inline" aria-hidden="true">
                  ·
                </span>
                <span className="hidden md:inline-flex items-center gap-1 font-mono text-amber-300">
                  <Crown className="w-3 h-3" aria-hidden="true" />
                  {gradeBossSeals}/5 {medium === 'hi' ? 'मुहरें' : 'Seals'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Medium Switcher + Music/SFX + Profile */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div
              role="group"
              aria-label="Language medium toggle"
              className="inline-flex items-center p-0.5 bg-[#09111F] rounded-lg border border-slate-700"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400 mx-1.5 hidden sm:inline" aria-hidden="true" />
              <button
                type="button"
                onClick={() => onMediumChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  medium === 'en'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onMediumChange('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  medium === 'hi'
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <button
              type="button"
              onClick={onToggleMusic}
              aria-label={adventurer.musicEnabled ? 'Mute background music' : 'Play background music'}
              title={adventurer.musicEnabled ? 'Music On' : 'Music Muted'}
              className={`w-8 h-8 rounded-lg border border-slate-700 bg-[#09111F] flex items-center justify-center ${
                adventurer.musicEnabled ? 'text-amber-400' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={onToggleSound}
              aria-label={adventurer.soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              className="w-8 h-8 rounded-lg border border-slate-700 bg-[#09111F] text-slate-300 hover:text-white flex items-center justify-center"
            >
              {adventurer.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenBarracks}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-200 bg-[#09111F] border border-slate-700 hover:border-amber-400 rounded-lg whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span className="hidden sm:inline">{medium === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Full-Bleed Interactive 3D Sanctuary Hub */}
      <WorldHub3DCanvas
        grade={grade}
        medium={medium}
        adventurer={adventurer}
        onlineCount={onlineCount}
        gradeBossSeals={gradeBossSeals}
        grandBossUnlocked={grandBossUnlocked}
        grandBossCleared={grandBossCleared}
        onGradeChange={onGradeChange}
        onOpenSubjectMap={onOpenSubjectMap}
        onStartGrandBoss={onStartGrandBoss}
        onOpenMultiplayer={onOpenMultiplayer}
        onOpenLeaderboard={onOpenLeaderboard}
        onOpenBarracks={onOpenBarracks}
      />
    </main>
  );
}
