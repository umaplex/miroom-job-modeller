

### **🏛️ Pillar 0: General (The "Vital Signs" Rubric)**

This pillar should be seeded with the following Dimensions and Fields.

#### **Dimension: Momentum & Talent Velocity**

*Focus: Is the company expanding, contracting, or stagnating?*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| headcount\_growth\_2yr | 2-Year Growth Trend | Calculate the % change in headcount over the last 24 months. Identify if growth is accelerating, slowing, or negative (layoffs). |
| dept\_growth\_skew | Functional Growth Bias | Which department is growing fastest? (e.g., "Engineering is flat, but Sales grew 30%"). This identifies the current "Investment Phase." |
| key\_leadership\_hires | Recent Leadership Moves | Identify any VP or C-level hires in the last 12 months. Note their "Source Firm" (e.g., "Hired a VP of Product from Stripe"). |

#### **Dimension: Market Appetite (Current Openings)**

*Focus: What problems are they currently hiring to solve?*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| openings\_distribution | Hiring Mix | Breakdown of current roles (e.g., 60% Eng, 20% Sales). Identify "Clusters" (e.g., hiring 5 AI Engineers suggests a new R\&D push). |
| role\_seniority\_bias | Seniority Focus | Are they hiring mostly "Juniors/Mid" (Scale mode) or "Staff/Directors" (Strategy/Foundational mode)? |
| geographic\_strategy | Talent Geography | Are roles concentrated in HQ, remote, or being moved to lower-cost regions (Offshoring)? |

#### **Dimension: Capital & Stability**

*Focus: How much "Runway" or "Pressure" exists?*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| funding\_stage\_status | Funding Reality | Latest round, amount, and valuation. For public companies, focus on current Market Cap and Stock Performance vs. Sector. |
| executive\_stability | C-Suite Tenure | Analyze the average tenure of the leadership team. Identify any "unexplained" departures of founders or key execs. |

* 

---

### **🚀 Seeding the "Pillar 1: Economic Engine" Master List**

Now that Jules has the field\_definitions table, we need to populate it. Here are the keys, names, and rubric prompts for **Pillar 1**. This is the data Jules needs to "seed" the database.

#### **Dimension: Revenue & GTM Architecture**

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| gtm\_motion | GTM Motion | Determine if the company is Sales-led, PLG, or Hybrid. Look for self-serve signups vs. "Request a Demo." |
| primary\_revenue\_model | Revenue Model | Identify if revenue is Subscription, Usage-based, Transactional, or Advertising. |
| expansion\_levers | Expansion Drivers | What causes a customer to pay more? (e.g., more seats, more API calls, higher feature tiers). |

#### **Dimension: Pricing Power**

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| billable\_unit | Billable Unit (The Meter) | What is the specific unit of value charged for? (e.g., "Per Managed Node," "Per SMS sent"). |
| ai\_monetization | AI Monetization Path | How are AI features priced? Is there an "AI Surcharge," or is it bundled in high-tier plans? |
| pricing\_position | Category Positioning | Is this company the "Premium/Luxury" leader or the "Value/Aggressive Disruptor" in the space? |

#### **Dimension: Profitability & Health**

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| margin\_profile | Gross Margin Profile | Estimate Gross Margin (Low/Mid/High). Identify major COGS (e.g., Cloud compute, human support). |
| health\_category | Company Health | Categorize as "Durable Profitability," "Efficient Growth," or "Growth at all Costs" based on recent news/layoffs/funding. |
| nrr\_band | NRR/GRR Banding | Infer Net Revenue Retention. Look for phrases like "Best-in-class retention" or "Struggling with churn." |

These refinements bring a clinical level of precision to **Pillar 2: Org DNA**. We are standardizing the fields so that Jules can build a high-performance database and an Agent that doesn't just "chat," but performs a **Strategic Audit**.

Below is the updated and standardized **field\_definitions** list for Pillar 2\.

---

### **🧬 Pillar 2: Org DNA (Standardized Rubric)**

#### **Dimension 1: Center of Gravity (The Power Map)**

