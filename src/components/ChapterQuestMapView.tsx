import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  FlaskConical,
  Languages,
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
import { BOSS_PORTRAIT, SUBJECT_REALMS } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { ChemistryBeakerLab } from './ChemistryBeakerLab';
import { QuestMap3DCanvas } from './QuestMap3DCanvas';
import { SafeImage } from './SafeImage';
import { SubjectDiagram } from './SubjectDiagram';

interface ChapterQuestMapViewProps {
  grade: GradeLevel;
  subjectId: SubjectId;
  medium: Medium;
  adventurer: AdventurerState;
  onMediumChange: (medium: Medium) => void;
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
  onMediumChange,
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Top Breadcrumb, Subject Quick Switch & Language Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-amber-400 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-lg transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>
              {medium === 'hi' ? `कक्षा ${grade}वीं विषय हब` : `Back to Class ${grade}th Hubs`}
            </span>
          </button>

          <div
            role="tablist"
            aria-label="Switch subject map"
            className="flex flex-wrap items-center gap-1.5"
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-amber-400 border-amber-300 text-slate-950'
                      : 'bg-[#162033] border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  {r.name[medium]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onMediumChange(medium === 'en' ? 'hi' : 'en')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-[#162033] border border-slate-700 hover:border-amber-400 rounded-lg self-start lg:self-auto whitespace-nowrap"
        >
          <Languages className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span>{medium === 'en' ? 'हिन्दी माध्यम' : 'English Medium'}</span>
        </button>
      </div>

