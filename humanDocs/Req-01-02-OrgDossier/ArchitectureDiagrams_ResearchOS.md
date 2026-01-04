# Research OS Architecture Diagrams

## 1. High Level Component Design

This diagram illustrates how the `Research OS` acts as the central engine, orchestrated by `PrepEngine` and powered by external tools (Tavily/Firecrawl).

```mermaid
graph TD
    User[User / Admin] -->|1. Trigger Prep| API[FastAPI Endpoint]
    API -->|2. Dispatch Job| Worker[Background Worker (Async)]
    
    subgraph "Research OS (The Engine)"
        Worker -->|3. Init Strategy| State[Research State]
        State -->|4. Stage A| Hunter[Hunter Agent (Query Gen)]
        Hunter -->|Search| Tavily[Tavily API]
        
        State -->|5. Stage B| Clerk[Clerk Agent (Evidence Mapping)]
        Clerk -->|Scrape| Firecrawl[Firecrawl API]
        
        State -->|6. Stage C| Director[Director Agent (Synthesis)]
        Director -->|Inference| OpenAI[GPT-4o]
    end
    
    Director -->|7. Persist| DB[(Supabase)]
    Hunter -.->|Log| Audit[(Audit Logs)]
    Clerk -.->|Log| Audit
    Director -.->|Log| Audit
```

## 2. Sequence Diagram: The "Standard Analyst" Flow

This sequence shows the lifecycle of a single Pillar Prep request handled by the `StandardAnalyst` persona.

```mermaid
sequenceDiagram
    participant U as User
    participant Q as PrepQueue
    participant D as Dispatcher
    participant A as StandardAnalyst
    participant T as Tavily
    participant F as Firecrawl
    participant LLM as GPT-4o
    participant DB as Postgres

    U->>Q: POST /prep (pillar=econ_engine)
    Q->>D: Process Job
    D->>D: Select Person (StandardAnalyst)
    D->>A: run_pillar(org, pillar_def)
    
    Note over A: 1. QUERY GENERATION
    A->>DB: Fetch search_strategy_prompt
    A->>LLM: Generate Queries (Strategy + Org)
    LLM-->>A: ["Pricing", "10-K", "News"]
    A->>DB: Log Audit (QUERY_GEN)
    
    Note over A: 2. DISCOVERY (Hunter)
    A->>T: Search(Queries)
    T-->>A: List[URLs]
    A->>A: Triage & Select Best 3
    A->>DB: Log Audit (SEARCH)

    Note over A: 3. EXTRACTION (Clerk)
    loop For each URL
        A->>F: Scrape(URL)
        F-->>A: Markdown Content
    end
    A->>DB: Log Audit (SCRAPE)

    Note over A: 4. SYNTHESIS (Director)
    A->>LLM: Synthesize(Markdown + Field Rubric)
    LLM-->>A: Structured Observations + Analysis
    A->>DB: Log Audit (SYNTHESIS)
    
    Note over A: 5. PERSISTENCE
    A->>DB: upsert org_field_observations
    A->>DB: insert org_field_evidence
```

## 3. Entity Relationship Diagram (ERD)

Highlights the relationship between the Organization, the Pillar Metadata, and the new Audit Log.

```mermaid
erDiagram
    organizations ||--o{ research_audit_logs : "has history"
    pillar_definitions ||--o{ research_audit_logs : "defines strategy"
    
    organizations {
        uuid id PK
        string domain
        string name
    }

    pillar_definitions {
        text id PK
        text name
        text search_strategy_prompt "Instructions for Hunter"
        jsonb scraping_config "Rules for Clerk"
    }

    research_audit_logs {
        uuid id PK
        uuid org_id FK
        text pillar_id FK
        uuid run_id "Shared ID for full job"
        text agent_version "Persona ID"
        enum step_type "QUERY, SEARCH, etc"
        jsonb input_context
        jsonb output_result
        numeric cost_usd
        int latency_ms
    }
```
