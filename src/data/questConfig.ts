import { AvatarOption, Medium, StageDefinition, SubjectRealm } from '../types/quiz';

export const AVATARS: AvatarOption[] = [
  {
    id: 'arya-knight',
    name: { en: 'Aarav · Compass Knight', hi: 'आरव · कम्पास नाइट' },
    title: { en: 'Navigator of NCERT Realms', hi: 'एनसीईआरटी लोक का मार्गदर्शक' },
    perk: { en: 'Sworn defender of Board Foundations', hi: 'बोर्ड आधार का रक्षक' },
    imagePath: '/src/assets/images/avatar_arya_knight_1794991568808.jpg',
  },
  {
    id: 'diya-alchemist',
    name: { en: 'Diya · Science Alchemist', hi: 'दीया · विज्ञान अल्केमिस्ट' },
    title: { en: 'Wielder of Elements & Optics', hi: 'तत्वों एवं प्रकाश की विशेषज्ञ' },
    perk: { en: 'Master of formulas and lab mysteries', hi: 'सूत्रों और प्रयोगों की ज्ञाता' },
    imagePath: '/src/assets/images/avatar_kabir_alchemist_1794991569693.jpg',
  },
  {
    id: 'kabir-sage',
    name: { en: 'Kabir · Logic Sage', hi: 'कबीर · तर्क ऋषि' },
    title: { en: 'Keeper of Proofs & Rhetoric', hi: 'प्रमेय और काव्य का साधक' },
    perk: { en: 'Unlocks hidden patterns under pressure', hi: 'समय के दबाव में सटीक समाधान' },
    imagePath: '/src/assets/images/avatar_tara_sage_1794991569264.jpg',
  },
];

export const BOSS_PORTRAIT = '/src/assets/images/boss_arena_guardian_1794991568921.jpg';
export const WORLD_MAP_BACKDROP = '/src/assets/images/quest_realm_backdrop_1794991568295.jpg';

