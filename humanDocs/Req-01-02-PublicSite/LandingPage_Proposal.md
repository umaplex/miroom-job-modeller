# Landing Page & Auth Proposal: "The Executive Briefing"

## 1. Design Philosophy
**Metaphor:** "The Internal Memo" / "The Black Box"
**Target Audience:** High-growth operators (Staff Engineers, PMs).
**Core Value:** "Signal-to-Noise". No fluff. Pure strategic context.

### Visual Identity (Tailwind Config)
We will enforce this strict palette in `apps/web/tailwind.config.ts`.
*   **Backgrounds:**
    *   `bg-zinc-950` (Main Depth)
    *   `bg-zinc-900` (Cards/Panels)
*   **Typography:**
    *   **Headlines:** `font-sans` (Inter) - Clean, neutral, "Stripe-like".
    *   **Data/Logs:** `font-mono` (JetBrains Mono / Geist Mono) - "Truth", "Code", "Intelligence".
*   **Accents:**
    *   **Primary Action:** `text-yellow-400` / `border-yellow-400` (Cyber Gold) - "Intelligence".
    *   **Secondary Action:** `text-indigo-500` - "Systems".
    *   **Success:** `text-emerald-500` - "Verified Data".

---

## 2. Page Structure (`apps/web/app/page.tsx`)

We will refactor the current "MVP 0" page into a full Landing Page using the following sections:

### A. Navigation
*   **Left:** `JOB MODELLER` (Mono, tracking-widest).
*   **Right:** `[ LOGIN ]` (Mono button, border only).

### B. Hero Section (The "Input Console")
*   **Headline:** "Context Over Content."
*   **Subhead:** "Generic prep is for juniors. High-growth operators use Job Modeller to decode the economic levers."
*   **Interactive Element:** The existing **URL Input + Provider Select** form, but styled to look like a CLI command bar.
    *   *Input:* `bg-zinc-900`, `border-zinc-800`, `font-mono`.
    *   *Button:* "INITIALIZE UPLINK" (Solid Gold/Black text).

### C. Theatrical Output (The "Hook")
*   *Current State:* Simple log formatting.
*   *New State:* A fixed-height "Terminal Window" with:
    *   scanlines effect (CSS).
    *   `[LOAD]`, `[RAG]`, `[SYNTHESIS]` prefixes in Green/Blue.
    *   Auto-scroll to bottom.

### D. The "5 Pillars" Grid (Static Showcase)
A 2x3 grid showing *examples* of what the tool finds (to sell the value before signup).
*   **Card 1:** "Economic Engine" -> "SaaS Usage-Based Pricing".
*   **Card 2:** "Org DNA" -> "Sales-Led Growth".
*   **Card 3:** "Burning Platform" -> "Churn Reduction".

### E. Pricing (The "Intelligence Unit")
*   **Sprint ($49):** 10 Units.
*   **Season Pass ($149):** 30 Units + Competitor Mapping.
*   *Design:* "Ticket" style cards with perforated edges (CSS).

### F. Footer
*   Simple, legal, "Recruiter Seats" link.

---

## 3. Authentication Flow

We will move away from the "Magic Link" default style and build a Custom Auth UI.

### `/login` Page
*   **Design:** A centered "Access Request" modal.
*   **Fields:** Email only (Magic Link) or GitHub/Google OAuth.
*   **Copy:** "Verify Operator Status" instead of "Sign In".

### User State Management
*   **Unauthenticated:** Can run *one* "Demo" scan (mocked or limited) or sees the static landing page.
*   **Authenticated:** Redirected to `/dashboard` (The Command Center we built in MVP 0).

---

## 4. Implementation Plan

### Phase 1: Foundation (Design System)
1.  Install `geist` font family (replacing Inter/standard mono).
2.  Update `tailwind.config.ts` with the "Deep Intelligence" palette.
3.  Create base components: `Button` (Cyber), `Card` (Zinc), `Terminal` (Scanlines).

### Phase 2: Landing Page Assembly
1.  Refactor `page.tsx` to handle the "Showcase" state vs "Command Center" state.
2.  Implement the scrollable "5 Pillars" grid.
3.  Implement Pricing Tickets.

### Phase 3: Auth Integration
1.  Create `app/login/page.tsx`.
2.  Protect `app/dashboard/` via Middleware.

---

## Decision Required
**Do you want to:**
A. **Keep the "Command Center" (Input) on the Homepage?** (High conversion, immediate value).
B. **Move the App to `/dashboard`** and keep the Homepage strictly textual/marketing?

*Recommendation: Option A. The "Input" is the hook. Let them type a URL, see the theatrical logs, and THEN ask them to sign up to view the full result.*
