export type SkillType = 'listening' | 'reading' | 'writing' | 'speaking' | 'vocabulary' | 'grammar';

export interface UserProfile {
  name: string;
  currentBand: number; // e.g. 5.5
  targetBand: number;  // e.g. 7.0
  startDate: string;   // YYYY-MM-DD
  durationDays: number; // 30
  dailyStudyTargetMinutes: number; // e.g. 180 (3 hours)
  minimumStreakMinutes: number;    // e.g. 120 (2 hours)
  dailyVocabTarget: number;        // e.g. 10
  preferredTimerDuration: number;  // e.g. 40
  theme: 'dark' | 'light' | 'system';
}

export interface DailyTask {
  id: string;
  dayNumber: number;
  skill: SkillType;
  title: string;
  targetMinutes: number;
  completedMinutes: number;
  completed: boolean;
  score?: number;
  notes?: string;
}

export interface DayPlan {
  dayNumber: number; // 1 to 30
  date: string;      // YYYY-MM-DD
  phase: 1 | 2 | 3 | 4 | 5;
  phaseTitle: string;
  objective: string;
  estimatedMinutes: number;
  tasks: DailyTask[];
  notes?: string;
  completed: boolean;
  actualStudyMinutes?: number;
}

export interface StudySession {
  id: string;
  date: string;      // YYYY-MM-DD
  skill: SkillType;
  durationMinutes: number;
  notes?: string;
  associatedTaskId?: string;
  createdAt: string; // ISO string
}

export type ListeningMistakeCategory = 
  | 'spelling' 
  | 'numbers' 
  | 'names' 
  | 'multiple_choice' 
  | 'map' 
  | 'matching' 
  | 'sentence_completion' 
  | 'distractors' 
  | 'concentration' 
  | 'vocabulary' 
  | 'other';

export interface ListeningPractice {
  id: string;
  date: string;
  testName: string;
  section: 'section_1' | 'section_2' | 'section_3' | 'section_4' | 'full_test';
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  estimatedBand: number; // Official IELTS raw to band
  timeTakenMinutes: number;
  mistakeCategories: ListeningMistakeCategory[];
  mistakes: string[];
  notes?: string;
}

export type ReadingQuestionType = 
  | 'true_false_not_given' 
  | 'yes_no_not_given' 
  | 'matching_headings' 
  | 'matching_information' 
  | 'multiple_choice' 
  | 'sentence_completion' 
  | 'summary_completion' 
  | 'diagram_labeling';

export interface ReadingPractice {
  id: string;
  date: string;
  testName: string;
  passage: 'passage_1' | 'passage_2' | 'passage_3' | 'full_test';
  questionTypes: ReadingQuestionType[];
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercentage: number;
  estimatedBand: number;
  timeTakenMinutes: number;
  mistakes: string[];
  notes?: string;
}

export interface WritingChecklist {
  // Task Response
  answeredAllParts: boolean;
  clearPosition: boolean;
  relevantIdeas: boolean;
  developedExamples: boolean;
  // Coherence & Cohesion
  clearParagraphing: boolean;
  logicalProgression: boolean;
  linkingWordsUsedNaturally: boolean;
  // Lexical Resource
  goodVocabulary: boolean;
  avoidedRepetition: boolean;
  correctWordForms: boolean;
  // Grammatical Range & Accuracy
  sentenceVariety: boolean;
  correctArticles: boolean;
  correctTenses: boolean;
  subjectVerbAgreement: boolean;
  correctPrepositions: boolean;
}

export interface WritingPractice {
  id: string;
  date: string;
  taskType: 'task_1' | 'task_2';
  topic: string;
  timeSpentMinutes: number;
  wordCount: number;
  selfAssessedBand: number;
  essayContent?: string;
  checklist: WritingChecklist;
  grammarMistakes: string[];
  vocabularyMistakes: string[];
  coherenceMistakes: string[];
  taskResponseMistakes: string[];
  evaluationNotes?: string;
}

export type SpeakingTopicCategory = 
  | 'people' 
  | 'places' 
  | 'objects' 
  | 'experiences' 
  | 'activities' 
  | 'technology' 
  | 'education' 
  | 'environment' 
  | 'work' 
  | 'hometown' 
  | 'travel' 
  | 'food' 
  | 'friends' 
  | 'family' 
  | 'other';

export interface SpeakingPractice {
  id: string;
  date: string;
  part: 'part_1' | 'part_2' | 'part_3' | 'full_simulation';
  category: SpeakingTopicCategory;
  topic: string;
  durationMinutes: number;
  fluencyScore: number; // 1-9
  vocabularyScore: number; // 1-9
  grammarScore: number; // 1-9
  pronunciationScore: number; // 1-9
  overallEstimatedBand: number;
  cueCardNotes?: string;
  difficultVocabulary: string[];
  grammarMistakes: string[];
  fluencyProblems: string[];
  repeatedWords: string[];
  pronunciationProblems: string[];
  notes?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'collocation' | 'idiom';
  exampleSentence: string;
  synonyms: string[];
  antonyms: string[];
  topic: string;
  dateAdded: string;
  reviewStatus: 'due_today' | 'reviewed' | 'mastered';
  confidenceLevel: 1 | 2 | 3 | 4 | 5; // 1: Don't know -> 5: Mastered
  nextReviewDate: string;
}

export type GrammarCategory = 
  | 'articles' 
  | 'prepositions' 
  | 'tenses' 
  | 'subject_verb_agreement' 
  | 'singular_plural' 
  | 'sentence_structure' 
  | 'relative_clauses' 
  | 'conditionals' 
  | 'modal_verbs' 
  | 'word_forms' 
  | 'punctuation';

export interface GrammarMistake {
  id: string;
  date: string;
  category: GrammarCategory;
  mySentence: string;
  correctSentence: string;
  explanation: string;
  occurrenceCount: number;
  resolved: boolean;
}

export interface ErrorLogItem {
  id: string;
  date: string;
  skill: SkillType;
  questionOrTopic: string;
  myAnswer: string;
  correctAnswer: string;
  whyWrong: string;
  category: string;
  correctRule: string;
  reviewed: boolean;
  reviewDate?: string;
  occurrenceCount: number;
}

export interface MockTest {
  id: string;
  date: string;
  testName: string;
  listeningRawScore?: number;
  listeningBand: number;
  readingRawScore?: number;
  readingBand: number;
  writingBand: number;
  speakingBand: number;
  overallBand: number;
  totalTimeMinutes: number;
  notes?: string;
}

export interface DayStats {
  date: string;
  totalStudyMinutes: number;
  tasksCompleted: number;
  totalTasks: number;
  status: 'completed' | 'partial' | 'missed';
  scores: {
    listening?: number;
    reading?: number;
    writing?: number;
    speaking?: number;
  };
  notes?: string;
}

export interface IELTSAppData {
  profile: UserProfile;
  days: DayPlan[];
  sessions: StudySession[];
  listening: ListeningPractice[];
  reading: ReadingPractice[];
  writing: WritingPractice[];
  speaking: SpeakingPractice[];
  vocabulary: VocabularyWord[];
  grammar: GrammarMistake[];
  errors: ErrorLogItem[];
  mockTests: MockTest[];
}
