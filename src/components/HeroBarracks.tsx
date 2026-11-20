import { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Crown,
  Flame,
  LogOut,
  Music,
  Shield,
  Swords,
  Trash2,
  Trophy,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AVATARS, SUBJECT_REALMS, getHeroLevelFromXP } from '../data/questConfig';
import { AdventurerState, AvatarId, EncounterResult, GradeLevel, Medium } from '../types/quiz';
import { processCustomAvatarFile } from '../utils/imageUpload';
import { SafeImage } from './SafeImage';

interface HeroBarracksProps {
  adventurer: AdventurerState;
  medium: Medium;
  onUpdateProfile: (updates: { heroName: string; bioTitle: string }) => void;
  onSelectAvatar: (avatarId: AvatarId) => void;
  onUpdateCustomAvatar: (dataUrl: string | null) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onInspectResult: (result: EncounterResult) => void;
  onResetAll: () => void;
  onSwitchHero: () => void;
  onBackToMap: () => void;
}

export function HeroBarracks({
  adventurer,
  medium,
  onUpdateProfile,
  onSelectAvatar,
  onUpdateCustomAvatar,
  onToggleSound,
  onToggleMusic,
  onInspectResult,
  onResetAll,
  onSwitchHero,
  onBackToMap,
}: HeroBarracksProps) {
  const [nameInput, setNameInput] = useState(adventurer.heroName);
  const [bioInput, setBioInput] = useState(adventurer.bioTitle);
  const [savedNotice, setSavedNotice] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const heroLevel = getHeroLevelFromXP(adventurer.totalXP);
  const activeAvatar = AVATARS.find((a) => a.id === adventurer.avatarId) ?? AVATARS[0];
  const portraitSrc = adventurer.customAvatarUrl || activeAvatar.imagePath;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = nameInput.trim() || 'Player 1';
    const cleanedBio = bioInput.trim() || 'MP Board Challenger';
    setNameInput(cleanedName);
    setBioInput(cleanedBio);
    onUpdateProfile({ heroName: cleanedName, bioTitle: cleanedBio });
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    try {
      const processed = await processCustomAvatarFile(file);
      onUpdateCustomAvatar(processed);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Unable to upload photo.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToMap}
          className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#181C32] bg-white rounded-xl comic-btn-sm"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{medium === 'hi' ? 'क्वेस्ट हब' : 'Quest Hub'}</span>
        </button>

        <button
          type="button"
          onClick={onSwitchHero}
          className="min-h-[42px] px-3.5 py-2 text-xs font-extrabold bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] rounded-xl comic-btn-sm inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{medium === 'hi' ? 'खाता बदलें / OTP' : 'Switch Account'}</span>
        </button>
      </div>

      {/* Vibrant 2D Hero Passcard & Profile Editor */}
      <section className="comic-card comic-xp-glow rounded-3xl overflow-hidden bg-white">
        <div className="comic-banner-blue comic-gloss border-b-[2.5px] border-[#181C32] p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-extrabold text-[#FEF08A] mb-3">
            <span>
              {medium === 'hi'
                ? `बोर्ड क्वेस्ट प्रोफ़ाइल · Lv.${heroLevel.level}`
                : `BOARD QUEST PROFILE · LV.${heroLevel.level}`}
            </span>
            <span>{heroLevel.title[medium]}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-[3px] border-[#181C32] shadow-[0_4px_0_#181C32] bg-[#FACC15]">
                <SafeImage
                  src={portraitSrc}
                  alt={adventurer.heroName}
                  className="w-full h-full object-cover"
                  fallbackTitle={adventurer.heroName}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Upload custom picture"
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1 w-full space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white truncate leading-tight">
                {adventurer.heroName}
              </h1>
              <p className="text-xs font-semibold text-[#DBEAFE] truncate">
                {adventurer.bioTitle} · {activeAvatar.title[medium]}
              </p>

              {/* Level XP Progress Bar */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#FEF08A] tabular-nums">
                  <span>
                    {heroLevel.currentInLevel} / {heroLevel.neededForNext} XP
                  </span>
                  <span>{heroLevel.progressPercent}%</span>
                </div>
                <div className="h-3 w-full bg-[#181C32]/45 rounded-full border-2 border-[#181C32] overflow-hidden">
                  <div
                    className="h-full bg-[#34D399] comic-progress-fill"
                    style={{ width: `${Math.max(5, heroLevel.progressPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <form onSubmit={handleSaveProfile} className="lg:col-span-6 space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB]">
              {medium === 'hi' ? 'खिलाड़ी पहचान संपादित करें' : 'Edit Player Card'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                maxLength={24}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={medium === 'hi' ? 'अपना नाम' : 'Hero name'}
                aria-label="Hero name"
                className="min-h-[42px] px-3 py-1.5 text-xs font-bold rounded-xl comic-input"
              />
              <input
                type="text"
                maxLength={48}
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder={medium === 'hi' ? 'उपाधि' : 'Title'}
                aria-label="Hero bio title"
                className="min-h-[42px] px-3 py-1.5 text-xs font-bold rounded-xl comic-input"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                type="submit"
                className="min-h-[42px] px-4 py-1.5 text-xs font-extrabold bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] rounded-xl comic-btn-sm comic-gloss"
              >
                {savedNotice
                  ? medium === 'hi'
                    ? 'सहेजा गया!'
                    : 'Saved!'
                  : medium === 'hi'
                    ? 'प्रोफ़ाइल सहेजें'
                    : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[42px] px-3.5 py-1.5 text-xs font-extrabold text-[#2563EB] bg-[#EFF6FF] rounded-xl comic-btn-sm inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{medium === 'hi' ? 'फ़ोटो बदलें' : 'Photo'}</span>
              </button>
              {adventurer.customAvatarUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateCustomAvatar(null)}
                  className="text-xs font-bold text-[#E11D48] underline px-1"
                >
                  {medium === 'hi' ? 'फ़ोटो हटाएँ' : 'Remove'}
                </button>
              )}
            </div>
            {uploadError && <p className="text-xs font-bold text-[#E11D48]">{uploadError}</p>}
          </form>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#FFFBEB] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-[#D97706]" aria-hidden="true" />
                <span>Total XP</span>
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#181C32] tabular-nums">
                {adventurer.totalXP.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF7ED] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EA580C]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'स्ट्रीक' : 'Streak'}</span>
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#181C32] tabular-nums">
                {adventurer.dailyStreak}d
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-[#059669]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'बॉस' : 'Bosses'}</span>
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#181C32] tabular-nums">
                {adventurer.bossesDefeated.length}/12
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#EFF6FF] border-2 border-[#181C32]">
              <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'द्वंद्व' : 'Duels'}</span>
              </p>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#181C32] tabular-nums">
                {adventurer.duelWins}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Arcade Settings & Audio Console (Menus / Settings Back Screen) */}
      <section aria-labelledby="arcade-settings-heading" className="comic-card rounded-3xl overflow-hidden bg-white">
        <div className="comic-banner-dark comic-gloss border-b-[2.5px] border-[#181C32] px-4 sm:px-5 py-3 flex items-center justify-between gap-2 text-white">
          <h2 id="arcade-settings-heading" className="font-display text-base sm:text-lg font-bold text-[#FACC15]">
            {medium === 'hi' ? 'गेम सेटिंग्स व ऑडियो कंट्रोल' : 'Arcade Settings & Audio Console'}
          </h2>
          <span className="text-[11px] font-mono font-bold text-slate-300">
            {medium === 'hi' ? 'बोर्ड क्वेस्ट मेनू' : 'MENU CONTROLS'}
          </span>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onToggleMusic}
            className={`min-h-[60px] p-3.5 rounded-2xl text-left comic-btn-sm comic-gloss flex items-center justify-between gap-3 ${
              adventurer.musicEnabled ? 'bg-[#FEF08A] text-[#181C32]' : 'bg-[#F8FAFF] text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#181C32] flex items-center justify-center shrink-0">
                <Music className="w-5 h-5 text-[#181C32]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm truncate">
                  {medium === 'hi' ? 'बैकग्राउंड म्यूज़िक' : 'Arcade Music'}
                </p>
                <p className="text-[11px] font-bold opacity-75">
                  {adventurer.musicEnabled
                    ? medium === 'hi'
                      ? 'चालू (High Energy)'
                      : 'ON (High Energy)'
                    : medium === 'hi'
                      ? 'बंद'
                      : 'MUTED'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-extrabold px-2 py-1 rounded-lg bg-white border-2 border-[#181C32] shrink-0">
              {adventurer.musicEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className={`min-h-[60px] p-3.5 rounded-2xl text-left comic-btn-sm comic-gloss flex items-center justify-between gap-3 ${
              adventurer.soundEnabled ? 'bg-[#D1FAE5] text-[#181C32]' : 'bg-[#F8FAFF] text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#181C32] flex items-center justify-center shrink-0">
                {adventurer.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#059669]" aria-hidden="true" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm truncate">
                  {medium === 'hi' ? 'युद्ध साउंड (SFX)' : 'Combat SFX'}
                </p>
                <p className="text-[11px] font-bold opacity-75">
                  {adventurer.soundEnabled
                    ? medium === 'hi'
                      ? 'तलवार व टाइमर ध्वनि चालू'
                      : 'Sword & Timer FX ON'
                    : medium === 'hi'
                      ? 'बंद'
                      : 'MUTED'}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-extrabold px-2 py-1 rounded-lg bg-white border-2 border-[#181C32] shrink-0">
              {adventurer.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={onSwitchHero}
            className="min-h-[60px] p-3.5 rounded-2xl text-left bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#181C32] comic-btn-sm comic-gloss flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white border-2 border-[#181C32] flex items-center justify-center shrink-0">
                <LogOut className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-sm truncate">
                  {medium === 'hi' ? 'लॉगिन / प्रोफ़ाइल बदलें' : 'Switch Account'}
                </p>
                <p className="text-[11px] font-bold text-slate-600 truncate">
                  {medium === 'hi' ? 'OTP गेट स्क्रीन खोलें' : 'Return to OTP Gate'}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2563EB] shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Avatar Class Selector */}
      <section aria-labelledby="avatar-select-heading" className="space-y-3">
        <h2 id="avatar-select-heading" className="font-display text-xl font-bold text-[#181C32]">
          {medium === 'hi' ? 'अपना अवतार चुनें' : 'Select Hero Avatar'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {AVATARS.map((av) => {
            const isSelected = av.id === adventurer.avatarId;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => onSelectAvatar(av.id)}
                className={`text-left p-4 rounded-3xl flex items-center gap-3.5 comic-btn-sm comic-gloss ${
                  isSelected ? 'bg-[#FEF08A]' : 'bg-white'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#181C32] shrink-0">
                  <SafeImage
                    src={av.imagePath}
                    alt={av.name[medium]}
                    className="w-full h-full object-cover"
                    fallbackTitle={av.name[medium]}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display font-bold text-[#181C32] text-sm sm:text-base truncate">
                      {av.name[medium]}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-[#2563EB] truncate">{av.title[medium]}</p>
                  <p className="text-xs font-medium text-slate-600 line-clamp-2">{av.perk[medium]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Boss Trophy Seals */}
      <section aria-labelledby="trophy-hall-heading" className="space-y-3">
        <h2 id="trophy-hall-heading" className="font-display text-xl font-bold text-[#181C32]">
          {medium === 'hi' ? 'बॉस विजय मुहरें' : 'Boss Trophy Seals'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(['10', '12'] as GradeLevel[]).map((g) => (
            <div key={g} className="comic-card rounded-3xl overflow-hidden bg-white">
              <div
                className={`px-4 sm:px-5 py-3 border-b-[2.5px] border-[#181C32] comic-gloss flex items-center justify-between ${
                  g === '10' ? 'bg-[#EFF6FF]' : 'bg-[#FFF1F2]'
                }`}
              >
                <h3
                  className={`font-display text-base sm:text-lg font-bold ${
                    g === '10' ? 'text-[#1D4ED8]' : 'text-[#E11D48]'
                  }`}
                >
                  {medium === 'hi' ? `कक्षा ${g}वीं मुहरें` : `Class ${g}th Boss Seals`}
                </h3>
                <span className="font-mono text-xs font-extrabold text-[#181C32] tabular-nums">
                  {SUBJECT_REALMS.filter((r) => adventurer.bossesDefeated.includes(`${g}-${r.id}`)).length}/5
                </span>
              </div>

              <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUBJECT_REALMS.map((realm) => {
                  const defeated = adventurer.bossesDefeated.includes(`${g}-${realm.id}`);
                  const bossName =
                    g === '10' ? realm.bossTitle10[medium] : realm.bossTitle12[medium];

                  return (
                    <div
                      key={`${g}-${realm.id}`}
                      className={`p-3 rounded-2xl border-2 border-[#181C32] flex items-center justify-between gap-2 ${
                        defeated ? 'bg-[#D1FAE5]' : 'bg-[#F8FAFF]'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-[#181C32] truncate">
                          {realm.name[medium]}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-600 truncate">
                          {bossName}
                        </p>
                      </div>
                      {defeated ? (
                        <Crown className="w-5 h-5 text-[#D97706] shrink-0" aria-hidden="true" />
                      ) : (
                        <Shield className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile-Friendly Battle History Cards */}
      <section aria-labelledby="battle-log-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="battle-log-heading" className="font-display text-xl font-bold text-[#181C32]">
            {medium === 'hi' ? 'हाल के युद्ध परिणाम' : 'Recent Battles'}
          </h2>

          {adventurer.history.length > 0 && (
            <div>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="min-h-[38px] inline-flex items-center gap-1 px-3 py-1.5 text-xs font-extrabold text-[#E11D48] bg-[#FFF1F2] rounded-xl comic-btn-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{medium === 'hi' ? 'प्रगति रीसेट' : 'Reset Progress'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 p-1.5 bg-[#FFF1F2] border-2 border-[#E11D48] rounded-xl">
                  <span className="text-xs font-bold text-[#181C32] px-1">
                    {medium === 'hi' ? 'मिटाएँ?' : 'Confirm reset?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setConfirmReset(false);
                    }}
                    className="px-2.5 py-1 text-xs font-extrabold text-white bg-[#E11D48] rounded-lg"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1 text-xs font-extrabold text-[#181C32] bg-white border border-[#181C32] rounded-lg"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {adventurer.history.length === 0 ? (
          <div className="comic-card rounded-3xl p-6 text-center bg-white">
            <p className="text-sm font-bold text-slate-600">
              {medium === 'hi'
                ? 'अभी कोई युद्ध नहीं खेला गया। क्वेस्ट टैब से पहला अध्याय खेलें!'
                : 'No battles yet. Jump into the Quests tab to battle Chapter 1!'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {adventurer.history.map((item) => (
              <div
                key={item.id}
                className="comic-card-sm rounded-2xl p-3.5 bg-white flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#181C32] truncate">{item.title[medium]}</p>
                  <p className="text-xs font-mono font-bold text-slate-600 tabular-nums">
                    <span className={item.victory ? 'text-[#059669]' : 'text-[#E11D48]'}>
                      {item.victory ? (medium === 'hi' ? 'विजय' : 'Win') : medium === 'hi' ? 'पराजय' : 'Loss'}
                    </span>{' '}
                    · {item.percentage}% ({item.correctCount}/{item.totalCount}) · +{item.totalXP} XP
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onInspectResult(item)}
                  className="min-h-[40px] px-3 py-1.5 text-xs font-extrabold bg-[#EFF6FF] text-[#1D4ED8] rounded-xl comic-btn-sm inline-flex items-center gap-1 shrink-0"
                >
                  <span>{medium === 'hi' ? 'देखें' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
