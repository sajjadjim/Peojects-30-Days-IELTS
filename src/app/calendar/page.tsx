'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileText,
  Flame,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { formatMinutes, formatDate } from '@/lib/ieltsUtils';

export default function CalendarPage() {
  const { data, stats } = useIELTS();

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Map study sessions and day plan tasks by date string (YYYY-MM-DD)
  const sessionsByDate: Record<string, number> = {};
  data.sessions.forEach(s => {
    sessionsByDate[s.date] = (sessionsByDate[s.date] || 0) + s.durationMinutes;
  });

  const plansByDate: Record<string, typeof data.days[0]> = {};
  data.days.forEach(d => {
    plansByDate[d.date] = d;
  });

  // Selected date details
  const selectedDayPlan = plansByDate[selectedDateStr];
  const selectedDayMinutes = sessionsByDate[selectedDateStr] || 0;
  const selectedSessions = data.sessions.filter(s => s.date === selectedDateStr);
  const selectedListening = data.listening.filter(l => l.date === selectedDateStr);
  const selectedReading = data.reading.filter(r => r.date === selectedDateStr);
  const selectedWriting = data.writing.filter(w => w.date === selectedDateStr);
  const selectedSpeaking = data.speaking.filter(s => s.date === selectedDateStr);
  const selectedErrors = data.errors.filter(e => e.date === selectedDateStr);

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
            <span className="badge badge-streak">
              <CalendarIcon size={13} />
              Monthly Study Schedule
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Streak Target: {data.profile.minimumStreakMinutes} min/day
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            30-Day Sprint Calendar & Activity History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Inspect daily study hours, completed routines, scores, and logged error reflections
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>Completed (≥120m)</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            <span>Partial</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span>Planned / Rest</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Calendar Grid Card */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Month Header Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
              {monthName}
            </h2>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={handlePrevMonth} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={handleNextMonth} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '10px',
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '6px 0' }}>{day}</div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
            {/* Empty slots before day 1 */}
            {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} style={{ minHeight: '64px', opacity: 0.2 }} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const studyMins = sessionsByDate[dateStr] || 0;
              const dayPlan = plansByDate[dateStr];

              // Status determination
              const isCompleted = studyMins >= data.profile.minimumStreakMinutes;
              const isPartial = studyMins > 0 && studyMins < data.profile.minimumStreakMinutes;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  style={{
                    minHeight: '64px',
                    padding: '8px 6px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid #818cf8' : isToday ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border-subtle)',
                    background: isSelected
                      ? 'rgba(99, 102, 241, 0.2)'
                      : isToday
                      ? 'rgba(99, 102, 241, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: isToday || isSelected ? 800 : 500,
                      color: isToday ? '#818cf8' : 'inherit',
                    }}>
                      {dayNum}
                    </span>

                    {/* Status Dot */}
                    {isCompleted && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} title="Target met" />
                    )}
                    {isPartial && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b' }} title="Partial study" />
                    )}
                  </div>

                  {studyMins > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isCompleted ? '#34d399' : '#f59e0b',
                    }}>
                      {formatMinutes(studyMins)}
                    </span>
                  )}

                  {dayPlan && (
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      D{dayPlan.dayNumber}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Drawer */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Date Inspection
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>
                {formatDate(selectedDateStr)}
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Study Time</div>
              <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: selectedDayMinutes >= data.profile.minimumStreakMinutes ? '#10b981' : '#f8fafc' }}>
                {formatMinutes(selectedDayMinutes)}
              </div>
            </div>
          </div>

          {/* Day Plan context */}
          {selectedDayPlan ? (
            <div style={{ padding: '14px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase' }}>
                Sprint Day {selectedDayPlan.dayNumber} — {selectedDayPlan.phaseTitle}
              </div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedDayPlan.objective}
              </div>
              {selectedDayPlan.notes && (
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '6px' }}>
                  Notes: &ldquo;{selectedDayPlan.notes}&rdquo;
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              No specific 30-day task scheduled for this date.
            </div>
          )}

          {/* Activity Sessions Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Logged Activity on this Day
            </div>

            {selectedSessions.length === 0 && selectedListening.length === 0 && selectedReading.length === 0 && selectedWriting.length === 0 && selectedSpeaking.length === 0 && (
              <div style={{ fontSize: '13px', color: 'var(--text-dim)', fontStyle: 'italic', padding: '10px 0' }}>
                No practice sessions recorded for this day.
              </div>
            )}

            {selectedSessions.map(s => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '13px' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{s.skill}</span>
                <span className="font-mono" style={{ color: 'var(--text-muted)' }}>{s.durationMinutes} min</span>
              </div>
            ))}

            {selectedErrors.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '11.5px', color: '#f87171', fontWeight: 700 }}>
                  Logged Mistakes ({selectedErrors.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  {selectedErrors.map(e => (
                    <div key={e.id} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '6px 10px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '4px' }}>
                      <strong>{e.skill.toUpperCase()}:</strong> {e.myAnswer} → <span style={{ color: '#34d399' }}>{e.correctAnswer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
