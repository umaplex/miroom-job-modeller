-- Add missing columns to org_field_observations that Analyst is using

ALTER TABLE org_field_observations 
ADD COLUMN IF NOT EXISTS confidence_score FLOAT DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS evidence JSONB DEFAULT '[]'::jsonb;
