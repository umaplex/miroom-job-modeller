-- Add Core Descriptors to General Pillar
-- Request: Stage, Line of Business, Customer Size

DO $$
DECLARE
    gen_id TEXT := 'general';
    dim_core_id UUID;
BEGIN
    -- Dimension: Core Identity
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (gen_id, 'Core Identity', -1) -- Order -1 to appear at the top
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = -1
    RETURNING id INTO dim_core_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_core_id, 'stage_classification', 'Company Stage', 'Maturity Level', 'Classify the company stage: Pre-Seed, Seed, Series A, Series B+, Pre-IPO, or Public. Based on funding history and headcount.'),
    (dim_core_id, 'primary_line_of_business', 'Line of Business', 'Business Type', 'What is their primary model? e.g., B2B SaaS, B2C Marketplace, Fintech, E-commerce, DeepTech.'),
    (dim_core_id, 'target_customer_size', 'Target Customer', 'Segment Focus', 'Who do they sell to? SMB, Mid-Market, Enterprise, or Government.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

END $$;
