'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  IELTSAppData,
  UserProfile,
  DailyTask,
  StudySession,
  ListeningPractice,
  ReadingPractice,
  WritingPractice,
  SpeakingPractice,
  VocabularyWord,
  GrammarMistake,
  ErrorLogItem,
  MockTest,
} from '@/types/ielts';
import {
  getStoredData,
  saveStoredData,
  calculateStudyStats,
  resetToSeedData,
  importDataFromJSON,
  exportDataAsJSON,
} from '@/lib/storage';
import { getTodayDateString } from '@/lib/ieltsUtils';
import { generateCustomPlan, PlanGenerationOptions } from '@/lib/planGenerator';
import {
  testSupabaseConnection,
  fetchIELTSDataFromSupabase,
  saveIELTSDataToSupabase,
  SUPABASE_SQL_SETUP,
  isSupabaseConfigured,
  DEFAULT_USER_RECORD_ID,
} from '@/lib/supabase';
import { useAuth } from './AuthContext';

export type CloudSyncStatus =
  | 'idle'
  | 'checking'
  | 'connected'
  | 'syncing'
  | 'synced'
  | 'setup_needed'
  | 'error';

interface IELTSContextType {
  data: IELTSAppData;
  isLoaded: boolean;
  stats: ReturnType<typeof calculateStudyStats>;
  // Cloud Database state
  cloudStatus: CloudSyncStatus;
  cloudMessage: string | null;
  lastSyncedAt: Date | null;
  syncNow: () => Promise<boolean>;
  pullFromCloud: () => Promise<boolean>;
  testConnection: () => Promise<void>;
  setupSql: string;

  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  buildCustomPlan: (options: PlanGenerationOptions) => void;
  addTaskToDay: (dayNumber: number, task: Omit<DailyTask, 'id'>) => void;
  deleteTaskFromDay: (dayNumber: number, taskId: string) => void;
  editTaskInDay: (dayNumber: number, taskId: string, updates: Partial<DailyTask>) => void;
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  updateDayNotes: (dayNumber: number, notes: string) => void;
  addStudySession: (session: Omit<StudySession, 'id' | 'createdAt'>) => void;
  addListeningPractice: (practice: Omit<ListeningPractice, 'id'>) => void;
  addReadingPractice: (practice: Omit<ReadingPractice, 'id'>) => void;
  addWritingPractice: (practice: Omit<WritingPractice, 'id'>) => void;
  addSpeakingPractice: (practice: Omit<SpeakingPractice, 'id'>) => void;
  addVocabularyWord: (word: Omit<VocabularyWord, 'id' | 'dateAdded'>) => void;
  updateVocabularyWord: (id: string, updates: Partial<VocabularyWord>) => void;
  deleteVocabularyWord: (id: string) => void;
  addGrammarMistake: (mistake: Omit<GrammarMistake, 'id'>) => void;
  toggleGrammarResolved: (id: string) => void;
  deleteGrammarMistake: (id: string) => void;
  addErrorLogItem: (item: Omit<ErrorLogItem, 'id' | 'occurrenceCount'>) => void;
  toggleErrorReviewed: (id: string) => void;
  deleteErrorLogItem: (id: string) => void;
  addMockTest: (test: Omit<MockTest, 'id'>) => void;
  resetAllData: () => void;
  importData: (jsonStr: string) => boolean;
  exportData: () => string;
}

const IELTSContext = createContext<IELTSContextType | null>(null);

