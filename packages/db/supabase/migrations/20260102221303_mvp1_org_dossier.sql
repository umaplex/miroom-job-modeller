-- Create Enums
DO $$ BEGIN
    CREATE TYPE org_status AS ENUM ('PREP_INITIALIZED', 'RESEARCHING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pillar_class AS ENUM ('FOUNDATION', 'INTELLIGENCE', 'TACTICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE pillar_status AS ENUM ('PENDING', 'SEARCHING', 'SYNTHESIZING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Pillar Definitions (Metadata)
CREATE TABLE IF NOT EXISTS pillar_definitions (
    id TEXT PRIMARY KEY, -- e.g., 'econ_engine'
    name TEXT NOT NULL,
    description TEXT,
    rubric JSONB DEFAULT '{}'::jsonb, -- The checklist
    expected_output JSONB DEFAULT '{}'::jsonb, -- Schema for result
    workflow_config JSONB DEFAULT '{}'::jsonb, -- Agent instructions
    version INTEGER DEFAULT 1,
    class pillar_class DEFAULT 'FOUNDATION',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organizations (Core Identity)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    display_name TEXT,
    main_url TEXT,
    status org_status DEFAULT 'PREP_INITIALIZED',
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User relationships
CREATE TABLE IF NOT EXISTS user_added_orgs (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS user_favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    faved_at TIMESTAMPTZ DEFAULT NOW(),
    last_visited_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, org_id)
);

-- 4. Org Pillar Status (Progress Tracking)
CREATE TABLE IF NOT EXISTS org_pillar_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    pillar_id TEXT REFERENCES pillar_definitions(id) ON DELETE RESTRICT,
    status pillar_status DEFAULT 'PENDING',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, pillar_id)
);

-- 5. Org Pillar Data (The Content)
CREATE TABLE IF NOT EXISTS org_pillar_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    pillar_id TEXT REFERENCES pillar_definitions(id) ON DELETE RESTRICT,
    content JSONB DEFAULT '{}'::jsonb,
    sources JSONB DEFAULT '[]'::jsonb,
    is_synthetic BOOLEAN DEFAULT FALSE,
    version INTEGER NOT NULL, -- Ties data to the pillar definition version
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(org_id, pillar_id, version)
);

-- 6. Prep Logs (Telemetry)
CREATE TABLE IF NOT EXISTS prep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    pillar_id TEXT REFERENCES pillar_definitions(id), -- Nullable if general org prep
    internal_code TEXT NOT NULL, -- e.g. SEARCH_EXECUTED
    display_text TEXT NOT NULL, -- Human readable
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Basic Secure Defaults)

-- Enable RLS
ALTER TABLE pillar_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_added_orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_pillar_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_pillar_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_logs ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid duplication errors)
DROP POLICY IF EXISTS "Public definitions" ON pillar_definitions;
CREATE POLICY "Public definitions" ON pillar_definitions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public organizations" ON organizations;
CREATE POLICY "Public organizations" ON organizations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users view own additions" ON user_added_orgs;
DROP POLICY IF EXISTS "Users add orgs" ON user_added_orgs;
CREATE POLICY "Users view own additions" ON user_added_orgs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add orgs" ON user_added_orgs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users insert favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users delete favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users update favorites" ON user_favorites;
CREATE POLICY "Users view own favorites" ON user_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert favorites" ON user_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete favorites" ON user_favorites FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users update favorites" ON user_favorites FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public status" ON org_pillar_status;
CREATE POLICY "Public status" ON org_pillar_status FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public data" ON org_pillar_data;
CREATE POLICY "Public data" ON org_pillar_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public logs" ON prep_logs;
CREATE POLICY "Public logs" ON prep_logs FOR SELECT USING (true);
