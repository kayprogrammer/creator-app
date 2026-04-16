# Creator App — 8x Founding Engineer Take-Home

A React Native (Expo) app for creators to browse brand campaigns, read briefs, watch example videos, submit their video URLs, and track the review status of their submissions.

## Features

- 📋 **Campaign List** — browse campaigns with category filters, payout, deadline, spots left
- 🎬 **Campaign Detail** — tabbed brief/examples view, requirements list, example video thumbnails
- 🔗 **Submit a Video** — TikTok/Instagram URL validation, bottom-sheet submission modal
- 📊 **Submission Status** — pending / approved / rejected with brand feedback + earnings summary

## Tech Stack

- [Expo](https://expo.dev/) ~54 + React Native 0.81
- TypeScript
- React Navigation (Native Stack + Bottom Tabs)
- React Context for global state
- Fully mocked data (no backend required)

## Getting Started

```bash
cd creator-app
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android, or `w` for web.

## Project Structure

```
creator-app/
├── App.tsx                    # Root with providers
├── src/
│   ├── data/
│   │   └── campaigns.ts       # Mocked campaigns + submissions
│   ├── context/
│   │   └── SubmissionsContext.tsx
│   ├── theme/
│   │   └── tokens.ts          # Design system tokens
│   ├── navigation/
│   │   ├── types.ts
│   │   └── AppNavigator.tsx
│   └── screens/
│       ├── CampaignListScreen.tsx
│       ├── CampaignDetailScreen.tsx
│       └── SubmissionsScreen.tsx
├── ai-logs/
│   └── session-01.md          # Full AI session log
└── REFLECTION.md              # Written reflection
```

## Submission Status States

The app pre-seeds two submissions so all three status states are immediately visible on first launch:
- ✅ **Approved** — Loom Coffee Co. submission
- ❌ **Rejected** — Aether Skincare submission (with feedback)
- ⏳ **Pending** — any new submission you make

## Notes

- All data is mocked in `src/data/campaigns.ts`
- Video URL submission validates TikTok and Instagram Reel URL formats
- State is held in React Context and resets on app restart (intentional, no backend)