export function IELTSProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const currentUserId = user ? user.uid : DEFAULT_USER_RECORD_ID;

  const [data, setData] = useState<IELTSAppData>(() => getStoredData());
  const [isLoaded, setIsLoaded] = useState(false);

  // Supabase Cloud Sync State
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>('checking');
  const [cloudMessage, setCloudMessage] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<IELTSAppData>(data);

  // Keep dataRef current
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Debounced auto-save to Supabase
  const scheduleCloudSync = useCallback((nextData: IELTSAppData) => {
    if (!isSupabaseConfigured) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(async () => {
      // Don't attempt background sync if setup is needed or not ready
      setCloudStatus((prev) => (prev === 'setup_needed' ? prev : 'syncing'));

      const result = await saveIELTSDataToSupabase(nextData, currentUserId);
      if (result.success) {
        setCloudStatus('synced');
        setCloudMessage('All study progress synced to Supabase.');
        setLastSyncedAt(new Date());
      } else {
        // If table doesn't exist, highlight setup needed
        if (result.error?.includes('relation') || result.error?.includes('schema cache')) {
          setCloudStatus('setup_needed');
          setCloudMessage('Supabase table setup needed. Click to copy SQL.');
        } else {
          setCloudStatus('error');
          setCloudMessage(result.error || 'Failed to sync with Supabase');
        }
      }
    }, 1500);
  }, [currentUserId]);

  // Central commit function: updates state, localStorage, and schedules cloud sync
  const commitData = useCallback((updater: (prev: IELTSAppData) => IELTSAppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveStoredData(next);
      scheduleCloudSync(next);
      return next;
    });
  }, [scheduleCloudSync]);

  // Check connection and perform initial data sync on mount or user change
  const checkAndInitCloud = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCloudStatus('idle');
      setCloudMessage('Supabase credentials not found.');
      return;
    }

    setCloudStatus('checking');
    setCloudMessage('Checking Supabase connection...');

    const conn = await testSupabaseConnection();
    if (!conn.connected) {
      setCloudStatus('error');
      setCloudMessage(conn.message);
      return;
    }

    if (!conn.tableExists) {
      setCloudStatus('setup_needed');
      setCloudMessage(conn.message);
      return;
    }

    // Table exists! Attempt to pull remote data for current user
    setCloudStatus('syncing');
    setCloudMessage('Fetching cloud data...');
    const remoteData = await fetchIELTSDataFromSupabase(currentUserId);

    if (remoteData && remoteData.profile) {
      setData(remoteData);
      saveStoredData(remoteData);
      setCloudStatus('synced');
      setCloudMessage('Loaded latest study data from Supabase.');
      setLastSyncedAt(new Date());
    } else {
      // Remote row is empty, push current local data to Supabase
      const localData = getStoredData();
      const saveRes = await saveIELTSDataToSupabase(localData, currentUserId);
      if (saveRes.success) {
        setCloudStatus('synced');
        setCloudMessage('Connected to Supabase. Local data uploaded as baseline.');
        setLastSyncedAt(new Date());
      } else {
        setCloudStatus('error');
        setCloudMessage(saveRes.error || 'Failed to initialize Supabase table');
      }
    }
  }, [currentUserId]);

  useEffect(() => {
    const local = getStoredData();
    setData(local);
    setIsLoaded(true);

    // Run Supabase initial check
    checkAndInitCloud();

    const handleSync = () => {
      setData(getStoredData());
    };

    window.addEventListener('ielts-data-updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('ielts-data-updated', handleSync);
      window.removeEventListener('storage', handleSync);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [checkAndInitCloud]);

  // Manual Trigger: Push local to Cloud
  const syncNow = useCallback(async (): Promise<boolean> => {
    setCloudStatus('syncing');
    setCloudMessage('Uploading current progress to Supabase...');
    const res = await saveIELTSDataToSupabase(dataRef.current, currentUserId);
    if (res.success) {
      setCloudStatus('synced');
      setCloudMessage('Successfully synced to Supabase.');
      setLastSyncedAt(new Date());
      return true;
    } else {
      if (res.error?.includes('relation') || res.error?.includes('schema cache')) {
        setCloudStatus('setup_needed');
        setCloudMessage('Table "ielts_study_data" does not exist yet.');
      } else {
        setCloudStatus('error');
        setCloudMessage(res.error || 'Sync failed');
      }
      return false;
    }
  }, [currentUserId]);

  // Manual Trigger: Pull Cloud to Local
  const pullFromCloud = useCallback(async (): Promise<boolean> => {
    setCloudStatus('syncing');
    setCloudMessage('Downloading from Supabase...');
    const remoteData = await fetchIELTSDataFromSupabase(currentUserId);
    if (remoteData && remoteData.profile) {
      setData(remoteData);
      saveStoredData(remoteData);
      setCloudStatus('synced');
      setCloudMessage('Successfully restored latest data from Supabase.');
      setLastSyncedAt(new Date());
      return true;
    } else {
      setCloudStatus('error');
      setCloudMessage('No data found in Supabase or failed to fetch.');
      return false;
    }
  }, [currentUserId]);

  // Manual Trigger: Test connection
  const testConnection = useCallback(async () => {
    await checkAndInitCloud();
  }, [checkAndInitCloud]);

  const stats = useMemo(() => calculateStudyStats(data), [data]);

  const updateProfile = useCallback((profileUpdates: Partial<UserProfile>) => {
    commitData((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates },
    }));
  }, [commitData]);

  const buildCustomPlan = useCallback((options: PlanGenerationOptions) => {
    const newDays = generateCustomPlan(options);
    commitData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        durationDays: options.durationDays,
        targetBand: options.targetBand,
        currentBand: options.currentBand,
        dailyStudyTargetMinutes: options.dailyStudyMinutes,
        startDate: options.startDate || prev.profile.startDate,
      },
      days: newDays,
    }));
  }, [commitData]);

  const addTaskToDay = useCallback((dayNumber: number, task: Omit<DailyTask, 'id'>) => {
    const newTask: DailyTask = {
      ...task,
      id: `custom-d${dayNumber}-${Date.now()}`,
    };
    commitData((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        const tasks = [...d.tasks, newTask];
        const allCompleted = tasks.every((t) => t.completed);
        return { ...d, tasks, completed: allCompleted };
      }),
    }));
  }, [commitData]);

  const deleteTaskFromDay = useCallback((dayNumber: number, taskId: string) => {
    commitData((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        const tasks = d.tasks.filter((t) => t.id !== taskId);
        const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
        return { ...d, tasks, completed: allCompleted };
      }),
    }));
  }, [commitData]);

  const editTaskInDay = useCallback((dayNumber: number, taskId: string, updates: Partial<DailyTask>) => {
    commitData((prev) => ({
      ...prev,
      days: prev.days.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        const tasks = d.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t));
        const allCompleted = tasks.every((t) => t.completed);
        return { ...d, tasks, completed: allCompleted };
      }),
    }));
  }, [commitData]);

  const toggleTaskCompletion = useCallback((dayNumber: number, taskId: string) => {
    commitData((prev) => {
      const nextDays = prev.days.map((d) => {
        if (d.dayNumber !== dayNumber) return d;
        const nextTasks = d.tasks.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, completed: !t.completed };
        });
        const allCompleted = nextTasks.every((t) => t.completed);
        return { ...d, tasks: nextTasks, completed: allCompleted };
      });
      return { ...prev, days: nextDays };
    });
  }, [commitData]);

  const updateDayNotes = useCallback((dayNumber: number, notes: string) => {
    commitData((prev) => {
      const nextDays = prev.days.map((d) => (d.dayNumber === dayNumber ? { ...d, notes } : d));
      return { ...prev, days: nextDays };
    });
  }, [commitData]);

  const addStudySession = useCallback((session: Omit<StudySession, 'id' | 'createdAt'>) => {
    const newSession: StudySession = {
      ...session,
      id: `sess-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    commitData((prev) => {
      const todayStr = getTodayDateString();
      const nextDays = prev.days.map((d) => {
        if (d.date === session.date || (session.date === todayStr && d.dayNumber === stats.currentDayNumber)) {
          return {
            ...d,
            actualStudyMinutes: (d.actualStudyMinutes || 0) + session.durationMinutes,
          };
        }
        return d;
      });

      return {
        ...prev,
        sessions: [newSession, ...prev.sessions],
        days: nextDays,
      };
    });
  }, [commitData, stats.currentDayNumber]);

  const addListeningPractice = useCallback((practice: Omit<ListeningPractice, 'id'>) => {
    const newRecord: ListeningPractice = {
      ...practice,
      id: `lp-${Date.now()}`,
    };
    const autoSession: StudySession = {
      id: `sess-auto-${Date.now()}`,
      date: practice.date,
      skill: 'listening',
      durationMinutes: practice.timeTakenMinutes || 30,
      notes: `Listening practice: ${practice.testName} (${practice.accuracyPercentage.toFixed(1)}%)`,
      createdAt: new Date().toISOString(),
    };
    commitData((prev) => ({
      ...prev,
      listening: [newRecord, ...prev.listening],
      sessions: [autoSession, ...prev.sessions],
    }));
  }, [commitData]);

  const addReadingPractice = useCallback((practice: Omit<ReadingPractice, 'id'>) => {
    const newRecord: ReadingPractice = {
      ...practice,
      id: `rp-${Date.now()}`,
    };
    const autoSession: StudySession = {
      id: `sess-auto-${Date.now()}`,
      date: practice.date,
      skill: 'reading',
      durationMinutes: practice.timeTakenMinutes || 30,
      notes: `Reading practice: ${practice.testName} (${practice.accuracyPercentage.toFixed(1)}%)`,
      createdAt: new Date().toISOString(),
    };
    commitData((prev) => ({
      ...prev,
      reading: [newRecord, ...prev.reading],
      sessions: [autoSession, ...prev.sessions],
    }));
  }, [commitData]);

  const addWritingPractice = useCallback((practice: Omit<WritingPractice, 'id'>) => {
    const newRecord: WritingPractice = {
      ...practice,
      id: `wp-${Date.now()}`,
    };
    const autoSession: StudySession = {
      id: `sess-auto-${Date.now()}`,
      date: practice.date,
      skill: 'writing',
      durationMinutes: practice.timeSpentMinutes || 40,
      notes: `Writing ${practice.taskType.toUpperCase()}: ${practice.topic.slice(0, 40)}... (Band ${practice.selfAssessedBand})`,
      createdAt: new Date().toISOString(),
    };
    commitData((prev) => ({
      ...prev,
      writing: [newRecord, ...prev.writing],
      sessions: [autoSession, ...prev.sessions],
    }));
  }, [commitData]);

  const addSpeakingPractice = useCallback((practice: Omit<SpeakingPractice, 'id'>) => {
    const newRecord: SpeakingPractice = {
      ...practice,
      id: `sp-${Date.now()}`,
    };
    const autoSession: StudySession = {
      id: `sess-auto-${Date.now()}`,
      date: practice.date,
      skill: 'speaking',
      durationMinutes: Math.max(practice.durationMinutes || 15, 10),
      notes: `Speaking ${practice.part}: ${practice.topic.slice(0, 40)}... (Band ${practice.overallEstimatedBand})`,
      createdAt: new Date().toISOString(),
    };
    commitData((prev) => ({
      ...prev,
      speaking: [newRecord, ...prev.speaking],
      sessions: [autoSession, ...prev.sessions],
    }));
  }, [commitData]);

  const addVocabularyWord = useCallback((word: Omit<VocabularyWord, 'id' | 'dateAdded'>) => {
    const todayStr = getTodayDateString();
    const newWord: VocabularyWord = {
      ...word,
      id: `v-${Date.now()}`,
      dateAdded: todayStr,
    };
    commitData((prev) => ({
      ...prev,
      vocabulary: [newWord, ...prev.vocabulary],
    }));
  }, [commitData]);

  const updateVocabularyWord = useCallback((id: string, updates: Partial<VocabularyWord>) => {
    commitData((prev) => ({
      ...prev,
      vocabulary: prev.vocabulary.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  }, [commitData]);

  const deleteVocabularyWord = useCallback((id: string) => {
    commitData((prev) => ({
      ...prev,
      vocabulary: prev.vocabulary.filter((v) => v.id !== id),
    }));
  }, [commitData]);

  const addGrammarMistake = useCallback((mistake: Omit<GrammarMistake, 'id'>) => {
    const newMistake: GrammarMistake = {
      ...mistake,
      id: `g-${Date.now()}`,
    };
    commitData((prev) => {
      const existing = prev.grammar.find(
        (g) => g.category === mistake.category && g.mySentence.toLowerCase() === mistake.mySentence.toLowerCase()
      );
      let nextGrammar: GrammarMistake[];
      if (existing) {
        nextGrammar = prev.grammar.map((g) =>
          g.id === existing.id ? { ...g, occurrenceCount: g.occurrenceCount + 1 } : g
        );
      } else {
        nextGrammar = [newMistake, ...prev.grammar];
      }
      return { ...prev, grammar: nextGrammar };
    });
  }, [commitData]);

  const toggleGrammarResolved = useCallback((id: string) => {
    commitData((prev) => ({
      ...prev,
      grammar: prev.grammar.map((g) => (g.id === id ? { ...g, resolved: !g.resolved } : g)),
    }));
  }, [commitData]);

  const deleteGrammarMistake = useCallback((id: string) => {
    commitData((prev) => ({
      ...prev,
      grammar: prev.grammar.filter((g) => g.id !== id),
    }));
  }, [commitData]);

  const addErrorLogItem = useCallback((item: Omit<ErrorLogItem, 'id' | 'occurrenceCount'>) => {
    commitData((prev) => {
      const existing = prev.errors.find(
        (e) =>
          e.skill === item.skill &&
          e.category.toLowerCase() === item.category.toLowerCase() &&
          e.myAnswer.toLowerCase() === item.myAnswer.toLowerCase()
      );
      let nextErrors: ErrorLogItem[];
      if (existing) {
        nextErrors = prev.errors.map((e) =>
          e.id === existing.id
            ? { ...e, occurrenceCount: e.occurrenceCount + 1, date: item.date, reviewed: false }
            : e
        );
      } else {
        const newItem: ErrorLogItem = {
          ...item,
          id: `err-${Date.now()}`,
          occurrenceCount: 1,
        };
        nextErrors = [newItem, ...prev.errors];
      }
      return { ...prev, errors: nextErrors };
    });
  }, [commitData]);

  const toggleErrorReviewed = useCallback((id: string) => {
    const todayStr = getTodayDateString();
    commitData((prev) => ({
      ...prev,
      errors: prev.errors.map((e) =>
        e.id === id ? { ...e, reviewed: !e.reviewed, reviewDate: !e.reviewed ? todayStr : undefined } : e
      ),
    }));
  }, [commitData]);

  const deleteErrorLogItem = useCallback((id: string) => {
    commitData((prev) => ({
      ...prev,
      errors: prev.errors.filter((e) => e.id !== id),
    }));
  }, [commitData]);

  const addMockTest = useCallback((test: Omit<MockTest, 'id'>) => {
    const newTest: MockTest = {
      ...test,
      id: `mt-${Date.now()}`,
    };
    commitData((prev) => ({
      ...prev,
      mockTests: [newTest, ...prev.mockTests],
    }));
  }, [commitData]);

  const resetAllData = useCallback(() => {
    const initial = resetToSeedData();
    commitData(() => initial);
  }, [commitData]);

  const importData = useCallback(
    (jsonStr: string) => {
      const success = importDataFromJSON(jsonStr);
      if (success) {
        const fresh = getStoredData();
        commitData(() => fresh);
      }
      return success;
    },
    [commitData]
  );

  const exportData = useCallback(() => {
    return exportDataAsJSON();
  }, []);

  return (
    <IELTSContext.Provider
      value={{
        data,
        isLoaded,
        stats,
        cloudStatus,
        cloudMessage,
        lastSyncedAt,
        syncNow,
        pullFromCloud,
        testConnection,
        setupSql: SUPABASE_SQL_SETUP,
        updateProfile,
        buildCustomPlan,
        addTaskToDay,
        deleteTaskFromDay,
        editTaskInDay,
        toggleTaskCompletion,
        updateDayNotes,
        addStudySession,
        addListeningPractice,
        addReadingPractice,
        addWritingPractice,
        addSpeakingPractice,
        addVocabularyWord,
        updateVocabularyWord,
        deleteVocabularyWord,
        addGrammarMistake,
        toggleGrammarResolved,
        deleteGrammarMistake,
        addErrorLogItem,
        toggleErrorReviewed,
        deleteErrorLogItem,
        addMockTest,
        resetAllData,
        importData,
        exportData,
      }}
    >
      {children}
    </IELTSContext.Provider>
  );
}

export function useIELTS() {
  const context = useContext(IELTSContext);
  if (!context) {
    throw new Error('useIELTS must be used within an IELTSProvider');
  }
  return context;
}
