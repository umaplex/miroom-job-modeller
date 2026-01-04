-- Seed Research Strategies for Research OS
-- Populates search_strategy_prompt for all 6 pillars

UPDATE pillar_definitions
SET search_strategy_prompt = CASE
    WHEN id = 'general' THEN 
        'Find the company stage (Series A, B, IPO), primary line of business, target customer segments, and recent headcount growth trends. Look for Crunchbase data, LinkedIn insights, and "About Us" pages.'
    WHEN id = 'econ_engine' THEN 
        'Find the Official Pricing Page, Investor Relations content, and 10-K filings. Look for "Revenue Model", "Net Revenue Retention", "Gross Margin", and "Expansion Levers". Prioritize definitive financial sources.'
    WHEN id = 'org_dna' THEN 
        'Find the Leadership Team profiles, Glassdoor reviews about culture, "Careers" page values, and recent executive interviews. Look for signals of "Engineering-led" vs "Sales-led" and RTO/Remote policies.'
    WHEN id = 'burning_platform' THEN 
        'Find recent "Crisis" news, layoffs, major competitor product launches, and "Existential Threat" articles. Look for "Analyst Downgrades" or "Customer Churn" reports.'
    WHEN id = 'domain_lexicon' THEN 
        'Find User Documentation, API Docs, and Engineering Blog posts. Look for specific internal acronyms, product names (Taxonomy), and "Must-know" industry jargon.'
    WHEN id = 'decision_making' THEN 
        'Find CEO Interviews (Podcast transcripts), Strategic Memos, and Investor Presentations. Focus on "How they prioritize", "Trade-offs", and "Success Metrics" (North Star).'
END
WHERE id IN ('general', 'econ_engine', 'org_dna', 'burning_platform', 'domain_lexicon', 'decision_making');
