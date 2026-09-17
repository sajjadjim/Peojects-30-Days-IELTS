'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Shuffle,
  CheckCircle2,
  FileText,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen
} from 'lucide-react';
import { useIELTS } from '@/context/IELTSContext';
import { speakingTopicBank, CueCardTopic } from '@/lib/speakingTopics';
import { SpeakingTopicCategory, SpeakingPractice } from '@/types/ielts';
import { playDoubleChime, playChime, getTodayDateString, formatDate } from '@/lib/ieltsUtils';

const categories: SpeakingTopicCategory[] = [
  'people', 'places', 'objects', 'experiences', 'activities',
  'technology', 'education', 'environment', 'work', 'hometown',
  'travel', 'food', 'friends', 'family'
];

export default function SpeakingPracticePage() {
  const { data, stats, addSpeakingPractice, addErrorLogItem } = useIELTS();

  const [activeTab, setActiveTab] = useState<'timer' | 'topics' | 'history'>('timer');
  const [selectedTopic, setSelectedTopic] = useState<CueCardTopic>(speakingTopicBank[0]);
  const [selectedCategory, setSelectedCategory] = useState<SpeakingTopicCategory | 'all'>('all');

  // Part 2 Timer state: 'idle' | 'prep' (60s) | 'speaking' (120s) | 'done'
  const [timerPhase, setTimerPhase] = useState<'idle' | 'prep' | 'speaking' | 'done'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [cueCardNotes, setCueCardNotes] = useState<string>('');

  // Evaluation Form state
  const [fluencyScore, setFluencyScore] = useState<number>(5.5);
  const [vocabScore, setVocabScore] = useState<number>(5.5);
  const [grammarScore, setGrammarScore] = useState<number>(5.5);
  const [pronunciationScore, setPronunciationScore] = useState<number>(6.0);
  const [difficultVocab, setDifficultVocab] = useState<string>('');
  const [grammarMistakes, setGrammarMistakes] = useState<string>('');
  const [fluencyIssues, setFluencyIssues] = useState<string>('');
  const [repeatedWords, setRepeatedWords] = useState<string>('');
  const [pronunciationIssues, setPronunciationIssues] = useState<string>('');
  const [evalNotes, setEvalNotes] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto calculate average overall band
  const calculatedBand = Math.round(((fluencyScore + vocabScore + grammarScore + pronunciationScore) / 4) * 2) / 2;

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerPhase === 'prep') {
              // Transition from 1-min preparation to 2-min speaking
              playDoubleChime();
              setTimerPhase('speaking');
              return 120; // 2 minutes speaking
            } else if (timerPhase === 'speaking') {
              // Finish speaking session
              clearInterval(timerRef.current!);
              setIsTimerRunning(false);
              setTimerPhase('done');
              playDoubleChime();
              return 0;
            }
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
  }, [isTimerRunning, timerPhase]);

  const handleStartPrep = () => {
    setTimerPhase('prep');
    setSecondsRemaining(60);
    setIsTimerRunning(true);
  };

  const handleSkipToSpeaking = () => {
    playDoubleChime();
    setTimerPhase('speaking');
    setSecondsRemaining(120);
    setIsTimerRunning(true);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerPhase('idle');
    setSecondsRemaining(60);
  };

  const handleRandomTopic = () => {
    const available = selectedCategory === 'all'
      ? speakingTopicBank
      : speakingTopicBank.filter(t => t.category === selectedCategory);
    if (available.length > 0) {
      const rand = available[Math.floor(Math.random() * available.length)];
      setSelectedTopic(rand);
      handleResetTimer();
    }
  };

  const handleSaveEvaluation = () => {
    const todayStr = getTodayDateString();

    const practiceRecord: Omit<SpeakingPractice, 'id'> = {
      date: todayStr,
      part: selectedTopic.part,
      category: selectedTopic.category,
      topic: selectedTopic.title,
      durationMinutes: 4, // 1m prep + 2m speech + evaluation
      fluencyScore,
      vocabularyScore: vocabScore,
      grammarScore,
      pronunciationScore,
      overallEstimatedBand: calculatedBand,
      cueCardNotes,
      difficultVocabulary: difficultVocab ? difficultVocab.split(',').map(s => s.trim()).filter(Boolean) : [],
      grammarMistakes: grammarMistakes ? grammarMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      fluencyProblems: fluencyIssues ? fluencyIssues.split(',').map(s => s.trim()).filter(Boolean) : [],
      repeatedWords: repeatedWords ? repeatedWords.split(',').map(s => s.trim()).filter(Boolean) : [],
      pronunciationProblems: pronunciationIssues ? pronunciationIssues.split(',').map(s => s.trim()).filter(Boolean) : [],
      notes: evalNotes,
    };

    addSpeakingPractice(practiceRecord);

    // If grammar mistakes recorded, automatically log to Error Log
    if (grammarMistakes) {
      grammarMistakes.split(',').forEach(m => {
        const item = m.trim();
        if (item) {
          addErrorLogItem({
            date: todayStr,
            skill: 'speaking',
            questionOrTopic: selectedTopic.title,
            myAnswer: item,
            correctAnswer: 'Review natural speech pattern and grammatical concordance',
            whyWrong: 'Spoken under exam time pressure',
            category: 'Grammar in Speech',
            correctRule: 'Self-monitor sentence openings and past-tense endings',
            reviewed: false,
          });
        }
      });
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    handleResetTimer();
  };

  const filteredTopics = selectedCategory === 'all'
    ? speakingTopicBank
    : speakingTopicBank.filter(t => t.category === selectedCategory);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeDisplay = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

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
            <span className="badge badge-speaking">
              <Mic size={13} />
              Speaking Module
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Current Practice Band: {stats.latestSpeaking.toFixed(1)} → Target: 7.0
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            IELTS Speaking Practice & Part 2 Simulation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Strict 1-minute preparation and 2-minute speaking delivery countdown with rubric evaluation
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('timer')}
            className={`btn btn-sm ${activeTab === 'timer' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Part 2 Simulator
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`btn btn-sm ${activeTab === 'topics' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Topics Bank ({speakingTopicBank.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Practice History ({data.speaking.length})
          </button>
        </div>
      </div>

      {activeTab === 'timer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Left: Cue Card & Prep Note Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#10b981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>
                  IELTS Part 2 Cue Card
                </span>
                <button
                  onClick={handleRandomTopic}
                  className="btn btn-ghost btn-sm"
                  style={{ gap: '6px', fontSize: '12px' }}
                >
                  <Shuffle size={13} />
                  <span>Randomize Topic</span>
                </button>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
                {selectedTopic.title}
              </h2>

              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                background: 'var(--stat-box-bg)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                {selectedTopic.cueCard}
              </div>

              {/* 1-Minute Prep Quick Notepad */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    1-Minute Cue Card Outline / Key Words
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Bullet points only (don&apos;t write full sentences)
                  </span>
                </div>
                <textarea
                  className="textarea"
                  value={cueCardNotes}
                  onChange={(e) => setCueCardNotes(e.target.value)}
                  placeholder="Notes for your 2 minutes:&#10;- Introduction: who / where&#10;- Main story details / sensory words&#10;- Climax / turning point&#10;- Personal reflection / why it matters..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Right: Countdown Timer & Self-Evaluation Rubric */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Timer Display Card */}
            <div className="glass-card" style={{
              padding: '28px',
              textAlign: 'center',
              border: timerPhase === 'prep'
                ? '2px solid #f59e0b'
                : timerPhase === 'speaking'
                ? '2px solid #10b981'
                : '1px solid var(--border-subtle)',
              background: timerPhase === 'prep'
                ? 'var(--card-tint-amber)'
                : timerPhase === 'speaking'
                ? 'var(--card-tint-emerald)'
                : 'var(--bg-card)',
            }}>
              <div style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                background: timerPhase === 'prep' ? 'rgba(245, 158, 11, 0.2)' : timerPhase === 'speaking' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: timerPhase === 'prep' ? '#f59e0b' : timerPhase === 'speaking' ? '#10b981' : 'var(--text-muted)',
                marginBottom: '10px',
              }}>
                {timerPhase === 'idle' && 'Ready to Prepare'}
                {timerPhase === 'prep' && 'Phase 1: Preparation (1 Minute)'}
                {timerPhase === 'speaking' && 'Phase 2: Speaking Time (2 Minutes)'}
                {timerPhase === 'done' && 'Session Complete — Assess Rubric'}
              </div>

              <div style={{
                fontSize: '72px',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                margin: '10px 0 16px',
                color: timerPhase === 'prep' ? '#fbbf24' : timerPhase === 'speaking' ? '#34d399' : 'var(--text-primary)',
              }}>
                {timeDisplay}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {timerPhase === 'idle' && (
                  <button onClick={handleStartPrep} className="btn btn-primary" style={{ gap: '8px' }}>
                    <Play size={16} fill="currentColor" />
                    <span>Start 1-Min Preparation</span>
                  </button>
                )}

                {timerPhase === 'prep' && (
                  <>
                    <button onClick={handleSkipToSpeaking} className="btn btn-success" style={{ gap: '6px' }}>
                      <Play size={16} fill="currentColor" />
                      <span>Ready Now (Start 2m Speaking)</span>
                    </button>
                    <button onClick={handleResetTimer} className="btn btn-ghost btn-sm">
                      Reset
                    </button>
                  </>
                )}

                {timerPhase === 'speaking' && (
                  <>
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="btn btn-secondary"
                    >
                      {isTimerRunning ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerPhase('done');
                        playDoubleChime();
                      }}
                      className="btn btn-primary"
                    >
                      Finish Speech
                    </button>
                  </>
                )}

                {timerPhase === 'done' && (
                  <button onClick={handleResetTimer} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                    <RotateCcw size={14} />
                    <span>Practice Another Topic</span>
                  </button>
                )}
              </div>
            </div>

            {/* Self-Assessment Rubric Form */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>
                  Self-Assessed Practice Evaluation
                </h3>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#818cf8',
                  fontFamily: 'var(--font-mono)',
                }}>
                  Estimated Band: {calculatedBand.toFixed(1)}
                </div>
              </div>

              {/* 4 Score Sliders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Fluency & Coherence</span>
                    <strong className="font-mono">{fluencyScore.toFixed(1)}</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="0.5"
                    value={fluencyScore}
                    onChange={(e) => setFluencyScore(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--speaking-color)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Lexical Resource (Vocab)</span>
                    <strong className="font-mono">{vocabScore.toFixed(1)}</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="0.5"
                    value={vocabScore}
                    onChange={(e) => setVocabScore(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--vocab-color)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Grammatical Range</span>
                    <strong className="font-mono">{grammarScore.toFixed(1)}</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="0.5"
                    value={grammarScore}
                    onChange={(e) => setGrammarScore(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--grammar-color)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span>Pronunciation</span>
                    <strong className="font-mono">{pronunciationScore.toFixed(1)}</strong>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="9"
                    step="0.5"
                    value={pronunciationScore}
                    onChange={(e) => setPronunciationScore(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#06b6d4' }}
                  />
                </div>
              </div>

              {/* Qualitative Observations */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label">Difficult Vocabulary or Expressions missed</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. ubiquitous, corroborate (comma-separated)"
                    value={difficultVocab}
                    onChange={(e) => setDifficultVocab(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Grammar mistakes made during speech</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. said 'he go' instead of 'he went', missed articles"
                    value={grammarMistakes}
                    onChange={(e) => setGrammarMistakes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Fluency hesitation or repeated words</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. repeated 'actually' 5 times, 4s pause when thinking"
                    value={fluencyIssues}
                    onChange={(e) => setFluencyIssues(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">General Reflections & Self-Feedback</label>
                  <textarea
                    className="textarea"
                    placeholder="Managed 1m 50s. Flow was good in the introduction, but ran out of ideas on the last bullet point..."
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {saveSuccess ? (
                  <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                    Practice Saved & Logged!
                  </span>
                ) : <span />}

                <button onClick={handleSaveEvaluation} className="btn btn-primary" style={{ gap: '8px' }}>
                  <Award size={16} />
                  <span>Log Speaking Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div>
          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Topics
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Topics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: selectedTopic.id === topic.id ? '2px solid var(--speaking-color)' : '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: 'var(--speaking-color)',
                      background: 'var(--speaking-bg)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      {topic.category}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {topic.part.toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {topic.title}
                  </h3>

                  <div style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    background: 'var(--stat-box-bg)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '12px',
                  }}>
                    {topic.cueCard}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTopic(topic);
                    setActiveTab('timer');
                    handleResetTimer();
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', gap: '6px' }}
                >
                  <Play size={13} fill="currentColor" color="#10b981" />
                  <span>Practice with 1m/2m Timer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Speaking Practice Log
          </h2>

          {data.speaking.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No speaking sessions logged yet. Try a 2-minute cue card simulation!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {data.speaking.map((sp) => (
                <div
                  key={sp.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '14px',
                  }}
                >
                  <div style={{ minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-speaking">{sp.category}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formatDate(sp.date)}</span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {sp.topic}
                    </div>
                    {sp.notes && (
                      <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {sp.notes}
                      </div>
                    )}
                    {sp.grammarMistakes && sp.grammarMistakes.length > 0 && (
                      <div style={{ fontSize: '12px', color: '#f87171', marginTop: '4px' }}>
                        Errors: {sp.grammarMistakes.join(', ')}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Band</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                      {sp.overallEstimatedBand.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      F:{sp.fluencyScore} V:{sp.vocabularyScore} G:{sp.grammarScore} P:{sp.pronunciationScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
