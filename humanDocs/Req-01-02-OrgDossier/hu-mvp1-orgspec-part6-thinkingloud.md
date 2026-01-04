* 

## ---

**4\. The Research Operating System (Core Engine)**

The heart of "Job Modeller" is the **Research Operating System (Research OS)**. This is not a collection of static scripts but a dynamic, intelligent state machine capable of reasoning about data scarcity, search strategy, and cost.

### **4.1 The Meta-Pattern: Discovery, Extraction, Synthesis**

To manage costs and maximize accuracy, the Research OS follows a strict three-stage pipeline for each of the 5 Pillars. This pipeline allows for "Triage Logic," ensuring resources are not wasted on low-value searches.

#### **Stage 1: Targeted Discovery (The Scout)**

* **Role:** Identify *where* the information lives. The system does not guess URLs (e.g., company.com/pricing) because URL structures vary wildly.  
* **Tool:** **Tavily API**. Tavily is optimized for LLM agents, returning cleaner context and reducing hallucinations compared to generic Google Search APIs.  
* **Logic:** The Query Generator (a lightweight GPT-4o-mini agent) accepts the Company Name and the Pillar Definition (e.g., "Economic Engine") and outputs 5 optimized search queries.  
  * *Example Queries:* "PagerDuty pricing model 2025", "PagerDuty 10-K revenue recognition", "PagerDuty vs Datadog pricing reddit".  
* **Outcome:** A list of high-relevance URLs tagged by source type (Official, News, Community, PDF).1

#### **Stage 2: Evidence Mapping (The Extractor)**

