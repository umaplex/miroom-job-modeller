-- Seed ALL Pillars based on MVP Part 5 Spec
-- Includes Pillars: 0 (General), 1 (Econ), 2 (Org DNA), 3 (Burning Platform), 4 (Domain Lexicon), 5 (Decision Logic)

DO $$
DECLARE
    -- Pillar IDs
    gen_id TEXT := 'general';
    econ_id TEXT := 'econ_engine';
    dna_id TEXT := 'org_dna';
    burn_id TEXT := 'burning_platform';
    lex_id TEXT := 'domain_lexicon';
    dec_id TEXT := 'decision_making';
    
    -- Dimension IDs (Variables)
    dim_mom_id UUID;
    dim_app_id UUID;
    dim_cap_id UUID;
    
    dim_gtm_id UUID;
    dim_price_id UUID;
    dim_prof_id UUID;
    
    dim_cog_id UUID;
    dim_rights_id UUID;
    dim_motiv_id UUID;
    dim_phil_id UUID;
    
    dim_ext_id UUID;
    dim_int_id UUID;
    dim_time_id UUID;
    dim_crisis_id UUID;
    
    dim_glos_id UUID;
    dim_sacred_id UUID;
    dim_dial_id UUID;
    
    dim_succ_id UUID;
    dim_rigor_id UUID;
    dim_prior_id UUID;

