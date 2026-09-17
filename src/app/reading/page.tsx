'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Clock,
  Award,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { rawToReadingBand, getTodayDateString, formatDate } from '@/lib/ieltsUtils';
import { ReadingQuestionType, ReadingPractice } from '@/types/ielts';

const questionTypesList: { id: ReadingQuestionType; label: string }[] = [
  { id: 'true_false_not_given', label: 'True / False / Not Given' },
  { id: 'yes_no_not_given', label: 'Yes / No / Not Given' },
  { id: 'matching_headings', label: 'Matching Headings' },
  { id: 'matching_information', label: 'Matching Information' },
  { id: 'multiple_choice', label: 'Multiple Choice' },
  { id: 'sentence_completion', label: 'Sentence Completion' },
  { id: 'summary_completion', label: 'Summary Completion' },
  { id: 'diagram_labeling', label: 'Diagram / Flowchart' },
];

export default function ReadingTrackerPage() {
  const { data, stats, addReadingPractice, addErrorLogItem } = useIELTS();

  const [testName, setTestName] = useState('Cambridge 18 Test 1');
  const [passage, setPassage] = useState<'passage_1' | 'passage_2' | 'passage_3' | 'full_test'>('passage_1');
  const [selectedTypes, setSelectedTypes] = useState<ReadingQuestionType[]>(['true_false_not_given', 'sentence_completion']);
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(13);
  const [correctAnswers, setCorrectAnswers] = useState<number>(8);
  const [timeTaken, setTimeTaken] = useState<number>(20);
  const [mistakeNotes, setMistakeNotes] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const incorrectAnswers = Math.max(0, questionsAttempted - correctAnswers);
  const accuracyPercentage = questionsAttempted > 0 ? (correctAnswers / questionsAttempted) * 100 : 0;
  // Scaled score out of 40 for official IELTS Academic reading conversion
  const scaledScore = questionsAttempted === 40 ? correctAnswers : Math.round((correctAnswers / questionsAttempted) * 40);
  const estimatedBand = rawToReadingBand(scaledScore);

  // Calculate average time and identify weak question types
  const totalPassages = data.reading.length;
  const avgTime = totalPassages > 0
    ? Math.round(data.reading.reduce((acc, r) => acc + r.timeTakenMinutes, 0) / totalPassages)
    : 20;

  // Track question type frequencies
  const typeFrequencies: Record<string, { count: number; correct: number; total: number }> = {};
  data.reading.forEach(r => {
    r.questionTypes.forEach(t => {
      if (!typeFrequencies[t]) typeFrequencies[t] = { count: 0, correct: 0, total: 0 };
      typeFrequencies[t].count++;
      typeFrequencies[t].correct += r.correctAnswers;
      typeFrequencies[t].total += r.questionsAttempted;
    });
  });

  const toggleQuestionType = (type: ReadingQuestionType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleLogPassage = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = getTodayDateString();

    const newPractice: Omit<ReadingPractice, 'id'> = {
      date: todayStr,
      testName,
      passage,
      questionTypes: selectedTypes,
      questionsAttempted,
      correctAnswers,
      incorrectAnswers,
      accuracyPercentage,
      estimatedBand,
      timeTakenMinutes: timeTaken,
      mistakes: mistakeNotes ? mistakeNotes.split('\n').filter(Boolean) : [],
      notes: generalNotes,
    };

    addReadingPractice(newPractice);

    if (mistakeNotes) {
      mistakeNotes.split('\n').forEach(line => {
        const item = line.trim();
        if (item) {
          addErrorLogItem({
            date: todayStr,
            skill: 'reading',
            questionOrTopic: `${testName} - ${passage.replace('_', ' ')}`,
            myAnswer: item,
            correctAnswer: 'Verify direct textual evidence in paragraph',
            whyWrong: `Question type: ${selectedTypes.join(', ') || 'Reading trap'}`,
            category: selectedTypes[0]?.replace(/_/g, ' ') || 'Reading Comprehension',
            correctRule: 'Only choose False if direct contradiction exists; otherwise Not Given',
            reviewed: false,
          });
        }
      });
    }

    setSavedSuccess(true);
    setMistakeNotes('');
    setGeneralNotes('');
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
            <span className="badge badge-reading">
              <BookOpen size={13} />
              Reading Module
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Practice Band: {stats.latestReading.toFixed(1)} → Target: 7.0 (30/40 correct)
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Reading Passage & Speed Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Monitor passage completion timing, target weak question types, and increase scanning speed
          </p>
        </div>
      </div>

      {/* Speed & Weakness Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Average Time Per Passage
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              {avgTime} minutes <span style={{ fontSize: '12px', color: avgTime <= 20 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>(Target: ≤ 20m)</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
            <AlertOctagon size={20} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Priority Reading Drill
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
              True / False / Not Given & Matching Headings
            </div>
          </div>
        </div>
      </div>

      {/* Form + Calculator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Log Reading Passage / Full Test
          </h2>

          <form onSubmit={handleLogPassage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Test Source / Passage Title</label>
              <input
                type="text"
                className="input"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Cambridge 18 Test 1 Passage 1"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Passage</label>
                <select
                  className="select"
                  value={passage}
                  onChange={(e) => setPassage(e.target.value as any)}
                >
                  <option value="passage_1">Passage 1 (Usually factual)</option>
                  <option value="passage_2">Passage 2 (Analytical)</option>
                  <option value="passage_3">Passage 3 (Abstract/Complex)</option>
                  <option value="full_test">Full Exam (3 Passages, 40 Qs)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Time Taken (minutes)</label>
                <input
                  type="number"
                  className="input"
                  min="5"
                  max="90"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(parseInt(e.target.value, 10) || 20)}
                />
              </div>
            </div>

            {/* Question Types */}
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                Question Types in this Passage
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {questionTypesList.map((qt) => {
                  const isChecked = selectedTypes.includes(qt.id);
                  return (
                    <button
                      type="button"
                      key={qt.id}
                      onClick={() => toggleQuestionType(qt.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isChecked ? '1px solid var(--reading-color)' : '1px solid var(--border-subtle)',
                        background: isChecked ? 'var(--reading-bg)' : 'rgba(255, 255, 255, 0.03)',
                        color: isChecked ? 'var(--reading-color)' : 'var(--text-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {qt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Questions Attempted</label>
                <input
                  type="number"
                  className="input"
                  min="1"
                  max="40"
                  value={questionsAttempted}
                  onChange={(e) => setQuestionsAttempted(parseInt(e.target.value, 10) || 13)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Correct Answers</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  max={questionsAttempted}
                  value={correctAnswers}
                  onChange={(e) => setCorrectAnswers(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="form-label">Specific Mistakes (One per line to send to Mistake Book)</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g.&#10;Q4 confused False with Not Given&#10;Q11 word limit exceeded (wrote 3 words instead of NO MORE THAN TWO)"
                value={mistakeNotes}
                onChange={(e) => setMistakeNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                  Passage Logged Successfully!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <PlusCircle size={16} />
                <span>Save Reading Record</span>
              </button>
            </div>
          </form>
        </div>

        {/* Academic Conversion & Timing Diagnosis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{
            padding: '24px',
            background: 'var(--card-tint-blue)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--reading-color)', letterSpacing: '0.05em' }}>
              Official IELTS Academic Reading Conversion
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SCORE</div>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {correctAnswers} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ {questionsAttempted}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#60a5fa' }}>{accuracyPercentage.toFixed(1)}% Accuracy</div>
              </div>

              <div style={{ width: '1px', height: '50px', background: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ESTIMATED BAND</div>
                <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: estimatedBand >= 7.0 ? '#10b981' : estimatedBand >= 6.0 ? '#60a5fa' : '#f59e0b' }}>
                  {estimatedBand.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Target: 7.0 (30+ / 40)
                </div>
              </div>
            </div>

            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
              textAlign: 'left',
              lineHeight: 1.5,
            }}>
              <strong>Pacing Rule of Thumb:</strong> Passage 1: ~17 min, Passage 2: ~20 min, Passage 3: ~23 min.
              Total exam time = 60 minutes with zero extra transfer time.
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Academic Reading Band Scale Reference
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 5.5</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>19–22</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 6.0</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>23–26</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 6.5</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#818cf8' }}>27–29</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#34d399' }}>Band 7.0</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>30–32</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Reading Practice History
        </h2>

        {data.reading.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No reading passages recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Test / Passage</th>
                  <th style={{ padding: '10px 12px' }}>Passage</th>
                  <th style={{ padding: '10px 12px' }}>Time</th>
                  <th style={{ padding: '10px 12px' }}>Score</th>
                  <th style={{ padding: '10px 12px' }}>Accuracy</th>
                  <th style={{ padding: '10px 12px' }}>Estimated Band</th>
                </tr>
              </thead>
              <tbody>
                {data.reading.map((test) => (
                  <tr key={test.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(test.date)}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{test.testName}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {test.passage.replace('_', ' ')}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{test.timeTakenMinutes}m</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                      {test.correctAnswers}/{test.questionsAttempted}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>
                      {test.accuracyPercentage.toFixed(1)}%
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        background: test.estimatedBand >= 7.0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                        color: test.estimatedBand >= 7.0 ? '#34d399' : '#60a5fa',
                      }}>
                        {test.estimatedBand.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