*Focus: Identifying the internal "sovereign" and the executive hierarchy.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| dominant\_function | Dominant Function | **\[Structured: Enum\]** Determine if the company is engineering-led, sales-led, product-led, design-led, or ops-led. Logic: Background of CEO \+ Founding team \+ highest VP density. |
| exec\_stack\_shape | Executive Stack Shape | **\[Structured: JSON\]** List the CXO roles. Identify the report line for Product (reports to CEO or CTO/COO?). Note if key roles like CPO or CRO are vacant or recently filled. |
| power\_balance\_notes | Power Balance Narrative | **\[Text\]** Synthesize the "Coalition of Power." (e.g., "The Product \+ Engineering coalition holds the roadmap, but Finance has a heavy veto on cloud spend.") |
| board\_archetype | Board Composition | **\[Structured: Enum\]** Is the board Operator-Heavy (former CEOs), Financier-Heavy (PE/VC), or Strategic-Hybrid? Signals: Board bios on LinkedIn/Website. |

---

#### **Dimension 2: Decision Rights & Information Flow**

*Focus: Understanding the "Operating System" of the company.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| writing\_culture\_strength | Writing Culture Strength | **\[Structured: Scale 0-3\]** 0: None, 1: Weak, 2: Moderate, 3: Strong. Signals: Amazon-style 6-pagers, PRFAQs, or high emphasis on RFCs in Eng blogs. |
| decision\_owner\_pattern | Decision Ownership | **\[Structured: Enum\]** manager-led, single-threaded-leader, consensus-committee, founder-veto. |
| disagreement\_protocol | Disagreement Style | **\[Structured: Enum\]** disagree-and-commit, soft-consensus, adversarial-debate, polite-avoidance. Signals: Employee reviews on "meeting efficiency" and "bureaucracy." |

---

#### **Dimension 3: Motivators & Hero Archetypes**

*Focus: The "Psychology of Success" within the Org.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| hero\_archetype | The Hero Archetype | **\[Structured: Enum\]** Identify the "Ideal Employee" rewarded here: firefighter, architect, sales\_shark, operator, missionary, optimizer. |
| reward\_drivers | Reward Drivers | **\[Structured: JSON\]** Primary vs. Secondary metrics for promotion. {primary: revenue/OKRs/velocity, secondary: impact/collaboration}. |
| risk\_appetite | Failure Tolerance | **\[Structured: Scale 1-3\]** 1: Low (Zero-defect), 2: Med (Controlled Experiment), 3: High (Celebrated Failed Bets). Look for "Fail Fast" mentions. |

---

#### **Dimension 4: Work Philosophy & Talent Health**

*Focus: Trust, Autonomy, and Senior Leadership Stability.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| work\_location\_philosophy | Location Trust | **\[Structured: Enum\]** remote-first, hybrid-hq-centric, strict-office, remote-capable. **Audit:** Check if VPs are co-located at HQ while ICs are remote. |
| leadership\_stability | Senior Leadership Tenure | **\[Structured: Float\]** Average tenure of Directors+ in months. **Red Flag Check:** "Mass exodus of senior product leaders in the last 6 months?" |
| trust\_autonomy\_proxy | Trust/Autonomy Rating | **\[Structured: Scale 1-3\]** Based on "surveillance vs outcome" culture. Signals: Use of monitoring tools vs. focus on "ownership" in culture docs. |

* 

The "Honesty Moat" is what will separate this platform from generic AI wrappers. By being transparent about the **Feasibility Gradient**, we build deep trust with the sophisticated user. A Director of Product knows that "internal tech debt" isn't on the company website; seeing it labeled as **"Synthetic Inference"** actually makes the insight feel more "inside" and valuable, rather than just an AI hallucination.

Here is the finalized and standardized rubric for **Pillar 3**, including the Crisis Archetypes and the new M\&A dimension.

---

### **🏛️ Pillar 3: The Burning Platform (Strategic Crisis)**

#### **Dimension 1: External Disruptors (High Reliability)**

*Focus: Market-driven shocks and competitive displacements.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| competitive\_leap | Competitive Leapfrog | **\[Structured: JSON\]** Identify specific competitor moves (pricing slashes, feature launches). |
| market\_paradigm\_shift | Category Shock | **\[Structured: Enum\]** ai-native-displacement, regulatory-lockdown, economic-contraction. |
| exodus\_severity | Customer Churn Risk | **\[Structured: Band\]** none, emerging, acute. Signals: G2/Reddit complaints about specific legacy bugs or "switching to X." |

