This is a critical pivot. To make the **Job Modeller** a $100k revenue platform, we cannot store this data as "flat text" or "blobs of markdown." If we do, we lose the ability to compare companies, generate automated "Blindspot" reports, or feed the data into our **Persona Architect** (MVP 2).

We need a **Highly Structured Schema** that treats "Observations" as first-class citizens.

---

## **🏗️ The Proposed Data Model (for Jules)**

Instead of one big text box, we use a relational structure that captures the **Dimension $\\rightarrow$ Field $\\rightarrow$ Observation** hierarchy. This allows us to track the *Evidence* (citations) for every single field.

### **1\. The Metadata Layer (Static)**

These tables define "The Rubric."

* **pillar\_definitions**: (e.g., Economic Engine).  
* **dimension\_definitions**: (e.g., GTM Architecture, Pricing Power).  
* **field\_definitions**: (e.g., primary\_revenue\_model, billable\_unit).  
  * *Fields include: key, name, description, data\_type (Enum/String/Int), and rubric\_prompt (The specific instruction for the AI).*

### **2\. The Organizational Instance Layer (Dynamic)**

This is where the actual "Dossier" lives. **We do not store this as Markdown.** We store it as structured rows.

Table: org\_field\_observations

| Field | Type | Description |

| :--- | :--- | :--- |

| id | UUID | Primary Key. |

| org\_id | UUID | Foreign Key to organizations. |

| field\_id | UUID | Foreign Key to field\_definitions. |

| structured\_value | JSONB | The "Final Answer" (e.g., {"value": "PLG", "confidence": 0.9}). |

| analysis\_markdown| Text | The "Human-readable" explanation/narrative of this specific field. |

| evidence\_nodes | JSONB | An array of quotes and URLs that prove this value. |

---

## **🖋️ How do we capture the "Narrative"?**

While the *data* is structured, the *user* needs to read it. **Yes, we use Markdown for the analysis\_markdown field within each Observation.**

**Why this Hybrid Approach?**

1. **The Machine (AI):** Uses the structured\_value to build the Practice Map and Personas.  
2. **The Human (User):** Reads the analysis\_markdown to get the "Director-level" nuance.

### **Example Observation Record (Internal View):**

JSON

{

  "field\_key": "gtm\_motion",

  "structured\_value": "Hybrid (Sales-led \+ PLG)",

  "analysis\_markdown": "PagerDuty is currently in a \*\*transitional state\*\*. While their heritage is self-serve, they are aggressively pushing an 'Enterprise-first' agenda. This creates an internal tension between 'Velocity' and 'Compliance'.",

  "evidence\_nodes": \[

    { "quote": "Our Enterprise segment grew 40%...", "source": "Q3 2025 Earnings Transcript" }

  \]

}

---

## **🛠️ Updated Implementation Strategy for Jules**

Jules should update the DB to support this **Entity-Attribute-Value (EAV) with Evidence** model.

### **The "Prep Thinking" to DB Flow:**

1. **Agent Logic:** The AI Agent iterates through the field\_definitions.  
2. **Research:** It fetches raw data and synthesizes an answer for *one field at a time*.  
3. **Capture:** It writes to org\_field\_observations.  
4. **Assembly:** The Frontend (via A2UI) queries all observations for a specific Org \+ Pillar and assembles them into the beautiful dashboard we discussed.

---

## **🚀 Why this is the $100k Choice**

If we use Markdown for the *whole* pillar, we are just a "Note-taking app." With this structured model:

* **Feature A:** "Show me all Series B companies that are currently pivoting from Seat to Usage pricing." (Impossible with Markdown, Easy with this DB).  
* **Feature B:** "Generate a Practice Question specifically for this field's weakness." (Requires structured data).

### **Next Step for Jules:**

I recommend Jules initializes the **field\_definitions** table and the **org\_field\_observations** table. This is the foundation of the "Core Engine."

**Would you like me to finalize the full Field List (Keys and Names) for the 5 Pillars so Jules can seed the database?**

