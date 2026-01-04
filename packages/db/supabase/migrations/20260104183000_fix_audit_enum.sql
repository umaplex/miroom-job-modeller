-- Fix Audit Log Enum
-- Add 'COMPLETE' to research_step_type

ALTER TYPE research_step_type ADD VALUE IF NOT EXISTS 'COMPLETE';
