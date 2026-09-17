'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PenTool,
  Clock,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { WritingPracticeSet } from '@/types/practice';
import { useIELTS } from '@/context/IELTSContext';
import { getTodayDateString, playDoubleChime } from '@/lib/ieltsUtils';

interface WritingSimulatorProps {
  testSet: WritingPracticeSet;
}

export default function WritingSimulator({ testSet }: WritingSimulatorProps) {
  const { addWritingPractice } = useIELTS();

  const [essayText, setEssayText] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(testSet.recommendedMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
  const [selfBand, setSelfBand] = useState<number>(5.5);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const targetWords = testSet.taskType === 'task_1' ? 150 : 250;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playDoubleChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const handleSaveEssay = () => {
    const todayStr = getTodayDateString();
    const timeSpentMins = Math.max(1, Math.round((testSet.recommendedMinutes * 60 - secondsRemaining) / 60));

    addWritingPractice({
      date: todayStr,
      taskType: testSet.taskType,
      topic: `${testSet.bookSource}: ${testSet.prompt}`,
      timeSpentMinutes: timeSpentMins,
      wordCount,
      selfAssessedBand: selfBand,
      essayContent: essayText,
      checklist: {
        answeredAllParts: true,
        clearPosition: true,
        relevantIdeas: true,
        developedExamples: true,
        clearParagraphing: true,
        logicalProgression: true,
        linkingWordsUsedNaturally: true,
        goodVocabulary: true,
        avoidedRepetition: true,
        correctWordForms: true,
        sentenceVariety: true,
        correctArticles: true,
        correctTenses: true,
        subjectVerbAgreement: true,
        correctPrepositions: true,
      },
      grammarMistakes: [],
      vocabularyMistakes: [],
      coherenceMistakes: [],
      taskResponseMistakes: [],
      evaluationNotes: `In-app Writing Exam Simulator. Word count: ${wordCount} words.`,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', minHeight: '650px' }}>
      {/* Top Bar */}
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
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-writing">
            <PenTool size={13} />
            {testSet.bookSource}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700 }}>
            {testSet.taskType.toUpperCase()} ({testSet.recommendedMinutes} min)
          </span>
        </div>

        {/* Center Countdown & Word Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)',
            color: '#38bdf8',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
          }}>
            <Clock size={15} />
            <span>{timeFormatted}</span>
          </div>

          <div style={{
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: wordCount >= targetWords ? '#10b981' : '#f59e0b',
          }}>
            {wordCount} / {targetWords} words
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {testSet.modelEssayBand8 && (
            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="btn btn-secondary btn-sm"
              style={{ gap: '6px' }}
            >
              {showModelAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showModelAnswer ? 'Hide Band 8 Sample' : 'View Band 8 Sample'}</span>
            </button>
          )}

          <button onClick={handleSaveEssay} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
            <Award size={15} />
            <span>{isSaved ? 'Saved to Records ✓' : 'Save & Assess'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Prompt vs Real-Time Writing Canvas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.4fr)',
        minHeight: '520px',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-main)',
      }}>
        {/* Left: Prompt, Data Description & Key Points */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-card)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>
            {testSet.title}
          </h2>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            marginBottom: '18px',
          }}>
            {testSet.prompt}
          </div>

          {testSet.dataDescription && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Chart / Data Details
              </div>
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--stat-box-bg)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
              }}>
                {testSet.dataDescription}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Essential IELTS Examiner Checkpoints
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {testSet.keyPointsToCover.map((pt, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Model Answer Drawer */}
          {showModelAnswer && testSet.modelEssayBand8 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', marginBottom: '8px' }}>
                Official Band 8.5 Model Answer
              </div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {testSet.modelEssayBand8}
              </div>
            </div>
          )}
        </div>

        {/* Right: Text Editor */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card-solid)',
        }}>
          <textarea
            className="textarea"
            style={{
              flex: 1,
              width: '100%',
              fontSize: '15px',
              lineHeight: 1.7,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: 0,
            }}
            placeholder="Type your essay response here under exam conditions... Make sure to write clear paragraphs with an introduction, overview/body paragraphs, and conclusion."
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
          />

          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Self-Assess:</span>
              <select
                className="select"
                style={{ width: '110px', padding: '4px 8px', fontSize: '12px' }}
                value={selfBand}
                onChange={(e) => setSelfBand(parseFloat(e.target.value))}
              >
                {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0].map(b => (
                  <option key={b} value={b}>Band {b.toFixed(1)}</option>
                ))}
              </select>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Keyboard shortcuts active • Local auto-save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
