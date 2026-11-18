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
  onUpdateProfile: (updates: {
    heroName: string;
    bioTitle: string;
  }) => void;
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
    const cleanedName = nameInput.trim() || 'Vishal';
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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{medium === 'hi' ? 'विषय हब पर लौटें' : 'Back to Subject Hubs'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleMusic}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg"
          >
            <Music
              className={`w-3.5 h-3.5 ${adventurer.musicEnabled ? 'text-amber-400' : 'text-slate-400'}`}
              aria-hidden="true"
            />
            <span>
              {adventurer.musicEnabled
                ? medium === 'hi'
                  ? 'संगीत चालू'
                  : 'Music On'
                : medium === 'hi'
                  ? 'संगीत बंद'
                  : 'Music Muted'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg"
          >
            {adventurer.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            )}
            <span>
              {adventurer.soundEnabled
                ? medium === 'hi'
                  ? 'ध्वनि चालू'
                  : 'Audio FX On'
                : medium === 'hi'
                  ? 'ध्वनि बंद'
                  : 'Audio FX Muted'}
            </span>
          </button>

          <button
            type="button"
            onClick={onSwitchHero}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-300 bg-slate-800 border border-slate-700 hover:border-sky-400 rounded-lg"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{medium === 'hi' ? 'नायक बदलें / लॉगिन' : 'Switch Hero / Login'}</span>
          </button>

          {adventurer.history.length > 0 && (
            <div>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{medium === 'hi' ? 'प्रगति रीसेट करें' : 'Reset Save'}</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 p-1 bg-red-950/80 border border-red-700 rounded-lg">
                  <span className="text-xs text-red-200 px-1.5">
                    {medium === 'hi' ? 'सभी डेटा मिटाएँ?' : 'Reset all XP & unlocks?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onResetAll();
                      setConfirmReset(false);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded"
                  >
                    {medium === 'hi' ? 'पुष्टि करें' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-200 bg-slate-800 rounded"
                  >
                    {medium === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hero Profile, Custom Picture Upload & Stats */}
      <section className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-amber-400/70 bg-[#0B1220]">
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
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center border-2 border-[#162033]"
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

          <div className="space-y-3 flex-1 min-w-0">
            <div>
              <p className="text-xs font-semibold text-amber-400">
                Level {heroLevel.level} · {heroLevel.title[medium]}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5 truncate">
                {adventurer.heroName}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {adventurer.bioTitle} · {activeAvatar.title[medium]}
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-2 max-w-sm">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={24}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={medium === 'hi' ? 'अपना नाम लिखें' : 'Hero name'}
                  aria-label="Hero name"
                  className="flex-1 min-w-0 px-3 py-1.5 text-xs font-medium bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  maxLength={48}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder={medium === 'hi' ? 'लक्ष्य / उपाधि' : 'Title / Motto'}
                  aria-label="Hero bio title"
                  className="flex-1 min-w-0 px-3 py-1.5 text-xs font-medium bg-[#0B1220] border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg whitespace-nowrap shrink-0"
                >
                  {savedNotice
                    ? medium === 'hi'
                      ? 'सहेजा'
                      : 'Saved'
                    : medium === 'hi'
                      ? 'सहेजें'
                      : 'Save'}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {medium === 'hi' ? 'कस्टम फोटो अपलोड करें' : 'Upload Custom Photo'}
                  </span>
                </button>
                {adventurer.customAvatarUrl && (
                  <button
                    type="button"
                    onClick={() => onUpdateCustomAvatar(null)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    {medium === 'hi' ? 'फोटो हटाएँ' : 'Remove Custom Photo'}
                  </button>
                )}
              </div>
              {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            </form>
          </div>
        </div>

        {/* 4 Stats */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Total XP</span>
            </p>
            <p className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
              {adventurer.totalXP.toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
              <span>{medium === 'hi' ? 'दैनिक स्ट्रीक' : 'Daily Streak'}</span>
            </p>
            <p className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
              {adventurer.dailyStreak}d
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{medium === 'hi' ? 'बॉस पराजित' : 'Bosses'}</span>
            </p>
            <p className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
              {adventurer.bossesDefeated.length} / 12
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
              <span>{medium === 'hi' ? 'द्वंद्व जीत' : 'Duel Wins'}</span>
            </p>
            <p className="mt-2 font-mono text-xl font-bold text-white tabular-nums">
              {adventurer.duelWins}
            </p>
          </div>
        </div>
      </section>

      {/* Avatar Selector */}
      <section aria-labelledby="avatar-select-heading" className="space-y-4">
        <div>
          <h2 id="avatar-select-heading" className="font-display text-2xl font-bold text-white">
            {medium === 'hi' ? 'अपना अवतार वर्ग चुनें' : 'Choose Your RPG Class'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {medium === 'hi'
              ? 'आपका चुना हुआ अवतार या कस्टम फोटो हर बॉस युद्ध व ग्लोबल रैंकिंग में दिखेगा।'
              : 'Your selected RPG avatar or uploaded picture represents you in Boss Battles and Multiplayer Duels.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AVATARS.map((av) => {
            const isSelected = av.id === adventurer.avatarId;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => onSelectAvatar(av.id)}
                className={`text-left p-5 rounded-xl border transition-colors flex items-center gap-4 ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400'
                    : 'bg-[#162033] border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-600 shrink-0">
                  <SafeImage
                    src={av.imagePath}
                    alt={av.name[medium]}
                    className="w-full h-full object-cover"
                    fallbackTitle={av.name[medium]}
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display font-bold text-white text-base truncate">
                      {av.name[medium]}
                    </p>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-amber-300">{av.title[medium]}</p>
                  <p className="text-xs text-slate-400">{av.perk[medium]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Boss Trophy Hall (Class 10 & Class 12) */}
      <section aria-labelledby="trophy-hall-heading" className="space-y-4">
        <h2 id="trophy-hall-heading" className="font-display text-2xl font-bold text-white">
          {medium === 'hi' ? 'बॉस विजय कक्ष (कक्षा 10 व 12)' : 'Boss Trophy Hall (Class 10th & 12th)'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['10', '12'] as GradeLevel[]).map((g) => (
            <div
              key={g}
              className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-4"
            >
              <h3 className="font-display text-lg font-bold text-amber-300">
                {medium === 'hi' ? `कक्षा ${g}वीं महाबॉस मुहरें` : `Class ${g}th Boss Seals`}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUBJECT_REALMS.map((realm) => {
                  const defeated = adventurer.bossesDefeated.includes(`${g}-${realm.id}`);
                  const bossName =
                    g === '10' ? realm.bossTitle10[medium] : realm.bossTitle12[medium];

                  return (
                    <div
                      key={`${g}-${realm.id}`}
                      className={`p-3.5 rounded-lg border flex items-center justify-between gap-3 ${
                        defeated
                          ? 'bg-emerald-950/40 border-emerald-700/60'
                          : 'bg-[#0F172A] border-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {realm.name[medium]}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{bossName}</p>
                      </div>
                      {defeated ? (
                        <Crown className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                      ) : (
                        <Shield className="w-5 h-5 text-slate-600 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Encounter Battle Log */}
      <section aria-labelledby="battle-log-heading" className="space-y-4">
        <h2 id="battle-log-heading" className="font-display text-2xl font-bold text-white">
          {medium === 'hi' ? 'युद्ध इतिहास लॉग' : 'Recent Quest & Boss Battles'}
        </h2>

        {adventurer.history.length === 0 ? (
          <div className="bg-[#162033] border border-slate-700/80 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-300">
              {medium === 'hi'
                ? 'अभी तक कोई युद्ध नहीं लड़ा गया है। अपने पहले अभियान के लिए क्वेस्ट मैप पर जाएँ।'
                : 'No battles recorded yet. Head to the Quest Map to start Chapter 1.'}
            </p>
          </div>
        ) : (
          <div className="bg-[#162033] border border-slate-700/80 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-[#0F172A] text-xs font-semibold text-slate-400">
                    <th className="py-3.5 px-5">{medium === 'hi' ? 'अभियान' : 'Encounter'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'परिणाम' : 'Outcome'}</th>
                    <th className="py-3.5 px-4">{medium === 'hi' ? 'सटीकता' : 'Accuracy'}</th>
                    <th className="py-3.5 px-4">XP</th>
                    <th className="py-3.5 px-5 text-right">{medium === 'hi' ? 'विवरण' : 'Report'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {adventurer.history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-5 font-medium text-white">
                        {item.title[medium]}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold">
                        {item.victory ? (
                          <span className="text-emerald-400">
                            {medium === 'hi' ? 'विजय' : 'Victory'}
                          </span>
                        ) : (
                          <span className="text-red-400">
                            {medium === 'hi' ? 'पराजय' : 'Defeated'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-200 tabular-nums">
                        {item.percentage}% ({item.correctCount}/{item.totalCount})
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-400 tabular-nums">
                        +{item.totalXP}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => onInspectResult(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                        >
                          <span>{medium === 'hi' ? 'देखें' : 'Inspect'}</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