BEGIN
    -- ==========================================
    -- PILLAR 0: GENERAL (VITAL SIGNS)
    -- ==========================================
    
    -- Dimension: Momentum & Talent Velocity
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (gen_id, 'Momentum & Talent Velocity', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_mom_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_mom_id, 'headcount_growth_2yr', '2-Year Growth Trend', 'Expansion vs Contraction', 'Calculate the % change in headcount over the last 24 months. Identify if growth is accelerating, slowing, or negative.'),
    (dim_mom_id, 'dept_growth_skew', 'Functional Growth Bias', 'Where is the investment going?', 'Which department is growing fastest? (e.g., "Engineering is flat, but Sales grew 30%").'),
    (dim_mom_id, 'key_leadership_hires', 'Recent Leadership Moves', 'Signal of ambition', 'Identify any VP or C-level hires in the last 12 months. Note their "Source Firm".')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Market Appetite
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (gen_id, 'Market Appetite', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_app_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_app_id, 'openings_distribution', 'Hiring Mix', 'Current open roles breakdown', 'Breakdown of current roles (e.g., 60% Eng, 20% Sales). Identify "Clusters".'),
    (dim_app_id, 'role_seniority_bias', 'Seniority Focus', 'Scale vs Strategy hiring', 'Are they hiring mostly "Juniors/Mid" or "Staff/Directors"?'),
    (dim_app_id, 'geographic_strategy', 'Talent Geography', 'Location strategy', 'Are roles concentrated in HQ, remote, or being moved to lower-cost regions?')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Capital & Stability
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (gen_id, 'Capital & Stability', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_cap_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_cap_id, 'funding_stage_status', 'Funding Reality', 'Runway and Valuation', 'Latest round, amount, and valuation. For public companies, focus on Market Cap.'),
    (dim_cap_id, 'executive_stability', 'C-Suite Tenure', 'Leadership Churn', 'Analyze the average tenure of the leadership team. Identify "unexplained" departures.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;


    -- ==========================================
    -- PILLAR 1: ECON ENGINE
    -- ==========================================

    -- Dimension: Revenue & GTM Architecture
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (econ_id, 'Revenue & GTM Architecture', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_gtm_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_gtm_id, 'gtm_motion', 'GTM Motion', 'Sales-led vs PLG', 'Determine if the company is Sales-led, PLG, or Hybrid.'),
    (dim_gtm_id, 'primary_revenue_model', 'Revenue Model', 'Monetization Mechanic', 'Identify if revenue is Subscription, Usage-based, Transactional, or Advertising.'),
    (dim_gtm_id, 'expansion_levers', 'Expansion Drivers', 'Upsell path', 'What causes a customer to pay more? (e.g., seats, API calls).')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Pricing Power
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (econ_id, 'Pricing Power', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_price_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_price_id, 'billable_unit', 'Billable Unit', 'The Meter', 'What is the specific unit of value charged for?'),
    (dim_price_id, 'ai_monetization', 'AI Monetization Path', 'AI Premium', 'How are AI features priced? Is there an "AI Surcharge"?'),
    (dim_price_id, 'pricing_position', 'Category Positioning', 'Premium vs Value', 'Is this company the "Premium/Luxury" leader or the "Value/Aggressive Disruptor"?')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Profitability & Health
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (econ_id, 'Profitability & Health', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_prof_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_prof_id, 'margin_profile', 'Gross Margin Profile', 'Cost Structure', 'Estimate Gross Margin (Low/Mid/High). Identify major COGS.'),
    (dim_prof_id, 'health_category', 'Company Health', 'Growth vs Profit', 'Categorize as "Durable Profitability," "Efficient Growth," or "Growth at all Costs".'),
    (dim_prof_id, 'nrr_band', 'NRR/GRR Banding', 'Retention Health', 'Infer Net Revenue Retention. Look for phrases like "Best-in-class retention".')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;


    -- ==========================================
    -- PILLAR 2: ORG DNA
    -- ==========================================

    -- Dimension: Center of Gravity
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dna_id, 'Center of Gravity', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_cog_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_cog_id, 'dominant_function', 'Dominant Function', 'Who leads the org?', 'Determine if the company is engineering-led, sales-led, product-led, design-led, or ops-led.'),
    (dim_cog_id, 'exec_stack_shape', 'Executive Stack Shape', 'Reporting Lines', 'List the CXO roles. Identify the report line for Product (reports to CEO or CTO/COO?).'),
    (dim_cog_id, 'power_balance_notes', 'Power Balance Narrative', 'The Coalition', 'Synthesize the "Coalition of Power."'),
    (dim_cog_id, 'board_archetype', 'Board Composition', 'Governance Style', 'Is the board Operator-Heavy, Financier-Heavy, or Strategic-Hybrid?')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Decision Rights
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dna_id, 'Decision Rights', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_rights_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_rights_id, 'writing_culture_strength', 'Writing Culture Strength', 'Memo vs Slides', '0-3 Scale. Signals: Amazon-style 6-pagers, PRFAQs, or high emphasis on RFCs.'),
    (dim_rights_id, 'decision_owner_pattern', 'Decision Ownership', 'Who decides?', 'manager-led, single-threaded-leader, consensus-committee, founder-veto.'),
    (dim_rights_id, 'disagreement_protocol', 'Disagreement Style', 'Conflict Resolution', 'disagree-and-commit, soft-consensus, adversarial-debate, polite-avoidance.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Motivators
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dna_id, 'Motivators', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_motiv_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_motiv_id, 'hero_archetype', 'The Hero Archetype', 'Ideal Employee', 'Identify the "Ideal Employee": firefighter, architect, sales_shark, operator, missionary, optimizer.'),
    (dim_motiv_id, 'reward_drivers', 'Reward Drivers', 'Promotion Metrics', 'Primary vs. Secondary metrics for promotion.'),
    (dim_motiv_id, 'risk_appetite', 'Failure Tolerance', 'Safe vs Bold', 'Scale 1-3. Look for "Fail Fast" mentions.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

     -- Dimension: Work Philosophy
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dna_id, 'Work Philosophy', 3)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 3
    RETURNING id INTO dim_phil_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_phil_id, 'work_location_philosophy', 'Location Trust', 'RTO Stance', 'remote-first, hybrid-hq-centric, strict-office, remote-capable.'),
    (dim_phil_id, 'leadership_stability_dna', 'Senior Leadership Tenure', 'Stability Proxy', 'Average tenure of Directors+ in months.'),
    (dim_phil_id, 'trust_autonomy_proxy', 'Trust/Autonomy Rating', 'Micro-management Proxy', 'Scale 1-3. Signals: Use of monitoring tools vs. focus on "ownership".')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;


    -- ==========================================
    -- PILLAR 3: BURNING PLATFORM
    -- ==========================================

    -- Dimension: External Disruptors
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (burn_id, 'External Disruptors', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_ext_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_ext_id, 'competitive_leap', 'Competitive Leapfrog', 'Market Shocks', 'Identify specific competitor moves (pricing slashes, feature launches).'),
    (dim_ext_id, 'market_paradigm_shift', 'Category Shock', 'Existential Threat', 'ai-native-displacement, regulatory-lockdown, economic-contraction.'),
    (dim_ext_id, 'exodus_severity', 'Customer Churn Risk', 'Bleed Rate', 'none, emerging, acute. Signals: G2/Reddit complaints.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Internal Fault Lines
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (burn_id, 'Internal Fault Lines', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_int_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_int_id, 'tech_debt_ceiling', 'Velocity Constraints', 'Tech Debt', 'Scale 1-3. Logic: Correlation between launch delays and employee reviews.'),
    (dim_int_id, 'product_revenue_gap', 'Strategic Mismatch', 'Target Gap', 'Identify if the current product suite is incapable of meeting revenue targets.'),
    (dim_int_id, 'leadership_mandate', 'The "Why Now"', 'Hiring Context', 'Synthesize the unstated reason for this hire.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Time-Sensitivity
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (burn_id, 'Time-Sensitivity', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_time_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_time_id, 'urgency_gauge', 'Strategic Urgency', 'Panic Level', 'high-pivot-or-perish, medium-stagnation-risk, low-optimization.'),
    (dim_time_id, 'burn_rate_pressure', 'Resource Tension', 'Cash Crunch', 'high-runway-exhaustion, low-efficiency-mandate, investor-impatience.'),
    (dim_time_id, 'm_and_a_positioning', 'Exit Orientation', 'M&A Signal', 'preparing-for-acquisition, defensive-moat-building, platform-consolidation.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: The Crisis Archetype
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (burn_id, 'The Crisis Archetype', 3)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 3
    RETURNING id INTO dim_crisis_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_crisis_id, 'crisis_archetype', 'Strategic Archetype', 'The One-Liner', 'stagnant-incumbent, blitzscale-overextension, ai-disruption-response, founder-transition, post-ipo-identity-crisis.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;


    -- ==========================================
    -- PILLAR 4: DOMAIN LEXICON
    -- ==========================================

    -- Dimension: The Glossary
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (lex_id, 'The Glossary', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_glos_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_glos_id, 'internal_acronyms', 'Company Acronyms', 'Jargon', 'Identify 5-10 common acronyms (e.g., "GDS", "L7").'),
    (dim_glos_id, 'customer_naming', 'Persona Labels', 'What do they call them?', 'Customers, Partners, Merchants, Drivers, Nodes, Users.'),
    (dim_glos_id, 'product_taxonomy', 'Product Identity', 'Naming Convention', 'platform, suite, cloud, fabric, operating-system, agentic-layer.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Mantras & Sacred Cows
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (lex_id, 'Mantras & Sacred Cows', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_sacred_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_sacred_id, 'ceo_mantras', 'Leadership Slogans', 'Sayings', 'Identify 3-5 repeated slogans (e.g., "Day 1").'),
    (dim_sacred_id, 'sacred_cows', 'Sacred Cow Audit', 'Dogma', 'Identify non-negotiable beliefs (e.g., "Privacy is a human right").'),
    (dim_sacred_id, 'linguistic_landmines', 'Anti-Patterns', 'Do NOT Say', 'Identify terms that trigger "outsider" status.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Domain & Tech Dialect
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (lex_id, 'Domain & Tech Dialect', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_dial_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_dial_id, 'vertical_keywords', 'Must-Know Terms', 'Shibboleths', 'The top 5 industry terms mandatory for this role (e.g., "ISO 27001", "LTV/CAC").'),
    (dim_dial_id, 'tech_stack_slang', 'Engineering Dialect', 'Stack Vibe', 'monolith, microservices, data-mesh, agentic-layer, RFC-driven.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;


    -- ==========================================
    -- PILLAR 5: DECISION MAKING (LOGIC)
    -- ==========================================

    -- Dimension: Success Metrics
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dec_id, 'Success Metrics', 0)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 0
    RETURNING id INTO dim_succ_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_succ_id, 'primary_north_star_metric_name', 'Metric Phrasing', 'The Name', 'Capture the company’s exact phrasing (e.g., "Weekly Active Payers").'),
    (dim_succ_id, 'primary_success_metric', 'The North Star', 'The Goal', 'revenue-velocity, efficiency-margin, user-growth, platform-reliability, strategic-moat.'),
    (dim_succ_id, 'time_horizon', 'Planning Horizon', 'Patience', 'short-term-quarterly, medium-term-yearly, long-term-multi-year.'),
    (dim_succ_id, 'tradeoff_priority', 'The "Tie-Breaker"', 'Values', 'Look for CEO quotes where they explicitly sacrificed one value for another.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: Rigor & Justification
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dec_id, 'Rigor & Justification', 1)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 1
    RETURNING id INTO dim_rigor_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_rigor_id, 'justification_style', 'Business Case Style', 'Pitch Format', 'narrative-heavy, data-model-heavy, visionary-narrative, technical-feasibility-first.'),
    (dim_rigor_id, 'rigor_examples', 'Proof Patterns', 'Evidence', 'Identify patterns in how they prove success (e.g., "cohort analysis").'),
    (dim_rigor_id, 'required_rigor', 'Rigor Level', 'Difficulty', 'Scale 1-3. 1: Scrappy, 2: Balanced, 3: Extreme/Double-blind.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

    -- Dimension: The Prioritization Filter
    INSERT INTO dimension_definitions (pillar_id, name, order_index)
    VALUES (dec_id, 'The Prioritization Filter', 2)
    ON CONFLICT (pillar_id, name) DO UPDATE SET order_index = 2
    RETURNING id INTO dim_prior_id;

    INSERT INTO field_definitions (dimension_id, key, name, description, rubric_prompt) VALUES
    (dim_prior_id, 'rejection_patterns', 'Common Veto Reasons', 'Why No?', 'Identify failure modes (e.g., "Doesn''t scale globally").'),
    (dim_prior_id, 'sacred_resource', 'The Bottleneck', 'Scarcity', 'engineering-cycles, marketing-budget, legal-clearance, founder-attention.')
    ON CONFLICT (dimension_id, key) DO UPDATE SET name = EXCLUDED.name, rubric_prompt = EXCLUDED.rubric_prompt;

END $$;
