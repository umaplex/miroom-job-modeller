# Functional Specification: Job Modeller MVP 0 (Foundation)

**Goal:** Establish the connectivity backbone. A user can log in, paste a URL, and see the system "acknowledge" and "start" a job, even if the intelligence is mocked or basic. Focus on the **Async State Loop**.

## 1. User Authentication & Profile
**Requirements:**
*   **Sign Up / Login:** Email/Password via Supabase Auth.
*   **User Profile:**
    *   Basic details: Name, Email.
    *   Subscription Status: Default "Free" (or "Unsubscribed").
    *   Intelligence Units: Display a balance (Mock strictly for MVP 0).
    *   **Plan History:** System must actively track current plan assignment and keep a history of past plan changes (User Activity Tracking).

**User Flow:**
1.  User lands on Splash Page.
2.  Clicks "Get Access".
3.  Completes Auth.
4.  Redirected to "Command Center" (Dashboard).

## 2. The "Command Center" (Dashboard)
**Requirements:**
*   **Empty State:** Clear CTA to "Start a New Dossier."
*   **Input Mechanism:**
    *   Field: "Company Domain" or "Job Description URL" (e.g., `alembic.com` or LinkedIn URL).
    *   Action Button: "Build Dossier."
*   **Job List:** Display of previously requested dossiers (Name, Date, Status).

**User Flow:**
1.  User enters `https://jobs.lever.co/alembic/...`.
2.  System validates URL format.
3.  System creates a "Job Card" in "Pending" state.
4.  UI switches to "Live Thinking" view (Theatrical UI).

## 3. The "Theatrical" Research UI (The Hook)
**Requirements:**
*   **Real-Time Feedback:** A log component that polls (or receives SSE) updates from the backend.
    *   *Examples:* "Connecting to Tavily...", "Found Investor Deck 2025...", "Analyzing Economic Model...".
*   **State Management:**
    *   `QUEUED` -> `RESEARCHING` -> `SYNTHESIZING` -> `COMPLETED`.
*   **Time-to-Value:** For MVP 0, this can be a 10-second mock delay to simulate work.

**User Flow:**
1.  User watches the "Terminal-like" log lines appear.
2.  Progress bar moves from 0% to 100%.
3.  On completion, "View Dossier" button becomes active.

## 4. The Dossier View (Placeholder)
**Requirements:**
*   **Header:** Company Name, "Context Freshness" Timestamp.
*   **5 Pillars Tabs:**
    *   Economic Engine
    *   Org DNA
    *   Burning Platform
    *   Domain Lexicon
    *   Decision Framework
*   **Content:** For MVP 0, this can be static placeholder text or a very simple "About Us" scrape result.

## 5. Billing Primitive (Stripe Integration)
**Requirements:**
*   **Upgrade Toggle:** A button to "Unlock Full Intelligence" (simulated or test-mode Stripe).
*   **Gating:**
    *   Free User: Sees "Blurry" Pillars 2-5. only sees Pillar 1 (Economic Engine).
    *   Paid User: Sees all Pillars.

## 6. System Administration (Backend)
**Requirements:**
*   **Audit Log:** Record every URL submission.
*   **User Management:** Admin view to see who signed up.

## MVP 0 Success Criteria
*   [ ] User can Create Account.
*   [ ] User can Submit URL.
*   [ ] Frontend displays "Thinking" logs from Backend.
*   [ ] Database stores the Org/Job entry.
*   [ ] "Dossier View" renders (even with dummy data).
*   [ ] System tracks User Plan status and history of changes.
