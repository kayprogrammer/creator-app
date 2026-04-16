# Written Reflection — 8x Founding Engineer Take-Home

**Candidate:** [Your Name]  
**Date Submitted:** 2026-04-16  
**Actual Time Taken:** ~5 hours (including setup, implementation, testing, and writeup)

---

## What I Built

A React Native (Expo) creator app with four main capabilities:

1. **Campaign List** — browse available brand campaigns with category filtering, payout, deadline, and spots-left indicators
2. **Campaign Detail** — tabbed view of the full brief (requirements, instructions) and example videos with thumbnail previews; opens videos in-browser via deep links
3. **Submit a Video** — bottom sheet modal with TikTok/Instagram URL validation, status-aware CTA (changes from "Submit" to "View Submission" after submitting)
4. **Submission Status** — dedicated screen showing all submissions with status badges (Pending ⏳ / Approved ✅ / Rejected ❌), brand feedback, and total earnings summary

---

## Difficulty

**Medium.** The core navigation and data flow were straightforward. The trickier parts were:

- **Context-aware CTAs** — the campaign detail screen needed to know if a submission already existed for that campaign and dynamically swap the button behaviour. This required wiring the submissions context lookup directly into the detail screen.
- **URL validation** — I wanted proper regex validation for TikTok and Instagram URL formats, not just a "starts with https" check. This required thinking about the actual URL patterns for both platforms (including `/reel/` vs `/p/` for Instagram).
- **Tab switching with content parity** — keeping the Brief and Examples tabs visually consistent without a shared scroll context was a small challenge in layout design.

---

## What I'd Add With More Time

- **Optimistic UI updates** — submission status could be polled or use websockets to update in real time
- **Local persistence** — use `expo-sqlite` or `AsyncStorage` to persist submissions across app restarts
- **Video preview thumbnails** — scrape OG image from TikTok/Instagram URL (or use their oEmbed APIs) to show an actual video thumbnail
- **Push notifications** — notify creators when their submission status changes
- **Pull-to-refresh** on the submissions list
- **Animated skeleton loaders** while data "loads" (even if mocked)
- **Haptic feedback** on submission confirmation using `expo-haptics`

---

## AI-Assisted Engineering Process

To meet the 48-hour deadline while maintaining high engineering standards, I utilized **Antigravity** (Google DeepMind's AI assistant) as a high-velocity pair programmer. My approach was to act as the **System Architect**, delegating the implementation of well-defined components while retaining full control over the structural integrity and domain logic.

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

## Final Notes

The brief asked for authenticity over polish — I tried to balance both. The app is fully functional for all four required features. The design is dark/premium because that aesthetic matches the creator economy platforms the brands are publishing on.

I enjoyed the constraint of mocked data — it forced me to design the state flow as if a real API existed, rather than hacking around it.
