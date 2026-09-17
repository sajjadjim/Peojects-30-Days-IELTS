'use client';

import React, { useState } from 'react';
import {
  Headphones,
  PlusCircle,
  AlertTriangle,
  Award,
  Clock,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { rawToListeningBand, getTodayDateString, formatDate } from '@/lib/ieltsUtils';
import { ListeningMistakeCategory, ListeningPractice } from '@/types/ielts';

const mistakeCategoriesList: { id: ListeningMistakeCategory; label: string }[] = [
  { id: 'spelling', label: 'Spelling' },
  { id: 'numbers', label: 'Numbers / Phone / Dates' },
  { id: 'names', label: 'Names & Addresses' },
  { id: 'multiple_choice', label: 'Multiple Choice Audio Speed' },
  { id: 'map', label: 'Map / Floorplan Direction' },
  { id: 'matching', label: 'Matching Options' },
  { id: 'sentence_completion', label: 'Sentence / Note Completion' },
  { id: 'distractors', label: 'Audio Distractors / Traps' },
  { id: 'concentration', label: 'Lapse in Concentration' },
  { id: 'vocabulary', label: 'Unknown Vocabulary / Synonyms' },
];

export default function ListeningTrackerPage() {
  const { data, stats, addListeningPractice, addErrorLogItem } = useIELTS();

  const [testName, setTestName] = useState('Cambridge 18 Test 2');
  const [section, setSection] = useState<'section_1' | 'section_2' | 'section_3' | 'section_4' | 'full_test'>('full_test');
  const [questionsAttempted, setQuestionsAttempted] = useState<number>(40);
  const [correctAnswers, setCorrectAnswers] = useState<number>(23);
  const [timeTaken, setTimeTaken] = useState<number>(32);
  const [selectedMistakes, setSelectedMistakes] = useState<ListeningMistakeCategory[]>(['distractors']);
  const [mistakeNotes, setMistakeNotes] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Calculations
  const incorrectAnswers = Math.max(0, questionsAttempted - correctAnswers);
  const accuracyPercentage = questionsAttempted > 0 ? (correctAnswers / questionsAttempted) * 100 : 0;
  // If full test (40 questions), use official table directly; if partial, scale up to 40 for band estimation
  const scaledScore = questionsAttempted === 40 ? correctAnswers : Math.round((correctAnswers / questionsAttempted) * 40);
  const estimatedBand = rawToListeningBand(scaledScore);

  // Aggregate mistake counts across all historical listening sessions
  const categoryFrequency: Record<string, number> = {};
  data.listening.forEach((test) => {
    test.mistakeCategories.forEach((cat) => {
      categoryFrequency[cat] = (categoryFrequency[cat] || 0) + 1;
    });
  });

  const sortedMistakes = Object.entries(categoryFrequency).sort((a, b) => b[1] - a[1]);
  const mostCommonMistake = sortedMistakes.length > 0 ? sortedMistakes[0] : null;

  const toggleMistakeCategory = (cat: ListeningMistakeCategory) => {
    if (selectedMistakes.includes(cat)) {
      setSelectedMistakes(selectedMistakes.filter(c => c !== cat));
    } else {
      setSelectedMistakes([...selectedMistakes, cat]);
    }
  };

  const handleLogTest = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = getTodayDateString();

    const newPractice: Omit<ListeningPractice, 'id'> = {
      date: todayStr,
      testName,
      section,
      questionsAttempted,
      correctAnswers,
      incorrectAnswers,
      accuracyPercentage,
      estimatedBand,
      timeTakenMinutes: timeTaken,
      mistakeCategories: selectedMistakes,
      mistakes: mistakeNotes ? mistakeNotes.split('\n').filter(Boolean) : [],
      notes: generalNotes,
    };

    addListeningPractice(newPractice);

    // If specific mistake items were recorded, push them to the Error Log
    if (mistakeNotes) {
      mistakeNotes.split('\n').forEach(line => {
        const item = line.trim();
        if (item) {
          addErrorLogItem({
            date: todayStr,
            skill: 'listening',
            questionOrTopic: `${testName} - ${section.replace('_', ' ')}`,
            myAnswer: item,
            correctAnswer: 'Review test transcript & audio timestamp',
            whyWrong: `Classified under: ${selectedMistakes.join(', ') || 'listening error'}`,
            category: selectedMistakes[0] || 'Listening Distractor',
            correctRule: 'Anticipate keyword synonyms before the audio plays',
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
      {/* Page Header */}
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
            <span className="badge badge-listening">
              <Headphones size={13} />
              Listening Module
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Practice Band: {stats.latestListening.toFixed(1)} → Target: 7.0 (30/40 correct)
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Listening Practice Tracker & Error Diagnosis
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Calculate official raw-to-band accuracy, track audio traps, and eliminate recurring test errors
          </p>
        </div>
      </div>

      {/* Analytical Weakness Alert Card */}
      {mostCommonMistake && (
        <div className="glass-card" style={{
          padding: '16px 20px',
          marginBottom: '24px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          background: 'var(--card-tint-red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertOctagon size={24} color="#f87171" />
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fca5a5' }}>
                Most Frequent Weakness: <span style={{ textTransform: 'capitalize', color: '#fff' }}>{mostCommonMistake[0].replace('_', ' ')}</span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                Occurred in {mostCommonMistake[1]} test sessions. Focus your next 40-minute practice session specifically on this question format.
              </div>
            </div>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#f87171', background: 'rgba(239, 68, 68, 0.15)', padding: '4px 10px', borderRadius: '6px' }}>
            Priority 1
          </div>
        </div>
      )}

      {/* Main Grid: Logging Form + Live Score Calculator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Test Entry Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Log Listening Practice Test
          </h2>

          <form onSubmit={handleLogTest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Test Source / Name</label>
              <input
                type="text"
                className="input"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Cambridge 18 Test 1 or Road to IELTS"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Section / Scope</label>
                <select
                  className="select"
                  value={section}
                  onChange={(e) => setSection(e.target.value as any)}
                >
                  <option value="full_test">Full Test (40 Qs)</option>
                  <option value="section_1">Section 1 (Social/Notes)</option>
                  <option value="section_2">Section 2 (Monologue/Map)</option>
                  <option value="section_3">Section 3 (Academic/MCQ)</option>
                  <option value="section_4">Section 4 (Lecture)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Time Taken (min)</label>
                <input
                  type="number"
                  className="input"
                  min="5"
                  max="60"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(parseInt(e.target.value, 10) || 30)}
                />
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
                  onChange={(e) => setQuestionsAttempted(parseInt(e.target.value, 10) || 40)}
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

            {/* Mistake Categories Checkboxes */}
            <div>
              <label className="form-label" style={{ marginBottom: '8px' }}>
                Mistake Categories Identified
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {mistakeCategoriesList.map((cat) => {
                  const isChecked = selectedMistakes.includes(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => toggleMistakeCategory(cat.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: isChecked ? '1px solid var(--listening-color)' : '1px solid var(--border-subtle)',
                        background: isChecked ? 'var(--listening-bg)' : 'rgba(255, 255, 255, 0.03)',
                        color: isChecked ? 'var(--listening-color)' : 'var(--text-muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label">Specific Mistakes (One per line to send to Mistake Book)</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g.&#10;Q7 inverted phone number digits&#10;Q14 missed map coordinates near library&#10;Q28 fell for distractor 'on Tuesdays' instead of 'Wednesdays'"
                value={mistakeNotes}
                onChange={(e) => setMistakeNotes(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">General Reflections & Strategy</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Good focus in Sec 1-2, but lagged in Sec 3 multiple choice questions"
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                  Test Logged Successfully!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <PlusCircle size={16} />
                <span>Save Listening Record</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation & Official Raw-to-Band Benchmark Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{
            padding: '24px',
            background: 'var(--card-tint-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--listening-color)', letterSpacing: '0.05em' }}>
              Official IELTS Academic Listening Conversion
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RAW SCORE</div>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                  {correctAnswers} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ {questionsAttempted}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#38bdf8' }}>{accuracyPercentage.toFixed(1)}% Accuracy</div>
              </div>

              <div style={{ width: '1px', height: '50px', background: 'var(--border-subtle)' }} />

              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PRACTICE BAND</div>
                <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: estimatedBand >= 7.0 ? '#10b981' : estimatedBand >= 6.0 ? '#38bdf8' : '#f59e0b' }}>
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
              <strong>Band 7.0 Benchmark:</strong> Requires 30–31 correct answers out of 40.
              Currently {30 - scaledScore > 0 ? `${30 - scaledScore} more correct answers needed` : 'At or above Band 7.0 target!'}.
            </div>
          </div>

          {/* Quick Raw Score Table reference */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Official Band Score Targets (Listening)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 5.5</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b' }}>18–22</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 6.0</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#38bdf8' }}>23–25</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band 6.5</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#818cf8' }}>26–29</div>
              </div>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '11px', color: '#34d399' }}>Band 7.0</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#10b981' }}>30–31</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Test History */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Listening Practice History
        </h2>

        {data.listening.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No listening tests recorded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Test Name</th>
                  <th style={{ padding: '10px 12px' }}>Section</th>
                  <th style={{ padding: '10px 12px' }}>Score</th>
                  <th style={{ padding: '10px 12px' }}>Accuracy</th>
                  <th style={{ padding: '10px 12px' }}>Practice Band</th>
                  <th style={{ padding: '10px 12px' }}>Mistakes</th>
                </tr>
              </thead>
              <tbody>
                {data.listening.map((test) => (
                  <tr key={test.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(test.date)}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{test.testName}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {test.section.replace('_', ' ')}
                    </td>
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
                        background: test.estimatedBand >= 7.0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.15)',
                        color: test.estimatedBand >= 7.0 ? '#34d399' : '#38bdf8',
                      }}>
                        {test.estimatedBand.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {test.mistakeCategories.map((mc, idx) => (
                          <span key={idx} style={{ fontSize: '11px', padding: '1px 6px', background: 'rgba(239, 68, 68, 0.12)', color: '#fca5a5', borderRadius: '3px' }}>
                            {mc.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
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
