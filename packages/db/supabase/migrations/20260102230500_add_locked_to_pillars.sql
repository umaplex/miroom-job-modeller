-- Add is_locked to pillar_definitions
ALTER TABLE pillar_definitions ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;
