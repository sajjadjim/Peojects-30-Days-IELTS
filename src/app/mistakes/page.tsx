'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  PlusCircle,
  CheckCircle2,
  Circle,
  Repeat,
  Trash2,
  Filter,
  Search,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Sparkles,
  BookMarked,
  HelpCircle,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { SkillType, ErrorLogItem } from '@/types/ielts';
import { getTodayDateString, formatDate } from '@/lib/ieltsUtils';

const skillOptions: { type: SkillType; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'listening', label: 'Listening', icon: Headphones, color: 'var(--listening-color)' },
  { type: 'reading', label: 'Reading', icon: BookOpen, color: 'var(--reading-color)' },
  { type: 'writing', label: 'Writing', icon: PenTool, color: 'var(--writing-color)' },
  { type: 'speaking', label: 'Speaking', icon: Mic, color: 'var(--speaking-color)' },
  { type: 'grammar', label: 'Grammar', icon: Sparkles, color: 'var(--grammar-color)' },
  { type: 'vocabulary', label: 'Vocabulary', icon: BookMarked, color: 'var(--vocab-color)' },
];

export default function MistakeBookPage() {
  const { data, addErrorLogItem, toggleErrorReviewed, deleteErrorLogItem } = useIELTS();

  const [selectedSkillFilter, setSelectedSkillFilter] = useState<SkillType | 'all'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'unreviewed' | 'repeated' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add mistake form state
  const [formSkill, setFormSkill] = useState<SkillType>('listening');
  const [questionOrTopic, setQuestionOrTopic] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [whyWrong, setWhyWrong] = useState('');
  const [category, setCategory] = useState('');
  const [correctRule, setCorrectRule] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Statistics
  const totalMistakes = data.errors.length;
  const unreviewedMistakes = data.errors.filter(e => !e.reviewed).length;
  const repeatedMistakes = data.errors.filter(e => e.occurrenceCount > 1).length;
  const masteredMistakes = data.errors.filter(e => e.reviewed).length;

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionOrTopic.trim() || !myAnswer.trim()) return;

    addErrorLogItem({
      date: getTodayDateString(),
      skill: formSkill,
      questionOrTopic: questionOrTopic.trim(),
      myAnswer: myAnswer.trim(),
      correctAnswer: correctAnswer.trim(),
      whyWrong: whyWrong.trim(),
      category: category.trim() || 'General Error',
      correctRule: correctRule.trim(),
      reviewed: false,
    });

    setQuestionOrTopic('');
    setMyAnswer('');
    setCorrectAnswer('');
    setWhyWrong('');
    setCategory('');
    setCorrectRule('');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowAddModal(false);
    }, 1500);
  };

  const filteredErrors = data.errors.filter(e => {
    if (selectedSkillFilter !== 'all' && e.skill !== selectedSkillFilter) return false;

    if (reviewFilter === 'unreviewed' && e.reviewed) return false;
    if (reviewFilter === 'repeated' && e.occurrenceCount <= 1) return false;
    if (reviewFilter === 'mastered' && !e.reviewed) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = e.questionOrTopic.toLowerCase().includes(q) ||
        e.myAnswer.toLowerCase().includes(q) ||
        e.correctAnswer.toLowerCase().includes(q) ||
        e.whyWrong.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

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
            <span className="badge badge-streak" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <AlertOctagon size={13} />
              Core Progress Driver
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Review mistakes before chasing new questions
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            The Mistake Book & Root Cause Log
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Documenting why you were wrong and the correct rule turns Band 5.5 mistakes into Band 7.0 mastery
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
          style={{ gap: '8px' }}
        >
          <PlusCircle size={16} />
          <span>Log New Error</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Total Logged Mistakes
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {totalMistakes}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#f87171', fontWeight: 700 }}>
            Unreviewed Mistakes
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444', marginTop: '4px' }}>
            {unreviewedMistakes}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700 }}>
            Repeated Traps (High Risk)
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b', marginTop: '4px' }}>
            {repeatedMistakes}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#34d399', fontWeight: 700 }}>
            Mastered & Reviewed
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981', marginTop: '4px' }}>
            {masteredMistakes}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card" style={{ padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Skill Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedSkillFilter('all')}
              className={`btn btn-sm ${selectedSkillFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Skills ({data.errors.length})
            </button>
            {skillOptions.map(s => {
              const count = data.errors.filter(e => e.skill === s.type).length;
              return (
                <button
                  key={s.type}
                  onClick={() => setSelectedSkillFilter(s.type)}
                  className={`btn btn-sm ${selectedSkillFilter === s.type ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '6px' }}
                >
                  <s.icon size={14} color={s.color} />
                  <span>{s.label} ({count})</span>
                </button>
              );
            })}
          </div>

          {/* Status Filter & Search */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setReviewFilter('all')}
                className={`btn btn-sm ${reviewFilter === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setReviewFilter('unreviewed')}
                className={`btn btn-sm ${reviewFilter === 'unreviewed' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: '#f87171' }}
              >
                Needs Review ({unreviewedMistakes})
              </button>
              <button
                onClick={() => setReviewFilter('repeated')}
                className={`btn btn-sm ${reviewFilter === 'repeated' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: '#f59e0b' }}
              >
                Repeated Traps ({repeatedMistakes})
              </button>
              <button
                onClick={() => setReviewFilter('mastered')}
                className={`btn btn-sm ${reviewFilter === 'mastered' ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ color: '#34d399' }}
              >
                Mastered ({masteredMistakes})
              </button>
            </div>

            <div style={{ position: 'relative', minWidth: '220px', flex: 1, maxWidth: '320px' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input"
                style={{ paddingLeft: '34px', fontSize: '13px' }}
                placeholder="Search errors or rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredErrors.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No errors match the current filter. Great job!
          </div>
        ) : (
          filteredErrors.map((err) => {
            const skillObj = skillOptions.find(s => s.type === err.skill) || skillOptions[0];
            const Icon = skillObj.icon;
            const isRepeated = err.occurrenceCount > 1;

            return (
              <div
                key={err.id}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  border: isRepeated
                    ? '2px solid rgba(245, 158, 11, 0.4)'
                    : err.reviewed
                    ? '1px solid rgba(16, 185, 129, 0.3)'
                    : '1px solid var(--border-subtle)',
                  background: isRepeated
                    ? 'var(--card-tint-amber)'
                    : err.reviewed
                    ? 'rgba(16, 185, 129, 0.05)'
                    : 'var(--bg-card)',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--bg-elevated)',
                      border: `1px solid ${skillObj.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: skillObj.color,
                    }}>
                      <Icon size={16} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: skillObj.color, textTransform: 'capitalize' }}>
                          {err.skill}
                        </span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>• {formatDate(err.date)}</span>
                        {isRepeated && (
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <Repeat size={12} />
                            Repeated Trap ({err.occurrenceCount}x)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {err.questionOrTopic}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => toggleErrorReviewed(err.id)}
                      className={`btn btn-sm ${err.reviewed ? 'btn-ghost' : 'btn-secondary'}`}
                      style={{
                        color: err.reviewed ? '#10b981' : 'var(--text-primary)',
                        gap: '6px',
                        fontSize: '12.5px',
                      }}
                    >
                      <CheckCircle2 size={16} color={err.reviewed ? '#10b981' : 'var(--text-muted)'} />
                      <span>{err.reviewed ? 'Reviewed & Mastered' : 'Mark Reviewed'}</span>
                    </button>

                    <button
                      onClick={() => deleteErrorLogItem(err.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}
                      title="Delete error"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Answers Comparison Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                  margin: '16px 0',
                }}>
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>
                      My Incorrect Answer
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {err.myAnswer}
                    </div>
                  </div>

                  <div style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Correct Official Answer / Form
                    </div>
                    <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>
                      {err.correctAnswer}
                    </div>
                  </div>
                </div>

                {/* Why Wrong & Rule */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', fontSize: '13px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: '#fca5a5' }}>Why I was wrong:</strong> {err.whyWrong}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: '#38bdf8' }}>Rule to memorize:</strong> {err.correctRule}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Error Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
              Log Practice Error to Mistake Book
            </h2>

            <form onSubmit={handleAddMistake} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Skill Module</label>
                  <select
                    className="select"
                    value={formSkill}
                    onChange={(e) => setFormSkill(e.target.value as SkillType)}
                  >
                    {skillOptions.map(s => (
                      <option key={s.type} value={s.type}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Trap Category</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. Map direction, Spelling, Distractor"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Question / Topic Identifier</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Cambridge 18 Test 2 Section 1 Q7"
                  value={questionOrTopic}
                  onChange={(e) => setQuestionOrTopic(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label" style={{ color: '#fca5a5' }}>My Incorrect Answer</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="What you wrote or chose"
                    value={myAnswer}
                    onChange={(e) => setMyAnswer(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="form-label" style={{ color: '#34d399' }}>Correct Answer</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Official correct answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Why was I wrong? (Root cause breakdown)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="e.g. Inverted digits under time panic / Did not pay attention to directional preposition 'adjacent to'"
                  value={whyWrong}
                  onChange={(e) => setWhyWrong(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Correct Rule / Exam Technique to Prevent this</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="e.g. Always trace finger along map as speaker talks; mentally verify numbers before audio ends"
                  value={correctRule}
                  onChange={(e) => setCorrectRule(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Mistake Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