export const SUBJECT_REALMS: SubjectRealm[] = [
  {
    id: 'hindi',
    name: { en: 'Hindi', hi: 'हिन्दी' },
    realmName10: { en: 'Kshitij Scrollwoods', hi: 'क्षितिज काव्य वन' },
    realmName12: { en: 'Aaroh Royal Archives', hi: 'आरोह राजकोष' },
    ncertBooks10: {
      en: 'New NCERT Kshitij-2, Kritika-2 & Vyakaran',
      hi: 'नई NCERT क्षितिज-2, कृतिका-2 एवं व्याकरण',
    },
    ncertBooks12: {
      en: 'New NCERT Aaroh-2, Vitan-2 & Abhivyakti',
      hi: 'नई NCERT आरोह-2, वितान-2 एवं अभिव्यक्ति',
    },
    bossTitle10: { en: 'Kavya Warden (Hindi Boss)', hi: 'काव्य प्रहरी (हिन्दी बॉस)' },
    bossTitle12: { en: 'Shabd Samrat (Hindi Boss)', hi: 'शब्द सम्राट (हिन्दी बॉस)' },
    mapCoords: { x: 14, y: 66 },
  },
  {
    id: 'english',
    name: { en: 'English', hi: 'अंग्रेज़ी' },
    realmName10: { en: 'First Flight Harbor', hi: 'फर्स्ट फ्लाइट बंदरगाह' },
    realmName12: { en: 'Flamingo High Library', hi: 'फ्लेमिंगो महाग्रंथालय' },
    ncertBooks10: {
      en: 'New NCERT First Flight, Footprints & Grammar',
      hi: 'नई NCERT फर्स्ट फ्लाइट, फुटप्रिंट्स व ग्रामर',
    },
    ncertBooks12: {
      en: 'New NCERT Flamingo, Vistas & Grammar',
      hi: 'नई NCERT फ्लेमिंगो, विस्टास व ग्रामर',
    },
    bossTitle10: { en: 'Grammar Sphinx (English Boss)', hi: 'ग्रामर स्फिंक्स (अंग्रेज़ी बॉस)' },
    bossTitle12: { en: 'Rhetoric Sovereign (English Boss)', hi: 'वाक् सम्राट (अंग्रेज़ी बॉस)' },
    mapCoords: { x: 31, y: 36 },
  },
  {
    id: 'maths',
    name: { en: 'Maths', hi: 'गणित' },
    realmName10: { en: 'Trigon Peaks', hi: 'त्रिकोणमिति शिखर' },
    realmName12: { en: 'Calculus Observatory', hi: 'कलन वेधशाला' },
    ncertBooks10: {
      en: 'New NCERT Maths Ch. 1–14 (Algebra, Trig & Stats)',
      hi: 'नई NCERT गणित अध्याय 1–14 (बीजगणित, त्रिकोणमिति)',
    },
    ncertBooks12: {
      en: 'New NCERT Maths Part I & II (Calculus & Vectors)',
      hi: 'नई NCERT गणित भाग 1 व 2 (कलन, आव्यूह, सदिश)',
    },
    bossTitle10: { en: 'Theorem Titan (Maths Boss)', hi: 'प्रमेय दानव (गणित बॉस)' },
    bossTitle12: { en: 'Integral Colossus (Maths Boss)', hi: 'समाकलन महारथी (गणित बॉस)' },
    mapCoords: { x: 52, y: 24 },
  },
  {
    id: 'physics',
    name: { en: 'Physics', hi: 'भौतिक विज्ञान' },
    realmName10: { en: 'Optics & Spark Bastion', hi: 'प्रकाश व विद्युत दुर्ग' },
    realmName12: { en: 'Electromagnetic Spire', hi: 'विद्युतचुंबकीय मीनार' },
    ncertBooks10: {
      en: 'New NCERT Science Physics (Light, Eye, Current)',
      hi: 'नई NCERT विज्ञान भौतिकी (प्रकाश, नेत्र, विद्युत)',
    },
    ncertBooks12: {
      en: 'New NCERT Physics Part I & II (Fields, Optics, Logic)',
      hi: 'नई NCERT भौतिकी भाग 1 व 2 (स्थिरवैद्युत, प्रकाशिकी)',
    },
    bossTitle10: { en: 'Ohm Sentinel (Physics Boss)', hi: 'ओम प्रहरी (भौतिक बॉस)' },
    bossTitle12: { en: 'Flux Overlord (Physics Boss)', hi: 'फ्लक्स अधिपति (भौतिक बॉस)' },
    mapCoords: { x: 64, y: 66 },
  },
  {
    id: 'chemistry',
    name: { en: 'Chemistry', hi: 'रसायन विज्ञान' },
    realmName10: { en: 'Alchemy Salt Forge', hi: 'लवण एवं कार्बन भट्टी' },
    realmName12: { en: 'Crystal Reaction Spire', hi: 'क्रिस्टल अभिक्रिया शिखर' },
    ncertBooks10: {
      en: 'New NCERT Science Chemistry (Reactions, Acids, Carbon)',
      hi: 'नई NCERT विज्ञान रसायन (अभिक्रिया, अम्ल, कार्बन)',
    },
    ncertBooks12: {
      en: 'New NCERT Chemistry Part I & II (Kinetics & Organic)',
      hi: 'नई NCERT रसायन भाग 1 व 2 (बलगतिकी व कार्बनिक)',
    },
    bossTitle10: { en: 'Carbon Forge Lord (Chem Boss)', hi: 'कार्बन स्वामी (रसायन बॉस)' },
    bossTitle12: { en: 'Catalyst Warden (Chem Boss)', hi: 'उत्प्रेरक रक्षक (रसायन बॉस)' },
    mapCoords: { x: 84, y: 42 },
  },
];

