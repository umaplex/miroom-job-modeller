# **System Specification Baseline: "Job Modeller" (Applied AI)**

**Version:** 1.0

**Status:** Formalized for MVP 0 & 1 Development

## **1\. Project Vision & Positioning**

The product is a **Contextual Intelligence Engine** designed to move tech candidates (Product Leaders/Staff Engineers) from "Skill-focused" to "Context-obsessed."

* **The Hook:** A "Leaked Exam Paper" experience where the user receives internal organizational intelligence that is otherwise invisible.  
* **The Moat:** A proprietary Data Flywheel combining Grounded AI Research with Admin-blessed "Org Dossiers."

---

## **2\. The 5 Core Context Pillars (The Rubric)**

Every Org Dossier must be structured around these five pillars to move beyond generic LLM summaries:

| Pillar | Definition | Key Data Points Required |
| :---- | :---- | :---- |
| **1\. Economic Engine** | How the company generates profit. | Revenue model (SaaS/Usage/Marketplace), Growth vs. Efficiency phase, NRR/ARR targets. |
| **2\. Org DNA** | The power structure and culture. | Department dominance (Eng-led vs. Sales-led), Leadership archetypes, "Craft" vs. "Velocity." |
| **3\. Burning Platform** | The immediate urgency for the hire. | Recent pivots, churn issues, funding runway, competitive threats (e.g., Datadog vs. PagerDuty). |
| **4\. Domain Lexicon** | The internal language. | End-user terminology (Patient vs. Merchant), Industry acronyms, Internal "Mantra" keywords. |
| **5\. Decision-Making** | How work gets prioritized. | Written vs. Meeting culture, Top-down vs. Consensus, Risk tolerance levels. |

---

## **3\. Product Roadmap (MVP Phases)**

### **MVP 0: Foundation**

* **User Framework:** Web landing page, Registration/Auth.  
* **Monetization:** Stripe integration (Free-to-Paid toggle).  
* **Tracking:** Billing tied to "Intelligence Units" (e.g., Credits for Org Preps).

### **MVP 1: Org Intelligence (The "Honey Trap")**

* **Org Dossier:** Grounded research engine generating the 5 Pillars using Unique Domain IDs.  
* **Theatrical Research UI:** A "Model Thinking" log showing live research hits to build perceived value.  
* **The Executive Briefing:** A high-fidelity 1-page summary of the "Hidden Narrative."  
* **Practice Map (Job-less):** Interactive heatmap allowing users to explore dossiers via pillars.

### **MVP 2: Persona Intelligence**

* **JD Integration:** Specific "Job De-Brief" logic.  
* **Contextual Blindspots:** Comparing User Resume vs. Org Dossier to highlight high-risk areas.  
* **Persona Architect:** Simulation engine with specific Interviewer Archetypes (The Skeptical CFO, The Visionary).

---

## **4\. System Architecture & The Core Engine**

### **The Research Workflow (Grounded AI)**

1. **Identity:** URL-based identification to ensure data accuracy.  
2. **Scraping Layer:** Hits 10-Ks, Investor Decks, Glassdoor, and Podcast Transcripts (2025 data).  
3. **Confidence Score:** Every Pillar entry must include a "Source Strength" rating.  
4. **Assumptions:** If data is missing, the system uses "Reasonable Assumptions" based on Company Stage/Sector (labeled as *Synthetic Data*).

### **Admin & Human-in-the-Loop (HITL)**

* **The Gold Standard:** Admins can "bless" a dossier to make it the default for all users.  
* **Data Injection:** Temporary local data (links/PDFs) provided by Admin during a prep session are trashed post-prep to avoid stale-data liability.  
* **Manual Re-trigger:** Any data update by an Admin automatically refreshes the relevant pillars.

---

## **5\. User Experience & Psychology**

* **The First 5 Minutes:**  
  * **Minute 1:** URL Paste & Optional Resume Upload.  
  * **Minute 2:** "Theatrical Research" UI showing the engine digging into 2025 strategy.  
  * **Minute 3:** Generation of the **Executive Briefing** (The "Leaked Paper").  
* **Positioning Strategy:** Emphasize that we prepare the user for **Priorities**, not just **Questions**.

---

## **6\. System Administration & Compliance**

