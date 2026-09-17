import { DayPlan, DailyTask, SkillType } from '@/types/ielts';

export interface PlanGenerationOptions {
  durationDays: number;
  currentBand: number;
  targetBand: number;
  dailyStudyMinutes: number;
  focusArea?: 'balanced' | 'writing_speaking' | 'reading_listening' | 'foundation';
  startDate?: string;
}

export interface PhaseInfo {
  phase: 1 | 2 | 3 | 4 | 5;
  title: string;
  desc: string;
  startDay: number;
  endDay: number;
  color: string;
}

export function calculatePhases(durationDays: number): PhaseInfo[] {
  const total = Math.max(3, durationDays);

  if (total <= 7) {
    // 1-7 days crash sprint
    return [
      { phase: 1, title: 'Diagnostic Baseline', desc: 'Pinpoint critical gaps across all 4 modules', startDay: 1, endDay: Math.max(1, Math.round(total * 0.2)), color: '#38bdf8' },
      { phase: 2, title: 'High-Yield Drill', desc: 'Target key scoring criteria for rapid band gains', startDay: Math.max(2, Math.round(total * 0.2) + 1), endDay: Math.max(2, Math.round(total * 0.5)), color: '#6366f1' },
      { phase: 3, title: 'Intensive Practice', desc: 'Strict timing & error log elimination', startDay: Math.max(3, Math.round(total * 0.5) + 1), endDay: Math.max(3, Math.round(total * 0.75)), color: '#f59e0b' },
      { phase: 4, title: 'Mock Simulation', desc: 'Simulate full test under exam pressure', startDay: Math.max(4, Math.round(total * 0.75) + 1), endDay: total - 1, color: '#10b981' },
      { phase: 5, title: 'Final Readiness', desc: 'Mistake notebook mastery & test-day mindset', startDay: total, endDay: total, color: '#ec4899' },
    ];
  }

  // Standard or extended duration (e.g. 14, 30, 45, 60, 90 days)
  const p1End = Math.max(1, Math.round(total * 0.22));
  const p2End = Math.max(p1End + 1, Math.round(total * 0.50));
  const p3End = Math.max(p2End + 1, Math.round(total * 0.77));
  const p4End = Math.max(p3End + 1, total - Math.max(2, Math.round(total * 0.08)));
  const p5End = total;

  return [
    {
      phase: 1,
      title: 'Foundation + Diagnosis',
      desc: 'Identify weak areas, establish habit, vocabulary foundations, question type mechanics',
      startDay: 1,
      endDay: p1End,
      color: '#38bdf8',
    },
    {
      phase: 2,
      title: 'Skill Building & Technique',
      desc: 'Improve listening accuracy, reading skimming/scanning, writing cohesion, speaking fluency',
      startDay: p1End + 1,
      endDay: p2End,
      color: '#6366f1',
    },
    {
      phase: 3,
      title: 'Intensive Timed Practice',
      desc: 'Timed sections under exam constraints, full essays, and zero-tolerance error analysis',
      startDay: p2End + 1,
      endDay: p3End,
      color: '#f59e0b',
    },
    {
      phase: 4,
      title: 'Mock Test Simulations',
      desc: 'Full 4-skill mock tests under strict timing, pressure handling, and comprehensive score breakdown',
      startDay: p3End + 1,
      endDay: p4End,
      color: '#10b981',
    },
    {
      phase: 5,
      title: 'Final Review & Exam Readiness',
      desc: 'Mistake notebook mastery, vocabulary consolidation, final mock exam, mindset & stamina',
      startDay: p4End + 1,
      endDay: p5End,
      color: '#ec4899',
    },
  ];
}

