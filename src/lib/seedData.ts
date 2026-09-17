import { IELTSAppData, DayPlan, DailyTask, VocabularyWord, GrammarMistake, ErrorLogItem, ListeningPractice, ReadingPractice, WritingPractice, SpeakingPractice, MockTest } from '@/types/ielts';

function create30Days(): DayPlan[] {
  const plans: DayPlan[] = [];
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 2); // Start day 1 two days ago, so user is on Day 3 today

  const phaseDetails = [
    { phase: 1 as const, title: 'Foundation + Diagnosis', desc: 'Identify weaknesses, establish routine, vocabulary & grammar correction, test format familiarity' },
    { phase: 2 as const, title: 'Skill Building', desc: 'Improve listening accuracy, reading speed, writing cohesion, and speaking fluency' },
    { phase: 3 as const, title: 'Intensive Practice', desc: 'Timed practice, complex question types, full essays, and strict error logging' },
    { phase: 4 as const, title: 'Mock Test Phase', desc: 'Full exam simulations under strict timing, pressure handling, and comprehensive analysis' },
    { phase: 5 as const, title: 'Final Review & Readiness', desc: 'Mistake notebook mastery, vocabulary consolidation, final mock test, exam mindset' },
  ];

  for (let day = 1; day <= 30; day++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (day - 1));
    const dateStr = curDate.toISOString().split('T')[0];

    let phaseIndex = 0;
    if (day <= 7) phaseIndex = 0;
    else if (day <= 15) phaseIndex = 1;
    else if (day <= 23) phaseIndex = 2;
    else if (day <= 28) phaseIndex = 3;
    else phaseIndex = 4;

    const phase = phaseDetails[phaseIndex];

    const defaultTasks: DailyTask[] = [
      {
        id: `d${day}-t1`,
        dayNumber: day,
        skill: 'listening',
        title: day <= 7 ? 'Listening Section 1 & 2 diagnostic' : day <= 15 ? 'Listening Section 3 & 4 focus' : 'Full Listening timed practice',
        targetMinutes: 40,
        completedMinutes: day < 3 ? 40 : 0,
        completed: day < 3,
        score: day === 1 ? 5.5 : day === 2 ? 6.0 : undefined,
      },
      {
        id: `d${day}-t2`,
        dayNumber: day,
        skill: 'reading',
        title: day <= 7 ? 'Reading Passage 1: Skimming & Scanning' : day <= 15 ? 'Reading Passage 2 & Matching Headings' : 'Full timed Reading test (3 passages)',
        targetMinutes: 40,
        completedMinutes: day < 3 ? 40 : 0,
        completed: day < 3,
        score: day === 1 ? 5.0 : day === 2 ? 5.5 : undefined,
      },
      {
        id: `d${day}-t3`,
        dayNumber: day,
        skill: 'writing',
        title: day % 2 === 1 ? 'Writing Task 1: Overview & Data description' : 'Writing Task 2: Agree/Disagree essay structure',
        targetMinutes: 50,
        completedMinutes: day < 3 ? 50 : 0,
        completed: day < 3,
        score: day === 1 ? 5.0 : day === 2 ? 5.0 : undefined,
      },
      {
        id: `d${day}-t4`,
        dayNumber: day,
        skill: 'speaking',
        title: day <= 10 ? 'Speaking Part 1: Fluency & Topic familiarity' : 'Speaking Part 2: 1-min prep & 2-min delivery',
        targetMinutes: 30,
        completedMinutes: day < 3 ? 30 : 0,
        completed: day < 3,
        score: day === 1 ? 5.5 : day === 2 ? 5.5 : undefined,
      },
      {
        id: `d${day}-t5`,
        dayNumber: day,
        skill: 'vocabulary',
        title: 'Learn 10 academic band-7 words + Collocations',
        targetMinutes: 10,
        completedMinutes: day < 3 ? 10 : 0,
        completed: day < 3,
      },
      {
        id: `d${day}-t6`,
        dayNumber: day,
        skill: 'grammar',
        title: 'Grammar review: Articles, Prepositions & Complex Sentences',
        targetMinutes: 10,
        completedMinutes: day < 3 ? 10 : 0,
        completed: day < 3,
      },
    ];

    plans.push({
      dayNumber: day,
      date: dateStr,
      phase: phase.phase,
      phaseTitle: phase.title,
      objective: day === 1 
        ? 'Diagnostic baseline: Pinpoint weakness in listening and reading speed'
        : day === 2
        ? 'Review diagnostic errors & practice writing task 2 introductory paragraphs'
        : day === 3
        ? 'Target True/False/Not Given traps and Part 2 speaking coherence'
        : `${phase.title}: Intensive drill on core exam competencies`,
      estimatedMinutes: 180,
      actualStudyMinutes: day === 1 ? 180 : day === 2 ? 185 : 0,
      tasks: defaultTasks,
      completed: day < 3,
      notes: day === 1 ? 'Struggled with distractor options in Listening section 2. Need to watch out for negative prefixes.' : undefined,
    });
  }

  return plans;
}

