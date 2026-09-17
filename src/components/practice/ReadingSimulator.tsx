'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ArrowRight
} from 'lucide-react';
import { ReadingPracticeSet } from '@/types/practice';
import { useIELTS } from '@/context/IELTSContext';
import { rawToReadingBand, getTodayDateString, playDoubleChime } from '@/lib/ieltsUtils';

interface ReadingSimulatorProps {
  testSet: ReadingPracticeSet;
  onFinish?: () => void;
}

export default function ReadingSimulator({ testSet, onFinish }: ReadingSimulatorProps) {
  const { addReadingPractice, addErrorLogItem } = useIELTS();

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(testSet.recommendedMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [fontSizePx, setFontSizePx] = useState<number>(15);
  const [loggedToMistakes, setLoggedToMistakes] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Grade test
  const calculateResults = () => {
    let correctCount = 0;
    const mistakesList: { question: typeof testSet.questions[0]; userAnswer: string }[] = [];

    testSet.questions.forEach((q) => {
      const uAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const cAns = q.correctAnswer.trim().toLowerCase();
      const accepted = (q.acceptedAnswers || []).map((a) => a.trim().toLowerCase());

      const isCorrect = uAns === cAns || accepted.includes(uAns);
      if (isCorrect) {
        correctCount++;
      } else {
        mistakesList.push({ question: q, userAnswer: userAnswers[q.id] || '(Unanswered)' });
      }
    });

    const total = testSet.questions.length;
    const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
    // Scale to official 40-question IELTS band
    const scaledScore = Math.round((correctCount / total) * 40);
    const estimatedBand = rawToReadingBand(scaledScore);

    return { correctCount, total, accuracy, estimatedBand, mistakesList };
  };

  const results = calculateResults();

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);
    playDoubleChime();

    // Auto save practice session to state
    const todayStr = getTodayDateString();
    const timeSpentMins = Math.max(1, Math.round((testSet.recommendedMinutes * 60 - secondsRemaining) / 60));

    addReadingPractice({
      date: todayStr,
      testName: `${testSet.bookSource} — ${testSet.title}`,
      passage: `passage_${testSet.passageNumber}`,
      questionTypes: Array.from(new Set(testSet.questions.map(q => q.type))),
      questionsAttempted: testSet.questions.length,
      correctAnswers: results.correctCount,
      incorrectAnswers: results.total - results.correctCount,
      accuracyPercentage: results.accuracy,
      estimatedBand: results.estimatedBand,
      timeTakenMinutes: timeSpentMins,
      mistakes: results.mistakesList.map(m => `Q${m.question.number}: Chose "${m.userAnswer}" (Expected "${m.question.correctAnswer}")`),
      notes: `In-app Computer-Delivered practice test. Score: ${results.correctCount}/${results.total} (${results.accuracy.toFixed(0)}%).`,
    });
  };

  const handleSendMistakesToBook = () => {
    const todayStr = getTodayDateString();
    results.mistakesList.forEach((m) => {
      addErrorLogItem({
        date: todayStr,
        skill: 'reading',
        questionOrTopic: `${testSet.bookSource} Q${m.question.number}: ${m.question.prompt}`,
        myAnswer: m.userAnswer,
        correctAnswer: m.question.correctAnswer,
        whyWrong: `Failed in ${m.question.type.replace(/_/g, ' ')}. ${m.question.paragraphReference || ''}`,
        category: m.question.type.replace(/_/g, ' '),
        correctRule: m.question.explanation,
        reviewed: false,
      });
    });
    setLoggedToMistakes(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setSecondsRemaining(testSet.recommendedMinutes * 60);
    setIsTimerRunning(true);
    setLoggedToMistakes(false);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: '650px' }}>
      {/* Top Test Control Bar */}
      <div style={{
        padding: '12px 20px',
        backgroundColor: 'var(--bg-card-solid)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-reading">
            <BookOpen size={13} />
            {testSet.bookSource}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Passage {testSet.passageNumber}: {testSet.title}
          </span>
        </div>

        {/* Center: Exam Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          background: secondsRemaining < 300 ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-elevated)',
          border: secondsRemaining < 300 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
          color: secondsRemaining < 300 ? '#ef4444' : '#38bdf8',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          fontSize: '15px',
        }}>
          <Clock size={16} />
          <span>{timeFormatted}</span>
        </div>

        {/* Right Actions: Font sizing + Submit button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-elevated)', borderRadius: '6px', padding: '2px 6px' }}>
            <button
              onClick={() => setFontSizePx(Math.max(13, fontSizePx - 1))}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 6px' }}
              title="Decrease passage text size"
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fontSizePx}px</span>
            <button
              onClick={() => setFontSizePx(Math.min(20, fontSizePx + 1))}
              className="btn btn-ghost btn-sm"
              style={{ padding: '4px 6px' }}
              title="Increase passage text size"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmitTest}
              className="btn btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <CheckCircle2 size={15} />
              <span>Submit & Auto-Grade</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              <RotateCcw size={15} />
              <span>Retry Test</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header Banner (Shown after submission) */}
      {isSubmitted && (
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15))',
          borderLeft: '1px solid var(--border-subtle)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Score Achieved
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {results.correctCount} / {results.total} ({results.accuracy.toFixed(0)}%)
              </div>
            </div>

            <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />

            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Estimated Practice Band
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: results.estimatedBand >= 7.0 ? '#10b981' : '#38bdf8' }}>
                Band {results.estimatedBand.toFixed(1)}
              </div>
            </div>
          </div>

          {results.mistakesList.length > 0 && (
            <button
              onClick={handleSendMistakesToBook}
              disabled={loggedToMistakes}
              className={`btn btn-sm ${loggedToMistakes ? 'btn-ghost' : 'btn-primary'}`}
              style={{ gap: '6px' }}
            >
              <AlertOctagon size={15} />
              <span>{loggedToMistakes ? 'Logged to Mistake Book ✓' : `Send ${results.mistakesList.length} Mistakes to Mistake Book`}</span>
            </button>
          )}
        </div>
      )}

      {/* Split-Screen: Passage on Left, Questions on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 1fr',
        flex: 1,
        border: '1px solid var(--border-subtle)',
        borderTop: 'none',
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-main)',
      }}>
        {/* Left: Reading Passage Scrollable Area */}
        <div style={{
          padding: '28px',
          overflowY: 'auto',
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
          lineHeight: 1.7,
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
            {testSet.title}
          </h2>

          <div style={{ fontSize: `${fontSizePx}px`, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
            {testSet.readingPassage}
          </div>
        </div>

        {/* Right: Interactive Question Sheet */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-card-solid)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--reading-color)', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Questions 1 – {testSet.questions.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Read the instructions carefully and answer according to the passage.
            </div>
          </div>

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
                    ? isCorrect
                      ? 'rgba(16, 185, 129, 0.06)'
                      : 'rgba(239, 68, 68, 0.06)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isSubmitted
                    ? isCorrect
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid var(--border-subtle)',
                }}
              >
                {/* Question Header & Prompt */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}>
                    {q.number}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {q.prompt}
                    </div>

                    {/* Question Inputs according to type */}
                    <div style={{ marginTop: '12px' }}>
                      {q.type === 'true_false_not_given' && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => {
                            const isSelected = userAnswer.toUpperCase() === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleAnswerChange(q.id, opt)}
                                style={{
                                  padding: '6px 14px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: isSubmitted ? 'default' : 'pointer',
                                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                                  background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'sentence_completion' && (
                        <div>
                          <input
                            type="text"
                            disabled={isSubmitted}
                            placeholder="Type answer here..."
                            className="input"
                            value={userAnswer}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            style={{ maxWidth: '280px', fontSize: '13px' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Post-Submission Feedback & Explanation */}
                    {isSubmitted && (
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: isCorrect ? '#34d399' : '#f87171' }}>
                          {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          <span>{isCorrect ? 'Correct!' : `Incorrect — Correct Answer: ${q.correctAnswer}`}</span>
                        </div>

                        <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                          <strong>Why:</strong> {q.explanation}
                        </div>
                        {q.paragraphReference && (
                          <div style={{ color: '#818cf8', fontSize: '11.5px', marginTop: '2px', fontWeight: 600 }}>
                            Reference: {q.paragraphReference}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
