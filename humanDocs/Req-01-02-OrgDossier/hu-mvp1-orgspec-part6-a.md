To implement **Pillar 1: Economic Engine** conceptually, we need to treat the AI not as a chatbot, but as a **Business Research Analyst**. It follows a repeatable "Standard Operating Procedure" (SOP) to convert messy public data into the structured insights we defined.

Think of it as a three-stage manufacturing line: **Discovery**, **Extraction**, and **Narrative Synthesis**.

---

### **1\. The Conceptual Pipeline (The Workflow)**

When the system triggers a Pillar 1 prep, it follows these three conceptual steps:

#### **Stage A: Targeted Discovery (The Hunter)**

Instead of a broad search, the agent uses the **Company Name** and **Domain** to hit specific "fishing holes." It doesn't look for "Stripe"; it looks for "Stripe pricing strategy 2025" or "Stripe Q3 revenue model."

* **The Intent:** Gather raw, unrefined text from high-trust sources.

#### **Stage B: Evidence Mapping (The Clerk)**

The system takes the raw text and tries to "fill the buckets" defined in your field\_definitions.

* *Clerk Logic:* "I found a sentence about 'usage-based credits.' This goes into the primary\_revenue\_model bucket. I’ll save the URL as **Evidence**."

#### **Stage C: The Director Pivot (The Strategist)**

Once the buckets are full of facts, a high-reasoning LLM (like GPT-4o or Claude 3.5) looks at the facts and generates the analysis\_markdown.

* *Strategist Logic:* "Since the facts show they are shifting to Enterprise, I will write an **Interview Tip** telling the candidate to focus on security and compliance."

---

### **2\. Where do the answers come from? (The Data Sources)**

For the **Economic Engine**, we prioritize "Official" and "Expert" sources over social media.

