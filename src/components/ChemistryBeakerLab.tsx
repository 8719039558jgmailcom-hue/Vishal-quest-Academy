import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Beaker,
  CheckCircle2,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Thermometer,
} from 'lucide-react';
import { GradeLevel, Medium } from '../types/quiz';
import { playBubbleMixSound, playStrikeSound } from '../utils/soundFx';

interface Reagent {
  id: string;
  formula: string;
  name: { en: string; hi: string };
  color: string;
  phImpact: number;
  stateLabel: { en: string; hi: string };
}

interface NcertReactionRecipe {
  id: string;
  grade: GradeLevel | 'both';
  reagents: [string, string];
  title: { en: string; hi: string };
  equation: string;
  resultColor: string;
  gas?: string;
  precipitate?: { color: string; label: string };
  phValue: number;
  tempC: number;
  observation: { en: string; hi: string };
}

const REAGENTS: Reagent[] = [
  {
    id: 'hcl',
    formula: 'HCl (aq)',
    name: { en: 'Hydrochloric Acid', hi: 'हाइड्रोक्लोरिक अम्ल' },
    color: '#38BDF8',
    phImpact: 1.5,
    stateLabel: { en: 'Strong Acid', hi: 'प्रबल अम्ल' },
  },
  {
    id: 'naoh',
    formula: 'NaOH (aq)',
    name: { en: 'Sodium Hydroxide', hi: 'सोडियम हाइड्रॉक्साइड' },
    color: '#A78BFA',
    phImpact: 13.0,
    stateLabel: { en: 'Strong Base', hi: 'प्रबल क्षार' },
  },
  {
    id: 'na2co3',
    formula: 'Na₂CO₃',
    name: { en: 'Sodium Carbonate', hi: 'सोडियम कार्बोनेट' },
    color: '#7DD3FC',
    phImpact: 11.2,
    stateLabel: { en: 'Carbonate Salt', hi: 'कार्बोनेट लवण' },
  },
  {
    id: 'cuso4',
    formula: 'CuSO₄',
    name: { en: 'Copper Sulphate', hi: 'कॉपर सल्फेट' },
    color: '#0284C7',
    phImpact: 5.5,
    stateLabel: { en: 'Blue Solution', hi: 'नीला विलयन' },
  },
  {
    id: 'fe',
    formula: 'Fe (s)',
    name: { en: 'Iron Filings', hi: 'लोहे की छीलन' },
    color: '#94A3B8',
    phImpact: 7.0,
    stateLabel: { en: 'Reactive Metal', hi: 'सक्रिय धातु' },
  },
  {
    id: 'bacl2',
    formula: 'BaCl₂',
    name: { en: 'Barium Chloride', hi: 'बेरियम क्लोराइड' },
    color: '#CBD5E1',
    phImpact: 7.0,
    stateLabel: { en: 'Clear Salt', hi: 'पारदर्शी लवण' },
  },
  {
    id: 'na2so4',
    formula: 'Na₂SO₄',
    name: { en: 'Sodium Sulphate', hi: 'सोडियम सल्फेट' },
    color: '#E2E8F0',
    phImpact: 7.0,
    stateLabel: { en: 'Sulphate Salt', hi: 'सल्फेट लवण' },
  },
  {
    id: 'agno3',
    formula: 'AgNO₃',
    name: { en: 'Silver Nitrate', hi: 'सिल्वर नाइट्रेट' },
    color: '#93C5FD',
    phImpact: 6.2,
    stateLabel: { en: 'Halide Tester', hi: 'हैलाइड अभिकर्मक' },
  },
  {
    id: 'kmno4',
    formula: 'KMnO₄',
    name: { en: 'Pot. Permanganate', hi: 'पोटैशियम परमैंगनेट' },
    color: '#C026D3',
    phImpact: 7.0,
    stateLabel: { en: 'Oxidizer', hi: 'ऑक्सीकारक' },
  },
];

