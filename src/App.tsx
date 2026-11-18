import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BattleArena } from './components/BattleArena';
import { ChapterQuestMapView } from './components/ChapterQuestMapView';
import { Footer } from './components/Footer';
import { GamifiedLoginView, LoginPayload } from './components/GamifiedLoginView';
import { ActiveView, Header } from './components/Header';
import { HeroBarracks } from './components/HeroBarracks';
import { MultiplayerArenaView, MultiplayerTab } from './components/MultiplayerArenaView';
import {
  PortalTransitionKind,
  PortalTransitionOverlay,
} from './components/PortalTransitionOverlay';
import { SubjectHubView } from './components/SubjectHubView';
import { VictoryReport } from './components/VictoryReport';
import {
  buildGrandBossQuestions,
  buildSubjectBossQuestions,
  getChapterNodeById,
  getChapterNodeQuestions,
  getChapterNodesForSubject,
  getSubjectRealm,
} from './data/mpboardIndex';
import { useMultiplayerSocket } from './hooks/useMultiplayerSocket';
import {
  ActiveEncounter,
  AdventurerState,
  AvatarId,
  EncounterResult,
  GradeLevel,
  Medium,
  SubjectId,
} from './types/quiz';
import { musicEngine } from './utils/musicEngine';
import { playPortalTransitionSound } from './utils/soundFx';

const STORAGE_KEY = 'vishal_quest_academy_v3';
const PREFS_KEY = 'vishal_quest_prefs_v3';
const SESSION_KEY = 'vishal_quest_session_active';

