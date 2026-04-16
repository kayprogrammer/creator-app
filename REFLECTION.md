# Written Reflection — 8x Founding Engineer Take-Home

**Candidate:** [Your Name]  
**Date Submitted:** 2026-04-16  
**Actual Time Taken:** ~5 hours (including setup, implementation, testing, and writeup)

---

## What I Built

A React Native (Expo) creator app with four main capabilities:

1. **Campaign Discovery** — Efficiently browse active brand campaigns with category filtering, payout metrics, deadlines, and real-time inventory (spots left).
2. **Immersive Campaign Detail** — A high-conversion tabbed view optimized for creator cognitive load. Features deep-nested brief analysis and an integrated, full-screen portrait video player with TikTok-style interactions.
3. **Automated Submission Pipeline** — A non-disruptive bottom-sheet modal pattern with rigid platform-specific URL validation (TikTok/Instagram) and context-aware CTAs.
4. **Creator Dashboard & Persistence** — A unified status tracking view with color-coded status badges, feedback cycles, and earnings summaries. The entire application state is backed by **AsyncStorage persistence**, ensuring user work survives app restarts and browser refreshes.

---

## Difficulty

**Medium.** The core navigation and data flow were straightforward. The trickier parts were:

- **Context-aware CTAs** — the campaign detail screen needed to know if a submission already existed for that campaign and dynamically swap the button behaviour. This required wiring the submissions context lookup directly into the detail screen.
- **URL validation** — I wanted proper regex validation for TikTok and Instagram URL formats, not just a "starts with https" check. This required thinking about the actual URL patterns for both platforms (including `/reel/` vs `/p/` for Instagram).
- **Tab switching with content parity** — keeping the Brief and Examples tabs visually consistent without a shared scroll context was a small challenge in layout design.

---

- **Video preview thumbnails** — Scrape OG metadata from TikTok/Instagram URLs or leverage oEmbed APIs to provide rich visual previews during the submission stage.
- **Push Notification Lifecycle** — Implement real-time notifications via Expo Notifications/FCM to inform creators immediately when submission statuses transition.
- **Animated Skeleton Loaders** — Enhance the 'Perceived Performance' during data fetching states using `moti` or standard layout animations.
- **Haptic Feedback API** — Integrate `expo-haptics` to provide tactile confirmation for high-stakes actions like submission confirmation.

---

## AI-Assisted Engineering Process

To meet the 48-hour deadline while maintaining high engineering standards, I utilized **Claude 3.5 Sonnet + Gemini 1.5 Pro via Antigravity** as a high-velocity multi-model pair programming suite. My approach was to act as the **System Architect**, delegating the implementation of well-defined components while retaining full control over the structural integrity and domain logic.

**Strategic Delegation (AI):**
- **Boilerplate & Scaffolding:** Rapid generation of initial Expo project structure and navigation shells.
- **UI Implementation:** Translation of design tokens into consistent React Native StyleSheets across all views.
- **Type Definitions:** Generation of comprehensive TypeScript interfaces based on the domain model I defined.

**Core Engineering Decisions (Manual):**
- **State Architecture:** Opted for a `SubmissionsProvider` using React Context over Redux/Zustand to maintain a lean bundle while ensuring consistent state across the parallel Campaign and Submission domains.
- **Domain Modeling:** Designed the Campaign and Submission schemas to be API-ready, ensuring a seamless transition from mocked data to a live backend.
- **Product UX:** Engineered the "Context-Aware CTA" system that dynamically adjusts campaign detail actions based on real-time submission status.
- **Defensive Logic:** Implemented rigid regex-based URL validation for TikTok/Instagram domains to ensure data integrity at the edge.

All code generated was subjected to rigorous manual review and refactored to align with clean code principles. This session demonstrated the "Founding Engineer + AI" multiplier: achieving production-grade output in a fraction of the traditional build time.

---

## Process

1. Read the brief carefully — re-read twice
2. Designed the data model (types first, implementation second)
3. Set up React Context for global submissions state
4. Built screens from outer shell inward (navigation → list → detail → modal → status)
5. Tested all 3 submission status states manually (pre-seeded + live submit)
6. Reviewed URL validation edge cases
7. Wrote this reflection and AI logs

---

## 📱 Review & Deployment

For a production-fidelity evaluation:
- **Environment**: I highly recommend reviewing the application in a **mobile viewport** (e.g., Chrome Device Mode or physical mobile device). The UI/UX architecture is optimized for 390x844 dimensions.

## Final Notes

My objective was to deliver a product that balances authenticity with high-velocity polish. The application is feature-complete according to the brief, emphasizing a "Native-First" experience. The dark/premium aesthetic was a deliberate choice to align with the high-end creator economy platforms that 8x interacts with.

I approached this as a "Founding Engineer" would: designing the data model and state flow to be API-ready, ensuring that replacing the mock layer with a live backend would require minimal architectural refactoring.
