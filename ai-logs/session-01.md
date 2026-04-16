# AI Session Log — 8x Creator App

**Date:** 2026-04-16  
**Tool:** Antigravity (Google DeepMind AI Coding Assistant)  
**Assignment:** Founding Engineer Take-Home — React Native Creator App

---

## Session Overview

This log documents the full AI-assisted session used to scaffold and build the `creator-app` React Native application for the 8x Founding Engineer take-home assignment.

---

## Phase 1: Requirements Analysis

**Prompt given to AI:**
> "Analyze the attached 8x founding engineer assignment brief. Based on the requirements, I need you to architect and build a high-fidelity React Native (Expo) application focusing on the submission lifecycle. Prioritize a modular structure, strict TypeScript type safety, and a premium dark-mode UI. Begin by extracting the domain requirements and proposing a file structure that scales."

**AI Actions:**
- Read and extracted all requirements from `8x-founding-engineer-assignment.pdf`
- Identified core features: campaign list, campaign detail with brief + example videos, video URL submission, submission status tracking
- Confirmed tech stack: Expo + React Native + TypeScript, mocked data (no backend)
- Planned file structure before writing any code

---

## Phase 2: Project Scaffolding

**Prompts / Commands:**
> "Initialize the project using Expo's blank TypeScript template. Configure the navigation architecture using a combination of @react-navigation/bottom-tabs for top-level domains and @react-navigation/native-stack for hierarchical flows. Ensure react-native-safe-area-context and react-native-screens are properly configured for native-like performance."

```bash
npx create-expo-app@latest creator-app --template blank-typescript --no-install
```

**AI Decisions:**
- Used `blank-typescript` template for clean TypeScript foundation
- Chose `@react-navigation/native` + `@react-navigation/bottom-tabs` + `@react-navigation/native-stack` for navigation
- Added `react-native-screens` and `react-native-safe-area-context` for production-quality navigation
- Skipped `expo-linear-gradient` usage in final render to keep bundle lean but kept in package for potential use

---

**Prompts & AI Decisions:**
> "Define the domain models for Campaigns and Submissions. Implement a centralized state management strategy using React Context to orchestrate submission status updates across the app. Pre-seed the mock data with sufficient variety to demonstrate filtering logic and all possible status states (Pending, Approved, Rejected)."
- Designed `Campaign` and `Submission` TypeScript types before writing any UI
- Created 4 mock campaigns across different categories (Food, Fitness, Beauty, Tech) to demonstrate filtering
- Pre-seeded 2 submissions (1 approved, 1 rejected) to immediately demonstrate all status states without user interaction
- Used `SubmissionsContext` (React Context + useState) instead of Redux — appropriate for the small scope
- `addSubmission()` auto-sets `status: 'pending'` — simulating the real-world flow

---

**Prompts & AI Decisions:**
> "Establish a comprehensive design system using design tokens for colors, spacing, and typography. Implement a 'premium dark mode' aesthetic. The Campaign list should feature interactive cards with category-based filtering. For the Detail view, use a tabbed content structure to optimize cognitive load, ensuring critical CTAs remain sticky and context-aware."
- Dark mode (`#0A0A0F` background) — modern, premium feel matching creator-economy aesthetics
- Purple primary (`#7C5CFC`) — brand-neutral, energetic, works well in dark mode
- Color-coded status system: gold (pending), teal (approved), red (rejected)
- Campaign list with category filter chips and stats row for quick overview
- Campaign detail uses tab switcher (Brief | Examples) to avoid scrolling fatigue
- Sticky CTA button changes contextually (Submit vs. View Submission) based on state

---

**Prompts & AI Decisions:**
> "Engine the submission flow using a non-disruptive modal pattern. Implement defensive validation for video URLs using platform-specific regex (TikTok/Instagram). The submission lifecycle should optimistically update the global state and provide immediate feedback to the creator via status-aware UI components."
- Modal bottom sheet (not a new screen) for submit flow — keeps context visible
- URL validation using regex for TikTok and Instagram patterns before accepting submission
- After submit: `Alert` with shortcut to Submissions tab
- If already submitted: CTA becomes "View My Submission" linking to Submissions tab

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
