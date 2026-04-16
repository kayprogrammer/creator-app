# AI Session Log — 8x Creator App

**Date:** 2026-04-16  
**Tool:** Claude 3.5 Sonnet + Gemini 1.5 Pro via Antigravity (Multi-Model AI Suite)  
**Assignment:** Founding Engineer Take-Home — React Native Creator App

---

## Session Overview

This log documents the full AI-assisted session used to scaffold and build the `creator-app` React Native application for the 8x Founding Engineer take-home assignment.

---

## Phase 1: Requirements Analysis & Architecture Design

**Prompt given to AI:**
> "Conduct a first-principles analysis of the 8x founding engineer assignment specification. I need to deliver a high-fidelity, submission-centric React Native (Expo) application. Extract the core domain requirements and propose a scalable directory architecture. Prioritize strict TypeScript type safety, a modular design pattern for easy extensibility, and a premium 'dark-mode' aesthetic. Your proposal should lay the foundation for a production-grade submission lifecycle."

**AI Actions:**
- Extracted domain entities: `Campaign`, `Submission`, `BrandBrief`, `Feedback`.
- Identified core flows: Filtered discovery, deep-nested brief analysis, URL-validated submission pipeline, and post-submission lifecycle tracking.
- Proposed a feature-first project structure to ensure clear separation of concerns.

---

## Phase 2: Core Engineering & Framework Setup

**Prompts / Commands:**
> "Initialize a clean Expo environment using the TypeScript template. Architect the navigation topology using a nested strategy: a `BottomTabNavigator` for primary domains (Discovery, Portfolio) and a `NativeStackNavigator` for detail-rich hierarchical flows. Ensure the integration of native performance primitives like `react-native-screens` and strict safe-area management."

```bash
npx create-expo-app@latest creator-app --template blank-typescript --no-install
```

**AI Decisions:**
- Optimized navigation for native feel and performance.
- Configured safe-area boundaries to ensure UI integrity across modern 'notched' devices.

---

**Prompts & AI Decisions:**
> "Formalize the domain layer by defining exhaustive TypeScript interfaces for Campaigns and Submissions. Implement a robust global state management solution using React Context to synchronize sub-second status updates across the discovery and submission domains. Seed the persistence layer with variegated mock data to demonstrate all status transitions: Pending (Ingestion), Approved (Validated), and Rejected (Flagged)."
- Enforced type-safety across the data layer.
- Implemented `SubmissionsContext` for lightweight, efficient state orchestration.
- Created diverse pre-seeded data to showcase full app state coverage.

---

**Prompts & AI Decisions:**
> "Design a premium UI system based on atomic design tokens. Implement a high-contrast dark-mode aesthetic utilizing HSL-tailored color palettes. For the discovery view, engineer a filter-chip system for category indexing. For the detail view, implement a tabbed interface to manage cognitive load, ensuring that the primary Call to Action (CTA) is sticky and dynamically aware of the submission state."
- Established a consistent design language (Tokens) for immediate visual polish.
- Engineered contextual CTA logic that transitions from 'Submit' to 'Review' based on user state.

---

**Prompts & AI Decisions:**
> "Develop the submission pipeline using an non-intrusive modal pattern. Implement defensive validation logic for content URLs using regular expressions for TikTok and Instagram Reel identifiers. The lifecycle should include optimistic state updates to ensure a zero-latency feedback loop for the creator."
- Built a validation engine to ensure data integrity at the edge.
- Optimized for 'Perceived Performance' via optimistic state transitions.

---

## Phase 6: Key Technical Choices

| Decision | Rationale |
|---|---|
| React Context over Redux | Appropriate scope, less boilerplate |
| Bottom tabs + stack | Natural navigation pattern for mobile creator tools |
| Regex URL validation | Prevent junk data, matches TikTok/Instagram URL patterns |
| Pre-seeded submissions | Immediately demonstrates all 3 status states on first launch |
| `picsum.photos` thumbnails | Realistic placeholder images without needing asset pipeline |
| Emoji brand logos | Keeps mock data visually interesting without image assets |

---

## Approximate Token / Prompt Usage

| Phase | Prompts | Approximate Output |
|---|---|---|
| Requirements analysis | 1 | PDF content extraction |
| Architecture decisions | (internal reasoning) | File structure plan |
| Data/types | 1 file generation | ~120 lines |
| Context | 1 file generation | ~45 lines |
| Theme tokens | 1 file generation | ~50 lines |
| CampaignList screen | 1 file generation | ~280 lines |
| CampaignDetail screen | 1 file generation | ~420 lines |
| Submissions screen | 1 file generation | ~250 lines |
| Navigation | 2 file generations | ~120 lines |
| App.tsx | 1 file generation | ~25 lines |

**Total generated code:** ~1,310+ lines across 9 source files

---

## What I Would Do Differently Without AI

- Would take ~4–5 hours manually
- Would write less comprehensive TypeScript types
- Would likely use simpler navigation (no proper stack + tabs combo)
- Brief tab parsing would be simpler (no markdown-like rendering)

## What AI Did Well

- Kept consistent design system (tokens) across all files
- Maintained full TypeScript typing throughout
- Pre-seeded data to showcase all app states immediately
- URL validation regex was production-appropriate, not just a length check
- Designed for real UX patterns (sticky CTAs, contextual button labels, badge counts)
