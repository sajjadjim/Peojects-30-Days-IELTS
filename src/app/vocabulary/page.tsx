'use client';

import React, { useState } from 'react';
import {
  BookMarked,
  PlusCircle,
  Star,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Trash2,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { VocabularyWord } from '@/types/ielts';
import { getTodayDateString, formatDate } from '@/lib/ieltsUtils';

export default function VocabularyPage() {
  const { data, addVocabularyWord, updateVocabularyWord, deleteVocabularyWord } = useIELTS();

  const [activeTab, setActiveTab] = useState<'bank' | 'flashcards'>('bank');
  const [filterStatus, setFilterStatus] = useState<'all' | 'due_today' | 'reviewed' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add word form state
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<VocabularyWord['partOfSpeech']>('adjective');
  const [exampleSentence, setExampleSentence] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [antonyms, setAntonyms] = useState('');
  const [topic, setTopic] = useState('Academic Writing & Task 2');
  const [confidenceLevel, setConfidenceLevel] = useState<VocabularyWord['confidenceLevel']>(2);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Flashcard mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Daily target progress
  const todayStr = getTodayDateString();
  const wordsAddedToday = data.vocabulary.filter(v => v.dateAdded === todayStr).length;
  const vocabTarget = data.profile.dailyVocabTarget || 10;
  const targetPercent = Math.min(100, Math.round((wordsAddedToday / vocabTarget) * 100));

  const wordsDueToday = data.vocabulary.filter(v => v.reviewStatus === 'due_today' || v.confidenceLevel <= 2);
  const wordsMastered = data.vocabulary.filter(v => v.reviewStatus === 'mastered' || v.confidenceLevel === 5);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    addVocabularyWord({
      word: word.trim(),
      meaning: meaning.trim(),
      partOfSpeech,
      exampleSentence: exampleSentence.trim(),
      synonyms: synonyms ? synonyms.split(',').map(s => s.trim()).filter(Boolean) : [],
      antonyms: antonyms ? antonyms.split(',').map(s => s.trim()).filter(Boolean) : [],
      topic: topic.trim() || 'General Academic',
      reviewStatus: confidenceLevel >= 4 ? 'reviewed' : 'due_today',
      confidenceLevel,
      nextReviewDate: todayStr,
    });

    setWord('');
    setMeaning('');
    setExampleSentence('');
    setSynonyms('');
    setAntonyms('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleConfidenceChange = (id: string, newLevel: VocabularyWord['confidenceLevel']) => {
    updateVocabularyWord(id, {
      confidenceLevel: newLevel,
      reviewStatus: newLevel === 5 ? 'mastered' : 'reviewed',
    });
  };

  // Filtered words
  const filteredWords = data.vocabulary.filter(v => {
    const matchesSearch = v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.topic.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === 'due_today') return v.reviewStatus === 'due_today' || v.confidenceLevel <= 2;
    if (filterStatus === 'reviewed') return v.reviewStatus === 'reviewed';
    if (filterStatus === 'mastered') return v.reviewStatus === 'mastered' || v.confidenceLevel === 5;
    return true;
  });

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
            <span className="badge badge-vocab">
              <BookMarked size={13} />
              Lexical Resource
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Band 7.0 requires flexible lexical range & precision collocations
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Academic Vocabulary Vault & Spaced Repetition
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Target: {vocabTarget} new academic band-7 words daily with confidence tracking
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('bank')}
            className={`btn btn-sm ${activeTab === 'bank' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Word Bank ({data.vocabulary.length})
          </button>
          <button
            onClick={() => { setActiveTab('flashcards'); setFlashcardIndex(0); setIsFlipped(false); }}
            className={`btn btn-sm ${activeTab === 'flashcards' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Flashcard Drill
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-sm btn-secondary"
            style={{ gap: '6px' }}
          >
            <PlusCircle size={15} />
            <span>{showAddForm ? 'Close Form' : '+ Add Word'}</span>
          </button>
        </div>
      </div>

      {/* Target Meter Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Today&apos;s Target ({vocabTarget} Words/Day)
            </span>
            <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#a855f7' }}>
              {wordsAddedToday} / {vocabTarget}
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
              width: `${targetPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #a855f7, #6366f1)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>
              Due For Revision Today
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f87171' }}>
              {wordsDueToday.length} words
            </div>
          </div>
          <button
            onClick={() => { setFilterStatus('due_today'); setActiveTab('bank'); }}
            className="btn btn-ghost btn-sm"
            style={{ color: '#f87171' }}
          >
            Review Now
          </button>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
              Mastered Words (Level 5)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
              {wordsMastered.length} words
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Exam Ready
          </span>
        </div>
      </div>

      {/* Add Word Form Accordion */}
      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
            Add New Academic Word / Collocation
          </h2>

          <form onSubmit={handleAddWord} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Word or Phrase</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. substantiate"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Part of Speech</label>
                <select
                  className="select"
                  value={partOfSpeech}
                  onChange={(e) => setPartOfSpeech(e.target.value as any)}
                >
                  <option value="noun">Noun</option>
                  <option value="verb">Verb</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                  <option value="collocation">Collocation</option>
                  <option value="idiom">Idiom</option>
                </select>
              </div>

              <div>
                <label className="form-label">Initial Confidence (1-5)</label>
                <select
                  className="select"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value, 10) as any)}
                >
                  <option value={1}>1: Don&apos;t know</option>
                  <option value={2}>2: Weak</option>
                  <option value={3}>3: Remember sometimes</option>
                  <option value={4}>4: Good</option>
                  <option value={5}>5: Mastered</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Definition / Meaning</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. To provide evidence to support or prove the truth of something"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Academic Example Sentence (IELTS Context)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. The researcher was unable to substantiate her claims with empirical data."
                value={exampleSentence}
                onChange={(e) => setExampleSentence(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Synonyms (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. corroborate, verify, validate"
                  value={synonyms}
                  onChange={(e) => setSynonyms(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Antonyms (comma-separated)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. disprove, refute"
                  value={antonyms}
                  onChange={(e) => setAntonyms(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Topic / Theme</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Education, Environment, Science"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              {saveSuccess ? (
                <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                  Word Saved Successfully!
                </span>
              ) : <span />}

              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <PlusCircle size={16} />
                <span>Save to Vault</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Flashcard Practice View */}
      {activeTab === 'flashcards' && (
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          {filteredWords.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No words available for this filter. Add words or change your filter selection.
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Card {flashcardIndex + 1} of {filteredWords.length}
                </span>
                <span style={{ fontSize: '12px', color: '#a855f7', fontWeight: 600 }}>
                  Click card or button below to flip
                </span>
              </div>

              {/* Flashcard Component */}
              {(() => {
                const currentWord = filteredWords[flashcardIndex];
                return (
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="glass-card glass-card-hover"
                    style={{
                      minHeight: '280px',
                      padding: '36px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '2px solid rgba(168, 85, 247, 0.4)',
                      background: isFlipped
                        ? 'var(--card-tint-purple)'
                        : 'var(--hero-bg)',
                      marginBottom: '20px',
                      userSelect: 'none',
                    }}
                  >
                    {!isFlipped ? (
                      <div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#a855f7',
                          background: 'rgba(168, 85, 247, 0.15)',
                          padding: '3px 10px',
                          borderRadius: '4px',
                        }}>
                          {currentWord.partOfSpeech} • {currentWord.topic}
                        </span>
                        <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-primary)', margin: '20px 0 10px' }}>
                          {currentWord.word}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          Click to reveal definition, IELTS example & synonyms
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
                          {currentWord.meaning}
                        </div>

                        {currentWord.exampleSentence && (
                          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '14px 0', lineHeight: 1.5 }}>
                            &ldquo;{currentWord.exampleSentence}&rdquo;
                          </div>
                        )}

                        {currentWord.synonyms.length > 0 && (
                          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '8px' }}>
                            Synonyms: <strong style={{ color: '#a855f7' }}>{currentWord.synonyms.join(', ')}</strong>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Confidence Rating Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      handleConfidenceChange(filteredWords[flashcardIndex].id, lvl as any);
                      setIsFlipped(false);
                      if (flashcardIndex < filteredWords.length - 1) {
                        setFlashcardIndex(flashcardIndex + 1);
                      }
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '12px' }}
                  >
                    Level {lvl} {lvl === 5 ? '★' : ''}
                  </button>
                ))}
              </div>

              {/* Prev / Next buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    if (flashcardIndex > 0) {
                      setFlashcardIndex(flashcardIndex - 1);
                      setIsFlipped(false);
                    }
                  }}
                  disabled={flashcardIndex === 0}
                  className="btn btn-ghost btn-sm"
                >
                  Previous Card
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '6px' }}
                >
                  {isFlipped ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{isFlipped ? 'Show Word' : 'Reveal Meaning'}</span>
                </button>

                <button
                  onClick={() => {
                    if (flashcardIndex < filteredWords.length - 1) {
                      setFlashcardIndex(flashcardIndex + 1);
                      setIsFlipped(false);
                    }
                  }}
                  disabled={flashcardIndex === filteredWords.length - 1}
                  className="btn btn-ghost btn-sm"
                >
                  Next Card
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Word Bank Table & Filter View */}
      {activeTab === 'bank' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '240px', flex: 1, maxWidth: '380px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search words, meanings, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterStatus('all')}
                className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              >
                All ({data.vocabulary.length})
              </button>
              <button
                onClick={() => setFilterStatus('due_today')}
                className={`btn btn-sm ${filterStatus === 'due_today' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Due Today ({wordsDueToday.length})
              </button>
              <button
                onClick={() => setFilterStatus('reviewed')}
                className={`btn btn-sm ${filterStatus === 'reviewed' ? 'btn-primary' : 'btn-secondary'}`}
              >
                In Progress
              </button>
              <button
                onClick={() => setFilterStatus('mastered')}
                className={`btn btn-sm ${filterStatus === 'mastered' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Mastered ({wordsMastered.length})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {filteredWords.map((v) => (
              <div
                key={v.id}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: v.confidenceLevel === 5 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-vocab" style={{ fontSize: '11px' }}>
                        {v.partOfSpeech}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {v.topic}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteVocabularyWord(v.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                      title="Delete word"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {v.word}
                  </div>

                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                    {v.meaning}
                  </div>

                  {v.exampleSentence && (
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '10px' }}>
                      &ldquo;{v.exampleSentence}&rdquo;
                    </div>
                  )}

                  {v.synonyms.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Synonyms: <span style={{ color: '#a855f7' }}>{v.synonyms.join(', ')}</span>
                    </div>
                  )}
                </div>

                {/* Confidence Stars & Level Selector */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleConfidenceChange(v.id, lvl as any)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '2px',
                          color: lvl <= v.confidenceLevel ? '#f59e0b' : 'var(--border-strong)',
                        }}
                        title={`Confidence: ${lvl}/5`}
                      >
                        <Star size={16} fill={lvl <= v.confidenceLevel ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: v.confidenceLevel === 5 ? '#34d399' : v.confidenceLevel <= 2 ? '#f87171' : '#f59e0b',
                  }}>
                    {v.confidenceLevel === 5 ? 'Mastered' : v.confidenceLevel <= 2 ? 'Needs Drill' : 'Reviewing'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
