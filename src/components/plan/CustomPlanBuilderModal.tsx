'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Target,
  Clock,
  CheckCircle2,
  Sliders,
  Flame,
  Zap,
  Shield,
  Award,
  ArrowRight
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { calculatePhases, PlanGenerationOptions } from '@/lib/planGenerator';

interface CustomPlanBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomPlanBuilderModal({ isOpen, onClose }: CustomPlanBuilderModalProps) {
  const { data, buildCustomPlan } = useIELTS();

  const [targetBand, setTargetBand] = useState<number>(data.profile.targetBand || 7.0);
  const [currentBand, setCurrentBand] = useState<number>(data.profile.currentBand || 5.5);
  const [durationDays, setDurationDays] = useState<number>(data.profile.durationDays || 30);
  const [isCustomDays, setIsCustomDays] = useState<boolean>(![7, 14, 30, 45, 60].includes(data.profile.durationDays));
  const [dailyMinutes, setDailyMinutes] = useState<number>(data.profile.dailyStudyTargetMinutes || 180);
  const [focusArea, setFocusArea] = useState<'balanced' | 'writing_speaking' | 'reading_listening' | 'foundation'>('balanced');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  if (!isOpen) return null;

  const previewPhases = calculatePhases(durationDays);
  const bandGap = Number((targetBand - currentBand).toFixed(1));

