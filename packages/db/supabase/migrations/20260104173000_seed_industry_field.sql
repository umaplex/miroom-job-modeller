DO $$
DECLARE
    gen_id TEXT := 'general';
    dim_app_id UUID;
BEGIN
    -- Find Dimension 'Market Appetite' 
    SELECT id INTO dim_app_id FROM dimension_definitions WHERE pillar_id = gen_id AND name = 'Market Appetite' LIMIT 1;

    -- Insert 'industry_vertical' field if not exists
    IF dim_app_id IS NOT NULL THEN
        INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt)
        VALUES (dim_app_id, 'industry_vertical', 'Primary Industry', 'Vertical Identity', 'Identify the primary industry sector (e.g., "SaaS - Cybersecurity", "Consumer FinTech"). Be specific.')
        ON CONFLICT (dimension_id, key) DO UPDATE SET 
            rubric_prompt = EXCLUDED.rubric_prompt;
    END IF;
END $$;
