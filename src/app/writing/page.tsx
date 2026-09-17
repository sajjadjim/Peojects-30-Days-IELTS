'use client';

import React, { useState } from 'react';
import {
  PenTool,
  PlusCircle,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Award,
  CheckSquare,
  Square,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { WritingChecklist, WritingPractice } from '@/types/ielts';
import { getTodayDateString, formatDate } from '@/lib/ieltsUtils';

const defaultChecklist: WritingChecklist = {
  // Task Response
  answeredAllParts: false,
  clearPosition: false,
  relevantIdeas: false,
  developedExamples: false,
  // Coherence & Cohesion
  clearParagraphing: false,
  logicalProgression: false,
  linkingWordsUsedNaturally: false,
  // Lexical Resource
  goodVocabulary: false,
  avoidedRepetition: false,
  correctWordForms: false,
  // Grammatical Range & Accuracy
  sentenceVariety: false,
  correctArticles: false,
  correctTenses: false,
  subjectVerbAgreement: false,
  correctPrepositions: false,
};

const samplePrompts = [
  {
    type: 'task_2' as const,
    title: 'University Education: Employment Skills vs Pure Academic Knowledge',
    prompt: 'Some people believe that university education should focus strictly on providing skills for employment, while others believe that the primary focus should be on learning for its own sake. Discuss both views and give your own opinion.'
  },
  {
    type: 'task_2' as const,
    title: 'Environmental Responsibility: Individuals vs Governments & Corporations',
    prompt: 'Environmental problems such as climate change cannot be solved by individual actions alone; only large corporations and governments have the power to make meaningful differences. To what extent do you agree or disagree?'
  },
  {
    type: 'task_1' as const,
    title: 'Academic Task 1: Energy Consumption by Source (1990–2020)',
    prompt: 'The line graph illustrates the consumption of energy across four distinct fuel sources (nuclear, coal, petroleum, and natural gas) in a developed nation between 1990 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.'
  },
];

export default function WritingTrackerPage() {
  const { data, stats, addWritingPractice, addErrorLogItem } = useIELTS();

  const [taskType, setTaskType] = useState<'task_1' | 'task_2'>('task_2');
  const [topic, setTopic] = useState<string>(samplePrompts[0].prompt);
  const [timeSpent, setTimeSpent] = useState<number>(45);
  const [selfAssessedBand, setSelfAssessedBand] = useState<number>(5.5);
  const [essayContent, setEssayContent] = useState<string>('');
  const [checklist, setChecklist] = useState<WritingChecklist>(defaultChecklist);

  const [grammarMistakes, setGrammarMistakes] = useState<string>('');
  const [vocabMistakes, setVocabMistakes] = useState<string>('');
  const [coherenceMistakes, setCoherenceMistakes] = useState<string>('');
  const [taskResponseMistakes, setTaskResponseMistakes] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Live word count
  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const targetWordCount = taskType === 'task_1' ? 150 : 250;

  const toggleChecklistItem = (key: keyof WritingChecklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistItemsCount = Object.values(checklist).filter(Boolean).length;
  const totalChecklistCount = Object.keys(checklist).length;

  const handleSavePractice = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = getTodayDateString();

    const newPractice: Omit<WritingPractice, 'id'> = {
      date: todayStr,
      taskType,
      topic,
      timeSpentMinutes: timeSpent,
      wordCount,
      selfAssessedBand,
      essayContent,
      checklist,
      grammarMistakes: grammarMistakes ? grammarMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      vocabularyMistakes: vocabMistakes ? vocabMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      coherenceMistakes: coherenceMistakes ? coherenceMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      taskResponseMistakes: taskResponseMistakes ? taskResponseMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      evaluationNotes: notes,
    };

    addWritingPractice(newPractice);

    if (grammarMistakes) {
      grammarMistakes.split(',').forEach(item => {
        const str = item.trim();
        if (str) {
          addErrorLogItem({
            date: todayStr,
            skill: 'writing',
            questionOrTopic: `Writing ${taskType.toUpperCase()}: ${topic.slice(0, 40)}...`,
            myAnswer: str,
            correctAnswer: 'Review formal writing structure and sentence syntax',
            whyWrong: 'Identified in essay self-evaluation',
            category: 'Writing Grammar & Vocabulary',
            correctRule: 'Vary complex sentences and eliminate repeated common adjectives',
            reviewed: false,
          });
        }
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-writing">
              <PenTool size={13} />
              Writing Module
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Practice Band: {stats.latestWriting.toFixed(1)} → Target: 7.0
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            IELTS Writing Task 1 & 2 Evaluation Lab
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Evaluate your essays against the 4 official IELTS criteria: Task Response, Coherence, Lexical Resource & Grammar
          </p>
        </div>

        {/* Task Switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { setTaskType('task_1'); setTopic(samplePrompts[2].prompt); }}
            className={`btn btn-sm ${taskType === 'task_1' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Task 1 (Report/Graph)
          </button>
          <button
            onClick={() => { setTaskType('task_2'); setTopic(samplePrompts[0].prompt); }}
            className={`btn btn-sm ${taskType === 'task_2' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Task 2 (Essay)
          </button>
        </div>
      </div>

      <form onSubmit={handleSavePractice}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Left: Essay Editor & Prompt */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
                {taskType === 'task_1' ? 'Task 1: Academic Report' : 'Task 2: Academic Essay'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Target: {targetWordCount}+ words | {taskType === 'task_1' ? '20m' : '40m'}
              </span>
            </div>

            <div>
              <label className="form-label">Essay Prompt / Topic Question</label>
              <textarea
                className="textarea"
                rows={2}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            {/* Essay Content Area */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Essay Body (Draft or paste for word analysis)
                </label>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: wordCount >= targetWordCount ? '#10b981' : '#f59e0b',
                }}>
                  {wordCount} / {targetWordCount} words {wordCount >= targetWordCount ? '✓' : `(needs ${targetWordCount - wordCount} more)`}
                </div>
              </div>

              <textarea
                className="textarea"
                rows={12}
                placeholder="Write or paste your complete essay here to analyze sentence structure, vocabulary, and word count..."
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                style={{ fontSize: '14px', lineHeight: 1.6 }}
              />
            </div>

            {/* Time & Band Slider */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Time Spent (minutes)</label>
                <input
                  type="number"
                  className="input"
                  min="5"
                  max="120"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(parseInt(e.target.value, 10) || 40)}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Self-Assessed Band</label>
                  <strong className="font-mono" style={{ color: 'var(--writing-color)', fontSize: '14px' }}>
                    Band {selfAssessedBand.toFixed(1)}
                  </strong>
                </div>
                <input
                  type="range"
                  min="4"
                  max="9"
                  step="0.5"
                  value={selfAssessedBand}
                  onChange={(e) => setSelfAssessedBand(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--writing-color)' }}
                />
              </div>
            </div>
          </div>

          {/* Right: 4 IELTS Criteria Checklist & Weakness Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                  Official IELTS Writing 4-Pillar Checklist
                </h3>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                  {checklistItemsCount} / {totalChecklistCount} passed
                </span>
              </div>

              {/* Pillar 1: Task Response */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '6px' }}>
                  1. Task Response
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'answeredAllParts' as const, label: 'Addressed all parts of the prompt equally' },
                    { key: 'clearPosition' as const, label: 'Maintained a clear position throughout' },
                    { key: 'relevantIdeas' as const, label: 'Supported ideas with relevant reasoning' },
                    { key: 'developedExamples' as const, label: 'Developed concrete, realistic examples' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checklist[item.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {checklist[item.key] ? (
                        <CheckSquare size={16} color="#f59e0b" />
                      ) : (
                        <Square size={16} color="var(--border-strong)" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 2: Coherence & Cohesion */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  2. Coherence & Cohesion
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'clearParagraphing' as const, label: 'Logical 4 or 5 paragraph structure' },
                    { key: 'logicalProgression' as const, label: 'Clear topic sentences in body paragraphs' },
                    { key: 'linkingWordsUsedNaturally' as const, label: 'Linking words used naturally without over-mechanization' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checklist[item.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {checklist[item.key] ? (
                        <CheckSquare size={16} color="#38bdf8" />
                      ) : (
                        <Square size={16} color="var(--border-strong)" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 3: Lexical Resource */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#a855f7', textTransform: 'uppercase', marginBottom: '6px' }}>
                  3. Lexical Resource (Vocabulary)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'goodVocabulary' as const, label: 'Band 7+ academic collocations used appropriately' },
                    { key: 'avoidedRepetition' as const, label: 'Avoided repetitive words (e.g. good, important)' },
                    { key: 'correctWordForms' as const, label: 'Accurate word formations and spellings' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checklist[item.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {checklist[item.key] ? (
                        <CheckSquare size={16} color="#a855f7" />
                      ) : (
                        <Square size={16} color="var(--border-strong)" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pillar 4: Grammatical Range & Accuracy */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', marginBottom: '6px' }}>
                  4. Grammatical Range & Accuracy
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'sentenceVariety' as const, label: 'Mix of complex, compound, and conditional sentences' },
                    { key: 'correctArticles' as const, label: 'Accurate use of definite (the) and zero articles' },
                    { key: 'correctTenses' as const, label: 'Consistent past/present grammatical tenses' },
                    { key: 'subjectVerbAgreement' as const, label: 'Flawless subject-verb agreement (People are)' },
                    { key: 'correctPrepositions' as const, label: 'Precise prepositions with numbers and trends' },
                  ].map(item => (
                    <div
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: checklist[item.key] ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {checklist[item.key] ? (
                        <CheckSquare size={16} color="#ec4899" />
                      ) : (
                        <Square size={16} color="var(--border-strong)" />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Breakdown Input */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Observed Weaknesses (Comma-separated)
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label">Grammar Errors</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. People is instead of people are, missing article before government"
                    value={grammarMistakes}
                    onChange={(e) => setGrammarMistakes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Vocabulary Repetition</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. repeated 'advantage' 4 times, used 'make' instead of 'render'"
                    value={vocabMistakes}
                    onChange={(e) => setVocabMistakes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Self-Evaluation Notes</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    placeholder="Overall reflections: Intro was strong, but body paragraph 2 lacked a clear real-world illustration..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {savedSuccess ? (
                  <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                    Essay Practice Saved!
                  </span>
                ) : <span />}

                <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                  <Award size={16} />
                  <span>Log Writing Assessment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Writing History Log */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Writing Practice History
        </h2>

        {data.writing.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No essays logged yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.writing.map((essay) => (
              <div
                key={essay.id}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div style={{ minWidth: '280px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="badge badge-writing">{essay.taskType.toUpperCase()}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(essay.date)}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {essay.wordCount} words</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {essay.timeSpentMinutes} mins</span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {essay.topic}
                  </div>

                  {essay.evaluationNotes && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {essay.evaluationNotes}
                    </div>
                  )}

                  {essay.grammarMistakes.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>
                      Errors: {essay.grammarMistakes.join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Self-Assessed Band</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--writing-color)' }}>
                    {essay.selfAssessedBand.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
