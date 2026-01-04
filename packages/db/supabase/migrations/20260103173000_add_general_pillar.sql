-- Add metadata columns to organizations table
ALTER TABLE public.organizations 
ADD COLUMN IF NOT EXISTS company_size text,
ADD COLUMN IF NOT EXISTS industry text;

-- Insert General Pillar Definition
INSERT INTO public.pillar_definitions (id, name, description, is_locked)
VALUES (
    'general', 
    'Vital Signs', 
    'Objective tracking of momentum: Headcount Velocity, Talent Density, and Leadership Stability.', 
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_locked = EXCLUDED.is_locked;
