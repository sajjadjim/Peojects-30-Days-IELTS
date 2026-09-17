'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Award,
  Filter,
  Flame,
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sliders,
  Plus,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes, formatDate } from '@/lib/ieltsUtils';
import { DayPlan, SkillType } from '@/types/ielts';
import { calculatePhases } from '@/lib/planGenerator';
import CustomPlanBuilderModal from '@/components/plan/CustomPlanBuilderModal';

export default function ThirtyDayPlanPage() {
  const { data, stats, toggleTaskCompletion, updateDayNotes, addTaskToDay, deleteTaskFromDay } = useIELTS();
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(stats.currentDayNumber);
  const [editingNotesDay, setEditingNotesDay] = useState<number | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState(false);

  // New task form state
  const [addingTaskForDay, setAddingTaskForDay] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSkill, setNewSkill] = useState<SkillType>('writing');
  const [newMinutes, setNewMinutes] = useState(30);

  const dynamicPhases = useMemo(() => {
    return calculatePhases(data.profile.durationDays || 30);
  }, [data.profile.durationDays]);

  const filteredDays = selectedPhase === 'all'
    ? data.days
    : data.days.filter(d => d.phase === selectedPhase);

  const handleStartEditNotes = (day: DayPlan) => {
    setEditingNotesDay(day.dayNumber);
    setNotesInput(day.notes || '');
  };

  const handleSaveNotes = (dayNumber: number) => {
    updateDayNotes(dayNumber, notesInput);
    setEditingNotesDay(null);
  };

  const handleCreateCustomTask = (dayNumber: number) => {
    if (!newTitle.trim()) return;
    addTaskToDay(dayNumber, {
      dayNumber,
      skill: newSkill,
      title: newTitle.trim(),
      targetMinutes: newMinutes,
      completedMinutes: 0,
      completed: false,
    });
    setNewTitle('');
    setAddingTaskForDay(null);
  };

  const activePhaseObj = selectedPhase !== 'all'
    ? dynamicPhases.find(p => p.phase === selectedPhase)
    : null;

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
            <span className="badge badge-streak">
              <Flame size={13} />
              Sprint Roadmap
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Current: Day {stats.currentDayNumber} of {data.profile.durationDays}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.14)',
              color: '#10b981',
              fontWeight: 700,
            }}>
              Goal: Band {data.profile.targetBand.toFixed(1)}
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            {data.profile.durationDays}-Day IELTS Master Plan
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Personalized progressive training: Baseline {data.profile.currentBand.toFixed(1)} <ArrowRight size={13} style={{ display: 'inline' }} /> Target {data.profile.targetBand.toFixed(1)}
          </p>
        </div>

        {/* Action Controls & Phase Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsPlanBuilderOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ gap: '6px' }}
          >
            <Sliders size={14} />
            <span>Customize Plan & Band</span>
          </button>

          {/* Phase Filter Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedPhase('all')}
              className={`btn btn-sm ${selectedPhase === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All {data.profile.durationDays} Days
            </button>
            {dynamicPhases.map(p => (
              <button
                key={p.phase}
                onClick={() => setSelectedPhase(p.phase)}
                className={`btn btn-sm ${selectedPhase === p.phase ? 'btn-primary' : 'btn-secondary'}`}
              >
                P{p.phase} (D{p.startDay}–{p.endDay})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Phase Banner */}
      {activePhaseObj && (
        <div className="glass-card" style={{
          padding: '20px 24px',
          marginBottom: '24px',
          borderLeft: `4px solid ${activePhaseObj.color}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: activePhaseObj.color }}>
              Phase {activePhaseObj.phase}: {activePhaseObj.title} (Days {activePhaseObj.startDay}–{activePhaseObj.endDay})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Target Focus
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {activePhaseObj.desc}
          </p>
        </div>
      )}

      {/* Days List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDays.map((day) => {
          const isToday = day.dayNumber === stats.currentDayNumber;
          const isExpanded = expandedDay === day.dayNumber;
          const completedTasksCount = day.tasks.filter(t => t.completed).length;
          const totalTasksCount = day.tasks.length;
          const completionPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

          return (
            <div
              key={day.dayNumber}
              className="glass-card"
              style={{
                border: isToday ? '2px solid #818cf8' : '1px solid var(--border-subtle)',
                background: isToday ? 'var(--card-tint-blue)' : 'var(--bg-card)',
                overflow: 'hidden',
              }}
            >
              {/* Day Header Row */}
              <div
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
              >
                {/* Left: Day Badge & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '240px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: isToday ? 'linear-gradient(135deg, #6366f1, #06b6d4)' : day.completed ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-elevated)',
                    border: day.completed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isToday ? '#ffffff' : day.completed ? '#10b981' : 'var(--text-primary)',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Day</span>
                    <span style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1 }}>{day.dayNumber}</span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatDate(day.date)}
                      </span>
                      {isToday && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: '#818cf8',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          border: '1px solid rgba(99, 102, 241, 0.4)',
                        }}>
                          TODAY
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Phase {day.phase}: {day.phaseTitle}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {day.objective}
                    </div>
                  </div>
                </div>

                {/* Right: Task Progress & Accordion Trigger */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {completedTasksCount}/{totalTasksCount} tasks
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {formatMinutes(day.estimatedMinutes)}
                      </div>
                    </div>

                    <div style={{
                      width: '54px',
                      height: '6px',
                      background: 'var(--border-strong)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${completionPct}%`,
                        height: '100%',
                        background: completionPct === 100 ? '#10b981' : '#6366f1',
                      }} />
                    </div>
                  </div>

                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded Tasks & Notes Area */}
              {isExpanded && (
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Scheduled Tasks ({day.tasks.length})
                    </div>
                    <button
                      onClick={() => setAddingTaskForDay(addingTaskForDay === day.dayNumber ? null : day.dayNumber)}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11.5px', gap: '4px', padding: '3px 8px' }}
                    >
                      <Plus size={13} />
                      <span>Add Custom Task</span>
                    </button>
                  </div>

                  {/* Add Custom Task Form */}
                  {addingTaskForDay === day.dayNumber && (
                    <div style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-accent)',
                      marginBottom: '12px',
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                        Add Task to Day {day.dayNumber}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g. Cambridge 18 Reading Passage 2 drill..."
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          style={{ fontSize: '13px' }}
                        />
                        <select
                          className="select"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value as SkillType)}
                          style={{ width: 'auto', fontSize: '12.5px' }}
                        >
                          <option value="listening">Listening</option>
                          <option value="reading">Reading</option>
                          <option value="writing">Writing</option>
                          <option value="speaking">Speaking</option>
                          <option value="vocabulary">Vocabulary</option>
                          <option value="grammar">Grammar</option>
                        </select>
                        <input
                          type="number"
                          className="input"
                          min="5"
                          max="180"
                          step="5"
                          value={newMinutes}
                          onChange={(e) => setNewMinutes(parseInt(e.target.value, 10) || 30)}
                          style={{ width: '80px', fontSize: '12.5px' }}
                          title="Minutes"
                        />
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => handleCreateCustomTask(day.dayNumber)}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 12px' }}
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setAddingTaskForDay(null)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '6px 10px' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: task.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                          borderRadius: 'var(--radius-md)',
                          border: task.completed ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <button
                            onClick={() => toggleTaskCompletion(day.dayNumber, task.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: task.completed ? '#10b981' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              padding: 0,
                            }}
                          >
                            {task.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                          </button>
                          <div style={{ minWidth: 0 }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {task.title}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {task.targetMinutes} min • {task.skill}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Link
                            href={`/timer?skill=${task.skill}&mins=${task.targetMinutes}`}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            title="Start timer"
                          >
                            <Clock size={12} />
                          </Link>

                          {task.id.startsWith('custom-') && (
                            <button
                              onClick={() => deleteTaskFromDay(day.dayNumber, task.id)}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '4px 6px', color: '#ef4444' }}
                              title="Delete task"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Daily Notes Section */}
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Day Notes & Mistake Reflections
                      </div>
                      {editingNotesDay !== day.dayNumber && (
                        <button
                          onClick={() => handleStartEditNotes(day)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '11.5px', padding: '2px 8px' }}
                        >
                          {day.notes ? 'Edit Reflections' : '+ Add Reflections'}
                        </button>
                      )}
                    </div>

                    {editingNotesDay === day.dayNumber ? (
                      <div style={{ marginTop: '8px' }}>
                        <textarea
                          className="textarea"
                          rows={3}
                          value={notesInput}
                          onChange={(e) => setNotesInput(e.target.value)}
                          placeholder="Log key insights from today: which distractor caught you, essay outline flaws, or vocabulary learned..."
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => handleSaveNotes(day.dayNumber)}
                            className="btn btn-primary btn-sm"
                          >
                            Save Note
                          </button>
                          <button
                            onClick={() => setEditingNotesDay(null)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        fontSize: '13px',
                        color: day.notes ? 'var(--text-secondary)' : 'var(--text-dim)',
                        fontStyle: day.notes ? 'normal' : 'italic',
                        background: 'var(--stat-box-bg)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        {day.notes || 'No reflections logged for this day yet.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Custom Plan Builder Modal */}
      <CustomPlanBuilderModal
        isOpen={isPlanBuilderOpen}
        onClose={() => setIsPlanBuilderOpen(false)}
      />
    </div>
  );
}
