# Setup Tasks: Job Modeller MVP 0

**Goal:** Establish the infrastructure for the "Async Connectivity" loop.
**Tech Stack:** Next.js 15+ (Vercel), FastAPI (Railway), Supabase (Postgres/Auth), Firecrawl, Tavily.

## 1. Source Control & Repository
- [ ] Initialize Monorepo (Turborepo) structure
    - `apps/web` (Next.js)
    - `apps/api` (FastAPI)
    - `packages/db` (Shared Schema)
- [ ] Set up `.gitignore` for Python/Node/Env files

## 2. Infrastructure Accounts (User Action Required)
- [ ] **Vercel:** Create project for `job-modeller-web`
- [ ] **Railway:** Create project for `job-modeller-api`
- [ ] **Supabase:** Create new project
    - Enable `pgvector` extension
    - Enable `Realtime` on `public.prep_thinking_logs` table
- [ ] **API Keys Needed:**
    - `OPENAI_API_KEY`
    - `TAVILY_API_KEY`
    - `FIRECRAWL_API_KEY`
    - `STRIPE_TEST_KEY`

## 3. Database Schema (Supabase)
- [ ] Execute Initial Schema Migration:
    - `users` (Profile, Plan Status, Plan History)
    - `organizations`
    - `org_pillars` (JSONB)
    - `prep_thinking_logs` (Realtime enabled)
    - `audit_logs`

## 4. Backend Scaffold (FastAPI)
- [ ] Setup `poetry` / `pip` environment
- [ ] Install `fastapi`, `supabase`, `langgraph`, `firecrawl-py`
- [ ] Create Health Check Endpoint (`GET /health`)
- [ ] Create Mock Job Trigger Endpoint (`POST /api/trigger-mock`)

## 5. Frontend Scaffold (Next.js)
- [ ] Initialize Next.js 15 App Router
- [ ] Install `supabase-js`, `lucide-react`, `shadcn/ui`
- [ ] Setup Supabase Auth Provider
- [ ] Create "Command Center" Page (Protected Route)
- [ ] Create Realtime Log Component (Subscribes to `prep_thinking_logs`)

## 6. Verification
- [ ] Verify Frontend can Login via Supabase
- [ ] Verify Backend can read/write to Supabase
- [ ] Verify Frontend receives Realtime updates from Backend inserts