      {/* Dedicated Subject Header Banner */}
      <section className="bg-[#162033]/95 border border-slate-600/80 rounded-2xl p-6 space-y-5 adventure-card-3d">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-[#0F172A] border border-slate-700 hidden sm:block shrink-0">
              <SubjectDiagram subjectId={subjectId} className="w-24 h-14" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-400">
                {realmTitle} · {ncertBooks}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5 [text-wrap:balance]">
                {medium === 'hi'
                  ? `कक्षा ${grade}वीं ${realm.name.hi} — NCERT अध्याय क्वेस्ट मैप`
                  : `Class ${grade}th ${realm.name.en} — Chapter Quest Map`}
              </h1>
            </div>
          </div>

          <div className="text-xs font-semibold bg-[#0F172A] border border-slate-700 px-4 py-2.5 rounded-lg shrink-0">
            {isSubjectBossCleared ? (
              <span className="inline-flex items-center gap-2 text-emerald-400">
                <Crown className="w-4 h-4 text-amber-400" aria-hidden="true" />
                {medium === 'hi'
                  ? 'विषय महाबॉस पराजित · मुहर अर्जित!'
                  : 'Subject Final Boss Cleared · Seal Earned!'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-amber-300">
                <Shield className="w-4 h-4" aria-hidden="true" />
                {medium === 'hi'
                  ? `लक्ष्य: ${nodes.length} अध्याय जीतकर ${subjectBossTitle} को हराएँ`
                  : `Goal: Clear ${nodes.length} Chapters & Defeat ${subjectBossTitle}`}
              </span>
            )}
          </div>
        </div>

        {/* Book / Subsection Navigation Tabs (Kavya Khand, Gadya Khand, Flamingo, Vistas, Maths Part I & II...) */}
        <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">
            {medium === 'hi' ? 'पुस्तक / खंड:' : 'Book / Subsection:'}
          </span>
          <button
            type="button"
            onClick={() => setActiveSectionFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
              activeSectionFilter === 'all'
                ? 'bg-sky-600 border-sky-400 text-white'
                : 'bg-[#0F172A] border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {medium === 'hi'
              ? `सभी खंड (${nodes.length} अध्याय)`
              : `All Sections (${nodes.length} Chapters)`}
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-sky-600 border-sky-400 text-white'
                    : 'bg-[#0F172A] border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {sec.label[medium]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Interactive Virtual Beaker Mixing Minigame for Chemistry */}
      {subjectId === 'chemistry' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChemistryBeakerLab
            grade={grade}
            medium={medium}
            soundEnabled={adventurer.soundEnabled}
            onDiscoverReactionXP={onEarnLabXP}
          />
        </motion.div>
      )}

      {/* Main Split: 3D Interactive Adventure Map (Left 7) + Chapter Scroll Inspector (Right 5) */}
      <section
        aria-label="Interactive 3D Chapter Quest Map and Inspector"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        <div className="lg:col-span-7">
          <QuestMap3DCanvas
            subjectId={subjectId}
            medium={medium}
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            heroName={adventurer.heroName}
            avatarId={adventurer.avatarId}
            soundEnabled={adventurer.soundEnabled}
            clearedStages={adventurer.clearedStages}
            isSubjectBossUnlocked={isSubjectBossUnlocked}
            isSubjectBossCleared={isSubjectBossCleared}
            onSelectNode={setSelectedNodeId}
            onActivateNode={(nodeId) => {
              if (nodeId === 'subject-boss') {
                if (isSubjectBossUnlocked) onStartSubjectBoss(grade, subjectId);
              } else {
                const match = nodes.find((n) => n.id === nodeId);
                if (match && isNodeUnlocked(match.order)) {
                  onStartChapterNode(nodeId);
                }
              }
            }}
          />
        </div>

        {/* Right: Selected Chapter Scroll & Boss Assessment Inspector */}
        <div className="lg:col-span-5 bg-[#162033]/95 border border-slate-600/80 rounded-2xl p-6 flex flex-col justify-between gap-5 adventure-card-3d">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                      <span className="text-xs font-mono font-semibold text-amber-400 truncate">
                        {subSec.label[medium]} · {selectedChapterNode.chapterCode[medium]}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    <h2 className="font-display text-xl font-bold text-white leading-snug">
                      {selectedChapterNode.title[medium]}
                    </h2>

                    {/* Chapter Guardian Boss Card */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#0F172A] border border-slate-700">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-amber-400/60 shrink-0">
                        <SafeImage
                          src={BOSS_PORTRAIT}
                          alt={selectedChapterNode.bossName[medium]}
                          className="w-full h-full object-cover"
                          fallbackTitle="Boss"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-amber-300 truncate">
                          {selectedChapterNode.bossName[medium]}
                        </p>
                        <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">
                          {qs.length} Qs · {selectedChapterNode.secondsPerQuestion}s/Strike · {tags}
                        </p>
                      </div>
                    </div>

                    {/* Dedicated NCERT Topic Study Notes Codex */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-semibold text-sky-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>
                          {medium === 'hi'
                            ? 'समर्पित NCERT विषय नोट्स (युद्ध-पूर्व तैयारी):'
                            : 'Dedicated Topic Study Notes (Pre-Battle Codex):'}
                        </span>
                      </p>

                      {selectedChapterNode.studyNotes && selectedChapterNode.studyNotes.length > 0 ? (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1.5">
                          {selectedChapterNode.studyNotes.map((note, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700/80 space-y-2"
                            >
                              <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                                {note.topicTitle[medium]}
                              </h3>
                              <p className="text-xs text-slate-200 leading-relaxed">
                                {note.summary[medium]}
                              </p>
                              {note.keyPoints.length > 0 && (
                                <ul className="space-y-1 text-[11px] sm:text-xs text-slate-300">
                                  {note.keyPoints.map((kp, kIdx) => (
                                    <li key={kIdx} className="flex items-start gap-1.5">
                                      <span className="font-mono text-amber-400 font-bold shrink-0">
                                        •
                                      </span>
                                      <span>{kp[medium]}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {note.examTip && (
                                <p className="text-[11px] font-semibold text-emerald-300 pt-1 border-t border-slate-800">
                                  {note.examTip[medium]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {selectedChapterNode.summaryPoints.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-mono text-amber-400 font-bold shrink-0">•</span>
                              <span>{pt[medium]}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80">
                    {unlocked ? (
                      <button
                        type="button"
                        onClick={() => onStartChapterNode(selectedChapterNode.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap"
                      >
                        <Swords className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {cleared
                            ? medium === 'hi'
                              ? `अध्याय ${selectedChapterNode.order} बॉस से फिर लड़ें`
                              : `Rematch Ch. ${selectedChapterNode.order} Boss`
                            : medium === 'hi'
                              ? `अध्याय ${selectedChapterNode.order} बॉस परीक्षा लड़ें`
                              : `Battle Ch. ${selectedChapterNode.order} Boss`}
                        </span>
                      </button>
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-[#0B1220] border border-slate-700 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 text-center">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                        <span>
                          {medium === 'hi'
                            ? `इसे खोलने के लिए पहले अध्याय ${selectedChapterNode.order - 1} जीतें`
                            : `Clear Chapter ${selectedChapterNode.order - 1} Boss first to unlock`}
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
                      <span className="text-xs font-mono font-semibold text-amber-400">
                        {medium === 'hi' ? 'अंतिम विषय चुनौती' : 'Final Subject Assessment'}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>

                    <h2 className="font-display text-xl font-bold text-white">
                      {subjectBossTitle}
                    </h2>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1E1B2E] border border-amber-500/40">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-amber-400 shrink-0">
                        <SafeImage
                          src={BOSS_PORTRAIT}
                          alt={subjectBossTitle}
                          className="w-full h-full object-cover"
                          fallbackTitle="Subject Boss"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-amber-300">
                          {medium === 'hi'
                            ? `${realm.name.hi} विषय महाबॉस`
                            : `${realm.name.en} Final Guardian`}
                        </p>
                        <p className="text-xs text-slate-300 tabular-nums mt-0.5">
                          {subjectBossQuestions.length} Strikes · 30s/Strike · PYQs 2023–2027 &amp; Traps
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {medium === 'hi'
                        ? `यह अंतिम विषय बॉस परीक्षा सभी ${nodes.length} अध्यायों के सबसे महत्वपूर्ण MP बोर्ड PYQ, 2027 IMP और गूढ़ प्रश्नों को जोड़ती है। जीतकर ${realm.name.hi} की बॉस मुहर प्राप्त करें!`
                        : `Unites signature PYQs, 2027 IMPs, and Tricky Conceptual strikes from all ${nodes.length} chapters above. Defeat ${subjectBossTitle} (≥ 60%) to claim the ${realm.name.en} Boss Seal!`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80">
                    {isSubjectBossUnlocked ? (
                      <button
                        type="button"
                        onClick={() => onStartSubjectBoss(grade, subjectId)}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl adventure-btn-gold whitespace-nowrap"
                      >
                        <Crown className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {isSubjectBossCleared
                            ? medium === 'hi'
                              ? 'विषय महाबॉस से फिर लड़ें'
                              : 'Rematch Subject Final Boss'
                            : medium === 'hi'
                              ? 'विषय महाबॉस युद्ध शुरू करें'
                              : 'Challenge Subject Final Boss'}
                        </span>
                      </button>
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-[#0B1220] border border-slate-700 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 text-center">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
                        <span>
                          {medium === 'hi'
                            ? `खोलने के लिए सभी ${nodes.length} अध्याय पूर्ण करें`
                            : `Clear all ${nodes.length} NCERT chapters to unlock Subject Boss`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              );
            })()
          )}
        </div>
      </section>

      {/* Grouped Book / Subsection Chapter Progression Shelves */}
      <section aria-labelledby="chapter-trail-heading" className="space-y-8">
        <div>
          <h2 id="chapter-trail-heading" className="font-display text-2xl font-bold text-white">
            {medium === 'hi'
              ? `${realm.name.hi} — पुस्तक एवं खंड-वार अध्याय प्रगति`
              : `${realm.name.en} — Subsections & Book Chapter Progression`}
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {medium === 'hi'
              ? 'प्रत्येक अध्याय अपनी NCERT पुस्तक व खंड के अंतर्गत व्यवस्थित है।'
              : 'Chapters are structured by official NCERT books and subject subsections.'}
          </p>
        </div>

        <div className="space-y-8">
          {visibleSubsections.map((section) => {
            const sectionNodes = nodes.filter(
              (n) => n.subsectionId === section.id || section.chapterOrders.includes(n.order)
            );
            return (
              <div key={section.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-800">
                  <h3 className="font-display text-lg font-bold text-amber-300 flex items-center gap-2">
                    {subjectId === 'chemistry' ? (
                      <FlaskConical className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    )}
                    <span>{section.label[medium]}</span>
                  </h3>
                  <p className="text-xs text-slate-400">{section.description[medium]}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {sectionNodes.map((node) => {
                    const unlocked = isNodeUnlocked(node.order);
                    const stars = adventurer.clearedStages[node.id] ?? 0;
                    const cleared = stars > 0;
                    const qs = getChapterNodeQuestions(node);
                    const tags = Array.from(new Set(qs.map((q) => q.sourceTag))).join(' · ');

                    return (
                      <article
                        key={node.id}
                        className={`rounded-xl border p-5 flex flex-col justify-between gap-4 ${
                          !unlocked
                            ? 'bg-[#0B1220]/70 border-slate-800 opacity-80'
                            : selectedNodeId === node.id
                              ? 'bg-[#162033] border-amber-400'
                              : 'bg-[#162033] border-slate-700/80'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-semibold text-amber-400">
                              {node.chapterCode[medium]}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                          </div>

                          <h4 className="font-display text-base font-bold text-white leading-snug">
                            {node.order}. {node.title[medium]}
                          </h4>

                          <p className="text-xs text-slate-400">{node.bossName[medium]}</p>

                          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                            {node.summaryPoints[0]?.[medium]}
                          </p>

                          <p className="text-xs text-slate-400 tabular-nums inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                            <span>
                              {qs.length} Qs · {node.secondsPerQuestion}s/Q · {tags}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedNodeId(node.id);
                              window.scrollTo({ top: 180, behavior: 'smooth' });
                            }}
                            className="px-3 py-2 text-xs font-semibold text-slate-200 bg-[#0F172A] border border-slate-700 hover:border-slate-500 rounded-lg whitespace-nowrap"
                          >
                            {medium === 'hi' ? 'नोट्स पढ़ें' : 'Study Notes'}
                          </button>

                          {unlocked ? (
                            <button
                              type="button"
                              onClick={() => onStartChapterNode(node.id)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg adventure-btn-gold whitespace-nowrap"
                            >
                              <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>
                                {cleared
                                  ? medium === 'hi'
                                    ? 'फिर लड़ें'
                                    : 'Rematch Boss'
                                  : medium === 'hi'
                                    ? 'युद्ध लड़ें'
                                    : 'Fight Boss'}
                              </span>
                            </button>
                          ) : (
                            <div className="flex-1 px-3 py-2 rounded-lg bg-[#0B1220] border border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
                              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                              <span>{medium === 'hi' ? 'लॉक है' : 'Locked'}</span>
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

          {/* Subject Final Boss Citadel Row */}
          <div className="rounded-xl border border-amber-500/60 bg-[#1E1B2E] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-mono font-semibold text-amber-400">
                {medium === 'hi' ? 'अंतिम बॉस नोड' : `Node ${nodes.length + 1} · Subject Final Boss`}
              </p>
              <h3 className="font-display text-lg font-bold text-white">{subjectBossTitle}</h3>
              <p className="text-xs text-slate-300">
                {subjectBossQuestions.length} Qs · 30s/Strike ·{' '}
                {medium === 'hi'
                  ? `सभी ${nodes.length} अध्यायों की संयुक्त महाबॉस परीक्षा`
                  : 'Combined raid uniting all book subsections · +250 Victory XP'}
              </p>
            </div>

            {isSubjectBossUnlocked ? (
              <button
                type="button"
                onClick={() => onStartSubjectBoss(grade, subjectId)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Swords className="w-4 h-4" aria-hidden="true" />
                <span>
                  {isSubjectBossCleared
                    ? medium === 'hi'
                      ? 'फिर चुनौती दें'
                      : 'Rematch Subject Boss'
                    : medium === 'hi'
                      ? 'महाबॉस चुनौती'
                      : 'Challenge Subject Boss'}
                </span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-lg bg-[#0B1220] border border-slate-700 inline-flex items-center gap-2 text-xs text-slate-300">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>
                  {medium === 'hi'
                    ? `अध्याय ${nodes.length} के बाद खुलेगा`
                    : `Clear Ch. ${nodes.length} to unlock`}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
