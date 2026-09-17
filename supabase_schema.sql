-- =========================================================
-- IELTS 30-Day Tracker: Supabase PostgreSQL Schema Setup
-- Run this in your Supabase Project -> SQL Editor -> Run
-- =========================================================

-- 1. Table for storing user accounts & authentication profiles
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