const sampleVocab: VocabularyWord[] = [
  {
    id: 'v-1',
    word: 'substantiate',
    meaning: 'To provide evidence to support or prove the truth of something',
    partOfSpeech: 'verb',
    exampleSentence: 'The researcher was unable to substantiate her claims with empirical data in Writing Task 2.',
    synonyms: ['corroborate', 'verify', 'authenticate', 'validate'],
    antonyms: ['disprove', 'refute', 'contradict'],
    topic: 'Academic Writing & Science',
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    reviewStatus: 'reviewed',
    confidenceLevel: 3,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'v-2',
    word: 'predominantly',
    meaning: 'Mainly; for the most part',
    partOfSpeech: 'adverb',
    exampleSentence: 'The expenditure was predominantly allocated towards infrastructural development.',
    synonyms: ['primarily', 'largely', 'chiefly', 'mainly'],
    antonyms: ['secondarily', 'minimally'],
    topic: 'Task 1 Academic Trends',
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    reviewStatus: 'mastered',
    confidenceLevel: 5,
    nextReviewDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
  },
  {
    id: 'v-3',
    word: 'ubiquitous',
    meaning: 'Present, appearing, or found everywhere',
    partOfSpeech: 'adjective',
    exampleSentence: 'Smartphones have become ubiquitous across virtually all demographics.',
    synonyms: ['omnipresent', 'pervasive', 'widespread'],
    antonyms: ['rare', 'scarce'],
    topic: 'Technology & Modern Life',
    dateAdded: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    reviewStatus: 'due_today',
    confidenceLevel: 2,
    nextReviewDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 'v-4',
    word: 'exponentially',
    meaning: 'At an increasingly rapid rate',
    partOfSpeech: 'adverb',
    exampleSentence: 'Carbon emissions have grown exponentially over the last four decades.',
    synonyms: ['rapidly', 'dramatically', 'sharply'],
    antonyms: ['gradually', 'linearly'],
    topic: 'Environment & Trends',
    dateAdded: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    reviewStatus: 'reviewed',
    confidenceLevel: 4,
    nextReviewDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  },
  {
    id: 'v-5',
    word: 'counterproductive',
    meaning: 'Having the opposite of the desired effect',
    partOfSpeech: 'adjective',
    exampleSentence: 'Excessive memorization without understanding underlying logic is counterproductive for IELTS speaking.',
    synonyms: ['detrimental', 'ineffective', 'disadvantageous'],
    antonyms: ['beneficial', 'productive', 'fruitful'],
    topic: 'Education & Study Skills',
    dateAdded: new Date().toISOString().split('T')[0],
    reviewStatus: 'due_today',
    confidenceLevel: 2,
    nextReviewDate: new Date().toISOString().split('T')[0],
  }
];