* **Audit Logging:** Every function (System or User) is audited with Name, Timestamp, User ID, and Intelligence Unit cost.  
* **TTL (Time To Live):** \* Economic/Market Pillars: 90-day decay.  
  * DNA/Lexicon Pillars: 180-day decay.  
* **User Satisfaction:** Feedback loop after every session to capture "Interview Hits/Misses" to feed the Data Flywheel.

This is the final **Technical Architecture & Deployment Blueprint** for Jules to begin **MVP 0**. It is optimized for low-cost entry, high-stakes research performance, and the **Agent-to-User Interface (A2UI)** paradigm.

---

## **🏛️ System Architecture: The "Agent-Native" Stack**

### **1\. The Core Layers**

| Layer | Selection | Rationale |
| :---- | :---- | :---- |
| **Frontend** | **Next.js 14+ (App Router)** | Best-in-class for performance and **A2UI** integration. |
| **Backend** | **FastAPI (Python 3.11+)** | Essential for LangChain/LangGraph and long-running AI research tasks. |
| **Database/Vector** | **Supabase (PostgreSQL \+ pgvector)** | Unified solution for Auth, Relational Data, and Semantic Search. Low cost. |
| **Task Queue** | **Upstash (Redis)** | Serverless Redis for managing the **Dossier Prep** background jobs. |
| **AI Orchestration** | **LangGraph** | Enables stateful, agentic workflows (Research \-\> Synthesis \-\> UI State). |

---

## **🛠️ Detailed Component Map**

### **A. The Intent-Driven Gateway (A2UI Bridge)**

The Frontend doesn't just request data; it syncs state with the Backend Agent.

* **A2UI Controller:** A specialized hook in Next.js that listens for JSON "UI State" updates from FastAPI.  
* **Command Dispatcher:** Every user action (chat or button click) is sent as an Intent (e.g., INTENT\_START\_RESEARCH, INTENT\_PIVOT\_PERSONA).

### **B. The Context Engine (Background Worker)**

Since research exceeds 30 seconds, we use a **Worker Pattern**:

1. **The Orchestrator:** FastAPI receives the URL, creates a "Pending" record in Supabase, and pushes a job to Redis.  
2. **The Research Agent:** A Python worker (Celery or Dramatiq) uses **Tavily/Perplexity API** to scrape 2025 context.  
3. **The Synthesizer:** Aggregates raw data into the **5 Pillars** and stores them in pgvector.

### **C. The Data Schema (Supabase/Postgres)**

Jules should initialize these core tables:

* users: Profile and Subscription status (link to Stripe).  
* organizations: Metadata (Domain, Name, Last Refreshed, TTL).  
* org\_pillars: Stores the JSON dossier for each of the 5 pillars (Linked to org\_id).  
* prep\_thinking\_logs: Auditable logs of the research process for the "Theatrical UI."  
* intelligence\_audit: Tracks "Intelligence Units" (Tokens/API calls) per user for billing.

---

## **🚀 Deployment Strategy: The "Hybrid-Cloud" Model**

We avoid a "Frontend-only" deployment (like Vercel) because our research jobs will time out.

### **1\. Frontend (The Shell)**

* **Provider:** **Vercel**  
* **Deployment:** Next.js App.  
* **Config:** Environment variables for Supabase URL and FastAPI Endpoint.

### **2\. Backend & Worker (The Brain)**

* **Provider:** **Railway.app** (or Render)  
* **Deployment:** A Dockerized FastAPI service.  
* **Why:** Railway allows **"Long-Running Services."** Our research agent can run for 2 minutes without being killed by a serverless timeout.

### **3\. Database & Auth (The Foundation)**

* **Provider:** **Supabase**  
* **Services:** Postgres (with pgvector), Supabase Auth (for MVP 0), and Storage (for Resume PDFs).

### **4\. Search & LLM APIs**

* **Search:** **Tavily API** (built for AI agents).  
* **LLM:** **OpenAI (GPT-4o)** for synthesis; **Claude 3.5 Sonnet** for persona modeling.

---

## **📋 Jules’s MVP 0 Sprint Checklist**

1. **Environment Setup:** \* Initialize Next.js project with Tailwind and A2UI base components.  
   * Set up FastAPI boilerplate with langgraph and pydantic.  
2. **Supabase Initialization:**  
   * Enable pgvector extension.  
   * Create organizations and org\_pillars tables.  