const NCERT_REACTIONS: NcertReactionRecipe[] = [
  {
    id: 'double-disp',
    grade: '10',
    reagents: ['bacl2', 'na2so4'],
    title: {
      en: 'Double Displacement (BaSO₄ Precipitate)',
      hi: 'द्विविस्थापन अभिक्रिया (BaSO₄ अवक्षेप)',
    },
    equation: 'BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄↓ (White) + 2NaCl(aq)',
    resultColor: '#94A3B8',
    precipitate: { color: '#FFFFFF', label: 'BaSO₄↓ White Solid' },
    phValue: 7.0,
    tempC: 26,
    observation: {
      en: 'Instant white insoluble BaSO₄ precipitate settles at the beaker base — classic Class 10th Ch. 1 board reaction!',
      hi: 'सफेद अघुलनशील BaSO₄ का अवक्षेप तुरंत तली में बैठ जाता है — कक्षा 10वीं पाठ 1 की मुख्य बोर्ड अभिक्रिया!',
    },
  },
  {
    id: 'acid-carbonate',
    grade: '10',
    reagents: ['hcl', 'na2co3'],
    title: {
      en: 'Acid + Carbonate Brisk CO₂ Effervescence',
      hi: 'अम्ल + कार्बोनेट से CO₂ गैस बुदबुदाहट',
    },
    equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
    resultColor: '#38BDF8',
    gas: 'CO₂↑',
    phValue: 6.4,
    tempC: 31,
    observation: {
      en: 'Vigorous CO₂ gas bubbles fizz upward and turn lime water milky — key Class 10th Ch. 2 experiment!',
      hi: 'तेज़ बुदबुदाहट के साथ CO₂ गैस निकलती है जो चूने के पानी को दूधिया कर देती है!',
    },
  },
  {
    id: 'displacement-fe',
    grade: '10',
    reagents: ['cuso4', 'fe'],
    title: {
      en: 'Iron Displaces Copper (Blue → Pale Green)',
      hi: 'लोहे द्वारा कॉपर विस्थापन (नीला → हल्का हरा)',
    },
    equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu↓(s)',
    resultColor: '#34D399',
    precipitate: { color: '#D97706', label: 'Cu↓ Brown Deposit' },
    phValue: 6.1,
    tempC: 29,
    observation: {
      en: 'More reactive Iron displaces Copper: deep blue CuSO₄ fades to pale green FeSO₄ with brownish Cu coating!',
      hi: 'अधिक सक्रिय लोहा कॉपर को विस्थापित करता है: नीला विलयन हल्का हरा हो जाता है और भूरा Cu जमता है!',
    },
  },
  {
    id: 'neutralization',
    grade: 'both',
    reagents: ['hcl', 'naoh'],
    title: {
      en: 'Exothermic Neutralization (Salt + Water)',
      hi: 'ऊष्माक्षेपी उदासीनीकरण (लवण + जल)',
    },
    equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + Heat',
    resultColor: '#22D3EE',
    phValue: 7.0,
    tempC: 38,
    observation: {
      en: 'Strong acid and strong base neutralize cleanly to pH 7.0 while releasing heat (+13 °C rise)!',
      hi: 'प्रबल अम्ल व प्रबल क्षार परस्पर क्रिया कर pH 7.0 पर उदासीन हो जाते हैं और ऊष्मा निकलती है!',
    },
  },
  {
    id: 'silver-halide',
    grade: '12',
    reagents: ['agno3', 'bacl2'],
    title: {
      en: 'Silver Halide Test (Curdy White AgCl↓)',
      hi: 'सिल्वर हैलाइड परीक्षण (दही-जैसा सफेद AgCl↓)',
    },
    equation: '2AgNO₃(aq) + BaCl₂(aq) → 2AgCl↓ + Ba(NO₃)₂',
    resultColor: '#CBD5E1',
    precipitate: { color: '#FFFFFF', label: 'AgCl↓ Curdy White' },
    phValue: 6.8,
    tempC: 26,
    observation: {
      en: 'Chloride ions react immediately with Ag⁺ forming curdy white AgCl precipitate (soluble in NH₄OH)!',
      hi: 'क्लोराइड आयन Ag⁺ से क्रिया करके दही जैसा सफेद AgCl अवक्षेप बनाते हैं!',
    },
  },
  {
    id: 'kmno4-redox',
    grade: '12',
    reagents: ['kmno4', 'fe'],
    title: {
      en: 'd-Block Redox Decolourization (MnO₄⁻ → Mn²⁺)',
      hi: 'd-ब्लॉक ऑक्सीकरण-अपचयन (MnO₄⁻ → Mn²⁺)',
    },
    equation: 'MnO₄⁻ (Purple) + 5Fe²⁺ + 8H⁺ → Mn²⁺ (Pale) + 5Fe³⁺ + 4H₂O',
    resultColor: '#A7F3D0',
    gas: 'Redox e⁻',
    phValue: 4.5,
    tempC: 33,
    observation: {
      en: 'Deep purple permanganate oxidizes Iron and loses colour as Mn(+7) reduces to nearly colourless Mn(+2)!',
      hi: 'गहरा बैंगनी परमैंगनेट (Mn⁺⁷) अपचयित होकर रंगहीन Mn²⁺ में बदल जाता है — कक्षा 12 d-ब्लॉक प्रमुख गुण!',
    },
  },
];