#### **Dimension 2: Internal Fault Lines (High Inference / Synthetic)**

*Focus: The "Silent Fires" stalling the organization from within.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| tech\_debt\_ceiling | Velocity Constraints | **\[Structured: Scale 1-3\]** 1: Manageable, 2: Slowing Velocity, 3: Critical. Logic: Correlation between launch delays and employee reviews. |
| product\_revenue\_gap | Strategic Mismatch | **\[Text\]** Identify if the current product suite is incapable of meeting the stated revenue/IPO targets. |
| leadership\_mandate | The "Why Now" | **\[Text\]** Synthesize the unstated reason for this hire. (e.g., "The Founder is stepping back and needs an 'Operator' to professionalize the product."). |

#### **Dimension 3: Time-Sensitivity & Urgency**

*Focus: The "Drop Dead Date" for the organization.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| urgency\_gauge | Strategic Urgency | **\[Structured: Enum\]** high-pivot-or-perish, medium-stagnation-risk, low-optimization. |
| burn\_rate\_pressure | Resource Tension | **\[Structured: Enum\]** high-runway-exhaustion, low-efficiency-mandate, investor-impatience. |
| m\_and\_a\_positioning | Exit Orientation | **\[Structured: Enum\]** preparing-for-acquisition, defensive-moat-building, platform-consolidation. |

#### **Dimension 4: The Crisis Archetype**

*Focus: The high-level mental model for the company's current state.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| crisis\_archetype | Strategic Archetype | **\[Structured: Enum\]** stagnant-incumbent, blitzscale-overextension, ai-disruption-response, founder-transition, post-ipo-identity-crisis. |

---

* 

---

### **📋 Boundary Check: Pillar 0 vs. Pillar 3**

| Feature | Pillar 0 (Fact) | Pillar 3 (Implication) |
| :---- | :---- | :---- |
| **Funding** | "Raised $50M Series C in Q1." | "Under extreme pressure to reach profitability before 2027." |
| **Leadership** | "CFO and VP of Eng left in Dec." | "The organization is suffering from a 'Founder-Transition' crisis; looking for steady hands." |
| **Hiring** | "15 open roles in AI Research." | "Hiring spree is a reactive 'AI-Disruption-Response' to a competitor's recent LLM launch." |

This refinement moves **Pillar 4** from a mere dictionary to a **Linguistic Survival Guide**. By including the **Linguistic Landmines**, we protect the candidate from the "accidental outsider" signal that kills interviews in the first 15 minutes.

The **Sacred Cows** as a structured JSON object is a major upgrade for Jules; it allows the AI to not just "display" information, but to "check" the candidate's practice responses for violations.

---

## **🏛️ Pillar 4: Domain Lexicon (The "Fluency Filter")**

### **Dimension 1: The Glossary (Internal Jargon)**

*Focus: Mastering the shibboleths that identify you as an "insider."*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| internal\_acronyms | Company Acronyms | **\[Structured: JSON\]** Identify 5-10 common acronyms (e.g., "GDS," "L7," "E6"). Include the expansion and a 1-sentence context. |
| customer\_naming | Persona Labels | **\[Structured: Enum\]** Customers, Partners, Merchants, Drivers, Nodes, Users. Logic: Which term appears most in the CEO's 2025 public letters? |
| product\_taxonomy | Product Identity | **\[Structured: Enum \+ Text\]** platform, suite, cloud, fabric, operating-system, agentic-layer. **Text Field:** Capture the exact phrase used (e.g., "The Autonomic Operations Cloud"). |

---

### **Dimension 2: Mantras, Sacred Cows & Landmines**

*Focus: What to worship and what to avoid at all costs.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| ceo\_mantras | Leadership Slogans | **\[Structured: List\]** Identify 3-5 repeated slogans (e.g., "Increase the GDP of the internet," "Frugality," "Day 1"). |
| sacred\_cows | Sacred Cow Audit | **\[Structured: JSON\]** { "belief": string, "evidence": string, "violation\_risk": string }. Identify non-negotiable beliefs (e.g., "Privacy is a human right"). |
| linguistic\_landmines | Anti-Patterns | **\[Structured: JSON\]** { "dont\_say": string, "say\_instead": string, "rationale": string }. Identify terms that trigger "outsider" status. |

