'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  Play,
  Timer,
  Clock,
  Sparkles,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  BookMarked,
  Layers,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes } from '@/lib/ieltsUtils';

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

export default function TodayRoutine() {
  const { data, stats, toggleTaskCompletion } = useIELTS();
  const [activeTaskNote, setActiveTaskNote] = useState<string | null>(null);

  const currentPlan = stats.todayPlan;
  if (!currentPlan) return null;

  const allCompleted = currentPlan.tasks.length > 0 && currentPlan.tasks.every(t => t.completed);

  return (
    <div className="glass-card" style={{ padding: '24px', margin: '24px 0' }}>
      {/* Header with Today's Goal */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#818cf8',
              background: 'rgba(99, 102, 241, 0.12)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              Today&apos;s IELTS Mission
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Phase {currentPlan.phase}: {currentPlan.phaseTitle}
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '4px' }}>
            Day {currentPlan.dayNumber} Routine Checklist
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {currentPlan.objective}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tasks Done</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {stats.todayTasksCompleted} / {stats.todayTasksTotal}
            </div>
          </div>
          <Link href="/daily" className="btn btn-secondary btn-sm">
            <span>Focus Mode</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Completion Banner if all tasks are finished */}
      {allCompleted && (
        <div style={{
          marginTop: '16px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#34d399',
        }}>
          <Sparkles size={22} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px' }}>
              Day {currentPlan.dayNumber} Mission Accomplished!
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Great discipline today. Remember to log and review your mistakes in the Mistake Book.
            </div>
          </div>
        </div>
      )}

      {/* Tasks Checklist Grid */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {currentPlan.tasks.map((task) => {
          const Icon = skillIconMap[task.skill] || CheckCircle2;
          const color = skillColorMap[task.skill] || 'var(--primary)';

          return (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-elevated)',
                border: task.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Left: Checkbox & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <button
                  onClick={() => toggleTaskCompletion(currentPlan.dayNumber, task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: task.completed ? '#10b981' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 size={22} fill="#10b981" color="var(--bg-main)" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <span style={{ textTransform: 'capitalize', color }}>{task.skill}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={11} />
                      {task.targetMinutes} min
                    </span>
                    {task.score && (
                      <>
                        <span>•</span>
                        <span style={{ color: '#818cf8', fontWeight: 600 }}>Band {task.score}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Quick Timer Launch button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  href={`/timer?skill=${task.skill}&mins=${task.targetMinutes}`}
                  className="btn btn-secondary btn-sm"
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    gap: '4px',
                  }}
                  title={`Start ${task.targetMinutes}m timer for ${task.title}`}
                >
                  <Timer size={13} color="#f97316" />
                  <span>{task.targetMinutes}m Timer</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
