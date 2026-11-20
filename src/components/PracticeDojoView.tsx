import { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FlaskConical, Play, Sparkles, Swords } from 'lucide-react';
import { getChapterNodeQuestions, getChapterNodesForSubject } from '../data/mpboardIndex';
import { SUBJECT_REALMS } from '../data/questConfig';
import { AdventurerState, GradeLevel, Medium, SubjectId } from '../types/quiz';
import { ChemistryBeakerLab } from './ChemistryBeakerLab';

interface PracticeDojoViewProps {
  grade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  medium: Medium;
  adventurer: AdventurerState;
  onStartChapterNode: (nodeId: string) => void;
  onStartSubjectBoss: (grade: GradeLevel, subjectId: SubjectId) => void;
  onEarnLabXP: (reactionId: string, xp: number) => void;
}

export function PracticeDojoView({
  grade,
  onGradeChange,
  medium,
  adventurer,
  onStartChapterNode,
  onStartSubjectBoss,
  onEarnLabXP,
}: PracticeDojoViewProps) {
  const [practiceTab, setPracticeTab] = useState<'notes' | 'beaker'>('notes');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('hindi');
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  const nodes = useMemo(
    () => getChapterNodesForSubject(grade, selectedSubject),
    [grade, selectedSubject]
  );

  return (
    <main className="max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-5">
      {/* Header Card */}
      <section className="comic-card rounded-3xl overflow-hidden bg-white">
        <div className="comic-banner-blue comic-gloss border-b-[2.5px] border-[#181C32] p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-mono font-extrabold text-[#FEF08A]">
              {medium === 'hi' ? 'अभ्यास एवं नोट्स डोजो' : 'PRACTICE & NOTES DOJO'}
            </p>
            <h1 className="font-display text-2xl font-bold text-white leading-tight">
              {medium === 'hi'
                ? 'NCERT नोट्स, क्विक ड्रिल व बीकर लैब'
                : 'Quick Drills, NCERT Notes & Beaker Lab'}
            </h1>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-white border-2 border-[#181C32] gap-1 shrink-0">
            {(['10', '12'] as GradeLevel[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGradeChange(g)}
                className={`min-h-[38px] px-3 py-1 text-xs font-extrabold rounded-lg ${
                  grade === g ? 'bg-[#FACC15] text-[#181C32]' : 'text-slate-600'
                }`}
              >
                {medium === 'hi' ? `${g}वीं` : `Class ${g}th`}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="p-4 sm:p-5 grid grid-cols-2 gap-2.5 bg-[#EFF6FF]">
          <button
            type="button"
            onClick={() => setPracticeTab('notes')}
            className={`min-h-[46px] px-3 py-2 rounded-2xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold ${
              practiceTab === 'notes' ? 'bg-[#FACC15] text-[#181C32]' : 'bg-white text-[#181C32]'
            }`}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'नोट्स व अध्याय ड्रिल' : 'Study Notes & Drills'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPracticeTab('beaker')}
            className={`min-h-[46px] px-3 py-2 rounded-2xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold ${
              practiceTab === 'beaker' ? 'bg-[#34D399] text-[#181C32]' : 'bg-white text-[#181C32]'
            }`}
          >
            <FlaskConical className="w-4 h-4" aria-hidden="true" />
            <span>{medium === 'hi' ? 'केमिस्ट्री बीकर लैब' : 'Chem Beaker Lab'}</span>
          </button>
        </div>
      </section>

      {practiceTab === 'beaker' ? (
        <ChemistryBeakerLab
          grade={grade}
          medium={medium}
          soundEnabled={adventurer.soundEnabled}
          onDiscoverReactionXP={onEarnLabXP}
        />
      ) : (
        <section className="space-y-4">
          {/* Subject Filter Pills (Horizontally scrollable on mobile) */}
          <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
            {SUBJECT_REALMS.map((r) => {
              const active = r.id === selectedSubject;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(r.id);
                    setExpandedNodeId(null);
                  }}
                  className={`min-h-[44px] px-4 py-2 text-xs font-extrabold rounded-2xl comic-btn-sm whitespace-nowrap shrink-0 ${
                    active ? 'bg-[#2563EB] text-white' : 'bg-white text-[#181C32]'
                  }`}
                >
                  {r.name[medium]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onStartSubjectBoss(grade, selectedSubject)}
              className="min-h-[44px] px-4 py-2 text-xs font-extrabold rounded-2xl bg-[#FB7185] text-[#181C32] comic-btn-sm comic-gloss inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Swords className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{medium === 'hi' ? 'विषय बॉस टेस्ट' : 'Subject Boss Blitz'}</span>
            </button>
          </div>

          {/* Expandable Study Notes + 1-Tap Drill List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {nodes.map((node) => {
              const expanded = expandedNodeId === node.id;
              const qs = getChapterNodeQuestions(node);
              const clearedStars = adventurer.clearedStages[node.id] ?? 0;

              return (
                <article key={node.id} className="comic-card rounded-3xl p-4 bg-white space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-mono font-extrabold text-[#2563EB]">
                        {node.chapterCode[medium]} · {qs.length} Qs
                      </p>
                      <h2 className="font-display text-base sm:text-lg font-bold text-[#181C32] leading-snug">
                        {node.order}. {node.title[medium]}
                      </h2>
                    </div>

                    {clearedStars > 0 && (
                      <span className="font-mono text-xs font-extrabold text-[#059669] shrink-0">
                        ★ {clearedStars}/3
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-600 leading-relaxed">
                    {node.summaryPoints[0]?.[medium]}
                  </p>

                  {expanded && (
                    <div className="p-3 rounded-2xl bg-[#F8FAFF] border-2 border-[#181C32] space-y-2.5 max-h-64 overflow-y-auto">
                      {node.studyNotes && node.studyNotes.length > 0 ? (
                        node.studyNotes.map((note, idx) => (
                          <div key={idx} className="space-y-1 pb-2 border-b border-slate-200 last:border-b-0 last:pb-0">
                            <p className="text-xs font-extrabold text-[#2563EB] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 shrink-0" aria-hidden="true" />
                              <span>{note.topicTitle[medium]}</span>
                            </p>
                            <p className="text-xs text-[#181C32] leading-relaxed">
                              {note.summary[medium]}
                            </p>
                            {note.examTip && (
                              <p className="text-[11px] font-bold text-[#059669]">
                                {note.examTip[medium]}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <ul className="space-y-1 text-xs text-[#181C32]">
                          {node.summaryPoints.map((pt, pIdx) => (
                            <li key={pIdx}>• {pt[medium]}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setExpandedNodeId(expanded ? null : node.id)}
                      className="min-h-[44px] flex-1 px-3 py-2 text-xs font-extrabold bg-[#F8FAFF] text-[#181C32] rounded-xl comic-btn-sm inline-flex items-center justify-center gap-1.5"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" aria-hidden="true" />
                          <span>{medium === 'hi' ? 'नोट्स बंद करें' : 'Hide Notes'}</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" aria-hidden="true" />
                          <span>{medium === 'hi' ? 'नोट्स पढ़ें' : 'Read Notes'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartChapterNode(node.id)}
                      className="min-h-[44px] flex-1 px-3 py-2 text-xs font-extrabold bg-[#FACC15] hover:bg-[#FDE047] text-[#181C32] rounded-xl comic-btn-sm comic-gloss inline-flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                      <span>{medium === 'hi' ? 'क्विज़ खेलें' : 'Practice Quiz'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