---

### **Dimension 3: Domain & Tech Dialect**

*Focus: Showing expertise in the specific neighborhood they occupy.*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| vertical\_keywords | Must-Know Domain Terms | **\[Structured: List\]** The top 5 industry terms mandatory for this role (e.g., "ISO 27001," "NPS-Velocity," "LTV/CAC"). |
| tech\_stack\_slang | Engineering Dialect | **\[Structured: Tags\]** monolith, microservices, data-mesh, agentic-layer, RFC-driven. Logic: Scan the Engineering Blog for recurring infrastructure themes. |

---

Your strategic intuition on the **Feasibility Gradient** and **Pillar Overlap** is spot on. For a high-level candidate, "Noise" is the enemy. If we push into the "Shadow Org Chart" (Pillar 6), we cross the line from a "Strategic Intelligence Tool" to a "Corporate Gossip App," which kills our credibility with the very people who would pay $149/quarter.

We will **discard Pillar 6** and finalize the framework at **5 Pillars (plus the General Pillar)**.

To solve the overlap between Pillar 2 (DNA) and Pillar 5 (Logic), we will sharpen Pillar 5 to focus exclusively on **Investment Logic**—how they decide what is worth their "Sacred Resource."

---

## **🏛️ Pillar 5: Decision-Making Framework (ROI Logic)**

### **Dimension 1: Success Metrics & North Stars**

*Focus: What is the specific "win condition" they optimize for?*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| primary\_north\_star\_metric\_name | Metric Phrasing | **\[Text\]** Capture the company’s exact phrasing (e.g., "Weekly Active Payers," "Cost per Remittance"). |
| primary\_success\_metric | The North Star | **\[Structured: Enum\]** revenue-velocity, efficiency-margin, user-growth, platform-reliability, strategic-moat. |
| time\_horizon | Planning Horizon | **\[Structured: Enum\]** short-term-quarterly, medium-term-yearly, long-term-multi-year. |
| tradeoff\_priority | The "Tie-Breaker" | **\[Structured: JSON\]** { "winner": string, "loser": string }. **Prompt:** Look for CEO quotes or product decisions where they explicitly sacrificed one value for another (e.g., "We will always choose Latency over Features"). |

---

### **Dimension 2: Rigor & Justification Style**

*Focus: How hard is the "Bar" for a new idea?*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| justification\_style | Business Case Style | **\[Structured: Enum\]** narrative-heavy, data-model-heavy, visionary-narrative, technical-feasibility-first. |
| rigor\_examples | Proof Patterns | **\[Text\]** Identify patterns in how they prove success. (e.g., "They always reference cohort analysis or multi-quarter experiment results in engineering blogs"). |
| required\_rigor | Rigor Level | **\[Structured: Scale 1-3\]** 1: Scrappy, 2: Balanced, 3: Extreme/Double-blind. |

---

### **Dimension 3: The Prioritization Filter (The "No" Factor)**

*Focus: Why do great ideas die here? (High Inference)*

| Key | Name | Rubric Prompt for AI Agent |
| :---- | :---- | :---- |
| rejection\_patterns | Common Veto Reasons | **\[Structured: List\]** Identify failure modes. (e.g., "Doesn't scale globally," "Off-brand," "Too operationally intensive"). |
| sacred\_resource | The Bottleneck | **\[Structured: Enum\]** engineering-cycles, marketing-budget, legal-clearance, founder-attention. |

---

## **🛡️ Strategic Boundary: Pillar 2 vs. Pillar 5**

To prevent Jules's agents from doing redundant work, we are strictly defining the "Scope" of extraction:

| Feature | Pillar 2: DNA (Identity) | Pillar 5: Logic (Investment) |
| :---- | :---- | :---- |
| **Question** | Who is this company at its core? | What is this company's ROI logic? |
| **Focus** | Power, Hierarchy, and Culture. | Metrics, Trade-offs, and Justification. |
| **Example** | "The CEO (ex-Sales) has final veto." | "They will only invest in things that move **NRR**." |

1. 

