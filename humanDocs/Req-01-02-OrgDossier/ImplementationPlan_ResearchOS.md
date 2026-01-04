# MVP Part 6: The Research Analyst (Research OS) Architecture

## 1. Executive Summary
This phase transitions the system from a "Monolithic Generator" to a **"Research Operating System"**. We are implementing an Agentic State Machine that acts as a **Business Research Analyst**.

### Core Philosophy
*   **Knowledge Factory:** A repeatable pipeline (Discovery $\rightarrow$ Extraction $\rightarrow$ Synthesis).
*   **A/B Testable Personas:** The design supports multiple "Analyst Personas" (e.g., `Org Analyst V1`, `Org Analyst V2`) to allow evolving the research logic without breaking the data model.
*   **Auditability:** Every API call, token usage, and search query is logged to `research_audit_logs` for cost attribution and debugging.

---

## 2. Gap Analysis

| Feature | Current State | Required State |
| :--- | :--- | :--- |
| **Logic Engine** | Monolithic `PrepEngine.py` (Mock/Basic) | **State Machine Pipeline** (Hunter $\rightarrow$ Clerk $\rightarrow$ Director) |
| **Data Sources** | Hardcoded / Simple | **Dynamic Discovery** (Tavily) + **Deep Extraction** (Firecrawl) |
| **Observability** | `prep_logs` (User facing text) | **`research_audit_logs`** (Cost, Latency, Prompt granularity) |
| **Config** | Hardcoded in Code | **Database Driven** (`search_strategy_prompt`, `scraping_config`) |
| **Personas** | Single Logic | **Pluggable Analysts** (A/B Testing Support) |

---

## 3. Data Model Changes

### 3.1 New Table: `research_audit_logs`
This is the "Black Box Recorder" for every research run.

```sql
CREATE TYPE research_step_type AS ENUM ('QUERY_GEN', 'SEARCH', 'SCRAPE', 'SYNTHESIS', 'ERROR');

CREATE TABLE research_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id),
    pillar_id TEXT REFERENCES pillar_definitions(id),
    
    -- Execution Context
    run_id UUID, -- Correlates all steps in a single job
    agent_version TEXT, -- e.g "OrgAnalyst_V1", "OrgAnalyst_DeepDiver_Beta" (For A/B Testing)
    step_type research_step_type,
    
    -- Payload & Result
    input_context JSONB, -- The prompt or search query used
    output_result JSONB, -- The raw output (URLs, content, summary)
    
    -- Metrics
    provider TEXT, -- "openai", "tavily", "firecrawl"
    model TEXT, -- "gpt-4o", "sonar-medium"
    tokens_in INT,
    tokens_out INT,
    cost_usd NUMERIC(10, 6),
    latency_ms INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2 Updates to `pillar_definitions`
We move the "Brain" of the analyst into the database to allow hot-swapping strategies.

*   `search_strategy_prompt` (TEXT): Instructions for the 'Hunter' (e.g., "Prioritize 10-K and Pricing Pages").
*   `scraping_config` (JSONB): Rules for the 'Clerk' (e.g., `{"follow_links": false, "deep_doc_selectors": ["#pricing"]}`).

---

## 4. Architecture Design

### 4.1 High Level Design (HLD)

(See `ArchitectureDiagrams_ResearchOS.md` for visual diagrams)

### 4.2 Low Level Design (LLD) - Python

We will use a **Strategy Pattern** for the Analyst Personas.

**`class BaseAnalyst:`**
*   Abstract base class defining the `run_pillar(org, pillar_def)` interface.
*   Handles common logging, error catching, and audit writing.

**`class StandardAnalyst(BaseAnalyst):`** (The V1 Implementation)
*   **Method `generate_queries(context)`**: Uses `pillar.search_strategy_prompt` + GPT-4o-mini to create 5 queries.
*   **Method `gather_evidence(queries)`**: 
    *   Calls Tavily.
    *   Heuristic Filter (Official vs News).
    *   Calls Firecrawl (Markdown extraction).
*   **Method `synthesize(evidence)`**: Uses GPT-4o to fill `structured_value` and write `analysis_markdown`.

**`class DeepDiveAnalyst(BaseAnalyst):`** (The V2 A/B Test Candidate)
*   Implements recursive searching or "Follow Link" logic for finding PDFs.
*   Uses a cheaper model for synthesis to test cost efficacy.

### 4.3 A/B Testing Workflow
1.  **Request:** POST `/orgs/{id}/prep?pillar=general&agent=OrgAnalyst_V2`
2.  **Dispatcher:** `PrepEngine` looks up the requested agent class.
3.  **Execution:** The specific `Analyst` subclass runs.
4.  **Audit:** Rows in `research_audit_logs` are tagged with `agent_version="OrgAnalyst_V2"`.
5.  **Comparison:** SQL Query to compare `avg(cost_usd)` and user feedback between V1 and V2.

---

## 5. Next Steps Plan

1.  **Migration:** Create `research_audit_logs` table (SQL).
2.  **Config:** Update `pillar_definitions` with the strategy columns.
3.  **Refactor:** Rewrite `prep_engine.py` to use the `Analyst` class structure.
4.  **Implement V1:** Build the `StandardAnalyst` connecting Tavily and Firecrawl.
