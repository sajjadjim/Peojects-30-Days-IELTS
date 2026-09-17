'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  PlusCircle,
  Clock,
  Award,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { rawToListeningBand, rawToReadingBand, calculateOverallBand, getTodayDateString, formatDate } from '@/lib/ieltsUtils';
import { MockTest } from '@/types/ielts';

export default function MockTestTrackerPage() {
  const { data, stats, addMockTest } = useIELTS();

  const [testName, setTestName] = useState('Cambridge 18 Official Practice Test');
  const [listeningRaw, setListeningRaw] = useState<number>(24);
  const [readingRaw, setReadingRaw] = useState<number>(23);
  const [writingBand, setWritingBand] = useState<number>(5.5);
  const [speakingBand, setSpeakingBand] = useState<number>(5.5);
  const [totalTimeMinutes, setTotalTimeMinutes] = useState<number>(165);
  const [notes, setNotes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Automatic band calculations
  const listeningBand = rawToListeningBand(listeningRaw);
  const readingBand = rawToReadingBand(readingRaw);
  const overallBand = calculateOverallBand(listeningBand, readingBand, writingBand, speakingBand);

  const handleLogMockTest = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = getTodayDateString();

    const newTest: Omit<MockTest, 'id'> = {
      date: todayStr,
      testName,
      listeningRawScore: listeningRaw,
      listeningBand,
      readingRawScore: readingRaw,
      readingBand,
      writingBand,
      speakingBand,
      overallBand,
      totalTimeMinutes,
      notes,
    };

    addMockTest(newTest);
    setSavedSuccess(true);
    setNotes('');
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
            <span className="badge badge-streak" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              <FileCheck2 size={13} />
              Full Exam Simulation
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Overall Practice Band: {stats.estimatedOverallBand.toFixed(1)} → Target: 7.0
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Full Mock Test Simulator & Score Averaging
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Simulate complete 4-skill testing conditions with official IELTS rounding criteria
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Mock Test Logging Form */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Log Full Mock Test Results
          </h2>

          <form onSubmit={handleLogMockTest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label">Mock Test Name / Edition</label>
              <input
                type="text"
                className="input"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Cambridge 18 Test 2 Full Simulation"
                required
              />
            </div>

            {/* Listening & Reading Raw Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Listening Raw (/40)</label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#06b6d4' }}>
                    Band {listeningBand.toFixed(1)}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="40"
                  className="input"
                  value={listeningRaw}
                  onChange={(e) => setListeningRaw(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Reading Raw (/40)</label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6' }}>
                    Band {readingBand.toFixed(1)}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="40"
                  className="input"
                  value={readingRaw}
                  onChange={(e) => setReadingRaw(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>
            </div>

            {/* Writing & Speaking Self-Assessed Bands */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Writing Practice Band</label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                    Band {writingBand.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="9"
                  step="0.5"
                  value={writingBand}
                  onChange={(e) => setWritingBand(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--writing-color)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Speaking Practice Band</label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>
                    Band {speakingBand.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="9"
                  step="0.5"
                  value={speakingBand}
                  onChange={(e) => setSpeakingBand(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--speaking-color)' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Total Exam Duration (minutes)</label>
              <input
                type="number"
                min="60"
                max="240"
                className="input"
                value={totalTimeMinutes}
                onChange={(e) => setTotalTimeMinutes(parseInt(e.target.value, 10) || 165)}
              />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Standard exam duration: 165 minutes (Listening 30m + Reading 60m + Writing 60m + Speaking 15m).
              </div>
            </div>

            <div>
              <label className="form-label">Test Notes & Reflections</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g. Fatigue hit during Reading passage 3. Managed time well on Writing Task 2..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                  Mock Test Logged!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <PlusCircle size={16} />
                <span>Save Full Mock Test</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Calculation & IELTS Rounding Rule Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{
            padding: '28px',
            textAlign: 'center',
            background: 'var(--card-tint-blue)',
            border: '1px solid var(--border-accent)',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.06em' }}>
              Official IELTS Score Averaging
            </div>

            <div style={{ fontSize: '56px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: overallBand >= 7.0 ? '#10b981' : '#818cf8', margin: '14px 0' }}>
              {overallBand.toFixed(1)}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '6px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              marginBottom: '16px',
            }}>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>L</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>{listeningBand.toFixed(1)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>R</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>{readingBand.toFixed(1)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>W</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{writingBand.toFixed(1)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>S</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{speakingBand.toFixed(1)}</div>
              </div>
            </div>

            <div style={{
              fontSize: '12.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
              textAlign: 'left',
            }}>
              <strong>Official IELTS Rounding Rule:</strong> If the average of the four scores ends in .25, it rounds UP to .5. If it ends in .75, it rounds UP to the next whole band.
            </div>
          </div>
        </div>
      </div>

      {/* Mock Tests History Table */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
          Mock Test Performance History
        </h2>

        {data.mockTests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No full mock tests logged yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Test Name</th>
                  <th style={{ padding: '10px 12px' }}>Listening</th>
                  <th style={{ padding: '10px 12px' }}>Reading</th>
                  <th style={{ padding: '10px 12px' }}>Writing</th>
                  <th style={{ padding: '10px 12px' }}>Speaking</th>
                  <th style={{ padding: '10px 12px' }}>Overall Band</th>
                  <th style={{ padding: '10px 12px' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {data.mockTests.map((mt) => (
                  <tr key={mt.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{formatDate(mt.date)}</td>
                    <td style={{ padding: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{mt.testName}</td>
                    <td style={{ padding: '12px', color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>Band {mt.listeningBand.toFixed(1)}</td>
                    <td style={{ padding: '12px', color: '#3b82f6', fontFamily: 'var(--font-mono)' }}>Band {mt.readingBand.toFixed(1)}</td>
                    <td style={{ padding: '12px', color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>Band {mt.writingBand.toFixed(1)}</td>
                    <td style={{ padding: '12px', color: '#10b981', fontFamily: 'var(--font-mono)' }}>Band {mt.speakingBand.toFixed(1)}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        background: mt.overallBand >= 7.0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: mt.overallBand >= 7.0 ? '#34d399' : '#a5b4fc',
                        border: mt.overallBand >= 7.0 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
                      }}>
                        Band {mt.overallBand.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{mt.totalTimeMinutes}m</td>
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
