'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { GrammarCategory, GrammarMistake } from '@/types/ielts';
import { getTodayDateString, formatDate } from '@/lib/ieltsUtils';

const grammarCategories: { id: GrammarCategory; label: string }[] = [
  { id: 'articles', label: 'Articles (a / an / the / zero)' },
  { id: 'prepositions', label: 'Prepositions (in, on, at, of, by)' },
  { id: 'tenses', label: 'Tenses (Past, Present Perfect, Future)' },
  { id: 'subject_verb_agreement', label: 'Subject-Verb Agreement (People are)' },
  { id: 'singular_plural', label: 'Singular / Plural & Uncountable' },
  { id: 'sentence_structure', label: 'Sentence Structure & Run-ons' },
  { id: 'relative_clauses', label: 'Relative Clauses (which / that / who)' },
  { id: 'conditionals', label: 'Conditionals (If / Unless / Provided)' },
  { id: 'modal_verbs', label: 'Modal Verbs (could, should, would)' },
  { id: 'word_forms', label: 'Word Forms (Noun / Verb / Adj / Adv)' },
  { id: 'punctuation', label: 'Punctuation & Commas' },
];

export default function GrammarPracticePage() {
  const { data, addGrammarMistake, toggleGrammarResolved, deleteGrammarMistake, addErrorLogItem } = useIELTS();

  const [selectedFilter, setSelectedFilter] = useState<GrammarCategory | 'all'>('all');
  const [category, setCategory] = useState<GrammarCategory>('subject_verb_agreement');
  const [mySentence, setMySentence] = useState('People is using technology.');
  const [correctSentence, setCorrectSentence] = useState('People are using technology.');
  const [explanation, setExplanation] = useState('"People" is a plural collective noun and requires the plural verb "are".');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = getTodayDateString();

    addGrammarMistake({
      date: todayStr,
      category,
      mySentence,
      correctSentence,
      explanation,
      occurrenceCount: 1,
      resolved: false,
    });

    // Also push to unified Mistake Book
    addErrorLogItem({
      date: todayStr,
      skill: 'grammar',
      questionOrTopic: `Grammar Rule: ${category.replace(/_/g, ' ')}`,
      myAnswer: mySentence,
      correctAnswer: correctSentence,
      whyWrong: explanation,
      category: category.replace(/_/g, ' '),
      correctRule: explanation,
      reviewed: false,
    });

    setSavedSuccess(true);
    setMySentence('');
    setCorrectSentence('');
    setExplanation('');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const filteredGrammar = selectedFilter === 'all'
    ? data.grammar
    : data.grammar.filter(g => g.category === selectedFilter);

  const totalMistakes = data.grammar.length;
  const unresolvedMistakes = data.grammar.filter(g => !g.resolved).length;
  const repeatedMistakes = data.grammar.filter(g => g.occurrenceCount > 1).length;

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
            <span className="badge badge-grammar">
              <Sparkles size={13} />
              Grammar Mastery
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Band 7.0 requires frequent error-free complex sentences
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Grammar Weakness Log & Sentence Correction
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Transform repeated sentence errors into solid, automatic grammatical intuition
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
            Logged Grammar Rules
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '4px' }}>
            {totalMistakes}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#fca5a5', fontWeight: 700 }}>
            Needs Active Practice
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ef4444', marginTop: '4px' }}>
            {unresolvedMistakes}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700 }}>
            Repeated Traps
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b', marginTop: '4px' }}>
            {repeatedMistakes}
          </div>
        </div>
      </div>

      {/* Form to Add Grammar Mistake */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px' }}>
          Record Grammar Mistake & Correction
        </h2>

        <form onSubmit={handleAddMistake} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ maxWidth: '400px' }}>
            <label className="form-label">Grammar Category</label>
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value as GrammarCategory)}
            >
              {grammarCategories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ color: '#fca5a5' }}>
                My Incorrect Sentence (What you wrote or said)
              </label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="e.g. People is using technology to communicate every day."
                value={mySentence}
                onChange={(e) => setMySentence(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" style={{ color: '#34d399' }}>
                Correct Sentence (Standard academic form)
              </label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="e.g. People are using technology to communicate every day."
                value={correctSentence}
                onChange={(e) => setCorrectSentence(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Explanation & IELTS Rule to Remember</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. 'People' is plural -> always use 'are', not 'is'."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            {savedSuccess ? (
              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                Mistake Logged into Grammar & Mistake Book!
              </span>
            ) : <span />}

            <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
              <PlusCircle size={16} />
              <span>Log Sentence Correction</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`btn btn-sm ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Categories
        </button>
        {grammarCategories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className={`btn btn-sm ${selectedFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {c.label.split('(')[0].trim()}
          </button>
        ))}
      </div>

      {/* Grammar Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredGrammar.length === 0 ? (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No grammar entries in this category yet.
          </div>
        ) : (
          filteredGrammar.map((item) => (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '18px 22px',
                border: item.resolved ? '1px solid rgba(16, 185, 129, 0.3)' : item.occurrenceCount > 1 ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                background: item.resolved ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-grammar" style={{ textTransform: 'capitalize' }}>
                    {item.category.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(item.date)}</span>
                  {item.occurrenceCount > 1 && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#f59e0b',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Repeat size={12} />
                      Repeated {item.occurrenceCount}x
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => toggleGrammarResolved(item.id)}
                    className="btn btn-sm btn-ghost"
                    style={{
                      color: item.resolved ? '#10b981' : 'var(--text-muted)',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>{item.resolved ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>

                  <button
                    onClick={() => deleteGrammarMistake(item.id)}
                    className="btn btn-sm btn-ghost"
                    style={{ color: '#ef4444', padding: '6px' }}
                    title="Delete mistake"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Sentences Before / After comparison */}
              <div style={{
                marginTop: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '12px',
              }}>
                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>
                    My Sentence (Incorrect)
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontStyle: 'italic' }}>
                    &ldquo;{item.mySentence}&rdquo;
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Correct Academic Sentence
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', fontWeight: 600 }}>
                    &ldquo;{item.correctSentence}&rdquo;
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div style={{
                marginTop: '10px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}>
                <strong>Rule:</strong> {item.explanation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
