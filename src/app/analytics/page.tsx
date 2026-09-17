'use client';

import React from 'react';
import {
  BarChart3,
  Flame,
  Clock,
  CheckCircle2,
  TrendingUp,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes, formatDate } from '@/lib/ieltsUtils';

export default function AnalyticsPage() {
  const { data, stats } = useIELTS();

  // Weekly review calculations (Past 7 days)
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const past7Sessions = data.sessions.filter(s => new Date(s.date) >= sevenDaysAgo);
  const weekStudyMinutes = past7Sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const weekStudyHours = (weekStudyMinutes / 60).toFixed(1);

  const weekListeningTests = data.listening.filter(l => new Date(l.date) >= sevenDaysAgo).length;
  const weekReadingTests = data.reading.filter(r => new Date(r.date) >= sevenDaysAgo).length;
  const weekWritingEssays = data.writing.filter(w => new Date(w.date) >= sevenDaysAgo).length;
  const weekSpeakingTalks = data.speaking.filter(s => new Date(s.date) >= sevenDaysAgo).length;

  const vocabLearnedCount = data.vocabulary.filter(v => v.confidenceLevel >= 3).length;
  const grammarCorrectedCount = data.grammar.filter(g => g.resolved).length;

  // Study hours per day (last 7 days bar data)
  const last7DaysData: { dateStr: string; label: string; hours: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const daySessions = data.sessions.filter(s => s.date === dStr);
    const mins = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    last7DaysData.push({
      dateStr: dStr,
      label: dayName,
      hours: parseFloat((mins / 60).toFixed(1)),
    });
  }

  const maxDailyHours = Math.max(...last7DaysData.map(d => d.hours), 4.0);

  // Skill Score Progression Data
  const listeningScores = data.listening.map(l => ({ date: l.date, band: l.estimatedBand }));
  const readingScores = data.reading.map(r => ({ date: r.date, band: r.estimatedBand }));
  const writingScores = data.writing.map(w => ({ date: w.date, band: w.selfAssessedBand }));
  const speakingScores = data.speaking.map(s => ({ date: s.date, band: s.overallEstimatedBand }));

  // Identify Weakest Skill based on recent band scores
  const skillBands = [
    { name: 'Listening', band: stats.latestListening, icon: Headphones, color: 'var(--listening-color)' },
    { name: 'Reading', band: stats.latestReading, icon: BookOpen, color: 'var(--reading-color)' },
    { name: 'Writing', band: stats.latestWriting, icon: PenTool, color: 'var(--writing-color)' },
    { name: 'Speaking', band: stats.latestSpeaking, icon: Mic, color: 'var(--speaking-color)' },
  ].sort((a, b) => a.band - b.band);

  const weakestSkill = skillBands[0];
  const strongestSkill = skillBands[skillBands.length - 1];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge badge-streak" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <BarChart3 size={13} />
            Performance Analytics
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Objective metrics tracking your sprint to Band 7.0
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
          Study Progress & Weekly Diagnosis
        </h1>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            <Clock size={15} />
            <span>Total Study Hours</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f8fafc', marginTop: '6px' }}>
            {stats.totalStudyHours}h
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Cumulative practice time
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-streak)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            <Flame size={15} />
            <span>Study Streaks</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-streak)', marginTop: '6px' }}>
            {stats.currentStreak} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>/ {stats.longestStreak} best</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Consecutive study days
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            <BookMarked size={15} />
            <span>Vocabulary Learned</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#a855f7', marginTop: '6px' }}>
            {vocabLearnedCount} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>/ {data.vocabulary.length}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Confidence Level 3+ words
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ec4899', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
            <Sparkles size={15} />
            <span>Grammar Rules Fixed</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ec4899', marginTop: '6px' }}>
            {grammarCorrectedCount} <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>/ {data.grammar.length}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Mastered grammatical patterns
          </div>
        </div>
      </div>

      {/* Weekly Review & Next Week Focus Card */}
      <div className="glass-card" style={{
        padding: '24px',
        marginBottom: '28px',
        background: 'var(--hero-bg)',
        border: '1px solid var(--border-accent)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>
              Weekly Diagnostic Review (Past 7 Days)
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
              Sprint Progress Summary
            </h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Week Study</span>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              {weekStudyHours} hours
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div style={{ padding: '12px', background: 'var(--stat-box-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Listening Tests</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{weekListeningTests} completed</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--stat-box-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reading Tests</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{weekReadingTests} completed</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--stat-box-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Writing Essays</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{weekWritingEssays} logged</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--stat-box-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speaking Sessions</div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>{weekSpeakingTalks} logged</div>
          </div>
        </div>

        {/* Next Week Focus Directive */}
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}>
          <Target size={22} color="#f87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase' }}>
              Next Week Focus Priority: {weakestSkill.name} (Current Band: {weakestSkill.band.toFixed(1)})
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              Data shows {weakestSkill.name} is currently your lowest-scoring module. Allocate 20 extra minutes of daily practice specifically targeting this skill&apos;s error analysis.
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart 1: Study Hours per Day (SVG Bar Chart) */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
              Study Hours Per Day (Last 7 Days)
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Target: 3.0 hours/day
            </span>
          </div>
        </div>

        {/* Pure SVG Responsive Bar Chart */}
        <div style={{ width: '100%', height: '220px', position: 'relative' }}>
          <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Target line at 3 hours */}
            {(() => {
              const targetY = 180 - (3.0 / maxDailyHours) * 160;
              return (
                <g>
                  <line
                    x1="40"
                    y1={targetY}
                    x2="98%"
                    y2={targetY}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <text x="42" y={targetY - 6} fill="#10b981" fontSize="10.5" fontWeight="600">
                    Daily 3h Target
                  </text>
                </g>
              );
            })()}

            {/* Bars */}
            {last7DaysData.map((d, index) => {
              const barWidth = 36;
              const xPos = 60 + index * 85;
              const barHeight = (d.hours / maxDailyHours) * 160;
              const yPos = 180 - barHeight;

              return (
                <g key={d.dateStr}>
                  {/* Bar */}
                  <rect
                    x={xPos}
                    y={yPos}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={d.hours >= 3.0 ? '#10b981' : d.hours >= 2.0 ? '#6366f1' : '#f59e0b'}
                    opacity="0.85"
                  />
                  {/* Value on top */}
                  <text
                    x={xPos + barWidth / 2}
                    y={yPos - 6}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize="11"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                  >
                    {d.hours}h
                  </text>
                  {/* Label on bottom */}
                  <text
                    x={xPos + barWidth / 2}
                    y="204"
                    textAnchor="middle"
                    fill="var(--text-muted)"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Skill Band Progression Radar / Cards */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
          Estimated Band Trajectory per Skill (Current → Target 7.0)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {skillBands.map((s) => {
            const Icon = s.icon;
            const gap = 7.0 - s.band;
            const pct = Math.min(100, Math.max(0, Math.round(((s.band - 4.0) / (7.0 - 4.0)) * 100)));

            return (
              <div
                key={s.name}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={18} color={s.color} />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{s.name}</span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: s.color }}>
                    Band {s.band.toFixed(1)}
                  </span>
                </div>

                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--border-strong)',
                  borderRadius: '4px',
                  margin: '12px 0 8px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    backgroundColor: s.color,
                    borderRadius: '4px',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Baseline: 5.5</span>
                  <span>{gap > 0 ? `${gap.toFixed(1)} gap to 7.0` : 'Target Met!'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
