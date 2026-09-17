export type PracticeModuleType = 'reading' | 'listening' | 'writing' | 'speaking';

export interface PracticeQuestion {
  id: string;
  number: number;
  type: 'true_false_not_given' | 'yes_no_not_given' | 'multiple_choice' | 'sentence_completion' | 'matching_headings';
  prompt: string;
  options?: string[]; // For multiple choice or headings
  correctAnswer: string; // Standardized string (e.g. "TRUE", "NOT GIVEN", "B", "canopy")
  acceptedAnswers?: string[]; // Alternative valid spellings
  explanation: string;
  paragraphReference?: string; // e.g. "Paragraph B"
}

export interface ReadingPracticeSet {
  id: string;
  bookSource: string; // e.g. "Cambridge 18 Academic — Test 1"
  passageNumber: 1 | 2 | 3;
  title: string;
  readingPassage: string; // Formatted full passage text with paragraphs [A], [B], [C]...
  recommendedMinutes: number; // e.g. 20
  questions: PracticeQuestion[];
}

export interface ListeningPracticeSet {
  id: string;
  bookSource: string; // e.g. "Cambridge 18 Academic — Test 1"
  sectionNumber: 1 | 2 | 3 | 4;
  title: string;
  audioUrl?: string; // Optional real audio URL or YouTube audio embed
  transcriptText?: string;
  recommendedMinutes: number;
  questions: PracticeQuestion[];
}

export interface WritingPracticeSet {
  id: string;
  bookSource: string;
  taskType: 'task_1' | 'task_2';
  title: string;
  prompt: string;
  dataDescription?: string; // For Task 1 graphs/charts
  modelEssayBand8?: string;
  keyPointsToCover: string[];
  recommendedMinutes: number; // 20 for task 1, 40 for task 2
}

export interface SpeakingPracticeSet {
  id: string;
  bookSource: string;
  part: 'part_1' | 'part_2' | 'part_3';
  topic: string;
  cueCard?: string;
  questions: string[];
  recommendedVocabulary: { word: string; meaning: string; collocation: string }[];
}