* **Role:** Retrieve raw content and map it to specific database fields.  
* **Tool:** **Firecrawl API**.  
* **Strategic Choice:** While Tavily offers basic extraction, **Firecrawl** is superior for deep extraction of specific pages, handling JavaScript rendering, and converting complex HTML into clean Markdown. It is also significantly cheaper at scale ($83 for 100k pages vs. Tavily's estimated $500-$800 for equivalent deep processing).13  
* **Triage Logic:** The system classifies URLs to optimize costs:  
  * *Pricing/Product Pages:* Sent to Firecrawl for full Markdown extraction to capture tables and feature lists.18  
  * *PDFs/10-Ks:* Sent to a specialized "Chunking Engine" that downloads the text and uses keyword filtering (e.g., "Revenue," "Churn") to extract only relevant sections. This prevents the context window from being flooded with irrelevant legal boilerplate, keeping token costs low.1  
  * *Fallback:* If a page is blocked (403/429), the agent marks the source as failed and proceeds to the next URL without crashing the workflow.

#### **Stage 3: The Director Pivot (The Synthesizer)**

* **Role:** Convert raw facts into strategic insights suitable for a Director-level candidate.  
* **Tool:** **GPT-4o (High Reasoning)**.  
* **Logic:** The agent receives the mapped evidence chunks and the "Rubric" for the pillar. It generates three distinct outputs:  
  1. **Structured Value:** A database-ready value (e.g., gtm\_motion: "Hybrid").  
  2. **Analysis Markdown:** A narrative explaining the insight (e.g., "While historically PLG, they are pivoting to Enterprise Sales as evidenced by the new 'Contact Sales' gate on the pricing page.").  
  3. **Interview Tip:** A specific strategic directive for the candidate (e.g., "Ask about the friction between their self-serve and enterprise funnels").1

### **4.2 Prompt Engineering Strategy**

The prompts driving the Research OS are not hardcoded strings but dynamic templates populated by the database metadata.

* **Master System Prompt:** Defines the persona (e.g., "You are a Strategy Consultant"). It enforces strict citation rules: "You must cite a URL for every claim."  
* **Context Injection:** The prompt dynamically receives the rubric\_prompt from the field\_definitions table. This is a critical architectural feature: if the founder decides to change the definition of "Org DNA" or add a new nuance, they simply update the database record. The next agent run immediately adopts the new behavior without a code deployment or server restart.1

### **4.3 Cost Management & Audit Logs**

To ensure the path to $100k MRR is profitable, the system maintains a rigorous research\_audit\_logs table.

* **Granular Tracking:** Every API call (Tavily search, Firecrawl scrape, OpenAI completion) is logged with tokens\_in, tokens\_out, and calculated cost\_usd.  
* **Optimization Loop:** This data allows the team to identify "expensive" pillars. If the "Burning Platform" pillar averages $0.80 per run while others are $0.10, the search strategy can be optimized (e.g., restricting scrape depth or switching to a cheaper model for the discovery phase).1

## ---

**5\. Data Architecture: The Hybrid EAV Model**

The database schema is the foundation of the "Talent Intelligence" pivot. A simple document store (NoSQL) is insufficient because it makes analytical queries (e.g., "Find all Series B companies using Usage-Based Pricing") difficult, hindering the future B2B product. Conversely, a rigid relational schema is too brittle for evolving research models. The solution is a **Hybrid Entity-Attribute-Value (EAV)** model using PostgreSQL JSONB.

### **5.1 Schema Design**

The core table structure allows for infinite flexibility in defining new intelligence fields while maintaining SQL query capability via GIN indexing.

**Table: organizations**

* id: UUID (Primary Key)  
* domain: String (Unique, e.g., stripe.com)  
* name: String  
* last\_refreshed\_at: Timestamp (Used for TTL logic)

**Table: pillar\_definitions (Metadata)**

* id: UUID  
* key: String (e.g., economic\_engine)  
* search\_strategy\_prompt: Text (Instructions for the Scout)  
* scraping\_config: JSONB (Rules for extraction, e.g., allowed domains) 18

**Table: field\_definitions (The Rubric)**

* id: UUID  
* pillar\_id: UUID  
* key: String (e.g., gtm\_motion)  
* rubric\_prompt: Text (Instructions for the Synthesizer)  
* data\_type: Enum (String, Enum, Number, Boolean)

**Table: org\_field\_observations (The Data)**

* id: UUID  
* org\_id: UUID  
* field\_id: UUID  
* structured\_value: **JSONB** (The normalized answer).  
* analysis\_markdown: Text (The human-readable narrative).  
* confidence\_score: Float (0.0 \- 1.0).  
* is\_synthetic: Boolean (True if inferred, False if grounded).  
* evidence: JSONB (Array of source URLs and quotes).

### **5.2 Rationale for Hybrid EAV**

* **Analytical Power:** By storing the structured\_value as JSONB, we can use Postgres JSON operators to filter organizations. A query like SELECT \* FROM org\_field\_observations WHERE field\_key \= 'gtm\_motion' AND structured\_value-\>\>'value' \= 'PLG' becomes highly performant with GIN indexes.19 This powers the "Talent Intelligence" search engine for recruiters in the future phases.  
* **Flexibility:** Adding a new field (e.g., "Remote Policy") requires inserting a row into field\_definitions, not altering the database schema or running migrations. This supports rapid iteration on the 5 Pillars.21  
* **Performance:** Modern Postgres JSONB is binary-decomposed and indexed, offering read performance comparable to traditional columns for this scale of data, while avoiding the "sparse column" problem of wide tables.22

### **5.3 Evidence & Confidence Gradient**

The architecture explicitly models the reliability of data, adhering to the "Honesty Moat" strategy.

* **Verified (Green):** Data extracted directly from a primary source (e.g., Pricing Page). is\_synthetic \= False.  
* **Inferred (Yellow):** Data deduced from patterns (e.g., Cultural values). is\_synthetic \= True, with synthetic\_rationale populated.  
* **Conflict Resolution:** When multiple sources conflict (e.g., a 2023 blog vs. a 2025 news article), the system prioritizes **Recency** and **Source Authority** (defined in the pillar\_definitions). The analysis\_markdown will explicitly note the trajectory: "Historically Sales-led, but shifting to PLG as of 2025," rather than simply overwriting the old data.1

## ---

**6\. Agentic Workflow Implementation (LangGraph)**

The logic governing the research process is implemented using **LangGraph**, a library designed for building stateful, multi-actor applications. Unlike linear chains (DAGs), LangGraph allows for cyclic workflows, which are essential for research tasks that require retries and decision-making loops.

### **6.1 State Machine Design**

The research process is modeled as a graph where nodes are actions and edges are decisions.

* **State Object:** A shared dictionary passed between nodes, containing keys like { organization, current\_pillar, search\_results, scraped\_content, observations, errors, retry\_count }.  
* **Node 1: QueryGen:** Reads current\_pillar metadata, calls LLM, populates search\_queries in State.  
* **Node 2: Search:** Executes Tavily API, populates search\_results.  
* **Node 3: Triage (Conditional Edge):** Filters results. If no relevant results are found (e.g., empty list or low relevance score), it triggers a **Conditional Edge** back to QueryGen to retry with broader terms, incrementing retry\_count.23  
* **Node 4: Scrape:** Executes Firecrawl, populates scraped\_content.  
* **Node 5: Synthesize:** Calls LLM with scraped\_content \+ rubric, populates observations.  
* **Node 6: Persist:** Writes observations to Supabase.

### **6.2 Error Handling and Fallbacks**

The "Dead End" Protocol is critical for robustness. The web is messy, and Series B companies often have sparse data.

* **Paywalls/403:** If Firecrawl returns a 403 (Forbidden), the Agent catches the exception and attempts a "Cache Search" (checking Google Cache or Archive.org versions via Tavily options) or pivots to secondary sources (e.g., searching specifically for "Reddit" or "Hacker News" discussions about the company).1  
* **Data Scarcity (Synthetic Mode):** If grounded evidence cannot be found after max retries, the agent switches to "Synthetic Mode." It uses the General Pillar data (Industry, Stage) to generate "Reasonable Assumptions." For example, "As a Series B DevTool, they likely use a seat-based pricing model." This is flagged in the UI as "Inferred from Sector Standards" to maintain user trust.1

## ---

**7\. User Experience Architecture: A2UI & Realtime**

The User Interface (UI) is the stage where the intelligence is presented. We adopt the **Agent-to-User Interface (A2UI)** pattern to make the generated data interactive and dynamic, moving beyond static markdown rendering.

### **7.1 Generative UI Components**

Instead of the Agent returning a block of text, it returns structured JSON that the Frontend renders into native React components.

* **Mechanism:** The backend sends a JSON object describing the UI intent (e.g., type: 'comparison\_table', data: { rows: \[...\] }). The React frontend maps this intent to a pre-built Tailwind CSS component.  
* **Technology:** We utilize the **Vercel AI SDK** or **CopilotKit**, which supports streaming structured components directly from the agent to the client.2  
* **Example:** For the "Economic Engine," the Agent might return a payload instructing the UI to render a "Pricing Tier" comparison table or a "Revenue Mix" pie chart, which is far more digestible than a paragraph of text.24

### **7.2 The "Theatrical" Thinking Log**

To mitigate the perception of latency (60s+ wait times for deep research), the system streams the internal log of the Agent.

* **Implementation:**  
  1. The Python Worker publishes granular events to the prep\_logs table (e.g., "Reading 10-K Filing...", "Analyzing Competitor Pricing...", "Found Paywall, Retrying...").  
  2. **Supabase Realtime** listens to INSERT events on this table.  
  3. The Next.js Frontend subscribes to the channel realtime:prep\_logs:org\_id.  
  4. As logs arrive, they are displayed in a "Terminal-like" interface, providing visual feedback that "work is happening."  
* **Broadcast vs. Postgres Changes:** We strictly use **Postgres Changes** for this logging because the volume is manageable per user. However, for features like the "Live Chat" or "Progress Bars" where high frequency is expected, we may utilize **Supabase Broadcast** (ephemeral messages) to avoid database writes and reduce costs.26  
* **Psychology:** This transparency transforms the wait time from a nuisance into a value-add. Watching the agent "Think" and "Pivot" proves the system is doing "deep work" rather than just hallucinating a quick answer, reinforcing the value proposition.1

## ---

**8\. Infrastructure and Scalability**

### **8.1 Handling Long-Running Tasks**

The asynchronous worker pattern is non-negotiable.

* **Message Broker:** **Upstash Redis** is selected for its serverless, consumption-based pricing model. It integrates seamlessly with Python via standard Redis clients and avoids the overhead of managing a persistent Redis cluster.8  
* **Worker Execution:** We use **Dramatiq** for Python task processing. Dramatiq is preferred over Celery for greenfield projects due to its simplicity, automatic retries, and better reliability with Redis.9 The worker runs in a containerized environment (Railway/Render) that allows execution times of 10+ minutes if necessary, bypassing the HTTP timeout limits of Vercel/AWS Lambda.14

### **8.2 Rate Limiting and Quotas**

External APIs (Tavily/Firecrawl) have rate limits and costs.

* **Throttling:** The Worker implements a "Token Bucket" rate limiter to ensure we do not exceed the API provider's Requests Per Minute (RPM) (e.g., 100 RPM for Tavily Dev, 1000 for Prod).28  
* **Cost Guardrails:** The system tracks the cumulative cost of a dossier in real-time. If a dossier exceeds a defined threshold (e.g., $1.50 in API costs), the system can terminate the job early or switch to a "shallow" research mode to preserve margins. This prevents a "runaway agent" from draining the budget on a single difficult company.18

### **8.3 Database Connection Management**

Postgres has a limit on concurrent connections (e.g., 500 connections on Supabase Pro).

* **Pooling:** We utilize **Supabase Transaction Pooler (Supavisor)**. This allows thousands of ephemeral serverless functions (from the frontend) to share a small number of actual database connections, preventing connection exhaustion during traffic spikes.29

## ---

**9\. Security and Compliance**

### **9.1 Row Level Security (RLS)**

Security is enforced at the database engine level using Postgres RLS policies.

* **Policy:** CREATE POLICY "Users see their own favs" ON org\_field\_observations FOR SELECT USING ( auth.uid() IN (SELECT user\_id FROM user\_favorites WHERE org\_id \= org\_field\_observations.org\_id) ).  
* **Implication:** Even if there is a bug in the API code, a user physically cannot query data for an organization they have not unlocked or favorited. This provides a robust "Defense in Depth".29

### **9.2 Data Isolation & Admin Injection**

While "Public Data" (Orgs) is shared to create the data flywheel, "User Data" (Resumes, Practice Sessions) is strictly isolated.

* **Admin Injection:** The system allows Admins to "inject" specific data (e.g., a PDF leak or a private memo) to improve a dossier. This data is marked as source\_type: 'admin\_injection' and is scrubbed of any PII before being ingested into the pillars. This supports the "Human-in-the-Loop" validation required for the first 100 high-value dossiers.1

## 