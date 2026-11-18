export type GradeLevel = '10' | '12';

export type Medium = 'en' | 'hi';

export type SubjectId = 'hindi' | 'english' | 'maths' | 'physics' | 'chemistry';

export type QuestionSourceTag =
  | 'PYQ 2023'
  | 'PYQ 2024'
  | 'PYQ 2025'
  | 'PYQ 2026'
  | 'IMP 2027'
  | 'TRICKY 2027';

export type StageType = 'chapter1' | 'chapter2' | 'boss' | 'sanctum';

export type BattleKind = 'chapter' | 'subject-boss' | 'grand-boss';

export type AvatarId = 'arya-knight' | 'diya-alchemist' | 'kabir-sage';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface AvatarOption {
  id: AvatarId;
  name: BilingualText;
  title: BilingualText;
  perk: BilingualText;
  imagePath: string;
}

export interface MPQuestion {
  id: string;
  grade: GradeLevel;
  subjectId: SubjectId;
  stage: StageType;
  sourceTag: QuestionSourceTag;
  isTricky?: boolean;
  ncertChapter: BilingualText;
  topic: BilingualText;
  prompt: BilingualText;
  options: [BilingualText, BilingualText, BilingualText, BilingualText];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: BilingualText;
  hint?: BilingualText;
  points: number;
}

export interface TopicStudyNote {
  topicTitle: BilingualText;
  summary: BilingualText;
  keyPoints: BilingualText[];
  examTip?: BilingualText;
}

export interface ChapterNodeDefinition {
  id: string;
  grade: GradeLevel;
  subjectId: SubjectId;
  subsectionId: string;
  order: number;
  chapterCode: BilingualText;
  title: BilingualText;
  bossName: BilingualText;
  summaryPoints: BilingualText[];
  studyNotes?: TopicStudyNote[];
  questionIds: string[];
  secondsPerQuestion: number;
  baseXP: number;
  mapCoords: { x: number; y: number };
}

export interface StageDefinition {
  stage: StageType;
  order: number;
  isBoss: boolean;
  title: BilingualText;
  subtitle: BilingualText;
  ncertFocus: BilingualText;
  bossName?: BilingualText;
  secondsPerQuestion: number;
  baseXP: number;
  passThresholdPercent: number;
}

export interface SubjectRealm {
  id: SubjectId;
  name: BilingualText;
  realmName10: BilingualText;
  realmName12: BilingualText;
  ncertBooks10: BilingualText;
  ncertBooks12: BilingualText;
  bossTitle10: BilingualText;
  bossTitle12: BilingualText;
  mapCoords: { x: number; y: number };
}

export interface BookSubsection {
  id: string;
  label: BilingualText;
  description: BilingualText;
  chapterOrders: number[];
}

export interface ActiveEncounter {
  id: string;
  grade: GradeLevel;
  subjectId: SubjectId | 'grand-boss';
  battleKind: BattleKind;
  chapterNodeId?: string;
  chapterOrder?: number;
  nextChapterNodeId?: string;
  isBossBattle: boolean;
  title: BilingualText;
  subtitle: BilingualText;
  bossName: BilingualText;
  secondsPerQuestion: number;
  passThresholdPercent: number;
  questions: MPQuestion[];
}

export interface EncounterRecord {
  questionId: string;
  selectedIndex: number | undefined;
  isCorrect: boolean;
  timeTakenSeconds: number;
  xpEarned: number;
  damageDealt: number;
}

export interface EncounterResult {
  id: string;
  encounterId: string;
  grade: GradeLevel;
  subjectId: SubjectId | 'grand-boss';
  battleKind: BattleKind;
  chapterNodeId?: string;
  chapterOrder?: number;
  nextChapterNodeId?: string;
  isBossBattle: boolean;
  victory: boolean;
  title: BilingualText;
  bossName: BilingualText;
  completedAt: string;
  questions: MPQuestion[];
  records: EncounterRecord[];
  correctCount: number;
  totalCount: number;
  percentage: number;
  totalXP: number;
  maxStreak: number;
  stars: 0 | 1 | 2 | 3;
  playerHpRemaining: number;
  totalTimeSeconds: number;
}

export interface AdventurerState {
  heroId: string;
  heroName: string;
  passcode: string;
  bioTitle: string;
  mobileNumber?: string;
  mobileVerified?: boolean;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
  totalXP: number;
  dailyStreak: number;
  lastActiveDate: string | null;
  bestCombo: number;
  duelWins: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  clearedStages: Record<string, number>;
  bossesDefeated: string[];
  history: EncounterResult[];
}

export interface LeaderboardEntry {
  heroId: string;
  heroName: string;
  bioTitle: string;
  grade: GradeLevel;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
  totalXP: number;
  dailyStreak: number;
  bossesDefeatedCount: number;
  duelWins: number;
  isOnline: boolean;
  updatedAt: string;
}

export interface SquadMember {
  heroId: string;
  heroName: string;
  grade: GradeLevel;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
  totalXP: number;
  isOnline: boolean;
}

export interface SquadChatMessage {
  id: string;
  heroId: string;
  heroName: string;
  text: string;
  sentAt: string;
}

export interface StudySquad {
  id: string;
  code: string;
  name: string;
  grade: GradeLevel;
  focusSubject: SubjectId | 'all';
  leaderHeroId: string;
  squadXP: number;
  members: SquadMember[];
  messages: SquadChatMessage[];
  createdAt: string;
}

export interface DuelParticipant {
  heroId: string;
  heroName: string;
  avatarId: AvatarId;
  customAvatarUrl: string | null;
  hp: number;
  score: number;
  correctCount: number;
  streak: number;
  answeredCurrent: boolean;
  lastAnswerCorrect?: boolean;
}

export interface DuelTaunt {
  id: string;
  fromHeroId: string;
  fromHeroName: string;
  emoji: string;
  text: string;
  sentAt: string;
}

export interface DuelRoom {
  id: string;
  code: string;
  title: string;
  grade: GradeLevel;
  subjectId: SubjectId | 'all';
  hostHeroId: string;
  status: 'waiting' | 'active' | 'finished';
  currentRound: number;
  totalRounds: number;
  roundSecondsRemaining: number;
  currentQuestion: MPQuestion | null;
  participants: DuelParticipant[];
  winnerHeroId: string | null;
  taunts: DuelTaunt[];
}
