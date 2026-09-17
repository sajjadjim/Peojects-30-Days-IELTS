'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Play,
  Clock,
  Sparkles,
  Flame,
  Award,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  Layers,
  FileEdit,
  Save,
  AlertCircle
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes, formatDate, playDoubleChime } from '@/lib/ieltsUtils';

const skillIconMap: Record<string, React.ElementType> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic,
  vocabulary: BookMarked,
  grammar: Layers,
};

const skillColorMap: Record<string, string> = {
  listening: 'var(--listening-color)',
  reading: 'var(--reading-color)',
  writing: 'var(--writing-color)',
  speaking: 'var(--speaking-color)',
  vocabulary: 'var(--vocab-color)',
  grammar: 'var(--grammar-color)',
};

export default function DailyRoutinePage() {
  const { data, stats, toggleTaskCompletion, updateDayNotes } = useIELTS();
  const currentPlan = stats.todayPlan;
  const [dayNotes, setDayNotes] = useState(currentPlan?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentPlan) return null;

  const allCompleted = currentPlan.tasks.length > 0 && currentPlan.tasks.every(t => t.completed);
  const completionPercentage = Math.round((stats.todayTasksCompleted / stats.todayTasksTotal) * 100);

  const handleToggle = (taskId: string) => {
    toggleTaskCompletion(currentPlan.dayNumber, taskId);
    // If this completes the last task, play celebration chime
    const willBeAllCompleted = currentPlan.tasks.filter(t => t.id !== taskId ? t.completed : !t.completed).every(Boolean);
    if (willBeAllCompleted) {
      playDoubleChime();
    }
  };

  const handleSaveNotes = () => {
    updateDayNotes(currentPlan.dayNumber, dayNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="page-wrapper">
      {/* Top Mission Header */}
      <div className="glass-card" style={{
        padding: '28px',
        background: 'var(--hero-bg)',
        border: '1px solid var(--border-accent)',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-streak">
                <Flame size={13} />
                Streak: {stats.currentStreak} Days
              </span>
              <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>
                Phase {currentPlan.phase}: {currentPlan.phaseTitle}
              </span>
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 800 }}>
              Today&apos;s IELTS Mission — Day {currentPlan.dayNumber}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
              {currentPlan.objective}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'var(--bg-elevated)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Study Time
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: stats.todayStudyMinutes >= data.profile.dailyStudyTargetMinutes ? '#10b981' : 'var(--text-primary)' }}>
                {formatMinutes(stats.todayStudyMinutes)} / {formatMinutes(data.profile.dailyStudyTargetMinutes)}
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Tasks Done
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                {stats.todayTasksCompleted} / {stats.todayTasksTotal} ({completionPercentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {allCompleted && (
        <div className="glass-card" style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <Sparkles size={32} color="#34d399" />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#34d399' }}>
              Day {currentPlan.dayNumber} Complete!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginTop: '2px' }}>
              You completed all scheduled tasks and logged {formatMinutes(stats.todayStudyMinutes)} of deliberate study. Your daily streak has been maintained!
            </p>
          </div>
        </div>
      )}

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        {currentPlan.tasks.map((task) => {
          const Icon = skillIconMap[task.skill] || Clock;
          const color = skillColorMap[task.skill] || 'var(--primary)';

          return (
            <div
              key={task.id}
              className="glass-card"
              style={{
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                border: task.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                background: task.completed ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)',
              }}
            >
              {/* Checkbox and task information */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                <button
                  onClick={() => handleToggle(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: task.completed ? '#10b981' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {task.completed ? (
                    <CheckCircle2 size={26} fill="#10b981" color="var(--bg-main)" />
                  ) : (
                    <Circle size={26} />
                  )}
                </button>

                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  border: `1px solid ${color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>

                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                    <span style={{ textTransform: 'capitalize', color, fontWeight: 600 }}>{task.skill}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      Target: {task.targetMinutes} minutes
                    </span>
                    {task.score && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#818cf8', fontWeight: 600 }}>Estimated Band {task.score}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  href={`/timer?skill=${task.skill}&mins=${task.targetMinutes}`}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  <Play size={13} fill="currentColor" color="#f97316" />
                  <span>Launch {task.targetMinutes}m Timer</span>
                </Link>

                <Link
                  href={`/${task.skill === 'vocabulary' ? 'vocabulary' : task.skill === 'grammar' ? 'grammar' : task.skill}`}
                  className="btn btn-ghost btn-sm"
                >
                  Open Tracker
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Notes & Reflections */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileEdit size={18} color="#818cf8" />
            <h2 style={{ fontSize: '16px', fontWeight: 700 }}>
              Day {currentPlan.dayNumber} Reflection & Notes
            </h2>
          </div>
          {isSaved && (
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
              Notes Saved Successfully!
            </span>
          )}
        </div>

        <textarea
          className="textarea"
          value={dayNotes}
          onChange={(e) => setDayNotes(e.target.value)}
          placeholder="Record notes on what was difficult today (e.g. lost concentration during Section 3 audio, struggled to find synonyms for 'advantage' in Writing Task 2)..."
          rows={4}
        />

        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSaveNotes} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Save size={14} />
            <span>Save Reflections</span>
          </button>
        </div>
      </div>
    </div>
  );
}
