'use client';

import React from 'react';
import Link from 'next/link';
import { AlertOctagon, ArrowRight, Lightbulb, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';

const MOTIVATIONS = [
  'Consistency beats occasional long study sessions.',
  'Focus on today\'s practice.',
  'Review your mistakes before chasing new questions.',
  'One focused session at a time.',
  'Band 7.0 is earned through error analysis, not random test completion.',
];

export default function WeakAreaAlert() {
  const { data, stats } = useIELTS();

  // Find most frequent mistake category across listening, reading, and errors
  const categoryCounts: Record<string, number> = {};
  data.errors.forEach(e => {
    categoryCounts[e.category] = (categoryCounts[e.category] || 0) + (e.occurrenceCount || 1);
  });
  data.listening.forEach(l => {
    l.mistakeCategories.forEach(mc => {
      const label = mc.replace(/_/g, ' ');
      categoryCounts[label] = (categoryCounts[label] || 0) + 1;
    });
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const topWeakness = sortedCategories.length > 0 ? sortedCategories[0] : null;

  // Pick daily motivational message based on current day number
  const motivationalQuote = MOTIVATIONS[(stats.currentDayNumber - 1) % MOTIVATIONS.length];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '16px',
      margin: '24px 0',
    }}>
      {/* Weak-Area Alert */}
      <div className="glass-card" style={{
        padding: '18px 20px',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        background: 'var(--card-tint-red)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <AlertOctagon size={16} />
              <span>Priority Weak-Area Focus</span>
            </div>
            <span style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '4px', fontWeight: 600 }}>
              {data.errors.filter(e => !e.reviewed).length} unreviewed errors
            </span>
          </div>

          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {topWeakness ? (
              <>Most frequent trap: <span style={{ color: '#ef4444', textTransform: 'capitalize' }}>{topWeakness[0]}</span> ({topWeakness[1]} errors logged)</>
            ) : (
              <>No repeated errors identified yet. Keep logging practice tests.</>
            )}
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
            Analyze why you picked the distractor before moving to fresh questions. Mastering recurring mistakes is the fastest path from 5.5 to 7.0.
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link href="/mistakes" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>
            <span>Open Mistake Book</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Motivational Mindset Card */}
      <div className="glass-card" style={{
        padding: '18px 20px',
        border: '1px solid var(--border-accent)',
        background: 'var(--card-tint-blue)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <Lightbulb size={16} />
            <span>Daily Discipline Mindset</span>
          </div>

          <div style={{ fontSize: '16px', fontWeight: 700, fontStyle: 'italic', color: 'var(--text-primary)', marginTop: '4px' }}>
            &ldquo;{motivationalQuote}&rdquo;
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
            Study target: <strong style={{ color: 'var(--text-primary)' }}>{data.profile.dailyStudyTargetMinutes / 60} hours/day</strong>. Stay focused on one test section at a time.
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Link href="/timer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>
            <span>Launch Focused Study Block</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
