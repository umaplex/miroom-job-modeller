This is the "meat" of the platform. For a product to reach $100k MRR, the **Org Dossier** cannot just be a text summary; it must be a structured, verifiable, and high-utility data asset.

Below are the detailed specifications for the **Org Dossier Engine**, structured specifically for Jules to implement.

---

## **🏛️ 1\. The Metadata Schema: The "Blueprint"**

Before we build a dossier, we define the **Pillar Metadata**. This allows us to add new pillars (e.g., "Competitive Landscape" or "Tech Stack") without rewriting the core engine.

### **Table: pillar\_definitions**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | UUID | Unique identifier (e.g., econ\_engine). |
| name | String | Human-readable name. |
| description | Text | High-level goal of this pillar. |
| rubric | JSON | The "Checklist" of what must be found (e.g., *Revenue model, Burn rate*). |
| expected\_output | JSON | Schema for the final dossier object. |
| workflow\_config | JSON | API endpoints to hit, specific LLM prompts, and depth settings. |

---

## **⚙️ 2\. The ORG Prep Workflow (State Machine)**

This workflow handles the transition from a "Raw URL" to a "Verified Org."

1. **Ingestion:** User inputs URL.  
2. **Normalization:** System uses an LLM/Search to resolve https://pagerduty.com $\\rightarrow$ PagerDuty Inc.  
3. **Deduplication:** Check organizations table for existing Domain ID.  
   * *If Exists:* Link user to existing Org.  
   * *If New:* Create Org Entry (Status: PREP\_INITIALIZED).  
4. **Pillar Scoping:** Retrieve all active pillar\_definitions. Create a row in org\_pillar\_status for each, marked as PENDING.

---

## **🧠 3\. The Pillar Dossier Prep Workflow (The "Deep Dive")**

For each pillar, a dedicated worker is spawned. This is where the "Thinking" happens.

### **The "Prep Thinking" Session**

Every activity must be logged in the prep\_logs table:

* **Internal Code:** SEARCH\_QUERY\_EXECUTED  
* **Human Language:** "Searching 2025 financial disclosures for revenue growth patterns..."

### **Execution Logic:**

1. **Data Gathering:** \* Check for **Admin-injected data** (temporary blobs/links).  
   * Execute search queries via **Tavily/Perplexity** based on the Pillar Rubric.  
2. **Synthesis:** \* Feed raw data \+ Rubric into a High-Reasoning LLM.  
   * **Constraint:** LLM must cite sources for every major claim in the content block.  
3. **Completion:** Update org\_pillar\_status to COMPLETED. Store final JSON in org\_pillar\_data.

---

## **🛠️ 4\. Admin Control Panel Specs**

The Admin view is the "Control Tower" for our data quality.

### **Features for Jules to build:**

* **The "Data View":** A table showing all Orgs, their aggregate completion % (e.g., 4/5 pillars ready), and the last refresh timestamp.  
* **Injection Interface:** A simple text/file upload area for a specific Org.  
  * *Logic:* "On Upload $\\rightarrow$ Set Status to RETRIGGER $\\rightarrow$ Clear existing Pillar Data $\\rightarrow$ Restart Workflow."  
* **System Health:** Visibility into API token usage and LLM costs per Org Prep session.

---

## **👤 5\. User Visibility & "Fave" Logic**

We want to foster a "Library" feel.

* **Discovery:** Users can search the organizations table.  
* **The "Fav" Trigger:** \* Viewing a dossier for the first time requires "Favoriting" it.  
  * This creates a record in user\_favorites, which acts as the "Access Key" for that user to see that Org's dossier data.  
* **Auto-Fav:** If a user is the *originator* of the Org (they added the URL), they are automatically faved.

---

## **📂 6\. Database Schema Design (For Jules)**

### **Table: organizations**

* id: UUID (Primary Key)  
* domain: String (Unique)  
* display\_name: String  
* main\_url: String  
* status: Enum (PREP\_INITIALIZED, RESEARCHING, COMPLETED, FAILED)

