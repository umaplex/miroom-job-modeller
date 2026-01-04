-- Enums
DO $$ BEGIN
    CREATE TYPE evidence_type AS ENUM ('SEC_FILING', 'EARNINGS_CALL', 'FOUNDER_PODCAST', 'GLASSDOOR', 'NEWS', 'INFERRED');
    CREATE TYPE review_status AS ENUM ('DRAFT', 'VETTED', 'DEPRECATED');
    CREATE TYPE source_origin AS ENUM ('AGENT', 'HUMAN_EDITOR', 'IMPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Metadata: Dimensions (Groupings within a Pillar)
CREATE TABLE IF NOT EXISTS dimension_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pillar_id TEXT REFERENCES pillar_definitions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(pillar_id, name)
);

-- 2. Metadata: Fields (The specific questions/attributes)
CREATE TABLE IF NOT EXISTS field_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension_id UUID REFERENCES dimension_definitions(id) ON DELETE CASCADE,
    key TEXT NOT NULL, -- e.g. 'gtm_motion'
    name TEXT NOT NULL, -- e.g. 'GTM Motion'
    description TEXT,
    rubric_prompt TEXT, -- Instructions for the agent
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dimension_id, key)
);

-- 3. Instance: Observations (The Answer)
CREATE TABLE IF NOT EXISTS org_field_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    field_id UUID REFERENCES field_definitions(id) ON DELETE RESTRICT,
    
    structured_value JSONB, -- The canonical answer e.g. {"value": "PLG"}
    analysis_markdown TEXT, -- The narrative
    
    -- Synthetic Logic
    is_synthetic BOOLEAN DEFAULT FALSE,
    synthetic_rationale TEXT,
    
    -- Audit & Temporal
    source_type source_origin DEFAULT 'AGENT',
    review_status review_status DEFAULT 'DRAFT',
    observed_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- Null = never expires
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(org_id, field_id)
);

-- 4. Instance: Evidence (The Proof)
CREATE TABLE IF NOT EXISTS org_field_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    observation_id UUID REFERENCES org_field_observations(id) ON DELETE CASCADE,
    
    quote TEXT,
    source_url TEXT,
    type evidence_type DEFAULT 'INFERRED',
    weight INTEGER DEFAULT 1, -- 1-10 scale
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE dimension_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_field_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_field_evidence ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public Read, Internal Write/Edit - assuming authenticated users/service role)

-- Metadata is public read
CREATE POLICY "Public dimensions" ON dimension_definitions FOR SELECT USING (true);
CREATE POLICY "Public fields" ON field_definitions FOR SELECT USING (true);

-- Observations are public read (for MVP)
CREATE POLICY "Public observations" ON org_field_observations FOR SELECT USING (true);

-- Evidence is public read
CREATE POLICY "Public evidence" ON org_field_evidence FOR SELECT USING (true);

-- (In a real app, we'd add insert/update policies for service role or admin users)
