-- Enable Extensions
create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  subscription_status text default 'free',
  subscription_tier text default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PLAN HISTORY
create table public.plan_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  previous_plan text,
  new_plan text,
  changed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORGANIZATIONS (The Dossier Anchor)
create table public.organizations (
  id uuid default uuid_generate_v4() primary key,
  domain text unique not null,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_refreshed_at timestamp with time zone
);

-- ORG PILLARS (The Intelligence)
create table public.org_pillars (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id) not null,
  pillar_name text not null, -- 'economic_engine', 'org_dna', etc
  content jsonb not null, -- The structured findings
  confidence_score float,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(org_id, pillar_name)
);

-- PREP THINKING LOGS (Realtime Stream)
create table public.prep_thinking_logs (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references public.organizations(id),
  message text not null,
  step_name text, -- 'RESEARCH', 'SYNTHESIS'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime
alter publication supabase_realtime add table public.prep_thinking_logs;