const sampleGrammar: GrammarMistake[] = [
  {
    id: 'g-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    category: 'subject_verb_agreement',
    mySentence: 'People is using technology to communicate every day.',
    correctSentence: 'People are using technology to communicate every day.',
    explanation: '"People" is a plural noun and always requires the plural auxiliary verb "are".',
    occurrenceCount: 2,
    resolved: true,
  },
  {
    id: 'g-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    category: 'articles',
    mySentence: 'Government should invest in the education.',
    correctSentence: 'The government should invest in education.',
    explanation: 'Specific governments require "The government", while general academic domains like "education" are uncountable and usually do not take "the" when discussed in general.',
    occurrenceCount: 1,
    resolved: false,
  },
  {
    id: 'g-3',
    date: new Date().toISOString().split('T')[0],
    category: 'prepositions',
    mySentence: 'There is a dramatic increase of 30% in sales.',
    correctSentence: 'There is a dramatic increase of 30% in sales / an increase of X.',
    explanation: 'Notice the preposition: "an increase in something", "an increase of [quantity]".',
    occurrenceCount: 1,
    resolved: false,
  }
];

const sampleErrors: ErrorLogItem[] = [
  {
    id: 'err-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    skill: 'listening',
    questionOrTopic: 'Cambridge 18 Test 1 Section 2 - Question 14 (Map labeling)',
    myAnswer: 'North library',
    correctAnswer: 'Library annex',
    whyWrong: 'Did not listen to directional indicators "adjacent to the botanical garden" and was misled by a distractor mentioning the main library.',
    category: 'Map',
    correctRule: 'Trace finger along map during speaker audio; listen carefully for prepositions of location (adjacent, opposite, corner).',
    reviewed: true,
    reviewDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    occurrenceCount: 1,
  },
  {
    id: 'err-2',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    skill: 'listening',
    questionOrTopic: 'Cambridge 18 Test 1 Section 1 - Question 7 (Phone number)',
    myAnswer: '07892 45312',
    correctAnswer: '07892 45321',
    whyWrong: 'Inverted the last two digits under time pressure.',
    category: 'Numbers',
    correctRule: 'Write digits clearly as they are uttered; replay numbers mentally before audio ends.',
    reviewed: false,
    occurrenceCount: 2,
  },
  {
    id: 'err-3',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    skill: 'reading',
    questionOrTopic: 'Cambridge 18 Test 1 Passage 1 - True/False/Not Given Q4',
    myAnswer: 'False',
    correctAnswer: 'Not Given',
    whyWrong: 'Assumed the opposite was true based on personal knowledge rather than what was strictly stated in paragraph 3.',
    category: 'True / False / Not Given',
    correctRule: 'Only choose FALSE if the passage directly contradicts the claim. If the passage does not confirm or deny it, it is NOT GIVEN.',
    reviewed: false,
    occurrenceCount: 3,
  },
  {
    id: 'err-4',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    skill: 'writing',
    questionOrTopic: 'Task 2: Technological unemployment essay',
    myAnswer: 'Only discussed advantages and forgot to address the counter-view in the prompt.',
    correctAnswer: 'Balanced discussion addressing both views explicitly.',
    whyWrong: 'Rushed into writing without breaking down prompt keywords (Discuss both views and give your opinion).',
    category: 'Task Response',
    correctRule: 'Always spend 3-5 minutes deconstructing prompt requirements and write balanced body paragraphs for both views before concluding.',
    reviewed: false,
    occurrenceCount: 1,
  }
];

const sampleListening: ListeningPractice[] = [
  {
    id: 'lp-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    testName: 'Cambridge 18 Test 1',
    section: 'full_test',
    questionsAttempted: 40,
    correctAnswers: 21,
    incorrectAnswers: 19,
    accuracyPercentage: 52.5,
    estimatedBand: 5.5,
    timeTakenMinutes: 32,
    mistakeCategories: ['map', 'numbers', 'distractors'],
    mistakes: ['Q7 inverted number', 'Q14 confused map coordinates', 'Q28 missed audio turn'],
    notes: 'Section 1 was decent (7/10), but Section 3 multiple choice speed caused panic.',
  },
  {
    id: 'lp-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    testName: 'Cambridge 18 Test 2 (Section 1 & 2)',
    section: 'section_1',
    questionsAttempted: 20,
    correctAnswers: 14,
    incorrectAnswers: 6,
    accuracyPercentage: 70.0,
    estimatedBand: 6.0,
    timeTakenMinutes: 18,
    mistakeCategories: ['spelling', 'sentence_completion'],
    mistakes: ['Misspelled accommodation with one m', 'Missed plural s on reservations'],
    notes: 'Spelling mistakes cost 2 points. Need to revise double consonant words.',
  }
];