export function generateCustomPlan(options: PlanGenerationOptions): DayPlan[] {
  const {
    durationDays,
    currentBand,
    targetBand,
    dailyStudyMinutes,
    focusArea = 'balanced',
    startDate,
  } = options;

  const totalDays = Math.max(3, Math.min(365, durationDays));
  const baseDate = startDate ? new Date(startDate) : new Date();
  const phases = calculatePhases(totalDays);

  const plans: DayPlan[] = [];

  // Apportion target minutes among skills based on focus area
  let listeningMins = 35;
  let readingMins = 40;
  let writingMins = 50;
  let speakingMins = 30;
  let vocabMins = 15;
  let grammarMins = 10;

  if (focusArea === 'writing_speaking') {
    writingMins = Math.round(dailyStudyMinutes * 0.35);
    speakingMins = Math.round(dailyStudyMinutes * 0.25);
    readingMins = Math.round(dailyStudyMinutes * 0.15);
    listeningMins = Math.round(dailyStudyMinutes * 0.15);
    vocabMins = Math.round(dailyStudyMinutes * 0.05);
    grammarMins = Math.max(10, dailyStudyMinutes - (writingMins + speakingMins + readingMins + listeningMins + vocabMins));
  } else if (focusArea === 'reading_listening') {
    readingMins = Math.round(dailyStudyMinutes * 0.32);
    listeningMins = Math.round(dailyStudyMinutes * 0.30);
    writingMins = Math.round(dailyStudyMinutes * 0.18);
    speakingMins = Math.round(dailyStudyMinutes * 0.12);
    vocabMins = Math.round(dailyStudyMinutes * 0.05);
    grammarMins = Math.max(10, dailyStudyMinutes - (readingMins + listeningMins + writingMins + speakingMins + vocabMins));
  } else {
    // Balanced
    const totalAlloc = dailyStudyMinutes;
    listeningMins = Math.round(totalAlloc * 0.22);
    readingMins = Math.round(totalAlloc * 0.24);
    writingMins = Math.round(totalAlloc * 0.28);
    speakingMins = Math.round(totalAlloc * 0.16);
    vocabMins = Math.round(totalAlloc * 0.05);
    grammarMins = Math.max(10, totalAlloc - (listeningMins + readingMins + writingMins + speakingMins + vocabMins));
  }

  const bandTitleSuffix = targetBand >= 7.5 ? `Band ${targetBand.toFixed(1)} Mastery` : `Target Band ${targetBand.toFixed(1)}`;

  for (let day = 1; day <= totalDays; day++) {
    const curDate = new Date(baseDate);
    curDate.setDate(baseDate.getDate() + (day - 1));
    const dateStr = curDate.toISOString().split('T')[0];

    // Find which phase this day belongs to
    const phaseInfo = phases.find(p => day >= p.startDay && day <= p.endDay) || phases[phases.length - 1];

    const tasks: DailyTask[] = [
      {
        id: `d${day}-t1`,
        dayNumber: day,
        skill: 'listening',
        title: phaseInfo.phase === 1
          ? `Listening Section 1 & 2 diagnostic (${bandTitleSuffix})`
          : phaseInfo.phase === 2
          ? 'Listening Section 3 & 4 academic lectures drill'
          : phaseInfo.phase === 3
          ? 'Full timed Listening test under strict conditions'
          : phaseInfo.phase === 4
          ? 'Full Mock Exam Listening module with 0 distractor errors'
          : 'Listening error audit: review tricky spellings & names',
        targetMinutes: listeningMins,
        completedMinutes: 0,
        completed: false,
      },
      {
        id: `d${day}-t2`,
        dayNumber: day,
        skill: 'reading',
        title: phaseInfo.phase === 1
          ? 'Reading Passage 1: Skimming, Scanning & Keywords'
          : phaseInfo.phase === 2
          ? 'Reading: True/False/Not Given & Matching Headings'
          : phaseInfo.phase === 3
          ? 'Timed 3-passage Reading test (60 min strict pacing)'
          : phaseInfo.phase === 4
          ? 'Mock Test Reading module & distractor breakdown'
          : 'High-speed speed reading drill & vocab consolidation',
        targetMinutes: readingMins,
        completedMinutes: 0,
        completed: false,
      },
      {
        id: `d${day}-t3`,
        dayNumber: day,
        skill: 'writing',
        title: day % 2 === 1
          ? `Writing Task 1: Overview & data trends (${bandTitleSuffix})`
          : `Writing Task 2: Opinion essay structure & cohesive devices`,
        targetMinutes: writingMins,
        completedMinutes: 0,
        completed: false,
      },
      {
        id: `d${day}-t4`,
        dayNumber: day,
        skill: 'speaking',
        title: phaseInfo.phase <= 2
          ? 'Speaking Part 1 & Part 2 Cue card 2-minute delivery'
          : phaseInfo.phase <= 4
          ? 'Speaking Part 3 abstract questions & idiomatic collocations'
          : 'Full Speaking Interview simulation & recording playback',
        targetMinutes: speakingMins,
        completedMinutes: 0,
        completed: false,
      },
      {
        id: `d${day}-t5`,
        dayNumber: day,
        skill: 'vocabulary',
        title: `Learn ${targetBand >= 7.5 ? 15 : 10} academic Band ${targetBand.toFixed(1)} topic collocations`,
        targetMinutes: vocabMins,
        completedMinutes: 0,
        completed: false,
      },
      {
        id: `d${day}-t6`,
        dayNumber: day,
        skill: 'grammar',
        title: 'Grammar repair: Complex structures, articles & prepositions',
        targetMinutes: grammarMins,
        completedMinutes: 0,
        completed: false,
      },
    ];

    let objective = '';
    if (day === 1) {
      objective = `Diagnostic baseline test: Pinpoint score gap from current Band ${currentBand.toFixed(1)} to target Band ${targetBand.toFixed(1)}`;
    } else if (day === totalDays) {
      objective = `Final readiness check & Mistake Book mastery before test day`;
    } else if (phaseInfo.phase === 4) {
      objective = `Full test simulation: Replicate actual 2h 45m test pressure & timing`;
    } else {
      objective = `${phaseInfo.title}: Targeted sprint toward Band ${targetBand.toFixed(1)} competency`;
    }

    plans.push({
      dayNumber: day,
      date: dateStr,
      phase: phaseInfo.phase,
      phaseTitle: phaseInfo.title,
      objective,
      estimatedMinutes: dailyStudyMinutes,
      actualStudyMinutes: 0,
      tasks,
      completed: false,
    });
  }

  return plans;
}