### **Table: org\_pillar\_data**

* id: UUID  
* org\_id: UUID (FK)  
* pillar\_id: String (FK to Metadata)  
* content: JSONB (The actual dossier)  
* sources: JSONB (List of URLs/Refs)  
* is\_synthetic: Boolean (True if based on assumptions, False if grounded in research)

### **Table: prep\_logs**

* id: UUID  
* org\_id: UUID  
* pillar\_id: String  
* internal\_code: String  
* display\_text: String  
* created\_at: Timestamp

---

### **1\. The workflow\_config Deep Dive**

The workflow\_config isn't just a static JSON—it’s the **instruction set** for the AI Agent. It tells the worker *how* to fulfill the rubric.

Why use this?

If we decide to change the "Economic Engine" research from using a generic search to a specialized 10-K parser, we only change the workflow\_config in the DB. No new code deployment is required.

**Example of a workflow\_config for the "Economic Engine" Pillar:**

JSON

{

  "version": "1.2.0",

  "execution\_mode": "sequential",

  "steps": \[

    {

      "id": "fetch\_financials",

      "tool": "tavily\_search",

      "params": { "query": "ticker {symbol} 2025 revenue model and unit economics", "search\_depth": "advanced" }

    },

    {

      "id": "analyze\_margin",

      "tool": "llm\_reasoning",

      "params": { "model": "gpt-4o", "temperature": 0.1, "system\_prompt": "Extract margin targets from context..." }

    }

  \],

  "retry\_policy": { "max\_attempts": 3, "backoff": "exponential" }

}

#### **Handling Versioning**

Yes, we should include a version field in the Pillar Definition.

* **When we update a pillar:** We increment the version.  
* **The "Smart Refresh" Logic:** If the system sees an Org with an "Economic" pillar at v1.0, but the system now has v1.2, it can flag that pillar as "Upgrade Available" to the user or Admin.

---

### **2\. User-Org Relationship Mapping**

We need to distinguish between **Ownership** (who added it) and **Interest** (who follows it). This ensures the "Honey Trap" works: an Org added by one user becomes a resource for all others.

**The Recommended DB Schema for Relationships:**

* **user\_added\_orgs (Table):** Captures the unique "discovery" event.  
  * *Fields:* user\_id, org\_id, added\_at.  
* **user\_favorites (Table):** Captures interest.  
  * *Fields:* user\_id, org\_id, faved\_at.

**Founder Rule:** If a user clicks "Add Org" and it already exists, the system simply adds it to their user\_favorites list and tells them: *"This Org is already in the library—opening it now."*

---

### **3\. Pillar Classing: Basic vs. Premium**

Instead of hardcoding "Basic" and "Premium" into the pillar name, we use a **Pillar Class** (or Tier) attribute. This allows you to "Up-sell" context during the interview prep.

Recommended Labels & Strategy:

| Class Label | Content Level | Access Logic |

| :--- | :--- | :--- |

| Foundation (Basic) | High-level strategy, Revenue model, Mission. | Free / Starter Tier. |

| Intelligence (Premium) | Specific churn data, Cultural "Red Flags," Decision-making quirks. | Paid Tier Only. |

| Tactical (Enterprise) | Real-world interview curveballs, internal memo leaks, peer-to-leveling. | High-tier / B2B. |

The pillar\_definitions table update:

Add a pillar\_class column (Enum: FOUNDATION, INTELLIGENCE, TACTICAL).

* In the UI, Foundation pillars are visible.  
* Intelligence pillars are **"blurred"** with a CTA: *"Upgrade to unlock the 'Burn Rate' and 'DNA' Intelligence for \[Company\]."*

---

### **🏛️ The "Applied AI" System Baseline (Finalized for Jules)**