const sampleReading: ReadingPractice[] = [
  {
    id: 'rp-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    testName: 'Cambridge 18 Test 1 Passage 1',
    passage: 'passage_1',
    questionTypes: ['true_false_not_given', 'sentence_completion'],
    questionsAttempted: 13,
    correctAnswers: 8,
    incorrectAnswers: 5,
    accuracyPercentage: 61.5,
    estimatedBand: 5.5,
    timeTakenMinutes: 22,
    mistakes: ['Q4 confused False vs Not Given', 'Q9 word count limit exceeded'],
    notes: 'Took 22 minutes on Passage 1 instead of target 18 minutes. Must increase skimming speed.',
  },
  {
    id: 'rp-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    testName: 'Cambridge 18 Test 1 Passage 2',
    passage: 'passage_2',
    questionTypes: ['matching_headings', 'summary_completion'],
    questionsAttempted: 13,
    correctAnswers: 7,
    incorrectAnswers: 6,
    accuracyPercentage: 53.8,
    estimatedBand: 5.5,
    timeTakenMinutes: 21,
    mistakes: ['Matching headings paragraph C and E inverted'],
    notes: 'Heading matching took too long. Read the first and last sentences of paragraphs first.',
  }
];

const sampleWriting: WritingPractice[] = [
  {
    id: 'wp-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    taskType: 'task_2',
    topic: 'Some people believe that universities should focus on graduates skills for employment, while others think they should focus on pure knowledge. Discuss both views.',
    timeSpentMinutes: 48,
    wordCount: 268,
    selfAssessedBand: 5.0,
    checklist: {
      answeredAllParts: false,
      clearPosition: true,
      relevantIdeas: true,
      developedExamples: false,
      clearParagraphing: true,
      logicalProgression: false,
      linkingWordsUsedNaturally: false,
      goodVocabulary: false,
      avoidedRepetition: false,
      correctWordForms: true,
      sentenceVariety: false,
      correctArticles: false,
      correctTenses: true,
      subjectVerbAgreement: false,
      correctPrepositions: true,
    },
    grammarMistakes: ['People is instead of people are', 'Lack of complex conditional clauses'],
    vocabularyMistakes: ['Repeated the word "important" 6 times'],
    coherenceMistakes: ['Overused "Furthermore" and "Moreover" in simple sentences'],
    taskResponseMistakes: ['Gave weak example in body paragraph 2'],
    evaluationNotes: 'Practice band 5.0. Structure is present, but vocabulary repetition and grammatical inaccuracies hold it back.',
  }
];

const sampleSpeaking: SpeakingPractice[] = [
  {
    id: 'sp-1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    part: 'part_2',
    category: 'places',
    topic: 'Describe a historical building or museum you visited that left a strong impression.',
    durationMinutes: 4,
    fluencyScore: 5.5,
    vocabularyScore: 5.5,
    grammarScore: 5.0,
    pronunciationScore: 6.0,
    overallEstimatedBand: 5.5,
    cueCardNotes: '- National Museum in capital city\n- Architecture: traditional red brick, ancient artifacts\n- Why memorable: interactive VR exhibition, illuminated dome',
    difficultVocabulary: ['edifice', 'antiquities', 'unparalleled heritage'],
    grammarMistakes: ['Said "In the last year I go" instead of "Last year I went"'],
    fluencyProblems: ['Paused for 4 seconds when searching for English word for showcase'],
    repeatedWords: ['very beautiful', 'really good'],
    pronunciationProblems: ['Heritage stressed on second syllable instead of first'],
    notes: 'Good attempt on Part 2. Managed to speak for 1 minute 48 seconds. Need to eliminate unnatural long pauses.',
  }
];

