# Countdown App — Build Plan

## What We're Building

A personal countdown tracker web app (PWA) for one user: Yiming. Installable on iPhone home screen. No backend needed — all data stored in localStorage. Deployed free on Vercel.

## User

Solo personal use. No auth, no multi-user. Yiming tracks personal life milestones.

## Features (MVP)

### 1. Countdown Management
- Create, edit, delete countdowns
- Manual drag-to-reorder (rank)
- Each countdown has: icon (emoji picker), name (text), color (color picker), target datetime

### 2. Display
- All countdowns shown as days remaining (never "3 months" — always "94 days")
- Negative days shown for past events ("3 days ago")
- Cards sorted by user rank (drag order persisted)
- Search/filter bar to find countdown by name

### 3. Daily Reward System
- On app open: check localStorage for last-open date
- If first open within a new 24h window: award $1 virtual credit
- Show encouraging life-coach phrase (rotating set of ~20 phrases)
- Running total displayed ("You've earned $47 by showing up")

### 4. Design
- Clean, minimal, classy aesthetic (not pastel-kiddy, not dark hacker)
- Mobile-first, works on iPhone Safari
- PWA manifest for "Add to Home Screen"
- Smooth animations on card interactions

## Tech Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v3
- **State:** React useState + useEffect (no Redux needed at this scale)
- **Storage:** localStorage (JSON serialization)
- **Drag & drop:** @dnd-kit/core (accessible, mobile-friendly)
- **Icons:** Emoji native (no icon library needed)
- **Deploy:** Vercel (free tier)
- **PWA:** vite-plugin-pwa

## File Structure

```
countdown-app/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── public/
│   └── manifest.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── CountdownCard.jsx
    │   ├── CountdownForm.jsx
    │   ├── DailyReward.jsx
    │   ├── SearchBar.jsx
    │   └── EmojiPicker.jsx
    ├── hooks/
    │   ├── useCountdowns.js
    │   └── useDailyReward.js
    └── utils/
        ├── storage.js
        ├── dateUtils.js
        └── phrases.js
```

## Data Model

```js
// Countdown object
{
  id: "uuid-v4",
  name: "Trip to Japan",
  icon: "✈️",
  color: "#6366f1",
  targetDate: "2026-03-15T00:00:00",
  rank: 0,
  createdAt: "2025-05-30T10:00:00"
}

// Daily reward state
{
  totalEarned: 47,
  lastOpenDate: "2025-05-30"
}
```

## Key Logic

### Days Calculation
```js
const daysUntil = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
// Positive = future, Negative = past, 0 = today
```

### Daily Reward Check
```js
const checkDailyReward = () => {
  const today = new Date().toDateString();
  const lastOpen = localStorage.getItem('lastOpenDate');
  if (lastOpen !== today) {
    localStorage.setItem('lastOpenDate', today);
    return true; // award $1
  }
  return false;
};
```

## Effort Estimate

| Task | CC Time |
|------|---------|
| Project scaffold (Vite + Tailwind + PWA) | 5 min |
| Data model + localStorage hooks | 10 min |
| Countdown CRUD + form | 15 min |
| Card display + days calc | 10 min |
| Drag-to-reorder | 10 min |
| Daily reward system | 10 min |
| Search/filter | 5 min |
| Polish + animations | 10 min |
| Vercel deploy | 5 min |
| **Total** | **~80 min** |

## Out of Scope (v1)

- Cloud sync / backup
- Notifications / reminders
- Sharing countdowns
- Recurring events
- Multiple users / auth
- Native iOS app (App Store)

## Success Criteria

- Opens on iPhone Safari, can be added to home screen
- All 5 MVP features work
- Looks clean enough that Yiming wants to use it daily
- Daily reward triggers correctly on first open each day