| Component | Responsibility | Jules's Action |
| :---- | :---- | :---- |
| **Metadata Versioning** | Tracks changes in research logic. | Add version to pillar\_definitions. |
| **Dynamic Workflows** | Executes pillar-specific AI tasks. | Build the worker to parse the workflow\_config JSON. |
| **Dual-List Tracking** | Separates Favs from Added Orgs. | Create user\_favorites and user\_added\_orgs tables. |
| **Tiered Access** | Controls visibility based on plan. | Use pillar\_class to filter API responses for the frontend. |

This landing page and navigation structure is critical for creating a **"sticky" habit**. By showing the "Last 5 visited" and "New/Updated Orgs," you are signaling that this is a living system with fresh intelligence, not just a static database.

Here is the refinement of the **User Flows for Org Management**, followed by my strategic answer to your question.

---

## **🏛️ Refined User Flows: Org Dashboard & Navigation**

### **1\. The "Command Center" (Home Page)**

When the user logs in, the goal is **immediate re-entry** and **system discovery**.

* **The Hero Metric (System Pulse):** \* *"Tracking context for **1,240** companies. **14** dossiers updated in the last 24 hours."*  
* **The "Recents" Row:** \* A horizontal scroll or grid of the **Last Top 5 Orgs** visited by the user.  
  * **Action:** Clicking a card opens the **Org Dossier**.  
* **The Global Org Menu:** \* **Search & Add:** A unified search bar. If the Org exists, it shows in results. If not, a CTA appears: *"Don't see \[Company\]? Add it now to model it."*  
  * **My Favorites:** A dedicated view to manage the user's "Watchlist."

### **2\. The Org Card Design**

To satisfy your "Intelligence" space requirement, each card should be structured for high-density information.

| Element | Description |
| :---- | :---- |
| **Org Identity** | Logo (if available) \+ Name \+ Primary Industry. |
| **Freshness Tag** | "Refreshed 2h ago" (Green) vs. "Last updated 3mo ago" (Yellow). |
| **Intelligence Metrics** | Space for Favorites Count, Practice Sessions Run, or Context Score. |
| **Status Indicator** | If the Org is currently in "PREP" mode, show a progress bar on the card itself. |

---

## **🛠️ Logic: Search, Add, and Fav**

* **Search Intent:** When a user searches, the system should show:  
  * *Existing matches* in our library.  
  * *Add new* option if no exact domain match exists.  
* **The "Fav" Action:** \* If a user finds an existing Org in search, they click "Favorite" to add it to their dashboard.  
  * If a user adds a *New* Org, the system creates the entry, starts the Prep Workflow, and **automatically** favorites it for them.  
* **The "Un-Fav" Action:**  
  * Removing from favorites does **not** delete the data; it simply hides it from the user's "Command Center."

---

## **❓ Question: Should we show "Favs" and "Your Orgs" separately?**

**My Recommendation: No, keep them in one list, but use a "Source" label.**

From a Founder’s perspective, we want to simplify the UI. For the user, the "Job to be Done" is: *"I need to see the companies I care about right now."* It doesn't matter as much if they were the first to add it or if someone else did.

**However, we should differentiate them subtly via "Badges":**

1. **"Your Discovery" Badge:** For Orgs the user personally added. This gives them a sense of "Ownership" and contribution.  
2. **"Community Favorite" Badge:** For Orgs that are popular (high fav count).

### **Why this approach?**

* **Avoids Clutter:** Two separate lists (Favs vs. Added) would likely contain 90% overlapping data, causing confusion.  
* **Encourages Library Growth:** By merging them, you make the "Global Library" feel like the user's personal collection, which they just happened to "expand" by adding their own.

---

## **📈 Next Step for the Specification**

Now that we have the dashboard flow, we need to define the **Org Dossier View** (what happens after they click the card). Since we are doing "Pillar-based" browsing:

**Would you like me to map out the "Pillar Navigation" experience?** (Specifically: How the user switches between Foundation and Intelligence pillars and how we handle the "blurred/locked" state for Premium content).

*P.S. Jules will need to ensure the user\_favorites table in the DB supports a last\_visited\_at timestamp to power that "Top 5 Recents" feature.*