interface ChemistryBeakerLabProps {
  grade: GradeLevel;
  medium: Medium;
  soundEnabled: boolean;
  onDiscoverReactionXP?: (reactionId: string, xp: number) => void;
}

export function ChemistryBeakerLab({
  grade,
  medium,
  soundEnabled,
  onDiscoverReactionXP,
}: ChemistryBeakerLabProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stirred, setStirred] = useState(false);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [pourPulse, setPourPulse] = useState(0);

  const activeReaction =
    selectedIds.length === 2
      ? NCERT_REACTIONS.find(
          (r) =>
            (r.reagents[0] === selectedIds[0] && r.reagents[1] === selectedIds[1]) ||
            (r.reagents[1] === selectedIds[0] && r.reagents[0] === selectedIds[1])
        ) ?? null
      : null;

  const firstReagent = REAGENTS.find((r) => r.id === selectedIds[0]);
  const secondReagent = REAGENTS.find((r) => r.id === selectedIds[1]);

  const handlePourReagent = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 2) return;
    playBubbleMixSound(soundEnabled);
    setPourPulse((p) => p + 1);
    const next = [...selectedIds, id];
    setSelectedIds(next);
    setStirred(false);

    if (next.length === 2) {
      const matched = NCERT_REACTIONS.find(
        (r) =>
          (r.reagents[0] === next[0] && r.reagents[1] === next[1]) ||
          (r.reagents[1] === next[0] && r.reagents[0] === next[1])
      );
      if (matched) {
        setStirred(true);
        playStrikeSound(soundEnabled);
        if (!discoveredIds.includes(matched.id)) {
          setDiscoveredIds((prev) => [...prev, matched.id]);
          onDiscoverReactionXP?.(matched.id, 30);
        }
      }
    }
  };

  const handleLoadRecipeHint = (recipe: NcertReactionRecipe) => {
    setSelectedIds([]);
    setStirred(false);
    playBubbleMixSound(soundEnabled);
    setSelectedIds([...recipe.reagents]);
    setStirred(true);
    setPourPulse((p) => p + 1);
    if (!discoveredIds.includes(recipe.id)) {
      setDiscoveredIds((prev) => [...prev, recipe.id]);
      onDiscoverReactionXP?.(recipe.id, 30);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setStirred(false);
  };

  const liquidColor =
    activeReaction && stirred
      ? activeReaction.resultColor
      : secondReagent
        ? secondReagent.color
        : firstReagent
          ? firstReagent.color
          : '#38BDF8';

  const fillPercent = selectedIds.length === 0 ? 0 : selectedIds.length === 1 ? 38 : 74;

  const displayPH =
    activeReaction && stirred
      ? activeReaction.phValue
      : firstReagent && secondReagent
        ? Number(((firstReagent.phImpact + secondReagent.phImpact) / 2).toFixed(1))
        : firstReagent
          ? firstReagent.phImpact
          : 7.0;

  const displayTemp =
    activeReaction && stirred ? activeReaction.tempC : selectedIds.length > 0 ? 25 : 24;

  const phCategory =
    displayPH < 6.5
      ? medium === 'hi'
        ? 'अम्लीय'
        : 'Acidic'
      : displayPH > 7.5
        ? medium === 'hi'
          ? 'क्षारीय'
          : 'Alkaline'
        : medium === 'hi'
          ? 'उदासीन'
          : 'Neutral';

  const relevantRecipes = NCERT_REACTIONS.filter(
    (r) => r.grade === 'both' || r.grade === grade
  );

  return (
    <section
      aria-labelledby="beaker-lab-heading"
      className="comic-card rounded-3xl p-4 sm:p-6 bg-white space-y-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#A7F3D0] border-2 border-[#181C32] shadow-[0_2px_0_#181C32] flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5 text-[#181C32]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[11px] font-mono font-extrabold text-[#059669]">
              {medium === 'hi' ? 'वर्चुअल बीकर प्रयोगशाला' : 'VIRTUAL BEAKER MINI-GAME'}
            </p>
            <h2 id="beaker-lab-heading" className="font-display text-lg sm:text-xl font-bold text-[#181C32]">
              {medium === 'hi'
                ? 'रसायन मिलाएँ (+30 XP प्रति खोज)'
                : 'Mix Reagents & Discover Reactions (+30 XP)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-extrabold text-[#059669] tabular-nums">
            {discoveredIds.length}/{NCERT_REACTIONS.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-[#181C32] bg-[#F8FAFF] rounded-xl comic-btn-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{medium === 'hi' ? 'खाली करें' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Beaker Stage + Shelf */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Beaker Stage */}
        <div className="lg:col-span-5 bg-[#EFF6FF] border-2 border-[#181C32] rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold">
            <span className="text-[#1D4ED8] tabular-nums">
              pH {displayPH.toFixed(1)} · {phCategory}
            </span>
            <span className="inline-flex items-center gap-1 text-[#B45309] tabular-nums">
              <Thermometer className="w-4 h-4" aria-hidden="true" />
              {displayTemp}°C
            </span>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <svg viewBox="0 0 220 220" className="w-44 h-44 sm:w-48 sm:h-48" role="img" aria-label="Interactive virtual chemical beaker">
              <defs>
                <clipPath id="comic-beaker-interior">
                  <path d="M 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 Z" />
                </clipPath>
              </defs>

              <path
                d="M 54 36 L 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 L 166 36"
                fill="#FFFFFF"
                stroke="#181C32"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />

              <g clipPath="url(#comic-beaker-interior)">
                <motion.rect
                  x="56"
                  width="108"
                  initial={false}
                  animate={{
                    y: 190 - (fillPercent / 100) * 138,
                    height: (fillPercent / 100) * 138,
                    fill: liquidColor,
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  fillOpacity="0.88"
                />

                {fillPercent > 0 && (
                  <motion.ellipse
                    cx="110"
                    rx="48"
                    ry="4.5"
                    initial={false}
                    animate={{
                      cy: 190 - (fillPercent / 100) * 138,
                      fill: liquidColor,
                    }}
                    stroke="#181C32"
                    strokeWidth="2"
                  />
                )}

                <AnimatePresence>
                  {activeReaction?.gas && stirred && (
                    <>
                      {[82, 102, 118, 134, 94].map((bx, i) => (
                        <motion.circle
                          key={`bubble-${pourPulse}-${i}`}
                          cx={bx}
                          r={3.5 + (i % 3)}
                          fill="#FFFFFF"
                          stroke="#181C32"
                          strokeWidth="1.5"
                          initial={{ cy: 180, opacity: 0.95 }}
                          animate={{ cy: 55, opacity: 0 }}
                          transition={{
                            duration: 1.1 + i * 0.16,
                            repeat: Infinity,
                            delay: i * 0.18,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {activeReaction?.precipitate && stirred && (
                  <motion.rect
                    x="62"
                    y="173"
                    width="96"
                    height="16"
                    rx="4"
                    initial={{ opacity: 0, y: 165 }}
                    animate={{ opacity: 1, y: 173 }}
                    transition={{ duration: 0.45 }}
                    fill={activeReaction.precipitate.color}
                    stroke="#181C32"
                    strokeWidth="2"
                  />
                )}
              </g>

              {[80, 110, 140, 170].map((yPos, idx) => (
                <g key={yPos}>
                  <line x1="65" y1={yPos} x2="80" y2={yPos} stroke="#181C32" strokeWidth="2" />
                  <text x="84" y={yPos + 3} fill="#181C32" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    {(4 - idx) * 50}mL
                  </text>
                </g>
              ))}

              <path
                d="M 52 36 L 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 L 168 36"
                fill="none"
                stroke="#181C32"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="p-3.5 rounded-xl bg-white border-2 border-[#181C32] space-y-1 min-h-[82px]">
            {selectedIds.length === 0 ? (
              <p className="text-xs font-semibold text-slate-600">
                {medium === 'hi'
                  ? 'अभिक्रिया देखने के लिए नीचे से कोई भी 2 रसायन चुनें!'
                  : 'Tap any 2 reagents to pour them into the beaker and test a reaction.'}
              </p>
            ) : selectedIds.length === 1 ? (
              <p className="text-xs font-bold text-[#181C32]">
                <span className="text-[#2563EB]">{firstReagent?.formula}</span>{' '}
                {medium === 'hi'
                  ? 'डाला गया। अब दूसरा रसायन चुनें!'
                  : 'loaded! Tap a second reagent to react.'}
              </p>
            ) : activeReaction ? (
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#059669] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{activeReaction.title[medium]}</span>
                </p>
                <p className="font-mono text-xs font-bold text-[#B45309]">
                  {activeReaction.equation}
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReaction.observation[medium]}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-[#181C32]">
                  {firstReagent?.formula} + {secondReagent?.formula} —{' '}
                  {medium === 'hi' ? 'सामान्य मिश्रण' : 'Physical Mixture'}
                </p>
                <p className="text-xs text-slate-600">
                  {medium === 'hi'
                    ? 'असली NCERT अभिक्रिया देखने के लिए नीचे दिए चैलेंज टैप करें!'
                    : 'Try an NCERT Reaction Mission below to see precipitates or gas!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reagent Shelf & Challenges */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-[#181C32] flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                <span>{medium === 'hi' ? 'रसायन चुनें (2 टैप करें):' : 'Tap 2 Reagents:'}</span>
              </p>
              <span className="font-mono text-xs font-extrabold text-[#2563EB] tabular-nums">
                {selectedIds.length}/2
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {REAGENTS.map((reagent) => {
                const isSelected = selectedIds.includes(reagent.id);
                const disabled = !isSelected && selectedIds.length >= 2;
                return (
                  <button
                    key={reagent.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePourReagent(reagent.id)}
                    className={`min-h-[64px] p-2.5 rounded-2xl text-left comic-btn-sm ${
                      isSelected
                        ? 'bg-[#FEF08A] text-[#181C32]'
                        : disabled
                          ? 'bg-slate-100 text-slate-400 opacity-60'
                          : 'bg-white hover:bg-[#F8FAFF] text-[#181C32]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-mono text-xs font-extrabold text-[#1D4ED8]">
                        {reagent.formula}
                      </span>
                      <span
                        className="w-3.5 h-3.5 rounded-md border-2 border-[#181C32] shrink-0"
                        style={{ backgroundColor: reagent.color }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs font-bold text-[#181C32] truncate mt-0.5">
                      {reagent.name[medium]}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 truncate">
                      {reagent.stateLabel[medium]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t-2 border-dashed border-slate-200">
            <p className="text-xs font-extrabold text-[#059669] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {medium === 'hi'
                  ? `कक्षा ${grade}वीं NCERT प्रयोग (1-टैप टेस्ट):`
                  : `Class ${grade}th NCERT Reaction Challenges:`}
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relevantRecipes.map((rec) => {
                const solved = discoveredIds.includes(rec.id);
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handleLoadRecipeHint(rec)}
                    className={`min-h-[52px] p-2.5 rounded-xl text-left comic-btn-sm flex items-center justify-between gap-2 ${
                      solved ? 'bg-[#D1FAE5]' : 'bg-[#F8FAFF] hover:bg-[#EFF6FF]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#181C32] truncate">
                        {rec.title[medium]}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-[#2563EB] truncate">
                        {rec.reagents.map((id) => REAGENTS.find((r) => r.id === id)?.formula).join(' + ')}
                      </p>
                    </div>
                    {solved && (
                      <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
