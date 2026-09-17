'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle2,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  Layers,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { SkillType } from '@/types/ielts';
import { playDoubleChime, getTodayDateString, formatMinutes } from '@/lib/ieltsUtils';

const skillOptions: { type: SkillType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'listening', label: 'Listening', icon: Headphones, color: 'var(--listening-color)' },
  { type: 'reading', label: 'Reading', icon: BookOpen, color: 'var(--reading-color)' },
  { type: 'writing', label: 'Writing', icon: PenTool, color: 'var(--writing-color)' },
  { type: 'speaking', label: 'Speaking', icon: Mic, color: 'var(--speaking-color)' },
  { type: 'vocabulary', label: 'Vocabulary', icon: BookMarked, color: 'var(--vocab-color)' },
  { type: 'grammar', label: 'Grammar', icon: Layers, color: 'var(--grammar-color)' },
];

const presetDurations = [
  { label: '25 min', minutes: 25, desc: 'Pomodoro' },
  { label: '40 min', minutes: 40, desc: 'Listening/Reading test' },
  { label: '50 min', minutes: 50, desc: 'Writing Task 2' },
  { label: '60 min', minutes: 60, desc: 'Full Reading exam' },
];

function TimerContent() {
  const searchParams = useSearchParams();
  const initialSkill = (searchParams.get('skill') as SkillType) || 'listening';
  const initialMins = parseInt(searchParams.get('mins') || '40', 10);

  const { addStudySession, stats } = useIELTS();

  const [selectedSkill, setSelectedSkill] = useState<SkillType>(initialSkill);
  const [targetMinutes, setTargetMinutes] = useState<number>(initialMins);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialMins * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [notesInput, setNotesInput] = useState<string>('');
  const [customInput, setCustomInput] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync when query params change
  useEffect(() => {
    if (searchParams.get('mins')) {
      const m = parseInt(searchParams.get('mins') || '40', 10);
      setTargetMinutes(m);
      setSecondsRemaining(m * 60);
      setIsRunning(false);
    }
    if (searchParams.get('skill')) {
      setSelectedSkill((searchParams.get('skill') as SkillType) || 'listening');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setSessionCompleted(true);
            playDoubleChime();
            // Automatically log session
            addStudySession({
              date: getTodayDateString(),
              skill: selectedSkill,
              durationMinutes: targetMinutes,
              notes: notesInput || `${selectedSkill.toUpperCase()} ${targetMinutes}m timer session`,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, targetMinutes, selectedSkill, notesInput, addStudySession]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    setSessionCompleted(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(targetMinutes * 60);
    setSessionCompleted(false);
  };

  const handleSelectDuration = (mins: number) => {
    setIsRunning(false);
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
    setSessionCompleted(false);
  };

  const handleApplyCustom = () => {
    const parsed = parseInt(customInput, 10);
    if (parsed && parsed > 0 && parsed <= 180) {
      handleSelectDuration(parsed);
      setCustomInput('');
    }
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = targetMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  const currentSkillObj = skillOptions.find(s => s.type === selectedSkill) || skillOptions[0];

  return (
    <div className="page-wrapper" style={{ maxWidth: '880px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
          IELTS Deliberate Study Timer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Timed practice trains your exam pacing and concentration under pressure
        </p>
      </div>

      {/* Skill Selector Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '24px',
      }}>
        {skillOptions.map((skill) => {
          const Icon = skill.icon;
          const isSelected = selectedSkill === skill.type;
          return (
            <button
              key={skill.type}
              onClick={() => setSelectedSkill(skill.type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? `2px solid ${skill.color}` : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'var(--bg-card)',
                color: isSelected ? skill.color : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '13.5px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{skill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Timer Display Glass Card */}
      <div className="glass-card" style={{
        padding: '40px 24px',
        textAlign: 'center',
        background: 'var(--hero-bg)',
        border: `1px solid ${currentSkillObj.color}40`,
        boxShadow: isRunning ? `0 0 40px ${currentSkillObj.color}25` : 'var(--glass-shadow)',
        marginBottom: '24px',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          color: currentSkillObj.color,
          fontSize: '12.5px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px',
        }}>
          <span>{currentSkillObj.label} Practice Block</span>
        </div>

        {/* Large Digital Countdown */}
        <div style={{
          fontSize: '84px',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '-0.04em',
          color: 'var(--text-primary)',
          lineHeight: 1,
          margin: '12px 0 20px',
          textShadow: isRunning ? `0 0 30px ${currentSkillObj.color}40` : 'none',
        }}>
          {timeFormatted}
        </div>

        {/* Progress bar */}
        <div style={{
          width: '80%',
          maxWidth: '440px',
          height: '8px',
          background: 'var(--border-strong)',
          borderRadius: '4px',
          margin: '0 auto 28px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: currentSkillObj.color,
            borderRadius: '4px',
            transition: 'width 1s linear',
          }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleStartPause}
            className={`btn btn-lg ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
            style={{ minWidth: '160px', gap: '10px', fontSize: '17px' }}
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start Session'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary btn-lg"
            title="Reset timer"
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>

        {/* Completion Notice */}
        {sessionCompleted && (
          <div style={{
            marginTop: '28px',
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            color: '#34d399',
          }}>
            <CheckCircle2 size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>
                {targetMinutes}-Minute Study Block Finished & Logged!
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                +{targetMinutes} minutes added to today&apos;s study total. Streak updated.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Presets & Custom Time */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Select Duration Preset
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
          {presetDurations.map((p) => (
            <button
              key={p.minutes}
              onClick={() => handleSelectDuration(p.minutes)}
              className={`btn ${targetMinutes === p.minutes ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', flexDirection: 'column', padding: '12px', height: 'auto', gap: '2px' }}
            >
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{p.label}</span>
              <span style={{ fontSize: '11px', opacity: 0.8, fontWeight: 500 }}>{p.desc}</span>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
          <input
            type="number"
            min="1"
            max="180"
            className="input"
            placeholder="Custom minutes (e.g. 35)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            style={{ maxWidth: '240px' }}
          />
          <button onClick={handleApplyCustom} className="btn btn-secondary btn-sm">
            Apply
          </button>
        </div>
      </div>

      {/* Session Notes */}
      <div className="glass-card" style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
          Session Focus Notes (Optional)
        </div>
        <input
          type="text"
          className="input"
          placeholder="e.g. Cambridge 18 Test 2 Section 3, or Agree/Disagree structure notes..."
          value={notesInput}
          onChange={(e) => setNotesInput(e.target.value)}
        />
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
          This note will be automatically attached to your logged study session upon completion.
        </div>
      </div>
    </div>
  );
}

export default function StudyTimerPage() {
  return (
    <Suspense fallback={<div className="page-wrapper" style={{ textAlign: 'center', padding: '40px' }}>Loading Timer...</div>}>
      <TimerContent />
    </Suspense>
  );
}