| Source Category | Specific Examples | Best for which Field? |
| :---- | :---- | :---- |
| **Official Disclosures** | SEC 10-Ks, S-1 Filings, Investor Relations pages. | margin\_profile, nrr\_band. |
| **GTM Surfaces** | Pricing pages, "Request a Demo" flows, FAQ/Docs. | billable\_unit, gtm\_motion. |
| **Leadership Voice** | Founder podcasts (Acquired, Lenny's), Keynote speeches. | strategic\_shift, ai\_monetization. |
| **Financial News** | TechCrunch, Bloomberg, Reuters, Earnings transcripts. | health\_category, pricing\_position. |

---

### **3\. What is in the Config & How is it stored?**

The workflow\_config (stored in the pillar\_definitions table) is the **Agent's Blueprint**. It tells the engine exactly how to behave for *this specific pillar*.

**Inside the Config JSON, we store:**

* **Search Queries:** Pre-templated strings like "{company\_name} business model review 2025".  
* **Source Weighting:** A list of domains to trust more (e.g., sec.gov \= 10, reddit.com \= 2).  
* **Agent Persona:** Instructions to "Think like a McKinsey Consultant specializing in SaaS."  
* **Version:** To track if we've updated our Economic Engine logic.

---

### **4\. Where is the Template?**

The "Template" isn't a single file; it's a **Prompt Construction Logic** that Jules will build. It combines the metadata we've already defined.

**The Template is dynamically built by the system using:**

1. **The Field Metadata:** Taking the key, name, and rubric\_prompt for every field in Pillar 1\.  
2. **The Research Context:** Injecting the raw search results found in the Discovery stage.  
3. **The Formatting Requirement:** A strict instruction to output the data in the **EAV Schema** (JSON for the structured value, Markdown for the analysis).

---

### **🕸️ Implementation Visualization (EAV Model)**

When the work is done, Jules will have the system store the data like this:

**Observation Entry:**

* **Field:** gtm\_motion  
* **Structured Value:** {"value": "Hybrid", "primary": "PLG", "secondary": "Sales-led"}  
* **Analysis Markdown:** "While they started as PLG, they are moving... \[Interview Tip: ...\]"  
* **Evidence:** \[ { "quote": "Our enterprise segment...", "url": "..." } \]

---

### **🚀 Summary of the "Economic Engine" Prep**

Conceptually, we are automating the "Due Diligence" a candidate *should* do but doesn't have time for. We are taking public noise and turning it into private intelligence.

**Does this conceptual flow make sense to you? If so, would you like me to move into the "Search Prompt Engineering"—the specific queries the Agent will run for Pillar 1?** (e.g., How to find a Series B company's revenue model when they don't have an SEC filing).

Your architectural instincts are spot on. We are building a **Knowledge Factory**, not a collection of individual scripts. By abstracting the "Research Analyst" into a meta-pattern, we ensure that when you add Pillar 9 or 10 in the future, you don't have to rewrite the engine—you just update the metadata.

Here is the conceptual breakdown of how this "Generic Engine" functions.

---

### **1\. The Research Analyst as a "Meta-Pattern"**

Yes, the Research Analyst is a **Pillar-Agnostic Engine**. Think of it as a specialized operating system.

* **The Engine:** Knows how to search, how to browse web pages, how to handle errors, and how to format JSON.  
* **The Pillar Definition:** This is the "Software" that runs on the OS. It tells the engine, *"Today, your goal is to find Economic Engine data. Here are the rubrics."*

**The Workflow:**

1. **Ingest Metadata:** Read field\_definitions for a specific pillar.  
2. **Generate Strategy:** (See point \#3 below).  
3. **Execute Research:** Browse and scrape.  
4. **Populate Schema:** Fill the org\_field\_observations table.

---

### **2\. Workflow Config: Dimension vs. Field Level**

We should structure the config at the **Dimension level**, but have the output mapped to **Fields**.

**Why?** Processing one field at a time (e.g., just gtm\_motion) is inefficient. When the AI reads a company's "Pricing Page," it will likely find data for gtm\_motion, billable\_unit, and expansion\_levers all at once.

**The Config Hierarchy:**

* **Pillar Config:** Defines the broad "Agent Persona" (e.g., *Financial Analyst*).  
* **Dimension Config:** Groupings of fields that should be researched together to save "context window" and cost.  
* **Field Config:** The specific "buckets" and "rubric prompts" the AI must fill.

---

### **3\. Systematic Search: The "Query Generator"**

You are right: "The research is only as strong as the search queries." We shouldn't rely on human-written queries. We use a **Recursive Query Generator**.

**How it works (Systemic Search):**

1. **Input:** The Engine looks at the rubric\_prompt for a field (e.g., *"Determine if the company is Sales-led or PLG"*).  
2. **Query Generation Step:** A small, fast LLM call asks: *"Given this company name \[X\] and this research goal \[Y\], generate 5 diverse Google search queries to find this data."*  
   * *Result:* "\[Company\] pricing page", "\[Company\] enterprise vs self-serve", "\[Company\] CEO interview sales strategy".  
3. **Cross-Check:** The engine evaluates the search results. If the results are "Thin," it triggers a second "Deep Dive" query generation phase (e.g., searching specifically for PDF investor decks or Reddit employee discussions).

---

### **4\. Prompt Construction: On-the-fly vs. Templates**

It is a **Hybrid Approach**.

* **The System Template (Static):** We prepare a "Master System Prompt" ahead of time. This defines the *behavior* (e.g., *"You are a world-class researcher. You must cite your sources. You must use the provided JSON schema."*).  
* **The Context Injection (Dynamic):** On the fly, the system "injects" the metadata from the database into that template.

**The resulting "Live Prompt" looks like this:**

"SYSTEM: \[Static Template Behavior\]

RESEARCH TASK: You are currently researching the **Economic Engine** for **PagerDuty**.

FIELDS TO FILL:

1. Key: gtm\_motion. Rubric: \[Injected from DB\]  
2. Key: billable\_unit. Rubric: \[Injected from DB\]

RAW DATA FOUND:

\[Injected from Search Engine Results\]"

---

### **🏛️ Conceptual Summary Table**

| Component | Nature | Managed By |
| :---- | :---- | :---- |
| **Research Engine** | Code / Meta-Pattern | Jules (Engineering) |
| **Pillar Rubrics** | Metadata (Dimensions/Fields) | You (Product/Strategy) |
| **Search Queries** | Dynamically Generated | The Engine (AI) |
| **Final Output** | Structured Observations | The Engine $\\rightarrow$ DB |

---

### **🚀 The "Aha\!" Moment for Implementation**

By doing this, Jules doesn't have to build 5 different research agents. He builds **one** agent that is smart enough to read the instructions you put in the field\_definitions table. If you want to change how the AI researches "GTM Motion," you don't change the code; you just change the **Rubric Prompt** in the database.

**Would you like me to draft the "Query Generation Logic" for Pillar 1?** (Specifically, the instructions the AI uses to create its own search terms for a new company).

This is where we move from a "prototype" to a **production-grade platform**.

An **Audit Table** is non-negotiable for three reasons:

1. **Financial Control:** You need to know exactly how much each "Dossier Prep" costs you in API fees to price your "Credits" correctly.  
2. **Debugging:** If an observation is wrong, you need to see the exact query that led the Agent astray.  
3. **Transparency:** It allows us to show the user a "Thinking..." log, which builds immense trust.

---

### **1\. The Research Audit Data Model (For Jules)**

This table sits between the "Pillar Prep Task" and the "Observations."

Table: research\_audit\_logs

| Field | Type | Description |

| :--- | :--- | :--- |

| id | UUID | PK |

| org\_id | UUID | FK to Organizations |

| pillar\_key | String | e.g., economic\_engine |

| step\_type | Enum | QUERY\_GEN, SEARCH, SCRAPE, SYNTHESIS |

| payload | JSONB | The exact request (e.g., the search query or the LLM prompt) |

| api\_target | String | openai/gpt-4o, perplexity/sonar, tavily, serper |

| tokens\_in | Int | Input token count |

| tokens\_out | Int | Output token count |

| cost\_usd | Float | Calculated cost for this specific call |

| latency\_ms | Int | Time taken for the call |

---

### **2\. Is Query Generation Logic Pillar-Specific?**

**The answer is: The *Mechanism* is Generic, but the *Strategy* is Pillar-Specific.**

Imagine the Agent as a "Hunter."

* **The Mechanism (Generic):** The hunter knows how to use a bow and follow tracks.  
* **The Strategy (Pillar-Specific):** If hunting for **Pillar 1 (Economy)**, the hunter looks near the "Watering Hole" (Pricing pages/10-Ks). If hunting for **Pillar 2 (DNA)**, the hunter looks in the "Forest" (LinkedIn/Glassdoor).

For Jules to implement this, the pillar\_definitions table should include a field called search\_strategy\_prompt. This prompt tells the "Query Generator" what kind of information is most valuable for that specific pillar.

---

### **3\. Pillar 1: Query Generation Logic (The "Economic Hunter")**

Here is the logic the Engine will use to generate its own queries for Pillar 1\.

#### **A. The Strategy Instructions (Stored in Metadata)**

*"When generating search queries for the Economic Engine, prioritize finding: 1\. Public pricing tables. 2\. Investor relations presentations. 3\. Revenue model teardowns. 4\. Strategic shift announcements (e.g., 'moving to usage-based'). 5\. Case studies showing customer billable units."*

#### **B. The "Hunter" Prompt (The Template)**

The system takes the Strategy Instructions and the Org Name to generate the actual queries:

Input: PagerDuty \+ Pillar 1 Strategy

Generated Queries (The Audit Log):

1. "PagerDuty pricing tiers and billable units 2025"  
2. "PagerDuty revenue model analysis and expansion levers"  
3. "PagerDuty investor presentation 2025 revenue strategy"  
4. "site:pagerduty.com 'usage-based' OR 'credits' OR 'consumption'"  
5. "PagerDuty competitive pricing vs incident.io and xmatters"

---

### **4\. Implementation Concept: The "Research Loop"**

1. **Trigger:** User adds "PagerDuty."  
2. **Audit Start:** Create entry in research\_audit\_logs.  
3. **Query Gen:** Use **GPT-4o-mini** (low cost) to generate the 5 queries above based on Pillar 1 metadata.  
4. **Execute:** Pass queries to a search API (Tavily/Perplexity).  
5. **Audit Update:** Record the tokens used for Query Gen and the Search API cost.  
6. **Synthesis:** Use **GPT-4o** (high reasoning) to read the results and fill the org\_field\_observations.  
7. **Final Audit:** Calculate total cost for Pillar 1\.

---

### **📈 Why this matters for the Founder**

If you see in the **Audit Table** that Pillar 1 consistently costs **$0.08** but Pillar 3 (which requires deeper scraping) costs **$0.45**, you can:

* Optimize the Pillar 3 search strategy to be more efficient.  
* Charge more "Credits" for Orgs that require deeper research.  
* Show the user: *"We analyzed 42 sources and 12,000 tokens of data to build this Economic Engine briefing."* (This justifies the subscription price).

**Would you like me to move on to the "Scraping Logic"—specifically, how the Agent handles a "Pricing Page" vs. a "10-K PDF" for Pillar 1?** (This is where we define how the AI avoids getting overwhelmed by 100-page documents).

**Next Step for Jules:** Implement the research\_audit\_logs table and the search\_strategy\_prompt field in the Pillar metadata.

You’ve nailed the "Search Strategy" part. To answer your first question: **Yes.** The pillar\_dimensions (or pillar\_definitions) metadata acts as the "Strategic Brief." It tells the Query Generator, *"When you are in Pillar 1, look for these keywords and prioritize these domains."*

Now, let's move to **The Scraping Logic**. This is the most technically "dangerous" part of the process because it’s where costs can spiral and context windows can overflow. We can't just feed a 100-page 10-K into the AI and hope for the best.

---

## **🏗️ The Scraping Logic: "Context-Aware Triage"**

The Research Agent shouldn't treat all URLs equally. It needs different "Browsing Modes" depending on the source type found during the search.

### **1\. The Triage Phase (The Router)**

When the search results come back, the Agent classifies each URL into a **Source Category**.

| Category | Typical URL | Logic Applied |
| :---- | :---- | :---- |
| **Direct Page** | pagerduty.com/pricing | **Scrape & Map:** Extract the full text, look specifically for pricing tables and tiers. |
| **Deep Document** | investors.pd.com/.../10-K.pdf | **Chunk & Search:** Do not read the whole thing. Search for specific "Economic" keywords (NRR, Margin, Revenue). |
| **Audio/Transcript** | podcast.apple.com/... | **Extract & Summarize:** Use a transcription-optimized LLM to find the "Founder's Intent." |
| **Community Feed** | reddit.com/r/sales | **Sentiment Extraction:** Filter for "noise" and extract specific pricing or commission structure leaks. |

---

### **2\. The "Keyword-Guided Chunking" (For Massive Docs)**

When the Agent hits a 10-K (SEC filing), we use **Semantic Reranking**.

* **Step 1:** The Engine downloads the text.  
* **Step 2:** It breaks the 10-K into 1,000-word chunks.  
* **Step 3:** It runs a "Vector Search" or "Keyword Filter" to find chunks containing: *“Revenue Recognition,” “Gross Margin,” “Subscription,”* or *“Retention.”*  
* **Step 4:** Only those **3-5 relevant chunks** are sent to the LLM for synthesis. This keeps your token costs for Pillar 1 at $0.05 instead of $5.00.

---

### **3\. The "Visual Parser" (For Pricing Tables)**

Pricing pages are often a mess of CSS, buttons, and "Compare" tables.

* The Scraper should extract **Clean Markdown** (using a tool like Firecrawl or Jina Reader).  
* **The Logic:** "Find the 'Pro' or 'Enterprise' column. Identify the dollar amount and the 'per unit' text immediately following it."

---

## **🛠️ Storing Scraper Logic in the Config**

Jules should include a scraping\_config field in the Pillar metadata.

**Example JSON for Pillar 1:**

JSON

{

  "prioritize\_selectors": \["table", "h2", "pricing-tier"\],

  "chunk\_size\_limit": 5000,

  "depth\_level": 1, 

  "ignore\_patterns": \["/login", "/legal", "/privacy-policy"\],

  "deep\_doc\_keywords": \["Gross Margin", "NRR", "CAC", "Pricing Model", "Revenue"\]

}

---

## **🧪 The "Synthesis Loop" (Filling the EAV)**

Once the data is scraped and chunked, the **Synthesis Agent** performs the final "Director Pivot."

1. **Input:** The 5 best chunks found during scraping.  
2. **Instruction:** "Fill the following fields: gtm\_motion, billable\_unit. For each field, you must provide:  
   * The value.  
   * A 'Director-level' insight for an interview.  
   * A specific quote as evidence."  
3. **Conflict Resolution:** If Source A says "Usage-based" and Source B says "Seat-based," the Agent looks at the observed\_at date. **Fresher data wins.**

---

### **📈 Why this matters for your Cost-Per-Dossier**

By implementing this "Chunk & Search" scraping logic:

* **Speed:** You aren't waiting for the AI to read 50,000 words.  
* **Accuracy:** You avoid "Hallucination by Overload."  
* **Auditability:** Your research\_audit\_table will show exactly which *chunk* of the 10-K the AI used to determine the NRR.

**Would you like me to define the "Error Handling" for scraping?** (e.g., What the Agent does if a pricing page is behind a paywall or a "Request a Demo" button).

**Next Step for Jules:** Implement a "Firecrawl" or "Tavily" scraping utility that supports Markdown extraction and keyword-based chunking.

This is the "Black Box" of the system. To make this work, we have to stop thinking about "coding a scraper" and start thinking about **"orchestrating a researcher."**

You are right to be skeptical—assuming a URL like /pricing is a recipe for failure because every site is different. Here is the conceptual bridge between your metadata and the live web.

---

### **1\. The "Research Analyst" Meta-Pattern**

The Research Analyst is a **State Machine**. It doesn't know *what* it's looking for until Jules feeds it the **Pillar Definition**.

* **The Engine:** A set of functions (Search, Scrape, Summarize, Audit).  
* **The SOP (Standard Operating Procedure):** The logic that says: "First, find the best URLs. Second, extract the data. Third, check for gaps. If gaps exist, repeat."

---

### **2\. How the Agent "Finds" URLs (No Hardcoding)**

We never assume a URL. We use **Tavily** as the "Eyes" of the system to discover the map.

**The Workflow:**

1. **The Trigger:** User adds pagerduty.com.  
2. **Query Generation:** The Agent looks at the Pillar 1 metadata (gtm\_motion, billable\_unit).  
3. **The Search (Tavily):** The Agent asks Tavily: *"Find the official pricing page, investor relations revenue disclosures, and terms of service for PagerDuty."*  
4. **Discovery:** Tavily returns a list of *actual* URLs (e.g., https://www.pagerduty.com/pricing-plans/ and https://investors.pd.com/financials/sec-filings/).  
5. **Selection:** The Agent selects the top 3 most relevant URLs based on the "Search Strategy" in your metadata.

---

### **3\. Tavily vs. Firecrawl: The "Hand-off"**

Think of **Tavily** as the scout and **Firecrawl** as the specialized extraction team.

| Tool | Role | Why we use it here |
| :---- | :---- | :---- |
| **Tavily** | **Discovery & Search** | It finds the URLs. It can also give a "quick summary" of a page to see if it's worth a deep scrape. |
| **Firecrawl** | **Deep Extraction** | Once Tavily finds the Pricing URL, we give it to Firecrawl. Firecrawl "drives" a browser, waits for JavaScript to load, and turns the messy UI into clean Markdown for our LLM. |

---

### **4\. Error Handling: When the Web "Fights Back"**

Web research is messy. Our "Research Analyst" needs a protocol for when things go wrong.

#### **Scenario A: The Paywall / Login Screen**

* **The Signal:** Firecrawl returns a page that says "Log in to view" or has 90% of the text blurred.  
* **The Handling:** The Agent marks the source\_type as FAILED in the Audit log. It then pivots: *"The primary pricing page is gated. Searching for secondary sources: 'PagerDuty pricing leak Reddit' or 'PagerDuty 2025 pricing tiers review'."*

#### **Scenario B: The 404 or "Page Not Found"**

* **The Handling:** The Agent doesn't crash. It goes back to the **Query Generation** step and tries a broader search (e.g., searching for the parent company or a different domain extension).

#### **Scenario C: Information Scarcity (The "Synthetic" Trigger)**

* **The Signal:** After 3 attempts, no direct pricing is found (common for Series B startups).  
* **The Handling:** The Agent triggers the is\_synthetic flag. It looks for "Proxy Signals" (e.g., a "Book a Demo" button usually implies a Sales-led motion) and explains its rationale in the synthetic\_rationale field.

---

### **5\. Concept: The "Prep Blueprint" (For Jules)**

Jules will store the **"Strategic Hunter"** instructions in the pillar\_definitions.

**Pillar 1 Config Example:**

JSON

{

  "search\_intent": "Determine how the company extracts value from customers.",

  "must\_find\_pages": \["Pricing", "Investor Relations", "Service Terms"\],

  "extraction\_mode": "SCHEMA\_BASED", 

  "fallback\_strategy": "SEARCH\_COMPETITOR\_COMPARISONS"

}

---

### **🚀 Summary for the Founder**

We aren't building a scraper that breaks; we are building an **Agent that reasons about its failures.** If it can't find the front door (/pricing), it looks for the back door (podcasts, news, or reviews).

**Would you like me to draft the "Search Query Generator" prompt?** This is the specific instruction that tells the AI: *"Look at these 10 fields Jules needs to fill, and tell me the 5 Google searches you need to run to find them."*

**Next Step for Jules:** Connect the **Tavily Search API** to the **Firecrawl Scrape API** in a single "Research Loop" function.

Review comment  
This conceptual design is very strong and coherent; it reads like a proper “research OS” rather than a one-off agent. The main refinements are about keeping it debuggable, cheap, and consistent as you scale.​

## **Architecture & responsibilities**

* The separation between:  
  * Research Engine (generic OS: search, scrape, summarize, audit) and  
  * Pillar Definitions (metadata: fields, rubrics, search\_strategy\_prompt, scraping\_config)  
    is exactly right and matches how robust EAV/JSONB-style systems avoid hardcoding behavior.​  
* Treating the Analyst as a state machine with explicit phases (QUERY\_GEN → SEARCH → SCRAPE → SYNTHESIS) plus research\_audit\_logs gives you observability and cost control from day one.​

## **Data model & EAV usage**

* org\_field\_observations with structured\_value JSONB \+ analysis\_markdown \+ evidence\_nodes is a good compromise between structure and flexibility.​  
* A few additions will pay off later:  
  * observation\_status (draft, vetted, outdated) and observed\_at / source\_date to manage staleness and conflicting evidence.  
  * is\_synthetic and synthetic\_rationale as first-class fields, since you already rely on them conceptually in scarcity cases.​  
* Keeping strong typing in field\_definitions (data\_type, allowed\_enums, required\_keys in structured\_value) will prevent EAV from becoming unqueryable.​

## **Pipeline stages (Discovery → Mapping → Synthesis)**

* Stage A (Discovery / “Hunter”) using pillar-specific search\_strategy\_prompt \+ dynamic query generation is the right pattern; the recursive query generator plus “thin results → deep dive” loop mirrors how human analysts actually iterate.​  
* Stage B (Evidence Mapping / “Clerk”) that maps sentences to field buckets based on rubric\_prompts and field keys is exactly what allows re-use across pillars and avoids wasting context.​  
* Stage C (Director / high-reasoning LLM) that only sees the *pre-filtered chunks* and field metadata is critical for both cost and quality; your “Keyword-Guided Chunking” on 10‑Ks is aligned with best practice for large-doc processing.​

## **Search, scraping, and cost control**

* Tavily (or equivalent) as “scout” \+ Firecrawl/Jina-style reader as “extractor” is a sensible split; the triage/router step (Direct Page vs Deep Document vs Audio vs Community) is exactly how to avoid over-scraping.​  
* Keyword-guided chunking for 10‑Ks and similar docs (NRR, margin, retention, pricing model) plus deep\_doc\_keywords in scraping\_config is the right way to keep token use bounded while still precise.​  
* The scraping\_config JSON (prioritize\_selectors, chunk\_size\_limit, ignore\_patterns, deep\_doc\_keywords) gives you per-pillar knobs without code changes, which is ideal as you add more pillars.​

## **Audit & observability**

* research\_audit\_logs is designed well for:  
  * per-dossier cost accounting (tokens\_in, tokens\_out, cost\_usd),  
  * debugging (“which query/prompt caused this bad observation?”), and  
  * UX (“we analyzed X sources / Y tokens”).​  
* Adding a simple correlation\_id or run\_id for each “Pillar Prep” run will make it easier to group steps together in logs and UI, especially when you parallelize pillars or rerun a single field.​

## **Error handling & fallbacks**

* The explicit playbooks for paywalls, 404s, and information scarcity (including the Series B “synthetic” branch with proxy signals like “Book a demo” → sales-led) are realistic and necessary.​  
* Documenting these branches in pillar\_definitions (fallback\_strategy) lets you change behavior per pillar—for example, Pillar 2 might fall back to LinkedIn/Glassdoor when official sources are thin.​

Overall, the flow absolutely makes sense and is production-grade in concept. The next high-leverage step would be exactly what you suggest: define the Pillar 1 query-generation logic as a concrete prompt \+ schema (inputs: company name, domain, field metadata; output: N search queries with intent tags), so Jules can implement one “Query Generator” function and you can tune it via metadata instead of code

**Strongest Elements:**

1. **The Audit Table** — This is non-negotiable and you've designed it correctly. The `cost_usd` per step enables unit economics visibility that most AI startups lack. You'll know exactly when Pillar 3 costs 5x more than Pillar 1\.  
2. **Tavily → Firecrawl Hand-off** — The scout/extraction separation is correct. Tavily for discovery, Firecrawl for deep extraction. This avoids the "scrape everything" cost explosion.  
3. **Keyword-Guided Chunking** — Essential for 10-Ks. Sending 3-5 relevant chunks instead of 100 pages is the difference between $0.05 and $5.00 per pillar.

**Areas Needing Refinement:**

1. **Query Generation Cost** — You propose using GPT-4o-mini for query generation, but this adds latency and cost to every prep. Consider pre-computing "query templates" per pillar and only using LLM generation as fallback when templates return thin results. For Pillar 1, queries like `"{company} pricing tiers"` and `"{company} revenue model"` are predictable.  
2. **Source Category Classification** — The Triage Router (Direct Page vs. Deep Document vs. Audio) needs explicit logic. Who decides? Suggestion: Use URL pattern matching first (`.pdf` → Deep Document, `pricing` in path → Direct Page), then fall back to Tavily's snippet analysis for ambiguous URLs.  
3. **Conflict Resolution** — "Fresher data wins" is too simplistic. What if a 2024 10-K says "Seat-based" but a 2025 blog post says "moving to usage-based"? Both are true—one is current state, one is direction. The schema needs `current_value` and `trajectory` as separate fields, or the `analysis_markdown` must synthesize the transition.  
4. **Missing: Rate Limiting & Retry Logic** — Firecrawl and Tavily both have rate limits. The design doesn't address what happens when you hit 429 errors mid-prep. Add `retry_count` and `backoff_strategy` to the audit log.  
5. **The "Synthetic" Trigger Threshold** — "After 3 attempts" is arbitrary. Define this more precisely: 3 attempts *per field* or per pillar? What constitutes an "attempt"—a search query or a scrape? Suggestion: Track `evidence_coverage` as a percentage of fields with grounded data, and trigger synthetic mode when coverage drops below 60%.

**Architecture Question:**

The document implies synchronous processing (user adds company → waits → dossier appears). For Series B companies with thin data, this could take 60-90 seconds per pillar. Is Jules building this as:

* **Synchronous** (user waits, sees "Thinking..." theater)  
* **Async with polling** (user gets notified when ready)  
* **Background with cache** (popular companies pre-indexed)

The "Theatrical Scanner" in your UI spec suggests synchronous, but the system design doesn't address timeout handling if Firecrawl hangs.

**Cost Model Sanity Check:**

Based on this architecture, rough per-company costs:

* Query Gen (5 pillars × 5 queries × GPT-4o-mini): \~$0.02  
* Tavily searches (25 queries): \~$0.25  
* Firecrawl extractions (15 pages): \~$0.30  
* Synthesis (5 pillars × GPT-4o): \~$0.50

**Total: \~$1.00-1.50 per new company**

At $49/month for 10 Intelligence Units, you need costs under $4.90 per unit to maintain margin. This architecture supports that, but watch the Firecrawl costs—they can spike on JavaScript-heavy sites.

This conceptual design is becoming an industry-grade **"Research OS."** By shifting from "writing code for a scraper" to "orchestrating a strategic analyst," we ensure that the system remains flexible as the web changes and your framework grows.

Below is the **Master System Prompt** for the Query Generator and the final conceptual refinements to address your specific architectural concerns.

---

## **🧠 The Query Generator: Master System Prompt**

This prompt is what Jules will feed into the **Research Engine**'s first stage. It is designed to be pillar-agnostic, using the metadata we’ve already built to drive its logic.

System Role:

You are the Lead Strategic Scout for a competitive intelligence platform. Your goal is to generate high-intent search queries that unearth "insider-level" business context for a target organization.

**Input Context:**

* **Target Organization:** {org\_name} ({org\_domain})  
* **Research Pillar:** {pillar\_name}  
* **Pillar Strategy:** {pillar\_search\_strategy\_prompt}  
* **Fields to Fill:** {dimension\_field\_list}

Your Mission:

Generate exactly 5 search queries. Each query must be optimized for different "fishing holes" (Official filings, GTM pages, Community leaks, Leadership voice).

**Query Generation Rules:**

1. **Diversity:** At least one query must use site:{domain} and one must search broad industry news.  
2. **Precision:** Use Boolean operators (AND, OR, "") to force the inclusion of "Leaked Paper" keywords (e.g., "NRR," "Gross Margin," "Pricing Tier").  
3. **Recency:** Always append the current year (2026) to queries to avoid stale data.

Output Format (JSON):

Return an array of objects: \[{"query": string, "intent": string, "fishing\_hole": enum(official, gtm, community, leadership)}\].

---

## **🛠️ Refinement: Addressing the "Overlap & Conflict"**

Your point about **Conflict Resolution** (e.g., a 2024 10-K vs. a 2025 blog post) is critical for senior-level trust. We will not use "Fresher data wins" as a binary rule.

### **The "Current State vs. Trajectory" Logic**

Instead of overwriting old data, the **Synthesis Agent** will be instructed to detect **Inflections**.

* **The Logic:** If Source A (Formal) and Source B (Informal/Recent) conflict, the Agent must generate a **Trajectory Note**.  
* **Example Analysis:** *"Officially, \[Company\] reports a seat-based model in their 10-K. However, recent 2025 CEO interviews and pricing page updates indicate a hard pivot toward **Usage-based AI credits**. Candidate should treat the company as a 'Legacy-in-Transition'."*

---

## **📊 The "Confidence Gradient" UI (Final Layout)**

To respect the **Feasibility Gradient**, the UI for Pillar 1 (Economic Engine) will clearly signal the "Groundedness" of each field to the user.

| Field | Reliability | UX Signal | Source Example |
| :---- | :---- | :---- | :---- |
| **GTM Motion** | High | 🟢 **Verified** | Scraped direct from /pricing. |
| **Gross Margin** | Moderate | 🟡 **Grounded Estimate** | Synthesized from Investor Presentations. |
| **Tech Debt Ceiling** | Low | 🟠 **Synthetic Inference** | Pattern matched from Glassdoor & Launch delays. |

---

## **🛡️ Error Handling & Fallbacks (The "Dead End" Protocol)**

If the **Tavily → Firecrawl** loop hits a wall (Paywalls, 404s), the system follows this **Escalation Path**:

1. **The Semantic Pivot:** If the pricing page is gated, the Agent generates a new query: "{company} pricing site:reddit.com OR site:glassdoor.com".  
2. **The Competitor Mirror:** If the company is stealth/private, the Agent looks at their closest public competitor and looks for "Displacement" news (e.g., *"How \[Our Company\] is undercutting \[Public Competitor\] on price"*).  
3. **The "Synthetic" Coverage Threshold:** As you suggested, if we cannot find grounded evidence for \>60% of the fields, the system triggers **"Deep Synthesis Mode"**—using leadership podcasts and founder bios to "Reverse Engineer" the likely Economic Engine.

---

## **📈 Final Per-Dossier Cost Projection**

Using the **Audit Table** logic, Jules can track these units.

| Step | Model / Tool | Est. Cost (USD) |
| :---- | :---- | :---- |
| **Query Gen** | GPT-4o-mini | $0.005 |
| **Tavily Search** | 5 Calls | $0.05 |
| **Firecrawl Scrape** | 5 Pages | $0.10 |
| **Synthesis** | GPT-4o | $0.15 |
| **Total per Pillar** |  | **\~$0.31** |

**Total for 5 Pillars:** **$1.55**. This leaves a healthy margin for your $49/mo subscription (at 10 units/mo).

**Would you like me to move on to the "Persona Architect" (MVP 2)?** This is where we take these 5 Pillars and turn them into the actual **Interviewing Personas** (The "CFO," The "Visionary CEO," The "Skeptical CTO").