export const CHAPTER_STAGES: StageDefinition[] = [
  {
    stage: 'chapter1',
    order: 1,
    isBoss: false,
    title: {
      en: 'Area 1 · NCERT Chapter Quest I',
      hi: 'क्षेत्र 1 · NCERT अध्याय अभियान I',
    },
    subtitle: {
      en: 'Foundational Chapters · MP Board PYQs 2023–2024',
      hi: 'आधारभूत अध्याय · एमपी बोर्ड PYQ 2023–2024',
    },
    ncertFocus: {
      en: 'Score ≥ 50% to unlock Area 2',
      hi: 'क्षेत्र 2 खोलने के लिए ≥ 50% अंक लाएँ',
    },
    secondsPerQuestion: 45,
    baseXP: 100,
    passThresholdPercent: 50,
  },
  {
    stage: 'chapter2',
    order: 2,
    isBoss: false,
    title: {
      en: 'Area 2 · NCERT Chapter Quest II',
      hi: 'क्षेत्र 2 · NCERT अध्याय अभियान II',
    },
    subtitle: {
      en: 'Core Syllabus Chapters · MP Board PYQs 2025–2026',
      hi: 'मुख्य पाठ्यक्रम अध्याय · एमपी बोर्ड PYQ 2025–2026',
    },
    ncertFocus: {
      en: 'Score ≥ 50% to unlock the Boss Gate',
      hi: 'बॉस द्वार खोलने के लिए ≥ 50% अंक लाएँ',
    },
    secondsPerQuestion: 40,
    baseXP: 125,
    passThresholdPercent: 50,
  },
  {
    stage: 'boss',
    order: 3,
    isBoss: true,
    title: {
      en: 'Area 3 · Guardian Boss Battle',
      hi: 'क्षेत्र 3 · महाबॉस युद्ध (Boss Battle)',
    },
    subtitle: {
      en: 'Timed Boss Challenge · PYQs 2023–2026 & 2027 IMPs',
      hi: 'समय-सीमित बॉस चुनौती · 2023–2026 PYQ व 2027 IMP',
    },
    ncertFocus: {
      en: 'Defeat Boss (≥ 60%) to unlock Champion Sanctum',
      hi: 'चैम्पियन मंदिर खोलने के लिए बॉस को हराएँ (≥ 60%)',
    },
    secondsPerQuestion: 30,
    baseXP: 175,
    passThresholdPercent: 60,
  },
  {
    stage: 'sanctum',
    order: 4,
    isBoss: false,
    title: {
      en: 'Area 4 · 2027 Champion Sanctum',
      hi: 'क्षेत्र 4 · 2027 चैम्पियन शिखर',
    },
    subtitle: {
      en: 'Unlocked by defeating the Boss · Elite 2027 IMPs',
      hi: 'बॉस को हराने पर खुला · श्रेष्ठ 2027 संभावित प्रश्न',
    },
    ncertFocus: {
      en: 'High-reward 2027 Mastery Vault',
      hi: '2027 बोर्ड परीक्षा का उच्च XP खजाना',
    },
    secondsPerQuestion: 35,
    baseXP: 200,
    passThresholdPercent: 50,
  },
];

export interface HeroLevelInfo {
  level: number;
  title: { en: string; hi: string };
  currentInLevel: number;
  neededForNext: number;
  progressPercent: number;
}

export function getHeroLevelFromXP(xp: number): HeroLevelInfo {
  const step = 400;
  const level = Math.floor(xp / step) + 1;
  const currentInLevel = xp % step;
  const progressPercent = Math.round((currentInLevel / step) * 100);

  const titles = [
    { en: 'Novice Explorer', hi: 'नौसिखिया खोजी' },
    { en: 'Chapter Ranger', hi: 'अध्याय रक्षक' },
    { en: 'Board Challenger', hi: 'बोर्ड योद्धा' },
    { en: 'Realm Strategist', hi: 'लोक रणनीतिकार' },
    { en: 'Citadel Champion', hi: 'दुर्ग विजेता' },
    { en: 'MPBSE Grandmaster', hi: 'एमपी बोर्ड महानायक' },
  ];
  const title = titles[Math.min(level - 1, titles.length - 1)];

  return {
    level,
    title,
    currentInLevel,
    neededForNext: step,
    progressPercent,
  };
}
