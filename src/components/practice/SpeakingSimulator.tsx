'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Award,
  BookMarked,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';
import { SpeakingPracticeSet } from '@/types/practice';
import { useIELTS } from '@/context/IELTSContext';
import { playDoubleChime, getTodayDateString } from '@/lib/ieltsUtils';

interface SpeakingSimulatorProps {
  testSet: SpeakingPracticeSet;
}

export default function SpeakingSimulator({ testSet }: SpeakingSimulatorProps) {
  const { addSpeakingPractice, addErrorLogItem } = useIELTS();

  // Phase: 'idle' | 'prep' (60s) | 'recording' (120s) | 'recorded'
  const [phase, setPhase] = useState<'idle' | 'prep' | 'recording' | 'recorded'>('idle');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // MediaRecorder audio state
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Scores
  const [fluencyScore, setFluencyScore] = useState<number>(5.5);
  const [vocabScore, setVocabScore] = useState<number>(5.5);
  const [grammarScore, setGrammarScore] = useState<number>(5.5);
  const [pronunciationScore, setPronunciationScore] = useState<number>(6.0);
  const [observedMistakes, setObservedMistakes] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (phase === 'prep') {
              playDoubleChime();
              startRecording();
              return 120; // 2 minutes speaking
            } else if (phase === 'recording') {
              stopRecording();
              playDoubleChime();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, phase]);

  const startPrep = () => {
    setPhase('prep');
    setSecondsRemaining(60);
    setIsTimerRunning(true);
    setAudioUrl(null);
  };

  const startRecording = async () => {
    setPhase('recording');
    setSecondsRemaining(120);
    setIsTimerRunning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.warn('Microphone access not permitted or unavailable, timer will continue without recording:', err);
      setMicPermission(false);
    }
  };

  const stopRecording = () => {
    setIsTimerRunning(false);
    setPhase('recorded');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const calculatedBand = Math.round(((fluencyScore + vocabScore + grammarScore + pronunciationScore) / 4) * 2) / 2;

  const handleSaveEvaluation = () => {
    const todayStr = getTodayDateString();

    addSpeakingPractice({
      date: todayStr,
      part: testSet.part,
      category: 'technology',
      topic: `${testSet.bookSource}: ${testSet.topic}`,
      durationMinutes: 4,
      fluencyScore,
      vocabularyScore: vocabScore,
      grammarScore,
      pronunciationScore,
      overallEstimatedBand: calculatedBand,
      cueCardNotes: notes,
      difficultVocabulary: testSet.recommendedVocabulary.map(v => v.word),
      grammarMistakes: observedMistakes ? observedMistakes.split(',').map(s => s.trim()).filter(Boolean) : [],
      fluencyProblems: [],
      repeatedWords: [],
      pronunciationProblems: [],
      notes: `In-app Speaking Simulator with voice recording playback. Self-assessed band: ${calculatedBand.toFixed(1)}.`,
    });

    if (observedMistakes) {
      observedMistakes.split(',').forEach(m => {
        const item = m.trim();
        if (item) {
          addErrorLogItem({
            date: todayStr,
            skill: 'speaking',
            questionOrTopic: `Speaking ${testSet.part.toUpperCase()}: ${testSet.topic}`,
            myAnswer: item,
            correctAnswer: 'Review natural speech pattern and grammatical precision',
            whyWrong: 'Identified during self-playback review',
            category: 'Speaking Fluency & Grammar',
            correctRule: 'Avoid long pauses; use discourse markers (such as, indeed, nevertheless)',
            reviewed: false,
          });
        }
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-speaking">
              <Mic size={13} />
              {testSet.bookSource}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Interactive Audio Recording & Playback Simulator
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>
            {testSet.topic}
          </h2>
        </div>

        {/* Phase Pill */}
        <div style={{
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          background: phase === 'prep' ? 'rgba(245, 158, 11, 0.15)' : phase === 'recording' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          color: phase === 'prep' ? '#f59e0b' : phase === 'recording' ? '#ef4444' : 'var(--text-muted)',
          fontSize: '12.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          {phase === 'recording' && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} className="pulse-glow" />}
          <span>
            {phase === 'idle' && 'Ready to Begin'}
            {phase === 'prep' && '1-Minute Preparation Countdown'}
            {phase === 'recording' && 'Live Recording (2 Minutes)'}
            {phase === 'recorded' && 'Recording Finished — Playback & Evaluate'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left: Cue Card & Prep Notepad */}
        <div>
          {testSet.cueCard && (
            <div style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--stat-box-bg)',
              border: '1px solid var(--border-subtle)',
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              whiteSpace: 'pre-line',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--speaking-color)', marginBottom: '8px' }}>
                Candidate Task Card
              </div>
              {testSet.cueCard}
            </div>
          )}

          <div>
            <label className="form-label">1-Minute Preparation Notes</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Jot down quick bullet points during your 60-second preparation phase..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Recommended Vocabulary Pills */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
              Band 7.0 Vocabulary Suggestions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {testSet.recommendedVocabulary.map((v) => (
                <span
                  key={v.word}
                  style={{
                    fontSize: '12px',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--vocab-bg)',
                    color: 'var(--vocab-color)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                  }}
                  title={`${v.meaning} (Collocation: ${v.collocation})`}
                >
                  {v.word}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Digital Countdown & Voice Playback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Digital Timer */}
          <div style={{
            padding: '24px',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              fontSize: '64px',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
              color: phase === 'prep' ? '#f59e0b' : phase === 'recording' ? '#ef4444' : 'var(--text-primary)',
            }}>
              {timeFormatted}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {phase === 'idle' && (
                <button onClick={startPrep} className="btn btn-primary" style={{ gap: '8px' }}>
                  <Play size={16} fill="currentColor" />
                  <span>Start 1-Min Prep</span>
                </button>
              )}

              {phase === 'prep' && (
                <button onClick={startRecording} className="btn btn-success" style={{ gap: '6px' }}>
                  <Mic size={16} />
                  <span>Ready (Start Recording Now)</span>
                </button>
              )}

              {phase === 'recording' && (
                <button onClick={stopRecording} className="btn btn-danger" style={{ gap: '6px' }}>
                  <MicOff size={16} />
                  <span>Stop & Save Recording</span>
                </button>
              )}

              {phase === 'recorded' && (
                <button onClick={startPrep} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                  <RotateCcw size={14} />
                  <span>Re-record</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio Player for Voice Playback */}
          {audioUrl && (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--card-tint-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: '8px' }}>
                Your Recorded Speech Playback
              </div>
              <audio controls src={audioUrl} style={{ width: '100%' }} />
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Listen back to your response. Listen for unnatural pauses, repeated filler words (um, ah), or mispronounced words.
              </div>
            </div>
          )}

          {/* Self-Score Sliders */}
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>Self-Assessed Score:</span>
              <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>
                Band {calculatedBand.toFixed(1)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Fluency</span>
                  <strong>{fluencyScore.toFixed(1)}</strong>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pronunciation</span>
                  <strong>{pronunciationScore.toFixed(1)}</strong>
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

            <div style={{ marginTop: '10px' }}>
              <input
                type="text"
                className="input"
                style={{ fontSize: '12.5px' }}
                placeholder="Grammar/Fluency errors noticed (e.g. repeated 'very', hesitation in point 3)..."
                value={observedMistakes}
                onChange={(e) => setObservedMistakes(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {savedSuccess ? (
                <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>
                  Practice & Recording Evaluated!
                </span>
              ) : <span />}

              <button onClick={handleSaveEvaluation} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                <Award size={14} />
                <span>Save Evaluation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
