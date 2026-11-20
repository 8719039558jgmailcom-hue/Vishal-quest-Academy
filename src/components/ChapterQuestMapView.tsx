import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Crown,
  FlaskConical,
  Lock,
  Shield,
  Star,
  Swords,
} from 'lucide-react';
import {
  buildSubjectBossQuestions,
  getChapterNodeQuestions,
  getChapterNodesForSubject,
  getSubjectBookSections,
  getSubjectRealm,
  getSubsectionForNode,
} from '../data/mpboardIndex';
import { AVATARS, BOSS_PORTRAIT, SUBJECT_REALMS } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { ChemistryBeakerLab } from './ChemistryBeakerLab';
import { SafeImage } from './SafeImage';
import { SubjectDiagram } from './SubjectDiagram';

interface ChapterQuestMapViewProps {
  grade: GradeLevel;
  subjectId: SubjectId;
  medium: Medium;
  adventurer: AdventurerState;
  onBackToHub: () => void;
  onSwitchSubject: (subjectId: SubjectId) => void;
  onStartChapterNode: (nodeId: string) => void;
  onStartSubjectBoss: (grade: GradeLevel, subjectId: SubjectId) => void;
  onEarnLabXP?: (reactionId: string, xp: number) => void;
}

export function ChapterQuestMapView({
  grade,
  subjectId,
  medium,
  adventurer,
  onBackToHub,
  onSwitchSubject,
  onStartChapterNode,
  onStartSubjectBoss,
  onEarnLabXP,
}: ChapterQuestMapViewProps) {
  const realm = getSubjectRealm(subjectId);
  const nodes = useMemo(() => getChapterNodesForSubject(grade, subjectId), [grade, subjectId]);
  const bookSections = useMemo(
    () => getSubjectBookSections(grade, subjectId),
    [grade, subjectId]
  );
  const subjectBossQuestions = useMemo(
    () => buildSubjectBossQuestions(grade, subjectId),
    [grade, subjectId]
  );

  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('all');

  const activeAvatar = AVATARS.find((a) => a.id === adventurer.avatarId) ?? AVATARS[0];
  const heroPortraitSrc = adventurer.customAvatarUrl || activeAvatar.imagePath;

  const isNodeCleared = (nodeId: string) => (adventurer.clearedStages[nodeId] ?? 0) > 0;

  const isNodeUnlocked = (order: number) => {
    if (order === 1) return true;
    const prevNode = nodes.find((n) => n.order === order - 1);
    return prevNode ? isNodeCleared(prevNode.id) : false;
  };

  const subjectBossKey = `${grade}-${subjectId}-boss`;
  const lastChapter = nodes[nodes.length - 1];
  const isSubjectBossUnlocked = lastChapter ? isNodeCleared(lastChapter.id) : false;
  const isSubjectBossCleared = adventurer.bossesDefeated.includes(`${grade}-${subjectId}`);

  const computeDefaultSelection = () => {
    const nextPending = nodes.find((n) => isNodeUnlocked(n.order) && !isNodeCleared(n.id));
    if (nextPending) return nextPending.id;
    if (isSubjectBossUnlocked) return 'subject-boss';
    return nodes[0]?.id ?? 'subject-boss';
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string>(computeDefaultSelection);

  useEffect(() => {
    setActiveSectionFilter('all');
    setSelectedNodeId(computeDefaultSelection());
  }, [grade, subjectId]);

  const activeSubsectionObj = bookSections.find((s) => s.id === activeSectionFilter) ?? null;
  const visibleSubsections = activeSubsectionObj ? [activeSubsectionObj] : bookSections;

  const selectedChapterNode = nodes.find((n) => n.id === selectedNodeId);
  const selectingSubjectBoss = selectedNodeId === 'subject-boss' || !selectedChapterNode;

  const subjectBossTitle =
    grade === '10' ? realm.bossTitle10[medium] : realm.bossTitle12[medium];
  const realmTitle = grade === '10' ? realm.realmName10[medium] : realm.realmName12[medium];
  const ncertBooks = grade === '10' ? realm.ncertBooks10[medium] : realm.ncertBooks12[medium];

  const clearedCount = nodes.filter((n) => isNodeCleared(n.id)).length;
  const completionPct = nodes.length > 0 ? Math.round((clearedCount / nodes.length) * 100) : 0;

  const trailNodes = useMemo(
    () =>
      activeSectionFilter === 'all'
        ? nodes
        : nodes.filter((n) => {
            if (n.subsectionId === activeSectionFilter) return true;
            const sec = bookSections.find((s) => s.id === activeSectionFilter);
            return sec ? sec.chapterOrders.includes(n.order) : false;
          }),
    [activeSectionFilter, bookSections, nodes]
  );

  return (
    <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Top Back & Subject Horizontal Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onBackToHub}
          className="min-h-[42px] self-start inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-[#181C32] bg-white rounded-xl comic-btn-sm whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>{medium === 'hi' ? `कक्षा ${grade}वीं हब` : `Class ${grade}th Hub`}</span>
        </button>

        <div
          role="tablist"
          aria-label="Switch subject map"
          className="flex overflow-x-auto gap-1.5 pb-1 no-scrollbar"
        >
          {SUBJECT_REALMS.map((r) => {
            const active = r.id === subjectId;
            return (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSwitchSubject(r.id)}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-extrabold rounded-xl comic-btn-sm whitespace-nowrap shrink-0 ${
                  active ? 'bg-[#FACC15] text-[#181C32]' : 'bg-white text-[#181C32]'
                }`}
              >
                {r.name[medium]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Banner & Book Subsections */}
      <section className="comic-card rounded-3xl overflow-hidden bg-white">
        <div
          className={`border-b-[2.5px] border-[#181C32] comic-gloss p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            subjectId === 'hindi'
              ? 'bg-[#FEF08A]'
              : subjectId === 'english'
                ? 'bg-[#BAE6FD]'
                : subjectId === 'maths'
                  ? 'bg-[#DDD6FE]'
                  : subjectId === 'physics'
                    ? 'bg-[#FECDD3]'
                    : 'bg-[#A7F3D0]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-2xl bg-white border-2 border-[#181C32] shadow-[0_2px_0_#181C32] shrink-0">
              <SubjectDiagram subjectId={subjectId} className="w-14 h-11" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono font-extrabold text-[#181C32]/80 truncate">
                {realmTitle} · {ncertBooks}
              </p>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[#181C32] leading-tight">
                {medium === 'hi'
                  ? `कक्षा ${grade}वीं ${realm.name.hi} क्वेस्ट`
                  : `Class ${grade}th ${realm.name.en} Quests`}
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border-2 border-[#181C32] shadow-[0_2px_0_#181C32] text-xs font-extrabold shrink-0">
            {isSubjectBossCleared ? (
              <span className="inline-flex items-center gap-1.5 text-[#059669]">
                <Crown className="w-4 h-4 text-[#EAB308]" aria-hidden="true" />
                {medium === 'hi' ? 'बॉस मुहर अर्जित!' : 'Boss Seal Earned!'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#181C32] font-mono tabular-nums">
                <Shield className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                {clearedCount}/{nodes.length} {medium === 'hi' ? 'अध्याय पूर्ण' : 'Stages Cleared'}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Subject Completion Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-extrabold text-slate-600 tabular-nums">
              <span>{medium === 'hi' ? 'अध्याय प्रगति' : 'CHAPTER PROGRESS'}</span>
              <span className="text-[#2563EB]">{completionPct}%</span>
            </div>
            <div className="h-3 w-full bg-slate-200 rounded-full border-2 border-[#181C32] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, completionPct)}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="h-full bg-[#10B981] comic-progress-fill"
              />
            </div>
          </div>

        {/* Horizontally Scrollable Subsection Filter Tabs */}
        <div className="flex overflow-x-auto items-center gap-2 pt-3 border-t-2 border-slate-200 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSectionFilter('all')}
            className={`min-h-[38px] px-3 py-1.5 text-xs font-extrabold rounded-xl comic-btn-sm whitespace-nowrap shrink-0 ${
              activeSectionFilter === 'all' ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFF] text-[#181C32]'
            }`}
          >
            {medium === 'hi' ? `सभी (${nodes.length})` : `All (${nodes.length})`}
          </button>

          {bookSections.map((sec) => {
            const active = activeSectionFilter === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSectionFilter(sec.id);
                  const matchNode = nodes.find(
                    (n) => n.subsectionId === sec.id || sec.chapterOrders.includes(n.order)
                  );
                  if (matchNode) setSelectedNodeId(matchNode.id);
                }}
                className={`min-h-[38px] px-3 py-1.5 text-xs font-extrabold rounded-xl comic-btn-sm whitespace-nowrap shrink-0 ${
                  active ? 'bg-[#2563EB] text-white' : 'bg-[#F8FAFF] text-[#181C32]'
                }`}
              >
                {sec.label[medium]}
              </button>
            );
          })}
        </div>
        </div>
      </section>

      {/* Interactive Virtual Beaker Lab for Chemistry */}
      {subjectId === 'chemistry' && (
        <ChemistryBeakerLab
          grade={grade}
          medium={medium}
          soundEnabled={adventurer.soundEnabled}
          onDiscoverReactionXP={onEarnLabXP}
        />
      )}

      {/* 2D Comic Arcade Stage Map (Left 6) + Active Stage & Notes Inspector (Right 6) */}
      <section aria-label="2D stage quest path and chapter notes" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 2D Comic S-Curve Arcade Mission Map */}
        <div className="lg:col-span-6 comic-card rounded-3xl p-4 sm:p-5 bg-[#EFF6FF] space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-[#181C32]">
              {medium === 'hi' ? 'अध्याय मिशन पथ (टैप करें)' : 'Arcade Stage Trail (Tap Node)'}
            </h2>
            <span className="text-[11px] font-mono font-extrabold text-[#2563EB]">
              {trailNodes.length + 1} STAGES
            </span>
          </div>

          <div className="relative space-y-3 py-1">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-6 bottom-16 -translate-x-1/2 w-1 border-l-[3px] border-dashed border-[#2563EB]/35 pointer-events-none"
            />
            {trailNodes.map((node, idx) => {
              const unlocked = isNodeUnlocked(node.order);
              const stars = adventurer.clearedStages[node.id] ?? 0;
              const cleared = stars > 0;
              const isSelected = selectedNodeId === node.id;
              const isNextToClear = unlocked && !cleared;
              const alignRight = idx % 2 === 1;

              return (
                <div
                  key={node.id}
                  className={`flex items-center ${alignRight ? 'justify-end' : 'justify-start'}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-[88%] sm:w-[82%] min-h-[68px] p-3 rounded-2xl text-left flex items-center gap-3 comic-btn-sm comic-gloss ${
                      isSelected
                        ? 'bg-[#FACC15] text-[#181C32]'
                        : cleared
                          ? 'bg-[#D1FAE5] text-[#181C32]'
                          : unlocked
                            ? 'bg-white text-[#181C32]'
                            : 'bg-slate-200 text-slate-500'
                    } ${isNextToClear && !isSelected ? 'ring-2 ring-[#2563EB]' : ''}`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl border-2 border-[#181C32] flex items-center justify-center font-mono font-extrabold text-sm shrink-0 relative ${
                        cleared ? 'bg-[#10B981] text-white' : unlocked ? 'bg-[#2563EB] text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {unlocked ? node.order : <Lock className="w-4 h-4" aria-hidden="true" />}
                      {isSelected && (
                        <motion.div
                          layoutId="hero-map-marker"
                          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full overflow-hidden border-2 border-[#181C32] bg-white shadow"
                        >
                          <SafeImage
                            src={heroPortraitSrc}
                            alt={adventurer.heroName}
                            className="w-full h-full object-cover"
                            fallbackTitle={adventurer.heroName}
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-extrabold uppercase opacity-75">
                          {node.chapterCode[medium]}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= stars ? 'text-[#D97706] fill-[#FACC15]' : 'text-slate-400'
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="font-display font-bold text-sm leading-snug truncate">
                        {node.title[medium]}
                      </p>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Final Subject Boss Node */}
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => setSelectedNodeId('subject-boss')}
                className={`w-full min-h-[72px] p-3.5 rounded-2xl text-left flex items-center gap-3 comic-btn ${
                  selectingSubjectBoss
                    ? 'bg-[#FB7185] text-[#181C32]'
                    : isSubjectBossUnlocked
                      ? 'bg-[#181C32] text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#181C32] bg-[#FACC15] shrink-0">
                  <SafeImage
                    src={BOSS_PORTRAIT}
                    alt={subjectBossTitle}
                    className="w-full h-full object-cover"
                    fallbackTitle="Boss"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-mono font-extrabold uppercase opacity-80">
                    {medium === 'hi' ? 'अंतिम बॉस चरण' : `STAGE ${nodes.length + 1} · FINAL BOSS`}
                  </p>
                  <p className="font-display text-base font-bold truncate">{subjectBossTitle}</p>
                </div>
                {isSubjectBossUnlocked ? (
                  <Crown className="w-6 h-6 shrink-0" aria-hidden="true" />
                ) : (
                  <Lock className="w-5 h-5 shrink-0" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Stage Inspector + Study Notes Codex */}
        <div className="lg:col-span-6 comic-card rounded-3xl p-4 sm:p-6 bg-white space-y-4">
          {!selectingSubjectBoss && selectedChapterNode ? (
            (() => {
              const qs = getChapterNodeQuestions(selectedChapterNode);
              const unlocked = isNodeUnlocked(selectedChapterNode.order);
              const stars = adventurer.clearedStages[selectedChapterNode.id] ?? 0;
              const cleared = stars > 0;
              const tags = Array.from(new Set(qs.map((q) => q.sourceTag))).join(' · ');
              const subSec = getSubsectionForNode(selectedChapterNode);

              return (
                <>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
                    <span className="text-xs font-mono font-extrabold text-[#2563EB] truncate">
                      {subSec.label[medium]} · {selectedChapterNode.chapterCode[medium]}
                    </span>
                    <div className="flex items-center gap-0.5 shrink-0">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars ? 'text-[#D97706] fill-[#FACC15]' : 'text-slate-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#181C32] leading-snug">
                    {selectedChapterNode.order}. {selectedChapterNode.title[medium]}
                  </h2>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFBEB] border-2 border-[#181C32]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#181C32] shrink-0">
                      <SafeImage
                        src={BOSS_PORTRAIT}
                        alt={selectedChapterNode.bossName[medium]}
                        className="w-full h-full object-cover"
                        fallbackTitle="Boss"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#181C32] truncate">
                        {selectedChapterNode.bossName[medium]}
                      </p>
                      <p className="text-[11px] font-mono font-bold text-slate-600 tabular-nums">
                        {qs.length} Qs · {selectedChapterNode.secondsPerQuestion}s/Strike · {tags}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {medium === 'hi'
                          ? 'NCERT विषय नोट्स (युद्ध-पूर्व तैयारी):'
                          : 'Dedicated NCERT Study Notes:'}
                      </span>
                    </p>

                    {selectedChapterNode.studyNotes && selectedChapterNode.studyNotes.length > 0 ? (
                      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                        {selectedChapterNode.studyNotes.map((note, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] space-y-1.5"
                          >
                            <h3 className="text-xs sm:text-sm font-extrabold text-[#1D4ED8]">
                              {note.topicTitle[medium]}
                            </h3>
                            <p className="text-xs text-[#181C32] leading-relaxed">
                              {note.summary[medium]}
                            </p>
                            {note.keyPoints.length > 0 && (
                              <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700">
                                {note.keyPoints.map((kp, kIdx) => (
                                  <li key={kIdx} className="flex items-start gap-1.5">
                                    <span className="font-mono text-[#E11D48] font-bold shrink-0">
                                      •
                                    </span>
                                    <span>{kp[medium]}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {note.examTip && (
                              <p className="text-[11px] font-bold text-[#059669] pt-1 border-t border-slate-200">
                                {note.examTip[medium]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#181C32] leading-relaxed">
                        {selectedChapterNode.summaryPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-mono text-[#2563EB] font-bold shrink-0">•</span>
                            <span>{pt[medium]}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-2">
                    {unlocked ? (
                      <button
                        type="button"
                        onClick={() => onStartChapterNode(selectedChapterNode.id)}
                        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-[#181C32] bg-[#FACC15] hover:bg-[#FDE047] rounded-2xl comic-btn comic-gloss"
                      >
                        <Swords className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {cleared
                            ? medium === 'hi'
                              ? `अध्याय ${selectedChapterNode.order} फिर खेलें`
                              : `Rematch Ch. ${selectedChapterNode.order} Boss`
                            : medium === 'hi'
                              ? `अध्याय ${selectedChapterNode.order} बॉस से लड़ें`
                              : `Battle Ch. ${selectedChapterNode.order} Boss`}
                        </span>
                      </button>
                    ) : (
                      <div className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-slate-100 border-2 border-[#181C32] flex items-center justify-center gap-2 text-xs font-extrabold text-slate-600 text-center">
                        <Lock className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
                        <span>
                          {medium === 'hi'
                            ? `पहले अध्याय ${selectedChapterNode.order - 1} जीतें`
                            : `Clear Ch. ${selectedChapterNode.order - 1} first to unlock`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()
          ) : (
            (() => {
              const stars = adventurer.clearedStages[subjectBossKey] ?? 0;
              return (
                <>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-slate-200">
                    <span className="text-xs font-mono font-extrabold text-[#E11D48]">
                      {medium === 'hi' ? 'अंतिम विषय महाबॉस' : 'FINAL SUBJECT BOSS'}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars ? 'text-[#D97706] fill-[#FACC15]' : 'text-slate-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-[#181C32]">
                    {subjectBossTitle}
                  </h2>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF1F2] border-2 border-[#181C32]">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#181C32] shrink-0">
                      <SafeImage
                        src={BOSS_PORTRAIT}
                        alt={subjectBossTitle}
                        className="w-full h-full object-cover"
                        fallbackTitle="Subject Boss"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#E11D48]">
                        {medium === 'hi'
                          ? `${realm.name.hi} विषय महाबॉस`
                          : `${realm.name.en} Final Guardian`}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#181C32] tabular-nums mt-0.5">
                        {subjectBossQuestions.length} Strikes · 10s/Strike
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {medium === 'hi'
                      ? `यह महाबॉस परीक्षा सभी ${nodes.length} अध्यायों के MP बोर्ड PYQ, 2027 IMP और गूढ़ प्रश्नों को जोड़ती है। जीतकर मुहर अर्जित करें!`
                      : `Combines PYQs, 2027 IMPs, and Tricky Conceptual strikes from all ${nodes.length} chapters. Score ≥ 60% to earn the ${realm.name.en} Boss Seal!`}
                  </p>

                  {isSubjectBossUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onStartSubjectBoss(grade, subjectId)}
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-extrabold text-[#181C32] bg-[#FB7185] hover:bg-[#FDA4AF] rounded-2xl comic-btn"
                    >
                      <Crown className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {isSubjectBossCleared
                          ? medium === 'hi'
                            ? 'महाबॉस से फिर लड़ें'
                            : 'Rematch Subject Boss'
                          : medium === 'hi'
                            ? 'महाबॉस युद्ध शुरू करें'
                            : 'Challenge Subject Boss'}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-slate-100 border-2 border-[#181C32] flex items-center justify-center gap-2 text-xs font-extrabold text-slate-600 text-center">
                      <Lock className="w-4 h-4 text-[#D97706] shrink-0" aria-hidden="true" />
                      <span>
                        {medium === 'hi'
                          ? `खोलने के लिए सभी ${nodes.length} अध्याय जीतें`
                          : `Clear all ${nodes.length} chapters to unlock`}
                      </span>
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>
      </section>

      {/* Subsection Chapter Cards Grid */}
      <section aria-labelledby="chapter-trail-heading" className="space-y-5">
        <div>
          <h2 id="chapter-trail-heading" className="font-display text-xl font-bold text-[#181C32]">
            {medium === 'hi'
              ? `${realm.name.hi} — पुस्तक एवं खंड-वार अध्याय`
              : `${realm.name.en} — Subsections & Book Chapters`}
          </h2>
        </div>

        <div className="space-y-6">
          {visibleSubsections.map((section) => {
            const sectionNodes = nodes.filter(
              (n) => n.subsectionId === section.id || section.chapterOrders.includes(n.order)
            );
            return (
              <div key={section.id} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b-2 border-[#181C32]">
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1D4ED8] flex items-center gap-2">
                    {subjectId === 'chemistry' ? (
                      <FlaskConical className="w-4 h-4 text-[#059669]" aria-hidden="true" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                    )}
                    <span>{section.label[medium]}</span>
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    {section.description[medium]}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionNodes.map((node) => {
                    const unlocked = isNodeUnlocked(node.order);
                    const stars = adventurer.clearedStages[node.id] ?? 0;
                    const cleared = stars > 0;
                    const qs = getChapterNodeQuestions(node);
                    const tags = Array.from(new Set(qs.map((q) => q.sourceTag))).join(' · ');

                    return (
                      <article
                        key={node.id}
                        className={`comic-card rounded-3xl p-4 flex flex-col justify-between gap-3 ${
                          !unlocked ? 'bg-slate-100 opacity-85' : 'bg-white'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-extrabold text-[#2563EB]">
                              {node.chapterCode[medium]}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= stars ? 'text-[#D97706] fill-[#FACC15]' : 'text-slate-300'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>

                          <h4 className="font-display text-base font-bold text-[#181C32] leading-snug">
                            {node.order}. {node.title[medium]}
                          </h4>

                          <p className="text-xs font-semibold text-slate-600 line-clamp-2">
                            {node.summaryPoints[0]?.[medium]}
                          </p>

                          <p className="text-[11px] font-mono font-bold text-slate-500 tabular-nums inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>
                              {qs.length} Qs · {node.secondsPerQuestion}s · {tags}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNodeId(node.id);
                              window.scrollTo({ top: 140, behavior: 'smooth' });
                            }}
                            className="min-h-[42px] px-3 py-2 text-xs font-extrabold text-[#181C32] bg-[#EFF6FF] rounded-xl comic-btn-sm whitespace-nowrap"
                          >
                            {medium === 'hi' ? 'नोट्स' : 'Notes'}
                          </button>

                          {unlocked ? (
                            <button
                              type="button"
                              onClick={() => onStartChapterNode(node.id)}
                              className="min-h-[42px] flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-extrabold text-[#181C32] bg-[#FACC15] hover:bg-[#FDE047] rounded-xl comic-btn-sm comic-gloss whitespace-nowrap"
                            >
                              <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>
                                {cleared
                                  ? medium === 'hi'
                                    ? 'फिर लड़ें'
                                    : 'Rematch'
                                  : medium === 'hi'
                                    ? 'लड़ें'
                                    : 'Fight'}
                              </span>
                            </button>
                          ) : (
                            <div className="min-h-[42px] flex-1 px-3 py-2 rounded-xl bg-slate-200 border-2 border-slate-400 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500">
                              <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                              <span>{medium === 'hi' ? 'लॉक' : 'Locked'}</span>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
