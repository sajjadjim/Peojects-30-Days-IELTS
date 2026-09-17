'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  FileText,
  Sparkles,
  Award
} from 'lucide-react';
import { ListeningPracticeSet } from '@/types/practice';
import { useIELTS } from '@/context/IELTSContext';
import { rawToListeningBand, getTodayDateString, playDoubleChime } from '@/lib/ieltsUtils';

interface ListeningSimulatorProps {
  testSet: ListeningPracticeSet;
}

export default function ListeningSimulator({ testSet }: ListeningSimulatorProps) {
  const { addListeningPractice, addErrorLogItem } = useIELTS();

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(testSet.recommendedMinutes * 60);
  const [loggedToMistakes, setLoggedToMistakes] = useState<boolean>(false);

  // Audio synthesis state for reading transcript if no external audio file
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if (testSet.transcriptText) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(testSet.transcriptText);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    const mistakesList: { question: typeof testSet.questions[0]; userAnswer: string }[] = [];

    testSet.questions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = q.correctAnswer.trim().toLowerCase();
      const accepted = (q.acceptedAnswers || []).map(a => a.trim().toLowerCase());

      const isCorrect = uAns === cAns || accepted.includes(uAns);
      if (isCorrect) {
        correctCount++;
      } else {
        mistakesList.push({ question: q, userAnswer: userAnswers[q.id] || '(Unanswered)' });
      }
    });

    const total = testSet.questions.length;
    const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
    const scaledScore = Math.round((correctCount / total) * 40);
    const estimatedBand = rawToListeningBand(scaledScore);

    return { correctCount, total, accuracy, estimatedBand, mistakesList };
  };

  const results = calculateResults();

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (isPlayingAudio && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    playDoubleChime();

    const todayStr = getTodayDateString();
    addListeningPractice({
      date: todayStr,
      testName: `${testSet.bookSource} — ${testSet.title}`,
      section: `section_${testSet.sectionNumber}`,
      questionsAttempted: testSet.questions.length,
      correctAnswers: results.correctCount,
      incorrectAnswers: results.total - results.correctCount,
      accuracyPercentage: results.accuracy,
      estimatedBand: results.estimatedBand,
      timeTakenMinutes: testSet.recommendedMinutes,
      mistakeCategories: ['sentence_completion', 'spelling', 'numbers'],
      mistakes: results.mistakesList.map(m => `Q${m.question.number}: Chose "${m.userAnswer}" (Expected "${m.question.correctAnswer}")`),
      notes: `In-app Listening Simulator. Score: ${results.correctCount}/${results.total} (Band ${results.estimatedBand}).`,
    });
  };

  const handleSendMistakesToBook = () => {
    const todayStr = getTodayDateString();
    results.mistakesList.forEach((m) => {
      addErrorLogItem({
        date: todayStr,
        skill: 'listening',
        questionOrTopic: `${testSet.bookSource} Q${m.question.number}: ${m.question.prompt}`,
        myAnswer: m.userAnswer,
        correctAnswer: m.question.correctAnswer,
        whyWrong: 'Missed detail or spelling in audio stream',
        category: 'Listening Note Completion',
        correctRule: m.question.explanation,
        reviewed: false,
      });
    });
    setLoggedToMistakes(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setShowTranscript(false);
    setLoggedToMistakes(false);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Top Controls & Audio Player */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '14px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-listening">
              <Headphones size={13} />
              {testSet.bookSource}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Section {testSet.sectionNumber} (Social/Informational)
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {testSet.title}
          </h2>
        </div>

        {/* Audio Player Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleToggleAudio}
            className={`btn ${isPlayingAudio ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            style={{ gap: '8px', minWidth: '150px' }}
          >
            {isPlayingAudio ? (
              <>
                <Pause size={15} />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play size={15} fill="currentColor" />
                <span>Play Listening Audio</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '6px' }}
          >
            <FileText size={14} />
            <span>{showTranscript ? 'Hide Transcript' : 'View Transcript'}</span>
          </button>
        </div>
      </div>

      {/* Transcript Collapsible Drawer */}
      {showTranscript && testSet.transcriptText && (
        <div style={{
          padding: '16px',
          background: 'var(--stat-box-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--listening-color)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Official Audio Transcript
          </div>
          {testSet.transcriptText}
        </div>
      )}

      {/* Results Banner */}
      {isSubmitted && (
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>RESULTS</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
              {results.correctCount} / {results.total} correct — Estimated Band {results.estimatedBand.toFixed(1)}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {results.mistakesList.length > 0 && (
              <button
                onClick={handleSendMistakesToBook}
                disabled={loggedToMistakes}
                className="btn btn-primary btn-sm"
                style={{ gap: '6px' }}
              >
                <AlertOctagon size={14} />
                <span>{loggedToMistakes ? 'Logged to Mistake Book ✓' : `Send ${results.mistakesList.length} Mistakes to Mistake Book`}</span>
              </button>
            )}

            <button onClick={handleReset} className="btn btn-secondary btn-sm">
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Question Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        {testSet.questions.map((q) => {
          const userAnswer = userAnswers[q.id] || '';
          const isCorrect = isSubmitted && (
            userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() ||
            (q.acceptedAnswers || []).map(a => a.trim().toLowerCase()).includes(userAnswer.trim().toLowerCase())
          );

          return (
            <div
              key={q.id}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: isSubmitted
                  ? isCorrect ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: isSubmitted
                  ? isCorrect ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                  : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: 'var(--listening-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800,
                }}>
                  {q.number}
                </span>

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {q.prompt}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    disabled={isSubmitted}
                    placeholder="Enter answer..."
                    className="input"
                    value={userAnswer}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    style={{ maxWidth: '240px', fontSize: '13px' }}
                  />
                </div>
              </div>

              {isSubmitted && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                  <span style={{ fontWeight: 700, color: isCorrect ? '#34d399' : '#f87171' }}>
                    {isCorrect ? 'Correct ✓' : `Incorrect ✗ (Expected: ${q.correctAnswer})`}
                  </span>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSubmit} className="btn btn-primary" style={{ gap: '6px' }}>
            <CheckCircle2 size={16} />
            <span>Submit Listening Test</span>
          </button>
        </div>
      )}
    </div>
  );
}
