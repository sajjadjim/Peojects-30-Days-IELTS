'use client';

import React, { useState } from 'react';
import {
  Upload,
  PlusCircle,
  FileText,
  CheckCircle2,
  BookOpen,
  Headphones,
  Sparkles
} from 'lucide-react';
import { ReadingPracticeSet } from '@/types/practice';

interface TestImporterProps {
  onAddCustomReadingTest: (test: ReadingPracticeSet) => void;
}

export default function TestImporter({ onAddCustomReadingTest }: TestImporterProps) {
  const [bookSource, setBookSource] = useState('Cambridge 16 Academic — Test 3 Passage 1');
  const [title, setTitle] = useState('Roman Shipbuilding and Navigation');
  const [passageText, setPassageText] = useState('');
  const [questionsRaw, setQuestionsRaw] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleImportReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passageText.trim()) return;

    // Parse simple questions format or create interactive True/False questions
    const lines = questionsRaw.split('\n').filter(Boolean);
    const parsedQuestions = lines.map((line, idx) => {
      const parts = line.split('|').map(s => s.trim());
      const prompt = parts[0] || `Question ${idx + 1}`;
      const answer = (parts[1] || 'TRUE').toUpperCase();
      const explanation = parts[2] || 'Refer to text above.';

      return {
        id: `custom-q-${Date.now()}-${idx}`,
        number: idx + 1,
        type: (answer === 'TRUE' || answer === 'FALSE' || answer === 'NOT GIVEN' ? 'true_false_not_given' : 'sentence_completion') as any,
        prompt,
        correctAnswer: answer,
        explanation,
      };
    });

    const newTest: ReadingPracticeSet = {
      id: `custom-read-${Date.now()}`,
      bookSource: bookSource.trim(),
      passageNumber: 1,
      title: title.trim(),
      readingPassage: passageText.trim(),
      recommendedMinutes: 20,
      questions: parsedQuestions.length > 0 ? parsedQuestions : [
        {
          id: `custom-q-default-1`,
          number: 1,
          type: 'true_false_not_given',
          prompt: 'Sample Question: The passage discusses historical developments.',
          correctAnswer: 'TRUE',
          explanation: 'Refer to paragraph [A].',
        }
      ],
    };

    onAddCustomReadingTest(newTest);
    setSaveSuccess(true);
    setPassageText('');
    setQuestionsRaw('');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Upload size={18} color="#818cf8" />
        <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
          Cambridge 10–20 Custom Test Importer
        </h2>
      </div>

      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
        Paste any test from your Cambridge IELTS PDF or book (Passage text & Answer key) to practice inside the split-screen computer-delivered exam simulator.
      </p>

      <form onSubmit={handleImportReading} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label">Book Edition / Test Identifier</label>
            <input
              type="text"
              className="input"
              value={bookSource}
              onChange={(e) => setBookSource(e.target.value)}
              placeholder="e.g. Cambridge 17 Test 4 Passage 2"
              required
            />
          </div>

          <div>
            <label className="form-label">Passage Title</label>
            <input
              type="text"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Desalination Revolution"
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Reading Passage Text (Paste from PDF or Cambridge eBook)</label>
          <textarea
            className="textarea"
            rows={8}
            placeholder="Paste complete passage text here... You can include [A], [B], [C] paragraph markers."
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            required
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Questions & Answer Key (Format: Question Text | Answer | Explanation)
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              One question per line
            </span>
          </div>
          <textarea
            className="textarea"
            rows={4}
            placeholder="Example:&#10;The company was founded in the 19th century. | TRUE | Paragraph A mentions 1845.&#10;The founder studied engineering at university. | NOT GIVEN | University education not stated."
            value={questionsRaw}
            onChange={(e) => setQuestionsRaw(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          {saveSuccess ? (
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
              Test Successfully Imported to Your Practice Bank!
            </span>
          ) : <span />}

          <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
            <PlusCircle size={16} />
            <span>Load into Exam Simulator</span>
          </button>
        </div>
      </form>
    </div>
  );
}