const sampleMockTest: MockTest = {
  id: 'mt-1',
  date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
  testName: 'Baseline Mock Test #1 (Diagnostic)',
  listeningRawScore: 21,
  listeningBand: 5.5,
  readingRawScore: 19,
  readingBand: 5.5,
  writingBand: 5.0,
  speakingBand: 5.5,
  overallBand: 5.5,
  totalTimeMinutes: 165,
  notes: 'Diagnostic baseline completed. Weakest skill is Writing (Task Response & Coherence). Reading speed also needs improvement.',
};

export function getInitialData(): IELTSAppData {
  const plans = create30Days();
  const todayStr = new Date().toISOString().split('T')[0];

  return {
    profile: {
      name: 'IELTS Candidate',
      currentBand: 5.5,
      targetBand: 7.0,
      startDate: plans[0].date,
      durationDays: 30,
      dailyStudyTargetMinutes: 180, // 3 hours
      minimumStreakMinutes: 120,    // 2 hours minimum for streak
      dailyVocabTarget: 10,
      preferredTimerDuration: 40,
      theme: 'dark',
    },
    days: plans,
    sessions: [
      {
        id: 'sess-1',
        date: plans[0].date,
        skill: 'listening',
        durationMinutes: 45,
        notes: 'Cambridge 18 diagnostic',
        createdAt: `${plans[0].date}T10:00:00Z`,
      },
      {
        id: 'sess-2',
        date: plans[0].date,
        skill: 'reading',
        durationMinutes: 45,
        notes: 'Passage 1 timing',
        createdAt: `${plans[0].date}T11:00:00Z`,
      },
      {
        id: 'sess-3',
        date: plans[0].date,
        skill: 'writing',
        durationMinutes: 50,
        notes: 'Task 2 essay',
        createdAt: `${plans[0].date}T14:00:00Z`,
      },
      {
        id: 'sess-4',
        date: plans[0].date,
        skill: 'speaking',
        durationMinutes: 30,
        notes: 'Part 1 intro drill',
        createdAt: `${plans[0].date}T16:00:00Z`,
      },
      {
        id: 'sess-5',
        date: plans[0].date,
        skill: 'vocabulary',
        durationMinutes: 10,
        notes: '10 words drill',
        createdAt: `${plans[0].date}T17:00:00Z`,
      },
      {
        id: 'sess-6',
        date: plans[1].date,
        skill: 'listening',
        durationMinutes: 45,
        notes: 'Section 1 & 2',
        createdAt: `${plans[1].date}T10:00:00Z`,
      },
      {
        id: 'sess-7',
        date: plans[1].date,
        skill: 'reading',
        durationMinutes: 45,
        notes: 'Matching headings',
        createdAt: `${plans[1].date}T11:00:00Z`,
      },
      {
        id: 'sess-8',
        date: plans[1].date,
        skill: 'writing',
        durationMinutes: 55,
        notes: 'Task 1 overview practice',
        createdAt: `${plans[1].date}T14:30:00Z`,
      },
      {
        id: 'sess-9',
        date: plans[1].date,
        skill: 'speaking',
        durationMinutes: 30,
        notes: 'Part 2 Cue card',
        createdAt: `${plans[1].date}T16:00:00Z`,
      },
      {
        id: 'sess-10',
        date: plans[1].date,
        skill: 'vocabulary',
        durationMinutes: 10,
        notes: 'Flashcards',
        createdAt: `${plans[1].date}T17:00:00Z`,
      },
      // Today session (partial study session logged to demonstrate live state)
      {
        id: 'sess-today-1',
        date: todayStr,
        skill: 'listening',
        durationMinutes: 40,
        notes: 'Cambridge 18 section 3 practice',
        createdAt: `${todayStr}T09:30:00Z`,
      },
    ],
    listening: sampleListening,
    reading: sampleReading,
    writing: sampleWriting,
    speaking: sampleSpeaking,
    vocabulary: sampleVocab,
    grammar: sampleGrammar,
    errors: sampleErrors,
    mockTests: [sampleMockTest],
  };
}
