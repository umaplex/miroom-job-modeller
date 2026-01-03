-- Seed the 5 Core Pillars
INSERT INTO pillar_definitions (id, name, description, is_locked) VALUES
('econ_engine', 'Economic Engine', 'Analysis of revenue models, growth levers, and financial health.', false),
('org_dna', 'Org DNA', 'Understanding the organizational structure, power dynamics, and culture.', false),
('burning_platform', 'Burning Platform', 'Identifying the critical strategic threats and urgent problems.', true),
('domain_lexicon', 'Domain Lexicon', 'The insider language, acronyms, and terminology.', true),
('decision_making', 'Decision Making', 'How decisions are actually made: slide culture vs memo culture, etc.', true)
ON CONFLICT (id) DO NOTHING;
