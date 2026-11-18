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
    resultColor: '#64748B',
    precipitate: { color: '#F8FAFC', label: 'BaSO₄↓ White Solid' },
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
    resultColor: '#10B981',
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
    resultColor: '#94A3B8',
    precipitate: { color: '#F1F5F9', label: 'AgCl↓ Curdy White' },
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
          : '#0EA5E9';

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
        ? 'अम्लीय (Acidic)'
        : 'Acidic'
      : displayPH > 7.5
        ? medium === 'hi'
          ? 'क्षारीय (Basic)'
          : 'Alkaline'
        : medium === 'hi'
          ? 'उदासीन (Neutral)'
          : 'Neutral';

  const relevantRecipes = NCERT_REACTIONS.filter(
    (r) => r.grade === 'both' || r.grade === grade
  );

  return (
    <section
      aria-labelledby="beaker-lab-heading"
      className="bg-[#162033] border border-slate-700/80 rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/50 flex items-center justify-center shrink-0">
            <FlaskConical className="w-5 h-5 text-sky-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400">
              {medium === 'hi'
                ? 'इंटरैक्टिव वर्चुअल रसायन प्रयोगशाला'
                : 'Interactive Virtual Beaker Mixing Minigame'}
            </p>
            <h2 id="beaker-lab-heading" className="font-display text-xl font-bold text-white">
              {medium === 'hi'
                ? 'रसायन मिलाएँ और NCERT अभिक्रिया देखें (+30 XP प्रति खोज)'
                : 'Mix Reagents & Discover Real NCERT Reactions (+30 XP Each)'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-emerald-300 tabular-nums">
            {discoveredIds.length}/{NCERT_REACTIONS.length}{' '}
            {medium === 'hi' ? 'अभिक्रियाएँ खोजीं' : 'Reactions Discovered'}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-[#0F172A] border border-slate-700 hover:border-amber-400 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{medium === 'hi' ? 'बीकर खाली करें' : 'Reset Beaker'}</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox: Animated Beaker Stage (Left 5) + Reagent Shelf & Recipes (Right 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Live SVG Beaker & Sensors */}
        <div className="lg:col-span-5 bg-[#0B1220] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-5">
          {/* Telemetry Bar */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-sky-300 tabular-nums">
              pH: <strong>{displayPH.toFixed(1)}</strong> · {phCategory}
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 tabular-nums">
              <Thermometer className="w-3.5 h-3.5" aria-hidden="true" />
              {displayTemp}°C
            </span>
          </div>

          {/* Animated Glass Beaker SVG */}
          <div className="relative flex items-center justify-center py-2">
            <svg viewBox="0 0 220 220" className="w-52 h-52" role="img" aria-label="Interactive virtual chemical beaker">
              <defs>
                <clipPath id="beaker-interior">
                  <path d="M 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 Z" />
                </clipPath>
              </defs>

              {/* Beaker back interior */}
              <path
                d="M 54 36 L 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 L 166 36"
                fill="#0F172A"
                stroke="#475569"
                strokeWidth="3"
                strokeLinejoin="round"
              />

              {/* Animated Liquid Fill inside clipped beaker */}
              <g clipPath="url(#beaker-interior)">
                <motion.rect
                  x="56"
                  width="108"
                  initial={false}
                  animate={{
                    y: 190 - (fillPercent / 100) * 138,
                    height: (fillPercent / 100) * 138,
                    fill: liquidColor,
                  }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  fillOpacity="0.72"
                />

                {/* Top meniscus shimmer */}
                {fillPercent > 0 && (
                  <motion.ellipse
                    cx="110"
                    rx="48"
                    ry="4"
                    initial={false}
                    animate={{
                      cy: 190 - (fillPercent / 100) * 138,
                      fill: liquidColor,
                    }}
                    fillOpacity="0.95"
                  />
                )}

                {/* Gas Effervescence Bubbles when gas reaction happens */}
                <AnimatePresence>
                  {activeReaction?.gas && stirred && (
                    <>
                      {[82, 102, 118, 134, 94].map((bx, i) => (
                        <motion.circle
                          key={`bubble-${pourPulse}-${i}`}
                          cx={bx}
                          r={3 + (i % 3)}
                          fill="#E0F2FE"
                          fillOpacity="0.85"
                          initial={{ cy: 180, opacity: 0.9 }}
                          animate={{ cy: 60, opacity: 0 }}
                          transition={{
                            duration: 1.2 + i * 0.18,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>

                {/* Precipitate Solid Layer at bottom */}
                {activeReaction?.precipitate && stirred && (
                  <motion.rect
                    x="62"
                    y="174"
                    width="96"
                    height="15"
                    rx="4"
                    initial={{ opacity: 0, y: 165 }}
                    animate={{ opacity: 0.95, y: 174 }}
                    transition={{ duration: 0.5 }}
                    fill={activeReaction.precipitate.color}
                  />
                )}
              </g>

              {/* Volume Graduation Markings */}
              {[80, 110, 140, 170].map((yPos, idx) => (
                <g key={yPos}>
                  <line x1="65" y1={yPos} x2="80" y2={yPos} stroke="#94A3B8" strokeWidth="1.5" />
                  <text x="84" y={yPos + 3} fill="#94A3B8" fontSize="9" fontFamily="monospace">
                    {(4 - idx) * 50}mL
                  </text>
                </g>
              ))}

              {/* Glass Outline Overlay */}
              <path
                d="M 52 36 L 60 44 L 60 176 Q 60 190 74 190 L 146 190 Q 160 190 160 176 L 160 44 L 168 36"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Live Reaction Output Console */}
          <div className="p-3.5 rounded-lg bg-[#162033] border border-slate-700/80 space-y-1.5 min-h-[88px]">
            {selectedIds.length === 0 ? (
              <p className="text-xs text-slate-400">
                {medium === 'hi'
                  ? 'अभिक्रिया शुरू करने के लिए दाईं ओर से कोई भी 2 रसायन बीकर में डालें।'
                  : 'Tap any 2 reagents on the right shelf to pour them into the beaker and test a reaction.'}
              </p>
            ) : selectedIds.length === 1 ? (
              <p className="text-xs text-sky-200">
                <strong className="text-amber-300">{firstReagent?.formula}</strong>{' '}
                {medium === 'hi'
                  ? 'बीकर में डाला गया। अब अभिक्रिया के लिए एक और रसायन चुनें!'
                  : 'poured! Select a second reagent to react.'}
              </p>
            ) : activeReaction ? (
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{activeReaction.title[medium]}</span>
                </p>
                <p className="font-mono text-xs text-amber-300">{activeReaction.equation}</p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeReaction.observation[medium]}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-300">
                  {medium === 'hi'
                    ? `${firstReagent?.formula} + ${secondReagent?.formula} — भौतिक मिश्रण (कोई अवक्षेप नहीं)`
                    : `${firstReagent?.formula} + ${secondReagent?.formula} — Stable Physical Mixture`}
                </p>
                <p className="text-xs text-slate-400">
                  {medium === 'hi'
                    ? 'अवक्षेप या गैस देखने के लिए नीचे दी किसी NCERT अभिक्रिया का प्रयास करें।'
                    : 'No precipitate or gas evolved. Try pairing reactants from the NCERT missions below!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Pourable Reagents + NCERT Discovery Missions */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>
                  {medium === 'hi'
                    ? 'रसायन शेल्फ (बीकर में डालने के लिए चुनें):'
                    : 'Reagent Shelf (Tap 2 Bottles to Mix):'}
                </span>
              </p>
              <span className="font-mono text-xs text-slate-400 tabular-nums">
                {selectedIds.length}/2 {medium === 'hi' ? 'चयनित' : 'Loaded'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {REAGENTS.map((reagent) => {
                const isSelected = selectedIds.includes(reagent.id);
                const disabled = !isSelected && selectedIds.length >= 2;
                return (
                  <button
                    key={reagent.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => handlePourReagent(reagent.id)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 text-white'
                        : disabled
                          ? 'bg-[#0B1220] border-slate-800 text-slate-500 opacity-60'
                          : 'bg-[#0F172A] border-slate-700 hover:border-sky-400 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-amber-300">
                        {reagent.formula}
                      </span>
                      <span
                        className="w-3 h-3 rounded-sm border border-slate-500 shrink-0"
                        style={{ backgroundColor: reagent.color }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs font-medium text-white truncate mt-1">
                      {reagent.name[medium]}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {reagent.stateLabel[medium]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NCERT Class-Focused Guided Experiments */}
          <div className="space-y-2.5 pt-3 border-t border-slate-700/80">
            <p className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {medium === 'hi'
                  ? `कक्षा ${grade}वीं मुख्य NCERT प्रयोग (क्लिक कर टेस्ट करें):`
                  : `Class ${grade}th NCERT Reaction Challenges (Click to Test):`}
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {relevantRecipes.map((rec) => {
                const solved = discoveredIds.includes(rec.id);
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handleLoadRecipeHint(rec)}
                    className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between gap-2 ${
                      solved
                        ? 'bg-emerald-950/35 border-emerald-700/60 text-emerald-100'
                        : 'bg-[#0F172A] border-slate-700 hover:border-amber-400 text-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{rec.title[medium]}</p>
                      <p className="text-[11px] font-mono text-amber-300/90 truncate mt-0.5">
                        {rec.reagents.map((id) => REAGENTS.find((r) => r.id === id)?.formula).join(' + ')}
                      </p>
                    </div>
                    {solved && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
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
