'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Upload,
  Sparkles,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import ReadingSimulator from '@/components/practice/ReadingSimulator';
import ListeningSimulator from '@/components/practice/ListeningSimulator';
import WritingSimulator from '@/components/practice/WritingSimulator';
import SpeakingSimulator from '@/components/practice/SpeakingSimulator';
import TestImporter from '@/components/practice/TestImporter';
import {
  sampleReadingTests,
  sampleListeningTests,
  sampleWritingTests,
  sampleSpeakingTests
} from '@/lib/practiceTests';
import { ReadingPracticeSet } from '@/types/practice';

export default function PracticeCenterPage() {
  const [activeModule, setActiveModule] = useState<'reading' | 'listening' | 'writing' | 'speaking' | 'importer'>('reading');

  const [readingTests, setReadingTests] = useState<ReadingPracticeSet[]>(sampleReadingTests);
  const [selectedReadingIndex, setSelectedReadingIndex] = useState<number>(0);

  const [selectedListeningIndex, setSelectedListeningIndex] = useState<number>(0);
  const [selectedWritingIndex, setSelectedWritingIndex] = useState<number>(0);
  const [selectedSpeakingIndex, setSelectedSpeakingIndex] = useState<number>(0);

  const handleAddCustomReading = (newTest: ReadingPracticeSet) => {
    setReadingTests([newTest, ...readingTests]);
    setSelectedReadingIndex(0);
    setActiveModule('reading');
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: '40px' }}>
      {/* Top Header & Module Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-streak" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.2))', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <Sparkles size={13} />
              In-App Exam Simulator
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Computer-Delivered IELTS Interface
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
            Cambridge Practice Center (Books 10–20)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            Practice full test modules directly inside your dashboard with split-screen views, auto-grading, and audio recording
          </p>
        </div>

        {/* Module Switcher Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveModule('reading')}
            className={`btn btn-sm ${activeModule === 'reading' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <BookOpen size={14} color="var(--reading-color)" />
            <span>Reading</span>
          </button>

          <button
            onClick={() => setActiveModule('listening')}
            className={`btn btn-sm ${activeModule === 'listening' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <Headphones size={14} color="var(--listening-color)" />
            <span>Listening</span>
          </button>

          <button
            onClick={() => setActiveModule('writing')}
            className={`btn btn-sm ${activeModule === 'writing' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <PenTool size={14} color="var(--writing-color)" />
            <span>Writing</span>
          </button>

          <button
            onClick={() => setActiveModule('speaking')}
            className={`btn btn-sm ${activeModule === 'speaking' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <Mic size={14} color="var(--speaking-color)" />
            <span>Speaking & Voice</span>
          </button>

          <button
            onClick={() => setActiveModule('importer')}
            className={`btn btn-sm ${activeModule === 'importer' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '6px' }}
          >
            <Upload size={14} />
            <span>Import Cambridge Test</span>
          </button>
        </div>
      </div>

      {/* Module Selector Dropdown / Pills if multiple sets exist */}
      {activeModule === 'reading' && readingTests.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Select Reading Test:
          </span>
          {readingTests.map((t, idx) => {
            const match = t.bookSource.match(/(?:Cambridge|IELTS)\s*(\d+)/i);
            const bookNum = match ? match[1] : '';
            const label = bookNum ? `IELTS ${bookNum} P${t.passageNumber}` : `${t.bookSource.split('—')[0].replace('Academic', '').trim()} P${t.passageNumber}`;
            const isSelected = selectedReadingIndex === idx;

            return (
              <button
                key={t.id}
                onClick={() => setSelectedReadingIndex(idx)}
                className={`btn btn-sm interactive-press ${isSelected ? 'btn-secondary' : 'btn-ghost'}`}
                style={{
                  fontSize: '12px',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontWeight: 700, color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                  {label}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                  ({t.questions.length}Q)
                </span>
              </button>
            );
          })}
          <span style={{
            fontSize: '11px',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.12)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>☁ Supabase Stored</span>
          </span>
        </div>
      )}

      {activeModule === 'writing' && sampleWritingTests.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Select Task:
          </span>
          {sampleWritingTests.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => setSelectedWritingIndex(idx)}
              className={`btn btn-sm ${selectedWritingIndex === idx ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                fontSize: '12px',
                border: selectedWritingIndex === idx ? '1px solid var(--writing-color)' : '1px solid transparent',
              }}
            >
              {w.taskType.toUpperCase()} ({w.bookSource.split('—')[0].trim()})
            </button>
          ))}
        </div>
      )}

      {/* Active Module Embed */}
      {activeModule === 'reading' && (
        <ReadingSimulator testSet={readingTests[selectedReadingIndex] || readingTests[0]} />
      )}

      {activeModule === 'listening' && (
        <ListeningSimulator testSet={sampleListeningTests[selectedListeningIndex] || sampleListeningTests[0]} />
      )}

      {activeModule === 'writing' && (
        <WritingSimulator testSet={sampleWritingTests[selectedWritingIndex] || sampleWritingTests[0]} />
      )}

      {activeModule === 'speaking' && (
        <SpeakingSimulator testSet={sampleSpeakingTests[selectedSpeakingIndex] || sampleSpeakingTests[0]} />
      )}

      {activeModule === 'importer' && (
        <TestImporter onAddCustomReadingTest={handleAddCustomReading} />
      )}
    </div>
  );
}