function makeDefaultHeroId(): string {
  return `hero-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

const DEFAULT_ADVENTURER: AdventurerState = {
  heroId: makeDefaultHeroId(),
  heroName: 'Vishal',
  passcode: 'MP2027',
  bioTitle: 'MP Board Merit Seeker',
  avatarId: 'arya-knight',
  customAvatarUrl: null,
  totalXP: 0,
  dailyStreak: 1,
  lastActiveDate: null,
  bestCombo: 0,
  duelWins: 0,
  soundEnabled: true,
  musicEnabled: true,
  clearedStages: {},
  bossesDefeated: [],
  history: [],
};

function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
}

function loadAdventurerState(): AdventurerState {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem('vishal_quest_academy_v2');
    if (!raw) return DEFAULT_ADVENTURER;
    const parsed = JSON.parse(raw) as Partial<AdventurerState>;
    const today = getLocalDateKey();
    const yesterday = getYesterdayDateKey();
    let streak = typeof parsed.dailyStreak === 'number' ? parsed.dailyStreak : 1;

    if (
      parsed.lastActiveDate &&
      parsed.lastActiveDate !== today &&
      parsed.lastActiveDate !== yesterday
    ) {
      streak = 1;
    }

    return {
      ...DEFAULT_ADVENTURER,
      ...parsed,
      heroId: parsed.heroId || makeDefaultHeroId(),
      passcode: parsed.passcode || 'MP2027',
      bioTitle: parsed.bioTitle || DEFAULT_ADVENTURER.bioTitle,
      customAvatarUrl: parsed.customAvatarUrl ?? null,
      duelWins: typeof parsed.duelWins === 'number' ? parsed.duelWins : 0,
      dailyStreak: Math.max(1, streak),
      musicEnabled: parsed.musicEnabled ?? true,
      clearedStages: parsed.clearedStages ?? {},
      bossesDefeated: Array.isArray(parsed.bossesDefeated) ? parsed.bossesDefeated : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return DEFAULT_ADVENTURER;
  }
}

function loadPreferences(): { grade: GradeLevel; medium: Medium; subjectId: SubjectId } {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return { grade: '12', medium: 'en', subjectId: 'hindi' };
    const parsed = JSON.parse(raw) as {
      grade?: GradeLevel;
      medium?: Medium;
      subjectId?: SubjectId;
    };
    return {
      grade: parsed.grade === '10' || parsed.grade === '12' ? parsed.grade : '12',
      medium: parsed.medium === 'hi' || parsed.medium === 'en' ? parsed.medium : 'en',
      subjectId:
        parsed.subjectId &&
        ['hindi', 'english', 'maths', 'physics', 'chemistry'].includes(parsed.subjectId)
          ? parsed.subjectId
          : 'hindi',
    };
  } catch {
    return { grade: '12', medium: 'en', subjectId: 'hindi' };
  }
}

function loadSessionEntered(initialHero: AdventurerState): boolean {
  try {
    return (
      window.sessionStorage.getItem(SESSION_KEY) === '1' &&
      Boolean(initialHero.mobileVerified && initialHero.mobileNumber)
    );
  } catch {
    return false;
  }
}

export default function App() {
  const initialPrefs = loadPreferences();
  const [grade, setGrade] = useState<GradeLevel>(initialPrefs.grade);
  const [medium, setMedium] = useState<Medium>(initialPrefs.medium);
  const [subjectId, setSubjectId] = useState<SubjectId>(initialPrefs.subjectId);
  const [adventurer, setAdventurer] = useState<AdventurerState>(loadAdventurerState);
  const [isEntered, setIsEntered] = useState<boolean>(() =>
    loadSessionEntered(loadAdventurerState())
  );
  const [activeView, setActiveView] = useState<ActiveView>('hub');
  const [multiplayerTab, setMultiplayerTab] = useState<MultiplayerTab>('duels');
  const [activeEncounter, setActiveEncounter] = useState<ActiveEncounter | null>(null);
  const [activeResult, setActiveResult] = useState<EncounterResult | null>(null);
  const [labDiscoveredReactions, setLabDiscoveredReactions] = useState<string[]>([]);
  const [portalTransition, setPortalTransition] = useState<{
    kind: PortalTransitionKind;
    subtitle?: string;
  } | null>(null);

  const commitTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const multiplayer = useMultiplayerSocket(adventurer.heroId, isEntered);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current !== null) window.clearTimeout(commitTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      musicEngine.stop();
    };
  }, []);

  // Start continuous copyright-safe royalty-free adventure BGM on first user interaction
  useEffect(() => {
    const unlockMusic = () => {
      musicEngine.start();
    };
    window.addEventListener('pointerdown', unlockMusic, { once: true });
    window.addEventListener('keydown', unlockMusic, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockMusic);
      window.removeEventListener('keydown', unlockMusic);
    };
  }, []);

  useEffect(() => {
    musicEngine.setMuted(!adventurer.musicEnabled);
  }, [adventurer.musicEnabled]);

  useEffect(() => {
    if (activeView === 'battle') {
      musicEngine.setMood('battle');
    } else if (activeView === 'multiplayer' && multiplayerTab === 'leaderboard') {
      musicEngine.setMood('leaderboard');
    } else {
      musicEngine.setMood('explore');
    }
  }, [activeView, multiplayerTab]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(adventurer));
    } catch {
      // Ignore storage quota errors
    }
  }, [adventurer]);

  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify({ grade, medium, subjectId }));
    } catch {
      // Ignore storage quota errors
    }
  }, [grade, medium, subjectId]);

  const syncProfileToServer = useCallback(
    async (nextState: AdventurerState, nextGrade: GradeLevel, nextMedium: Medium) => {
      try {
        const res = await fetch('/api/profile/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            heroId: nextState.heroId,
            heroName: nextState.heroName,
            passcode: nextState.passcode,
            bioTitle: nextState.bioTitle,
            grade: nextGrade,
            medium: nextMedium,
            avatarId: nextState.avatarId,
            customAvatarUrl: nextState.customAvatarUrl,
            totalXP: nextState.totalXP,
            dailyStreak: nextState.dailyStreak,
            bestCombo: nextState.bestCombo,
            duelWins: nextState.duelWins,
            clearedStages: nextState.clearedStages,
            bossesDefeated: nextState.bossesDefeated,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as {
            profile?: { duelWins?: number; totalXP?: number };
          };
          if (data.profile && typeof data.profile.duelWins === 'number') {
            setAdventurer((prev) => ({
              ...prev,
              duelWins: Math.max(prev.duelWins, data.profile!.duelWins!),
              totalXP: Math.max(prev.totalXP, data.profile!.totalXP ?? prev.totalXP),
            }));
          }
        }
      } catch {
        // Offline/dev reconnect tolerance
      }
    },
    []
  );

  // Sync profile back up when entering and after live multiplayer leaderboard updates
  useEffect(() => {
    if (!isEntered) return;
    syncProfileToServer(adventurer, grade, medium);
  }, [isEntered, grade, medium]);

  // Keep client duelWins & server-awarded duel XP aligned with live leaderboard broadcasts
  useEffect(() => {
    if (!isEntered) return;
    const selfRow = multiplayer.leaderboard.find((e) => e.heroId === adventurer.heroId);
    if (!selfRow) return;
    if (selfRow.duelWins > adventurer.duelWins || selfRow.totalXP > adventurer.totalXP) {
      setAdventurer((prev) => ({
        ...prev,
        duelWins: Math.max(prev.duelWins, selfRow.duelWins),
        totalXP: Math.max(prev.totalXP, selfRow.totalXP),
      }));
    }
  }, [adventurer.duelWins, adventurer.heroId, adventurer.totalXP, isEntered, multiplayer.leaderboard]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerPortalTransition = useCallback(
    (kind: PortalTransitionKind, commit: () => void, subtitle?: string) => {
      if (commitTimerRef.current !== null) window.clearTimeout(commitTimerRef.current);
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);

      playPortalTransitionSound(adventurer.soundEnabled);
      setPortalTransition({ kind, subtitle });

      const commitDelay = kind === 'leaderboard' ? 280 : 210;
      const hideDelay = kind === 'leaderboard' ? 560 : 410;

      commitTimerRef.current = window.setTimeout(() => {
        commit();
        scrollToTop();
      }, commitDelay);

      hideTimerRef.current = window.setTimeout(() => {
        setPortalTransition(null);
      }, hideDelay);
    },
    [adventurer.soundEnabled]
  );

  const handleEnterAcademy = async (payload: LoginPayload) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        heroId:
          payload.heroName.toLowerCase() === adventurer.heroName.toLowerCase() &&
          payload.passcode === adventurer.passcode
            ? adventurer.heroId
            : undefined,
        heroName: payload.heroName,
        passcode: payload.passcode,
        bioTitle: payload.bioTitle,
        mobileNumber: payload.mobileNumber,
        verificationToken: payload.verificationToken,
        grade: payload.grade,
        medium: payload.medium,
        avatarId: payload.avatarId,
        customAvatarUrl: payload.customAvatarUrl,
      }),
    });

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(
        errData.error || 'Mobile OTP verification could not be confirmed. Please retry.'
      );
    }

    const data = (await res.json()) as {
      profile: {
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
        bestCombo: number;
        duelWins: number;
        clearedStages: Record<string, number>;
        bossesDefeated: string[];
      };
    };

    const p = data.profile;
    const isSameHero = p.heroId === adventurer.heroId;
    const resolvedState: AdventurerState = {
      ...adventurer,
      heroId: p.heroId,
      heroName: p.heroName,
      passcode: p.passcode,
      bioTitle: p.bioTitle,
      mobileNumber: p.mobileNumber || payload.mobileNumber,
      mobileVerified: true,
      avatarId: p.avatarId,
      customAvatarUrl: p.customAvatarUrl,
      totalXP: isSameHero ? Math.max(adventurer.totalXP, p.totalXP) : p.totalXP,
      dailyStreak: isSameHero ? Math.max(adventurer.dailyStreak, p.dailyStreak) : p.dailyStreak,
      bestCombo: isSameHero ? Math.max(adventurer.bestCombo, p.bestCombo) : p.bestCombo,
      duelWins: Math.max(isSameHero ? adventurer.duelWins : 0, p.duelWins),
      clearedStages: isSameHero
        ? { ...p.clearedStages, ...adventurer.clearedStages }
        : p.clearedStages ?? {},
      bossesDefeated: isSameHero
        ? Array.from(new Set([...(p.bossesDefeated ?? []), ...adventurer.bossesDefeated]))
        : p.bossesDefeated ?? [],
      history: isSameHero ? adventurer.history : [],
    };

    setGrade(payload.grade);
    setMedium(payload.medium);
    setAdventurer(resolvedState);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore sessionStorage errors
    }
    setIsEntered(true);
    setActiveView('hub');
    scrollToTop();
  };

  const handleSwitchHero = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore
    }
    setIsEntered(false);
    scrollToTop();
  };

  const handleOpenSubjectMap = (targetSubject: SubjectId) => {
    const realm = getSubjectRealm(targetSubject);
    const portalKind: PortalTransitionKind =
      targetSubject === 'chemistry' ? 'chemistry-lab' : 'subject-map';
    triggerPortalTransition(
      portalKind,
      () => {
        setSubjectId(targetSubject);
        setActiveView('subject-map');
      },
      medium === 'hi'
        ? `कक्षा ${grade}वीं · ${realm.name.hi}`
        : `Class ${grade}th · ${realm.name.en}`
    );
  };

  const handleStartChapterNode = (nodeId: string) => {
    const node = getChapterNodeById(nodeId);
    if (!node) return;
    const realm = getSubjectRealm(node.subjectId);
    const questions = getChapterNodeQuestions(node);
    if (questions.length === 0) return;

    const subjectNodes = getChapterNodesForSubject(node.grade, node.subjectId);
    const nextNode = subjectNodes.find((n) => n.order === node.order + 1);

    const encounter: ActiveEncounter = {
      id: `${node.id}-${Date.now()}`,
      grade: node.grade,
      subjectId: node.subjectId,
      battleKind: 'chapter',
      chapterNodeId: node.id,
      chapterOrder: node.order,
      nextChapterNodeId: nextNode?.id,
      isBossBattle: true,
      title: {
        en: `${realm.name.en} · Ch. ${node.order}: ${node.title.en}`,
        hi: `${realm.name.hi} · अध्याय ${node.order}: ${node.title.hi}`,
      },
      subtitle: node.chapterCode,
      bossName: node.bossName,
      secondsPerQuestion: node.secondsPerQuestion,
      passThresholdPercent: 50,
      questions,
    };

    triggerPortalTransition(
      'battle',
      () => {
        setGrade(node.grade);
        setSubjectId(node.subjectId);
        setActiveEncounter(encounter);
        setActiveView('battle');
      },
      node.bossName[medium]
    );
  };

  const handleStartSubjectBoss = (targetGrade: GradeLevel, targetSubject: SubjectId) => {
    const realm = getSubjectRealm(targetSubject);
    const questions = buildSubjectBossQuestions(targetGrade, targetSubject);
    if (questions.length === 0) return;

    const bossTitle = targetGrade === '10' ? realm.bossTitle10 : realm.bossTitle12;

    const encounter: ActiveEncounter = {
      id: `${targetGrade}-${targetSubject}-boss-${Date.now()}`,
      grade: targetGrade,
      subjectId: targetSubject,
      battleKind: 'subject-boss',
      isBossBattle: true,
      title: {
        en: `${realm.name.en} · Subject Final Boss Assessment`,
        hi: `${realm.name.hi} · अंतिम विषय महाबॉस परीक्षा`,
      },
      subtitle: {
        en: '5-Chapter Combined Raid · PYQs 2023–2027 & Tricky Traps',
        hi: 'सभी 5 अध्यायों की संयुक्त परीक्षा · PYQ 2023–2027 व गूढ़ प्रश्न',
      },
      bossName: bossTitle,
      secondsPerQuestion: 30,
      passThresholdPercent: 60,
      questions,
    };

    triggerPortalTransition(
      'battle',
      () => {
        setGrade(targetGrade);
        setSubjectId(targetSubject);
        setActiveEncounter(encounter);
        setActiveView('battle');
      },
      bossTitle[medium]
    );
  };

  const handleStartGrandBoss = (targetGrade: GradeLevel) => {
    const questions = buildGrandBossQuestions(targetGrade);
    if (questions.length === 0) return;

    const encounter: ActiveEncounter = {
      id: `${targetGrade}-grand-boss-${Date.now()}`,
      grade: targetGrade,
      subjectId: 'grand-boss',
      battleKind: 'grand-boss',
      isBossBattle: true,
      title: {
        en: `Class ${targetGrade}th · 2027 MP Board Grand Boss`,
        hi: `कक्षा ${targetGrade}वीं · 2027 एमपी बोर्ड महाबॉस युद्ध`,
      },
      subtitle: {
        en: '10-Strike Citadel Raid · PYQs 2023–2027 & Conceptual Traps',
        hi: '10-प्रहार महायुद्ध · PYQ 2023–2027 व गूढ़ अवधारणाएँ',
      },
      bossName: {
        en: `MPBSE ${targetGrade}th Citadel Sovereign`,
        hi: `एमपी बोर्ड कक्षा ${targetGrade}वीं महासम्राट`,
      },
      secondsPerQuestion: 30,
      passThresholdPercent: 60,
      questions,
    };

    triggerPortalTransition(
      'battle',
      () => {
        setGrade(targetGrade);
        setActiveEncounter(encounter);
        setActiveView('battle');
      },
      encounter.bossName[medium]
    );
  };

  const handleLaunchFeaturedBoss = () => {
    const nodes = getChapterNodesForSubject(grade, subjectId);
    const nextChapter =
      nodes.find((n, idx) => {
        const prevCleared = idx === 0 || (adventurer.clearedStages[nodes[idx - 1].id] ?? 0) > 0;
        const selfCleared = (adventurer.clearedStages[n.id] ?? 0) > 0;
        return prevCleared && !selfCleared;
      }) ?? nodes[0];

    const lastNode = nodes[nodes.length - 1];
    const allCleared = lastNode && (adventurer.clearedStages[lastNode.id] ?? 0) > 0;

    if (allCleared) {
      handleStartSubjectBoss(grade, subjectId);
    } else if (nextChapter) {
      handleStartChapterNode(nextChapter.id);
    }
  };

  const handleCompleteEncounter = (result: EncounterResult) => {
    const today = getLocalDateKey();
    const yesterday = getYesterdayDateKey();

    setAdventurer((prev) => {
      let nextStreak = prev.dailyStreak;
      if (prev.lastActiveDate === yesterday) {
        nextStreak = prev.dailyStreak + 1;
      } else if (prev.lastActiveDate !== today) {
        nextStreak = 1;
      }

      const nextCleared = { ...prev.clearedStages };
      if (result.victory) {
        if (result.battleKind === 'chapter' && result.chapterNodeId) {
          nextCleared[result.chapterNodeId] = Math.max(
            nextCleared[result.chapterNodeId] ?? 0,
            result.stars
          );
        } else if (result.battleKind === 'subject-boss' && result.subjectId !== 'grand-boss') {
          const key = `${result.grade}-${result.subjectId}-boss`;
          nextCleared[key] = Math.max(nextCleared[key] ?? 0, result.stars);
        }
      }

      const nextBosses = [...prev.bossesDefeated];
      if (result.victory) {
        if (result.battleKind === 'subject-boss' && result.subjectId !== 'grand-boss') {
          const bossKey = `${result.grade}-${result.subjectId}`;
          if (!nextBosses.includes(bossKey)) nextBosses.push(bossKey);
        } else if (result.battleKind === 'grand-boss') {
          const grandKey = `${result.grade}-grand-boss`;
          if (!nextBosses.includes(grandKey)) nextBosses.push(grandKey);
        }
      }

      const updated: AdventurerState = {
        ...prev,
        totalXP: prev.totalXP + result.totalXP,
        dailyStreak: Math.max(1, nextStreak),
        lastActiveDate: today,
        bestCombo: Math.max(prev.bestCombo, result.maxStreak),
        clearedStages: nextCleared,
        bossesDefeated: nextBosses,
        history: [result, ...prev.history].slice(0, 30),
      };
      syncProfileToServer(updated, grade, medium);
      return updated;
    });

    setActiveResult(result);
    setActiveView('results');
    scrollToTop();
  };

  const handleReplayEncounter = () => {
    if (!activeResult) return;
    if (activeResult.battleKind === 'grand-boss') {
      handleStartGrandBoss(activeResult.grade);
    } else if (
      activeResult.battleKind === 'subject-boss' &&
      activeResult.subjectId !== 'grand-boss'
    ) {
      handleStartSubjectBoss(activeResult.grade, activeResult.subjectId);
    } else if (activeResult.chapterNodeId) {
      handleStartChapterNode(activeResult.chapterNodeId);
    }
  };

  const handleEnterNextChapter = () => {
    if (!activeResult || activeResult.subjectId === 'grand-boss') return;
    if (activeResult.nextChapterNodeId) {
      handleStartChapterNode(activeResult.nextChapterNodeId);
    } else if (activeResult.battleKind === 'chapter') {
      handleStartSubjectBoss(activeResult.grade, activeResult.subjectId);
    }
  };

  const handleBackFromBattleOrResults = () => {
    if (activeResult && activeResult.subjectId !== 'grand-boss') {
      setSubjectId(activeResult.subjectId);
      setGrade(activeResult.grade);
      setActiveView('subject-map');
    } else if (activeEncounter && activeEncounter.subjectId !== 'grand-boss') {
      setActiveView('subject-map');
    } else {
      setActiveView('hub');
    }
    scrollToTop();
  };

  const handleNavigate = (view: ActiveView) => {
    const portalKind: PortalTransitionKind =
      view === 'multiplayer'
        ? 'multiplayer'
        : view === 'barracks'
          ? 'barracks'
          : view === 'subject-map'
            ? 'subject-map'
            : 'hub';
    triggerPortalTransition(portalKind, () => {
      if (view === 'multiplayer') setMultiplayerTab('duels');
      setActiveView(view);
    });
  };

  const handleOpenLeaderboard = () => {
    triggerPortalTransition('leaderboard', () => {
      setMultiplayerTab('leaderboard');
      setActiveView('multiplayer');
    });
  };

  const handleOpenMultiplayer = () => {
    triggerPortalTransition('multiplayer', () => {
      setMultiplayerTab('duels');
      setActiveView('multiplayer');
    });
  };

  const handleJumpToGradeHub = (targetGrade: GradeLevel) => {
    triggerPortalTransition(
      'hub',
      () => {
        setGrade(targetGrade);
        setActiveView('hub');
      },
      medium === 'hi' ? `कक्षा ${targetGrade}वीं लोक` : `Class ${targetGrade}th Realm`
    );
  };

  const handleEarnLabXP = (reactionId: string, xp: number) => {
    if (labDiscoveredReactions.includes(reactionId)) return;
    setLabDiscoveredReactions((prev) => [...prev, reactionId]);
    setAdventurer((prev) => {
      const updated = { ...prev, totalXP: prev.totalXP + xp };
      syncProfileToServer(updated, grade, medium);
      return updated;
    });
  };

  const handleToggleSound = () => {
    setAdventurer((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleToggleMusic = () => {
    musicEngine.start();
    setAdventurer((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  };

  const handleUpdateProfile = (updates: { heroName: string; bioTitle: string }) => {
    setAdventurer((prev) => {
      const next = { ...prev, heroName: updates.heroName, bioTitle: updates.bioTitle };
      syncProfileToServer(next, grade, medium);
      return next;
    });
  };

  const handleSelectAvatar = (avatarId: AvatarId) => {
    setAdventurer((prev) => {
      const next = { ...prev, avatarId };
      syncProfileToServer(next, grade, medium);
      return next;
    });
  };

  const handleUpdateCustomAvatar = (dataUrl: string | null) => {
    setAdventurer((prev) => {
      const next = { ...prev, customAvatarUrl: dataUrl };
      syncProfileToServer(next, grade, medium);
      return next;
    });
  };

  const handleInspectResult = (res: EncounterResult) => {
    setActiveResult(res);
    setActiveView('results');
    scrollToTop();
  };

  const handleResetAll = () => {
    const fresh: AdventurerState = {
      ...DEFAULT_ADVENTURER,
      heroId: adventurer.heroId,
      heroName: adventurer.heroName,
      passcode: adventurer.passcode,
      bioTitle: adventurer.bioTitle,
      avatarId: adventurer.avatarId,
      customAvatarUrl: adventurer.customAvatarUrl,
    };
    setAdventurer(fresh);
    syncProfileToServer(fresh, grade, medium);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Ignore storage errors
    }
  };

  if (!isEntered) {
    return (
      <GamifiedLoginView
        initialName={adventurer.heroName}
        initialPasscode={adventurer.passcode}
        initialBioTitle={adventurer.bioTitle}
        initialMobileNumber={adventurer.mobileNumber || ''}
        initialGrade={grade}
        initialMedium={medium}
        initialAvatarId={adventurer.avatarId}
        initialCustomAvatarUrl={adventurer.customAvatarUrl}
        onMediumChange={setMedium}
        onEnterAcademy={handleEnterAcademy}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col adventure-bg text-slate-100">
      <PortalTransitionOverlay
        activePortal={portalTransition?.kind ?? null}
        medium={medium}
        subtitle={portalTransition?.subtitle}
      />

      <Header
        activeView={activeView}
        medium={medium}
        onNavigate={handleNavigate}
        onJumpToGradeHub={handleJumpToGradeHub}
        onLaunchFeaturedBoss={handleLaunchFeaturedBoss}
      />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeView}-${activeView === 'subject-map' ? subjectId : grade}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeView === 'battle' && activeEncounter ? (
              <BattleArena
                key={activeEncounter.id}
                encounter={activeEncounter}
                adventurer={adventurer}
                medium={medium}
                onMediumChange={setMedium}
                onToggleSound={handleToggleSound}
                onToggleMusic={handleToggleMusic}
                onComplete={handleCompleteEncounter}
                onExit={() =>
                  handleNavigate(
                    activeEncounter.subjectId === 'grand-boss' ? 'hub' : 'subject-map'
                  )
                }
              />
            ) : activeView === 'results' && activeResult ? (
              <VictoryReport
                result={activeResult}
                medium={medium}
                onMediumChange={setMedium}
                onReplay={handleReplayEncounter}
                onEnterNextChapter={handleEnterNextChapter}
                onBackToMap={handleBackFromBattleOrResults}
              />
            ) : activeView === 'multiplayer' ? (
              <MultiplayerArenaView
                adventurer={adventurer}
                grade={grade}
                medium={medium}
                initialTab={multiplayerTab}
                connected={multiplayer.connected}
                onlineCount={multiplayer.onlineCount}
                leaderboard={multiplayer.leaderboard}
                squads={multiplayer.squads}
                duels={multiplayer.duels}
                lastError={multiplayer.lastError}
                onClearError={multiplayer.clearError}
                onBackToHub={() => handleNavigate('hub')}
                onCreateSquad={multiplayer.createSquad}
                onJoinSquad={multiplayer.joinSquad}
                onLeaveSquad={multiplayer.leaveSquad}
                onSendSquadChat={multiplayer.sendSquadChat}
                onCreateDuel={multiplayer.createDuel}
                onJoinDuel={multiplayer.joinDuel}
                onStartDuel={multiplayer.startDuel}
                onAnswerDuel={multiplayer.answerDuel}
                onSendDuelTaunt={multiplayer.sendDuelTaunt}
                onLeaveDuel={multiplayer.leaveDuel}
              />
            ) : activeView === 'barracks' ? (
              <HeroBarracks
                adventurer={adventurer}
                medium={medium}
                onUpdateProfile={handleUpdateProfile}
                onSelectAvatar={handleSelectAvatar}
                onUpdateCustomAvatar={handleUpdateCustomAvatar}
                onToggleSound={handleToggleSound}
                onToggleMusic={handleToggleMusic}
                onInspectResult={handleInspectResult}
                onResetAll={handleResetAll}
                onSwitchHero={handleSwitchHero}
                onBackToMap={() => handleNavigate('hub')}
              />
            ) : activeView === 'subject-map' ? (
              <ChapterQuestMapView
                grade={grade}
                subjectId={subjectId}
                medium={medium}
                adventurer={adventurer}
                onMediumChange={setMedium}
                onBackToHub={() => handleNavigate('hub')}
                onSwitchSubject={(nextSub) => handleOpenSubjectMap(nextSub)}
                onStartChapterNode={handleStartChapterNode}
                onStartSubjectBoss={handleStartSubjectBoss}
                onEarnLabXP={handleEarnLabXP}
              />
            ) : (
              <SubjectHubView
                grade={grade}
                onGradeChange={setGrade}
                medium={medium}
                onMediumChange={setMedium}
                adventurer={adventurer}
                onlineCount={multiplayer.onlineCount}
                onToggleSound={handleToggleSound}
                onToggleMusic={handleToggleMusic}
                onOpenBarracks={() => handleNavigate('barracks')}
                onOpenMultiplayer={handleOpenMultiplayer}
                onOpenLeaderboard={handleOpenLeaderboard}
                onOpenSubjectMap={handleOpenSubjectMap}
                onStartGrandBoss={handleStartGrandBoss}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer
        medium={medium}
        onNavigate={handleNavigate}
        onJumpToGradeHub={handleJumpToGradeHub}
        onOpenLeaderboard={handleOpenLeaderboard}
      />
    </div>
  );
}
