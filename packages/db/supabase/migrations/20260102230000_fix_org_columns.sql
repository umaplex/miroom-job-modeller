-- Fix missing columns if table already existed
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS main_url TEXT;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- For status, we check if it exists, if not add it. 
-- If it exists but is different type, we might have issues, but let's assume it's missing or compatible.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='status') THEN
        ALTER TABLE organizations ADD COLUMN status org_status DEFAULT 'PREP_INITIALIZED';
    END IF;
END $$;