  // Calculate projected exam date
  const endExamDate = new Date(startDate);
  endExamDate.setDate(endExamDate.getDate() + (durationDays - 1));
  const examDateStr = endExamDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const durationPresets = [
    { days: 7, label: '7 Days', desc: 'Crash Sprint', icon: Zap },
    { days: 14, label: '14 Days', desc: 'High-Yield Booster', icon: Flame },
    { days: 30, label: '30 Days', desc: 'Official Sprint', icon: Target },
    { days: 45, label: '45 Days', desc: 'Skill Mastery', icon: Shield },
    { days: 60, label: '60 Days', desc: 'Band 8+ Immersion', icon: Award },
  ];

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    const options: PlanGenerationOptions = {
      durationDays,
      targetBand,
      currentBand,
      dailyStudyMinutes: dailyMinutes,
      focusArea,
      startDate,
    };
    buildCustomPlan(options);
    setIsGenerated(true);
    setTimeout(() => {
      setIsGenerated(false);
      onClose();
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto',
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-card-solid)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="interactive-press hover:text-white"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
          }}
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '24px', paddingRight: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.14)',
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              Personal Freedom & Custom Strategy
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            IELTS Target & Custom Plan Builder
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Build your personalized curriculum: set how many days you need, choose your target band, and dynamically generate daily routines tailored to your schedule.
          </p>
        </div>

        {isGenerated ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {durationDays}-Day Custom Plan Generated!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '420px' }}>
              Your target of Band {targetBand.toFixed(1)} is set. Your daily missions have been updated and synchronized with your local & cloud storage.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBuild} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Step 1: Target Band & Baseline Selection */}
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Target size={18} color="var(--primary)" />
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  1. IELTS Band Objective
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Target Band Goal */}
                <div>
                  <label className="form-label">
                    Target Band Goal (Required Score)
                  </label>
                  <select
                    className="select"
                    value={targetBand}
                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                    style={{ fontSize: '15px', fontWeight: 700 }}
                  >
                    {[5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)} {b >= 8.0 ? '— Very Good / Expert' : b >= 7.0 ? '— Good User (C1 CEFR)' : '— Competent User'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Current Baseline Band */}
                <div>
                  <label className="form-label">
                    Current Practice Baseline
                  </label>
                  <select
                    className="select"
                    value={currentBand}
                    onChange={(e) => setCurrentBand(parseFloat(e.target.value))}
                    style={{ fontSize: '15px', fontWeight: 600 }}
                  >
                    {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)} Baseline
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Real-time Gap Banner */}
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '13px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Target Improvement:
                </span>
                <span style={{
                  fontWeight: 700,
                  color: bandGap > 0 ? 'var(--primary)' : '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  {currentBand.toFixed(1)} <ArrowRight size={14} /> {targetBand.toFixed(1)}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    fontSize: '11px',
                  }}>
                    {bandGap > 0 ? `+${bandGap} Band Gap` : 'Maintain Baseline'}
                  </span>
                </span>
              </div>
            </div>

            {/* Step 2: Custom Plan Duration (Days) */}
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#06b6d4" />
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                    2. Plan Duration (How Many Days?)
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#06b6d4' }}>
                  {durationDays} Days Total
                </span>
              </div>

              {/* Preset buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
                gap: '10px',
                marginBottom: '14px',
              }}>
                {durationPresets.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = !isCustomDays && durationDays === preset.days;
                  return (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => {
                        setIsCustomDays(false);
                        setDurationDays(preset.days);
                      }}
                      className="interactive-press"
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={18} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                      <span style={{ fontWeight: 800, fontSize: '14px' }}>{preset.label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{preset.desc}</span>
                    </button>
                  );
                })}

                {/* Custom days button */}
                <button
                  type="button"
                  onClick={() => setIsCustomDays(true)}
                  className="interactive-press"
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: isCustomDays ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: isCustomDays ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                    color: isCustomDays ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Sliders size={18} color={isCustomDays ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>Custom</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Your choice</span>
                </button>
              </div>

              {/* Custom Number Input if selected */}
              {isCustomDays && (
                <div style={{
                  padding: '12px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ margin: 0, fontSize: '12px' }}>
                      Enter exact number of days (e.g. 10, 21, 40, 90, 120):
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="365"
                      className="input"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(3, parseInt(e.target.value, 10) || 30))}
                      style={{ marginTop: '6px', fontSize: '15px', fontWeight: 700 }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '160px' }}>
                    Plan dynamically scales phases from Day 1 to Day {durationDays}.
                  </div>
                </div>
              )}

              {/* Start Date & Projected Finish */}
              <div style={{
                marginTop: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Sprint Start:</span>
                  <input
                    type="date"
                    className="input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '12.5px', width: 'auto' }}
                  />
                </div>
                <div>
                  Ready by: <strong style={{ color: '#10b981' }}>{examDateStr}</strong>
                </div>
              </div>
            </div>

            {/* Step 3: Daily Study Time & Focus Strategy */}
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Clock size={18} color="#f59e0b" />
                <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                  3. Daily Commitment & Focus Modules
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Daily Study Target */}
                <div>
                  <label className="form-label">
                    Daily Study Target: {Math.floor(dailyMinutes / 60)}h {dailyMinutes % 60 > 0 ? `${dailyMinutes % 60}m` : ''} ({dailyMinutes} min/day)
                  </label>
                  <select
                    className="select"
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10))}
                  >
                    <option value={60}>1 hour / day (Light)</option>
                    <option value={120}>2 hours / day (Moderate)</option>
                    <option value={180}>3 hours / day (Recommended)</option>
                    <option value={240}>4 hours / day (Intensive Sprint)</option>
                    <option value={300}>5 hours / day (Full Immersion)</option>
                  </select>
                </div>

                {/* Priority Focus */}
                <div>
                  <label className="form-label">
                    Curriculum Focus Allocation
                  </label>
                  <select
                    className="select"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value as any)}
                  >
                    <option value="balanced">Balanced (All 4 modules equally drilled)</option>
                    <option value="writing_speaking">Writing & Speaking Heavy (Active output focus)</option>
                    <option value="reading_listening">Reading & Listening Heavy (Comprehension & speed)</option>
                    <option value="foundation">Comprehensive (Extra vocab & grammar drill)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dynamic Phase Breakdown Preview */}
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Generated Roadmap Phases Preview ({durationDays} Days)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {previewPhases.map((p) => (
                  <div
                    key={p.phase}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      borderLeft: `3px solid ${p.color}`,
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 800, color: p.color }}>
                      Phase {p.phase} (D{p.startDay}–{p.endDay})
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit & Cancel Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary interactive-press"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary interactive-press"
                style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
              >
                <Sparkles size={16} />
                <span>Generate & Activate My Plan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
