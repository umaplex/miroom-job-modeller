-- Seed Dimensions & Fields
DO $$
DECLARE
    gen_pillar_id TEXT := 'general';
    econ_pillar_id TEXT := 'econ_engine';
    
    dim_vital_id UUID;
    dim_rev_id UUID;
BEGIN
    -- 1. General Pillar -> 'Vital Signs' Dimension
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (gen_pillar_id, 'Vital Signs', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_vital_id;

    -- Fields for Vital Signs
    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_vital_id, 'headcount_velocity', 'Headcount Velocity', '2-year trend & skew', 'Analyze LinkedIn data for total headcount growth over 24m.'),
    (dim_vital_id, 'talent_density', 'Talent Density', 'Key hires from Tier-1', 'Identify recent Director+ hires from FAANG/Unicorns.'),
    (dim_vital_id, 'leadership_stability', 'Leadership Stability', 'C-suite tenure', 'Check for recent founder/exec departures.'),
    (dim_vital_id, 'openings_skew', 'Openings Skew', 'Tech vs Commercial ratio', 'Analyze active job openings for departmental concentration.')
    ON CONFLICT (dimension_id, key) DO NOTHING;

    -- 2. Econ Engine -> 'Revenue Architecture' Dimension
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (econ_pillar_id, 'Revenue Architecture', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_rev_id;

    -- Fields for Econ Engine
    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_rev_id, 'primary_model', 'Primary Revenue Model', 'Subscription vs Consumption vs Transaction', 'Determine the core monetization mechanic.'),
    (dim_rev_id, 'pricing_power', 'Pricing Power', 'Ability to raise prices', 'Look for NRR > 120% or recent price hikes.'),
    (dim_rev_id, 'unit_economics', 'Unit Economics', 'LTV/CAC and Payback', 'Estimate CAC payback period based on S&M spend.')
    ON CONFLICT (dimension_id, key) DO NOTHING;

END $$;
