-- Migration: Research OS Infrastructure
-- 1. Create Audit Logs Table
-- 2. Add Strategy Columns to Pillar Definitions

-- Enable UUID extension if not exists (should be already enabled, but safety first)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Research Step Enum
DO $$ BEGIN
    CREATE TYPE research_step_type AS ENUM ('QUERY_GEN', 'SEARCH', 'SCRAPE', 'SYNTHESIS', 'ERROR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Research Audit Logs Table
CREATE TABLE IF NOT EXISTS research_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    pillar_id TEXT REFERENCES pillar_definitions(id) ON DELETE CASCADE,
    
    -- Execution Context
    run_id UUID NOT NULL, -- Correlates all steps in a single job
    agent_version TEXT NOT NULL, -- e.g "StandardAnalyst_V1"
    step_type research_step_type NOT NULL,
    
    -- Payload & Result
    input_context JSONB, -- The prompt or search query used
    output_result JSONB, -- The raw output (URLs, content, summary)
    
    -- Metrics
    provider TEXT, -- "openai", "tavily", "firecrawl"
    model TEXT, -- "gpt-4o", "sonar-medium"
    tokens_in INT DEFAULT 0,
    tokens_out INT DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0,
    latency_ms INT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_research_audit_org ON research_audit_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_research_audit_run ON research_audit_logs(run_id);
CREATE INDEX IF NOT EXISTS idx_research_audit_created ON research_audit_logs(created_at DESC);

-- 3. Add Strategy Columns to Pillar Definitions
ALTER TABLE pillar_definitions 
ADD COLUMN IF NOT EXISTS search_strategy_prompt TEXT,
ADD COLUMN IF NOT EXISTS scraping_config JSONB DEFAULT '{}'::jsonb;

-- 4. RLS Policies for Audit Logs (Admin only predominantly, but User can see their own costs if needed?)
-- For now, allow service role full access. Users generally don't read raw audit logs in MVP.
ALTER TABLE research_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access" ON research_audit_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