3. **Stripe Integration:**  
   * Create a basic "Subscription" toggle in the User Dashboard.  
   * Set up a Webhook listener in FastAPI to update user plans.  
4. **The "Hello World" Research Loop:**  
   * Build a single endpoint that takes a URL, triggers a 5-second "Mock Research" task, and updates a "Thinking Log" table that the Frontend polls.

---

## **📈 Founder's Final Note for Jules**

*"Jules, the goal of MVP 0 is **Connectivity**. I want to see a user log in, paste a link, and see a live log showing the system 'thinking.' Don't worry about the quality of the research yet; focus on the **Asynchronous State Loop** between the Worker, the Database, and the A2UI. That is the engine that gets us to $100k MRR."*

**Would you like me to generate the docker-compose.yml or the initial SQL Schema for Jules to copy/paste?**

Following is the rough note that lead to the above document

MVP Build Flow

* MVP 0  
  * Basic Framework for users accounts  
* MVP 1  
  * Build Org Dossier  
* MVP 2  
  * Support Practice Persona

**Basic Framework for users accounts**

Primary User Flows

* Users can land on the web site and see the sites features (incl MVP 1 & MVP 2\)  
* Users have an option to register / Sign In  
* All users start with free plan and does not require payment.   
* Users can change their plan upon which they connect to Stripe

System Capabilities

* User activity tracking ( This information will be used to both asses or decide billing or payment tires )  
  * User’s plan status are actively tracked in the system. Their current plan assignment & past plan history are kept.   
* 

**Build Org Dossier**

Primary User Flows

* User adds a company ; System prepares the Org Dossier ; User sees the Org Dossier & Practice Map

Secondary User Flows

* User can view the Orgs they are following ; Open that Org’s Dossier & Practice Map . 

Admin User Flows

* Admin can login and see all Orgs  
* Admin can add an Org to the system  
* Admin can see the “User view of Org” where they see the org dossier & practice map as user would see  
* Admin can see “Data View of the Org” which  provides an overview of the data and visibility into status  
* Admin can retrigger Org dossier prep   
* Admin can add additional data ( links , documents, text contents) for each Org

Managing Org Visibility

* Regardless of how an org is added org dossiers are available to all users. But not by default  
* A user must fav an org to see it. Whenever user adds an org it is automatically faved for them. Users can alternatively search for org (among available orgs) and fav them

Core Engine For Org 

* Org Pillar Meta data ; This data holds different org pillars the product supports.   
  * We start with 5 org pillars. But this is a way to easily bring new org pillars in future  
  * Each org pillar is defined with a name, description  
  * For each Org pillar it contains (a) Rubric of what information is required to build the dossier (b) what the org pillar dossier should look like  ( information expected)  
* Whenever an Org is added, first system checks if the Org already exists. If it does then Pillar Build will not happen  
* If the org is not present System will first initiate ORG Prep work flow

ORG Prep Workflow

* Extract the correct Org Name & Verify   
* Create Org Entry. Capture a main link for the Org in the Org Entry  
* Retrieve current Pillar meta data Short list the pillars that are applicable. (It may be a case that some pillars are not applicable 0 in future expansion)  
* Capture the Pillars for the Org ( even skipped one and indicate why skipped). There should be a state & description for each Pillar entry for org  
* Kick Off the Pillar Dossier Prep  
* For each prep kick off Pillar Dossier Prep

Pillar Dossier Prep Workflow

* For each Pillar system retrieves the rubric from the meta data  
* Then checks if any local data is available to use  
* Starts a pillar prep workflow & finally completes with Dossier creation  
* For each of the pillar, system should maintain a specific pillar prep workflow. And each of that pillar prep workfin indicates what information to collection, what questions to ask and which API to hit etc

Prep Thinking

* As system goes thru Org/Pillar Prep, system should start a prep session  
* It should capture every activity in a human facing language & internal code  
* If a user is logged in live they can see this as live status changes in user experience. Otherwise it will is accessible to admin & users to see how the org dossiers prepped ( consider this experience is much like model thinking feature) but something persisted as well

**General System Expectations**

* Every user facing functions are audited in the system  
* Every system functions are audited in the system.   
* Whenever that function triggers the system captures (a) function name (b) time ( c) users information if applicable

