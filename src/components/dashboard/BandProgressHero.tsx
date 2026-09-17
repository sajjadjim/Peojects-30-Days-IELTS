'use client';

import React, { useState } from 'react';
import { Target, Flame, CheckCircle2, Clock, ArrowRight, Award, Sliders } from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes } from '@/lib/ieltsUtils';
import CustomPlanBuilderModal from '@/components/plan/CustomPlanBuilderModal';

export default function BandProgressHero() {
  const { stats, data } = useIELTS();
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const studyPercent = Math.min(
    100,
    Math.round((stats.todayStudyMinutes / data.profile.dailyStudyTargetMinutes) * 100)
  );

  const dayPercent = Math.round((stats.currentDayNumber / data.profile.durationDays) * 100);
  const bandGap = Number((data.profile.targetBand - stats.estimatedOverallBand).toFixed(1));

  return (
    <div className="glass-card card-hover-glow" style={{
      padding: '28px',
      background: 'var(--hero-bg)',
      border: '1px solid var(--border-accent)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '240px',
        height: '240px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '28px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left: 30-Day Sprint Progress */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge-shimmer" style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.12)',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              {data.profile.durationDays}-Day IELTS Intensive Sprint
            </span>
            <span className="animate-float-gentle" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-streak)',
              background: 'var(--accent-streak-bg)',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(249, 115, 22, 0.25)',
            }}>
              <Flame size={13} className="text-orange-500 animate-pulse" />
              {stats.currentStreak} Day Streak
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '6px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Day {stats.currentDayNumber} <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 500 }}>/ {data.profile.durationDays}</span>
            </h1>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span>{stats.daysRemaining} days remaining</span>
            </div>
          </div>

          {/* Sprint Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
              <span>Challenge Completion</span>
              <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {dayPercent}% (Day {stats.currentDayNumber} of {data.profile.durationDays})
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${dayPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                borderRadius: '4px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Today's Study Target Progress */}
          <div style={{ marginTop: '18px', padding: '14px', background: 'var(--stat-box-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <Clock size={15} color="#818cf8" />
                <span>Today&apos;s Study Target</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: studyPercent >= 100 ? '#10b981' : 'var(--text-primary)' }}>
                  {formatMinutes(stats.todayStudyMinutes)}
                </span>
                <span style={{ color: 'var(--text-muted)' }}> / {formatMinutes(data.profile.dailyStudyTargetMinutes)}</span>
                <span style={{ marginLeft: '8px', color: '#818cf8' }}>({studyPercent}%)</span>
              </div>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              background: 'var(--border-strong)',
              borderRadius: '5px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${studyPercent}%`,
                height: '100%',
                background: studyPercent >= 100 ? '#10b981' : 'linear-gradient(90deg, #6366f1, #38bdf8)',
                borderRadius: '5px',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>
        </div>

        {/* Right: Practice Band Trajectory & Reality Check */}
        <div style={{
          background: 'var(--hero-subcard-bg)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Target Band Progression
                </span>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(true)}
                  className="interactive-press"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    color: 'var(--primary)',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  title="Customize Plan & Target Band"
                >
                  <Sliders size={11} />
                  <span>Customize Plan</span>
                </button>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}>
                Practice / Estimated
              </span>
            </div>

            {/* Band Numbers Display */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '20px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  Current Practice
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                  marginTop: '4px',
                }}>
                  {stats.estimatedOverallBand.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Band Baseline</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#818cf8',
                }}>
                  <ArrowRight size={18} />
                </div>
                <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: 700 }}>
                  {bandGap > 0 ? `+${bandGap}` : bandGap} GAP
                </span>
              </div>

              <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setIsBuilderOpen(true)} title="Click to customize target band">
                <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                  Target Goal
                </div>
                <div style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: '#10b981',
                  marginTop: '4px',
                  textShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                }}>
                  {data.profile.targetBand.toFixed(1)}
                </div>
                <div style={{ fontSize: '11px', color: '#34d399' }}>Official Goal ✎</div>
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '12px',
          }}>
            Estimated band reflects recent mock tests & practice logs. Not an official IELTS score.
          </div>
        </div>
      </div>

      <CustomPlanBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </div>
  );
}
