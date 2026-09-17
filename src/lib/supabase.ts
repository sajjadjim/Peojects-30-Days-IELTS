import { createClient } from '@supabase/supabase-js';
import { IELTSAppData } from '@/types/ielts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qicndufzkorzfeyszmqz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_PzCGNu4nRzzSCidMqph25A_dKuvPqO8';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const DEFAULT_USER_RECORD_ID = 'default_user';

export interface SupabaseConnectionStatus {
  configured: boolean;
  connected: boolean;
  tableExists: boolean;
  message: string;
  error?: string;
}

export interface SupabaseUserProfile {
  id: string; // Firebase UID
  email: string | null;
  display_name: string | null;
  phone_number: string | null;
  photo_url: string | null;
  provider: string;
  is_anonymous: boolean;
  last_sign_in_at: string;
  updated_at: string;
  raw_user_meta?: Record<string, any>;
}

/**
 * Checks connectivity to the Supabase instance and checks if the required tables exist.
 */
export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured) {
    return {
      configured: false,
      connected: false,
      tableExists: false,
      message: 'Supabase URL or Key not configured in environment variables.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('ielts_study_data')
      .select('id, updated_at')
      .limit(1);

    if (error) {
      // PGRST205 / 42P01 means table does not exist in schema cache
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('relation') || error.code === '42P01') {
        return {
          configured: true,
          connected: true,
          tableExists: false,
          message: 'Supabase connected successfully, but the tables (ielts_users, ielts_study_data) have not been created yet in your Supabase SQL editor.',
          error: error.message,
        };
      }

      return {
        configured: true,
        connected: false,
        tableExists: false,
        message: `Connection returned an error: ${error.message}`,
        error: error.message,
      };
    }

    return {
      configured: true,
      connected: true,
      tableExists: true,
      message: 'Supabase connected and tables ready! Cloud user & data sync active.',
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      tableExists: false,
      message: `Failed to connect to Supabase: ${err?.message || 'Unknown network error'}`,
      error: err?.message,
    };
  }
}

/**
 * Syncs user information to the Supabase database
 */
export async function syncUserToDatabase(
  user: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    phoneNumber?: string | null;
    photoURL?: string | null;
    isAnonymous?: boolean;
    providerData?: Array<{ providerId: string }>;
  },
  extraMeta?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isSupabaseConfigured) return { success: false, error: 'Supabase not configured' };

    const provider = user.providerData && user.providerData.length > 0
      ? user.providerData[0].providerId
      : user.isAnonymous
      ? 'anonymous'
      : 'email';

    const payload = {
      id: user.uid,
      email: user.email || null,
      display_name: user.displayName || null,
      phone_number: user.phoneNumber || null,
      photo_url: user.photoURL || null,
      provider: provider,
      is_anonymous: Boolean(user.isAnonymous),
      last_sign_in_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      raw_user_meta: extraMeta || {},
    };

    const { error } = await supabase
      .from('ielts_users')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase user profile sync notice:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Error syncing user profile to Supabase:', err);
    return { success: false, error: err?.message || 'Sync error' };
  }
}

/**
 * Fetch stored study tracker data from Supabase
 */
export async function fetchIELTSDataFromSupabase(userId: string = DEFAULT_USER_RECORD_ID): Promise<IELTSAppData | null> {
  try {
    const { data, error } = await supabase
      .from('ielts_study_data')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    const appData: IELTSAppData = {
      profile: data.profile,
      days: data.days || [],
      sessions: data.sessions || [],
      listening: data.listening || [],
      reading: data.reading || [],
      writing: data.writing || [],
      speaking: data.speaking || [],
      vocabulary: data.vocabulary || [],
      grammar: data.grammar || [],
      errors: data.errors || [],
      mockTests: data.mock_tests || data.mockTests || [],
    };

    return appData;
  } catch (err) {
    console.error('Unexpected error fetching from Supabase:', err);
    return null;
  }
}

/**
 * Save / Upsert study tracker data to Supabase
 */
export async function saveIELTSDataToSupabase(
  appData: IELTSAppData,
  userId: string = DEFAULT_USER_RECORD_ID
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: userId,
      profile: appData.profile,
      days: appData.days,
      sessions: appData.sessions,
      listening: appData.listening,
      reading: appData.reading,
      writing: appData.writing,
      speaking: appData.speaking,
      vocabulary: appData.vocabulary,
      grammar: appData.grammar,
      errors: appData.errors,
      mock_tests: appData.mockTests,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('ielts_study_data')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error saving to Supabase' };
  }
}

/**
 * Saves a Cambridge / IELTS practice test bank to the Supabase database.
 */
export async function saveTestBankToSupabase(testBankData: any): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured' };
  }

  try {
    const { error } = await supabase
      .from('ielts_study_data')
      .upsert({
        id: 'cambridge_test_bank',
        profile: {
          title: 'Cambridge Official Practice Tests Bank',
          updated: new Date().toISOString(),
        },
        mock_tests: Array.isArray(testBankData) ? testBankData : [testBankData],
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error saving test bank to Supabase' };
  }
}

/**
 * Fetches the practice test bank from the Supabase database.
 */
export async function fetchTestBankFromSupabase(): Promise<{ data: any[] | null; error?: string }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase is not configured' };
  }

  try {
    const { data, error } = await supabase
      .from('ielts_study_data')
      .select('mock_tests')
      .eq('id', 'cambridge_test_bank')
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data?.mock_tests || null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Network error fetching test bank from Supabase' };
  }
}

/**
 * The SQL needed to create the tables and enable RLS in Supabase.
 */
export const SUPABASE_SQL_SETUP = `-- 1. Table for storing user accounts & authentication profiles
create table if not exists public.ielts_users (
  id text primary key, -- Firebase User UID
  email text,
  display_name text,
  phone_number text,
  photo_url text,
  provider text,
  is_anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_sign_in_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  raw_user_meta jsonb default '{}'::jsonb
);

-- Enable Row Level Security (RLS) for users table
alter table public.ielts_users enable row level security;

create policy "Allow read access to all users" on public.ielts_users
  for select using (true);

create policy "Allow insert access to all users" on public.ielts_users
  for insert with check (true);

create policy "Allow update access to all users" on public.ielts_users
  for update using (true) with check (true);

-- 2. Table for storing user study progress & tracker state
create table if not exists public.ielts_study_data (
  id text primary key default 'default_user',
  profile jsonb not null default '{}'::jsonb,
  days jsonb not null default '[]'::jsonb,
  sessions jsonb not null default '[]'::jsonb,
  listening jsonb not null default '[]'::jsonb,
  reading jsonb not null default '[]'::jsonb,
  writing jsonb not null default '[]'::jsonb,
  speaking jsonb not null default '[]'::jsonb,
  vocabulary jsonb not null default '[]'::jsonb,
  grammar jsonb not null default '[]'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  mock_tests jsonb not null default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) for study data table
alter table public.ielts_study_data enable row level security;

create policy "Allow read access to all" on public.ielts_study_data
  for select using (true);

create policy "Allow insert access to all" on public.ielts_study_data
  for insert with check (true);

create policy "Allow update access to all" on public.ielts_study_data
  for update using (true) with check (true);

-- 3. Optional: Enable Supabase Realtime for instant synchronization
alter publication supabase_realtime add table public.ielts_users;
alter publication supabase_realtime add table public.ielts_study_data;
`;
