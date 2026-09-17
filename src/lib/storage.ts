'use client';

import { IELTSAppData, UserProfile, DayPlan, StudySession, ListeningPractice, ReadingPractice, WritingPractice, SpeakingPractice, VocabularyWord, GrammarMistake, ErrorLogItem, MockTest } from '@/types/ielts';
import { getInitialData } from './seedData';
import { calculateOverallBand, getTodayDateString } from './ieltsUtils';

const STORAGE_KEY = 'ielts_study_tracker_data_v1';

export function getStoredData(): IELTSAppData {
  if (typeof window === 'undefined') {
    return getInitialData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as IELTSAppData;
    // Basic verification of schema integrity
    if (!parsed.profile || !parsed.days || !parsed.listening) {
      const initial = getInitialData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return getInitialData();
  }
}

export function saveStoredData(data: IELTSAppData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('ielts-data-updated'));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

export function resetToSeedData(): IELTSAppData {
  const initial = getInitialData();
  saveStoredData(initial);
  return initial;
}

export function exportDataAsJSON(): string {
  const data = getStoredData();
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString) as IELTSAppData;
    if (!parsed.profile || !Array.isArray(parsed.days)) {
      throw new Error('Invalid schema');
    }
    saveStoredData(parsed);
    return true;
  } catch (err) {
    console.error('Import error:', err);
    return false;
  }
}

/**
 * High-level helper calculations
 */
export function calculateStudyStats(data: IELTSAppData) {
  const todayStr = getTodayDateString();
  const startDate = new Date(data.profile.startDate);
  const today = new Date(todayStr);

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const currentDayNumber = Math.min(Math.max(diffDays, 1), data.profile.durationDays);
  const daysRemaining = Math.max(0, data.profile.durationDays - currentDayNumber);

  // Today's study time
  const todaySessions = data.sessions.filter(s => s.date === todayStr);
  const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Today's Day Plan tasks
  const todayPlan = data.days.find(d => d.dayNumber === currentDayNumber) || data.days[0];
  const todayTasks = todayPlan ? todayPlan.tasks : [];
  const todayTasksCompleted = todayTasks.filter(t => t.completed).length;
  const todayTasksTotal = todayTasks.length;

  // Calculate Streak
  // A day counts toward streak if total study minutes >= minimumStreakMinutes
  const dayMinutesMap: Record<string, number> = {};
  data.sessions.forEach(s => {
    dayMinutesMap[s.date] = (dayMinutesMap[s.date] || 0) + s.durationMinutes;
  });

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Scan backwards from today (or yesterday if today is not yet minimum)
  const todayMinMet = (dayMinutesMap[todayStr] || 0) >= data.profile.minimumStreakMinutes;
  let checkDate = new Date(todayStr);
  if (!todayMinMet) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const mins = dayMinutesMap[dateStr] || 0;
    if (mins >= data.profile.minimumStreakMinutes) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  if (todayMinMet && currentStreak === 0) {
    currentStreak = 1;
  }

  // Calculate Longest Streak by scanning all dates in sorted order
  const datesWithMins = Object.keys(dayMinutesMap).sort();
  if (datesWithMins.length > 0) {
    let prevDate: Date | null = null;
    for (const dStr of datesWithMins) {
      if (dayMinutesMap[dStr] >= data.profile.minimumStreakMinutes) {
        const curD = new Date(dStr);
        if (prevDate) {
          const diff = Math.round((curD.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        prevDate = curD;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      }
    }
  }
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Calculate Total Study Hours across all sessions
  const totalStudyMinutes = data.sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Skill Bands (use latest practices or fallback to profile current band)
  const latestListening = data.listening.length > 0 ? data.listening[data.listening.length - 1].estimatedBand : data.profile.currentBand;
  const latestReading = data.reading.length > 0 ? data.reading[data.reading.length - 1].estimatedBand : data.profile.currentBand;
  const latestWriting = data.writing.length > 0 ? data.writing[data.writing.length - 1].selfAssessedBand : data.profile.currentBand;
  const latestSpeaking = data.speaking.length > 0 ? data.speaking[data.speaking.length - 1].overallEstimatedBand : data.profile.currentBand;

  const estimatedOverallBand = calculateOverallBand(latestListening, latestReading, latestWriting, latestSpeaking);

  // Days completed
  const daysCompleted = data.days.filter(d => d.completed).length;

  return {
    currentDayNumber,
    daysRemaining,
    daysCompleted,
    todayStudyMinutes,
    todayTasksCompleted,
    todayTasksTotal,
    currentStreak,
    longestStreak,
    totalStudyMinutes,
    totalStudyHours,
    latestListening,
    latestReading,
    latestWriting,
    latestSpeaking,
    estimatedOverallBand,
    todayPlan,
  };
}
