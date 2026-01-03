# MVP 1 Part 1: Org Dossier Engine - Assessment & Implementation Spec

## Assessment & Feedback

### 1. Architecture Complexity
*   **State Machine:** The transition from `PREP_INITIALIZED` -> `RESEARCHING` -> `COMPLETED` is central. We need robust handling for failures (e.g., Search API down).
*   **Async Workers:** The specification implies background processing. For MVP 1, we will use **FastAPI Background Tasks** to keep infrastructure simple (avoiding Redis/Celery complexity for now) while ensuring non-blocking UI.
*   **Normalization:** The "URL -> Name" resolution checks are critical. We will implement a lightweight LLM step (`utils/normalization.py`) for this.

### 2. Database Design
*   The proposed schema is solid.
*   **Feedback:** We should add a `user_roles` table or column (Admin vs User) early to support the "Admin Control Panel" requirements securely.
*   **Feedback:** For `user_favorites`, adding `last_visited_at` is confirmed as a requirement for the "Recents" feature.

### 3. "Applied AI" Logic
*   **Workflow Config:** Storing the "Instruction Set" in JSON is excellent for iterating on prompts without code deploys.
*   **Version Control:** We will implement the `version` column in `pillar_definitions` immediately to future-proof the "Smart Refresh" feature.

---

## Technical Implementation Spec

### Phase 1: Database Foundation
#### [NEW] Migration: `packages/db/supabase/migrations/<timestamp>_mvp1_org_dossier.sql`
*   Create `pillar_definitions` (Metadata, Versioning, Rubric).
*   Create `organizations` (Core Identity, Status Enum).
*   Create `org_pillar_status` (Tracking pillar-level progress).
*   Create `org_pillar_data` (The content blob).
*   Create `prep_logs` (Telemetry).
*   Create `user_favorites` & `user_added_orgs` (Relationships).

### Phase 2: Backend Logic (FastAPI)
#### [NEW] `apps/backend/services/org_service.py`
*   `normalize_org(url)`: Uses LLM to extract "PagerDuty Inc" from URL.
*   `get_or_create_org(domain)`: Handles deduplication.

#### [NEW] `apps/backend/services/prep_engine.py`
*   `trigger_prep_workflow(org_id)`: The "Orchestrator".
*   `execute_pillar_worker(pillar_id, workflow_config)`: The "Worker" (FastAPI Background Task).

#### [MODIFY] `apps/backend/main.py`
*   Add endpoints: 
    *   `POST /orgs/ingest` (Start prep)
    *   `GET /orgs/{id}/status` (Poll progress)
    *   `GET /orgs/recents` (Fetch top 5 visited)
    *   `GET /orgs/search` (Global search)

---

## Frontend Architecture: Logged In Experience

### 1. Global Navigation (The "Hud")
A persistent Top Navigation Bar present on all authenticated pages.
*   **Left:** "JOB MODELLER" Wordmark (Click $\rightarrow$ Dashboard).
*   **Center:** **Omni-Search Bar**.
    *   *Behavior:* As user types, it searches `organizations`.
    *   *Results:* Dropdown showing "Jump to [Company]" or "Add [Input] as new Target".
*   **Right:** User Profile (Avatar/Email) $\rightarrow$ Dropdown (Settings, Sign Out).
*   **Theme:** Dark Charcoal/Glassmorphism (`bg-zinc-950/80 backend-blur`).

### 2. The Command Center (Dashboard Page)
The `/dashboard` route serves as the entry point.

#### Section A: System Pulse (Hero)
*   **Visual:** Minimalist metric cards.
*   **Data:**
    *   "Global Index": Total Orgs tracked by system.
    *   "Fresh Intelligence": Number of pillars updated in last 24h.
    *   "My Targets": Count of user's favorites.

#### Section B: The "Recents" Rail
*   **Layout:** A horizontal scrolling list of **Org Cards**.
*   **Content:** The last 5 organizations the user interacted with.
*   **Empty State:** If 0 recents, show "Recommended / Trending" or a "Start your first search" prompt.

#### Section C: Library / Watchlist
*   **Layout:** A sortable Grid/Table of `user_favorites`.
*   **Columns/Cards:** Company Name, Status (Ready/Prep), Last Updated, "Context Score" (Pillars completed).
*   **Filter:** "Show all" vs "Created by me".

### 3. Org Dossier View (Page Layout)
When clicking an Org Card (`/org/[id]`):
*   **Header:** Large Organization Title, Domain, and "Refresh" Action.
*   **Pillar Tabs:** A sticky sub-nav below the header:
    *   `[01 Eco Engine] [02 Org DNA] [03 Burning Platform] ...`
    *   *Visuals:* Tabs glow or show a "Lock" icon based on Tier/Status.
*   **Content Area:** Renders the JSON content of the selected pillar.

---

## User Approval
> [!IMPORTANT]
> **Async Strategy:** We will use **FastAPI Background Tasks**.
> **Latency:** User accepted synchronous normalization lag (~1-2s).
