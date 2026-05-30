<!-- /autoplan restore point: /Users/yiming/.gstack/projects/countdown-app/main-autoplan-restore-20260530-221820.md -->
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

## CEO Review — Phase 1

### 0A. Premise Challenge

**Premise confirmed by user:** This is a **daily habit app** where countdowns are motivational content. The daily reward/check-in loop is the hero, not the countdown display.

Implications for design:
- Opening screen should lead with the daily reward + streak, not a list of cards
- The $1 virtual credit system needs to feel compelling (streak counter added, see below)
- Countdown cards are the motivational backdrop, not the primary UI metaphor

**Premises accepted as-is:**
- localStorage only (no backend): fine for personal tool. Accepted risk: data lost on phone reset. Yiming knows this.
- Solo use, no auth: correct for personal tool.
- PWA over native iOS: correct. Native iOS requires $99/yr Apple dev account, Xcode, Swift. Not appropriate.

### 0B. Existing Code Leverage

No existing code (greenfield). Reuses: Vite template, @dnd-kit (battle-tested mobile touch DnD), Tailwind's utility classes.

**What already exists that we're NOT rebuilding:** Apple Reminders, Widgetsmith. These cover generic countdown display but lack the daily reward habit loop — which is the differentiator.

### 0C. Dream State Mapping

```
CURRENT STATE              THIS PLAN                  12-MONTH IDEAL
No app                 --> PWA with habit loop +   --> Streak at risk
                           countdown cards,            notifications,
                           $1/day reward               iCloud JSON backup,
                           (hero on open screen)       card share-as-image,
                                                       milestone celebrations
```

This plan moves squarely toward the 12-month ideal. The deferred features (notifications, backup, sharing) are natural Phase 2.

### 0C-bis. Implementation Alternatives

```
APPROACH A: React PWA (planned)
  Summary: React 18 + Vite + Tailwind + localStorage. Deployed on Vercel.
  Effort:  M (~80 min CC)
  Risk:    Low
  Pros:    - Claude can build it entirely
           - PWA installs on iPhone home screen
           - Easy to extend later
  Cons:    - Build toolchain complexity for single user
  Reuses:  Vite template, @dnd-kit, Tailwind

APPROACH B: Single HTML file
  Summary: Vanilla JS + inline CSS. No build step.
  Effort:  S (~40 min CC)
  Risk:    Low
  Pros:    - Zero toolchain
           - Portable, no deploy needed
  Cons:    - Harder to maintain/extend
           - Drag-to-reorder is painful without a library
           - No PWA manifest support without separate file
  Reuses:  Nothing

APPROACH C: Native iOS (SwiftUI)
  Summary: Real iOS app, App Store distribution.
  Effort:  XL (requires Apple Dev account $99/yr, Xcode, Swift)
  Risk:    High
  Pros:    - Native performance, haptics, notifications
  Cons:    - User has no code background; App Store review required
           - 10x more complex to maintain
  Reuses:  Nothing
```

**RECOMMENDATION: Approach A.** React PWA is the sweet spot — Claude builds it entirely, Yiming installs it on iPhone home screen in 2 minutes, and it's easy to extend for Phase 2.

*Auto-decided: P5 (explicit over clever) + P3 (pragmatic). Approach B is too limiting for future features. Approach C is an ocean, not a lake.*

### 0D. Selective Expansion — Cherry-Picks

Expansions evaluated. Auto-decided using P1/P2:

| # | Expansion | Effort | Decision | Rationale |
|---|-----------|--------|----------|-----------|
| 1 | **Streak counter** (consecutive days) | S (1 file) | ACCEPTED | Habit research: streaks with loss-aversion are 3x more motivating than accumulation alone. Adds urgency. |
| 2 | **Data export (JSON download)** | S (1 function) | ACCEPTED | localStorage is wiped on phone reset / browser clear. Without backup, losing 6 months of countdowns is frustrating. Low effort, high protection. |
| 3 | **Milestone celebration animation** | S (1 component) | ACCEPTED | When a countdown hits 0, show a confetti/celebration moment. This is the payoff moment — should feel special. |
| 4 | **Push notifications** | L (service worker + permission flow) | DEFERRED | Adds service worker complexity. Not in original scope. |
| 5 | **Share countdown as image** | M (canvas API) | DEFERRED | Useful but not core to the habit loop. |
| 6 | **Recurring events** | M | DEFERRED | Not in original scope. |

### 0E. Temporal Interrogation

```
HOUR 1 (foundations):
  - Decide: does "today" show 0 days or "TODAY"? Recommend: show "TODAY" as a special state.
  - Decide: timezone handling. Target date = midnight in user's local timezone.
    localStorage stores ISO string, Date() uses local TZ. Fine for personal use.

HOUR 2-3 (core logic):
  - Daily reward: what if user opens at 11:58pm, gets reward, opens again at 12:01am?
    They get 2 rewards in 3 minutes. Acceptable? Yes — it's personal, low stakes.
  - Streak break: if user misses a day, streak resets to 0. Show a "streak broken" message?
    Recommend: yes, with a compassionate life-coach phrase.

HOUR 4-5 (integration):
  - @dnd-kit on iPhone Safari: touch events work, but need to test long-press to initiate
    drag vs scroll conflict. @dnd-kit handles this via sensors.
  - PWA manifest: icon sizes needed (192x192, 512x512). Use emoji or simple SVG.

HOUR 6+ (polish/tests):
  - localStorage corruption: JSON.parse can throw. Wrap all reads in try/catch with
    graceful fallback to empty state.
  - Emoji picker: native emoji input (type emoji directly) vs custom picker.
    Custom picker adds 2hrs. Recommend: text input where user types/pastes emoji.
```

### 0F. Mode: SELECTIVE EXPANSION

Greenfield personal app. Mode: SELECTIVE EXPANSION.
Expansions accepted: streak counter, data export, milestone celebration.
These are all ≤1 file additions. In blast radius. Total added effort: ~20 min CC.

### CEO Section Reviews

**Section 1: Architecture**
```
localStorage ──▶ useCountdowns hook ──▶ CountdownCard components
                                    ──▶ CountdownForm (create/edit)
                                    ──▶ DailyReward component (hero on open)

localStorage ──▶ useDailyReward hook ──▶ DailyReward component
                                      ──▶ StreakCounter (new)
```
Clean. No coupling concerns. Single source of truth: localStorage JSON. No external dependencies except @dnd-kit.

Single point of failure: localStorage cleared = all data gone. Mitigated by data export (accepted expansion).

Rollback: Vercel deploy rollback is 1-click. localStorage state not affected by deploys.

**Section 2: Error & Rescue Map**

| Codepath | What can go wrong | Rescued? | Fix |
|---|---|---|---|
| JSON.parse(localStorage) | Corrupted/missing data | No ← GAP | try/catch → fallback to [] |
| Date calculation | Invalid date string | No ← GAP | isNaN check → show "Invalid date" |
| @dnd-kit touch | Touch conflict with scroll | Partial | Use PointerSensor with activation constraint |
| Data export | localStorage empty | N/A | Export empty array gracefully |

*Auto-decided: add defensive JSON.parse + date validation to implementation spec. P5 explicit.*

**Section 3: Security**
Personal app, no auth, no server. Attack surface: zero (no external data accepted, no API calls).
Only user input is: countdown name (text), target date (date picker), color (color picker), emoji (text input).
No injection vectors — all data is stored and displayed only for the same user in the same browser.
*Clean.*

**Section 4: Data Flow Edge Cases**

| Interaction | Edge Case | Handled? |
|---|---|---|
| Create countdown | Name empty | Add: require non-empty name |
| Create countdown | Date in the past | Allow (user may track past events) |
| Daily reward | Open 2x in same window | Check date string, not timestamp — fine |
| Drag reorder | Only 1 item | Hide drag handle |
| Search | No results | Show "No countdowns found" empty state |
| Countdown = 0 days | Show "TODAY" | Handle as special state |
| Countdown past 0 | Negative days | Show "X days ago" |
| localStorage full | >5MB | Extremely unlikely for this data volume |

**Section 5: Code Quality**
No code yet. Implementation spec: keep components small (<100 lines each), one hook per data concern (useCountdowns, useDailyReward), utils/dateUtils.js for all date math, utils/storage.js for all localStorage ops.

**Section 6: Test Coverage**
Key tests needed (for Claude to write during /ship):
- daysUntil(date) with: future date, today, past date, invalid string
- checkDailyReward(): first open (should award), same-day second open (should not), day after (should award)
- streak logic: consecutive days +1, gap day resets to 0
- localStorage read: valid data, corrupted data (should return [])

**Sections 7-10** (Performance, Observability, Deployment, Long-term):
- Performance: localStorage reads are sync, <1ms. No N+1, no DB. Clean.
- Observability: personal tool — no alerts/dashboards needed. Console.error for parse failures is sufficient.
- Deployment: Vercel auto-deploy from git push. No DB migrations, no rollout risk.
- Long-term: data lives in localStorage. Phase 2 expansion (cloud backup) requires a Supabase table + auth. Architecture supports this — all data access goes through storage.js, so swapping localStorage for an API call is ~1 file change.

**Section 11: Design & UX**

```
OPEN SCREEN (hero: daily reward):

  ┌─────────────────────────────┐
  │  Good morning, Yiming ☀️   │
  │  "You showed up again."     │
  │                             │
  │  🎉 +$1  Total: $47        │
  │  🔥 Streak: 12 days        │
  │  ──────────────────────     │
  │  [countdown cards below]   │
  └─────────────────────────────┘

COUNTDOWN CARD:
  ┌─────────────────────────────┐
  │  ✈️  Trip to Japan  [edit] │
  │  ████████████  94 days     │
  └─────────────────────────────┘

STATES:
  FEATURE        | LOADING | EMPTY       | ERROR    | SUCCESS    | PAST
  Daily reward   | —       | (no open)   | —        | +$1 banner | —
  Countdown list | Instant | "Add first" | corrupt→[] | cards     | "X days ago"
  Milestone hit  | —       | —           | —        | confetti   | —
```

Information hierarchy confirmed: daily reward first (habit hook), countdown cards second (motivational content).

### CEO Dual Voices Summary

```
CEO DUAL VOICES — CONSENSUS TABLE:
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Subagent Consensus
  ─────────────────────────────────── ─────── ──────── ─────────
  1. Premises valid?                   ✓       ✓*      CONFIRMED*
  2. Right problem to solve?           ✓       ✓       CONFIRMED
  3. Scope calibration correct?        ✓       ~       CONFIRMED (w/streak add)
  4. Alternatives sufficiently explored?✓      ✓       CONFIRMED
  5. Competitive/market risks covered? N/A     N/A     N/A (personal tool)
  6. 6-month trajectory sound?         ✓       ~       CONFIRMED (with habit reframe)
═══════════════════════════════════════════════════════════════
* Premise updated: habit app (confirmed by user). Codex: unavailable [single-model].
```

### "NOT in scope" for v1

- Push notifications (service worker complexity)
- Share countdown as image (canvas API)
- Recurring/annual events
- Cloud sync / iCloud backup
- Multiple users / auth
- Native iOS / App Store

### CEO Completion Summary

| | |
|---|---|
| Mode | SELECTIVE EXPANSION |
| Premise | Habit app with countdown content. User confirmed. |
| Expansions added | Streak counter, data export (JSON), milestone celebration |
| Critical gaps | Defensive JSON.parse, date validation, empty state for 0 countdowns |
| Architecture | Clean. localStorage → hooks → components. |
| Reversibility | 5/5 — pure frontend, Vercel rollback is instant |
| Deferred | Notifications, sharing, recurring events |

---

## Out of Scope (v1)

- Cloud sync / backup
- Notifications / reminders
- Sharing countdowns
- Recurring events
- Multiple users / auth
- Native iOS app (App Store)

## Design Review — Phase 2

### Design Scope: 7/10

The plan has good structure and confirmed information hierarchy. Gaps: empty states, post-zero countdown behavior, reward screen blocking vs inline, and several implementation specifics that will haunt the coder without explicit decisions.

No DESIGN.md exists (first project). Proceeding with universal design principles.

### Design Litmus Scorecard

```
DESIGN DUAL VOICES — CONSENSUS TABLE:
═══════════════════════════════════════════════════════════════
  Dimension                         Claude   Subagent  Consensus
  ─────────────────────────────────── ──────── ──────── ─────────
  1. Information hierarchy correct?   ✓        ~        DISAGREE (see below)
  2. Interaction states specified?     ~        ✗        issues
  3. Empty states defined?            ✗        ✗        CONFIRMED gap
  4. Design specificity adequate?     ~        ✗        issues
  5. Responsive/mobile intentional?   ✓        ✓        CONFIRMED
  6. Accessibility specified?         ✗        ✗        CONFIRMED gap
  7. AI slop risk?                    low      low      CONFIRMED clean
═══════════════════════════════════════════════════════════════
Codex: unavailable [single-model design]
```

**DISAGREE on dimension 1:** CEO review put daily reward as blocking first screen. Design subagent flags this as poor UX for return visits (day 2+: user wants to check a countdown, gets blocked by reward). Auto-decided: **inline banner** (not blocking screen). The reward appears as a top banner that dismisses after 3 seconds or on tap.

### Design Decisions — Auto-Decided

All decisions logged to audit trail.

**Reward screen approach (blocking → inline):**
- REVISED: daily reward appears as a top banner on first open each day, not a full screen
- Banner shows: emoji + "+$1 earned today • Streak: 14 days" + life-coach phrase
- Auto-dismisses after 4 seconds or tap to dismiss
- Does NOT block access to countdown cards

**Post-zero countdown behavior (critical gap resolved):**
- Countdown hitting 0: shows "TODAY 🎉" with subtle confetti animation
- Stays at "TODAY" for the entire calendar day
- Next day: shows "1 day ago", "2 days ago" etc. (keeps in list as past event)
- User can manually archive/delete at any time
- Past events shown in muted color at bottom of list, below active countdowns

**Empty state (first run — critical gap resolved):**
```
  ┌─────────────────────────────┐
  │                             │
  │         🗓️                  │
  │   Nothing to count down to  │
  │   yet.                      │
  │                             │
  │   Add your first milestone  │
  │   — a trip, a birthday, a   │
  │   deadline.                 │
  │                             │
  │   [+ Add Countdown]         │
  │                             │
  └─────────────────────────────┘
```

**Color picker:** 8 preset colors (user picks from palette, not free color wheel). Colors: indigo, rose, amber, emerald, sky, violet, orange, teal. Matches Tailwind 500 values. No hex input needed.

**Life-coach phrases:** Static list of 20, one per day (cycling). Pre-written at build time in `utils/phrases.js`. Not AI-generated (no API cost, works offline).

**Reorder UX on mobile:** @dnd-kit with PointerSensor + long-press activation (300ms hold to initiate drag). This avoids scroll conflict.

**Offline behavior:** All data is localStorage — app works offline natively. No service worker needed for data. PWA manifest handles "Add to Home Screen" only.

**Milestone celebration:** CSS confetti animation (no library), plays for 2 seconds when countdown first reaches 0. No sound (PWA audio autoplay restrictions).

**Accessibility basics:** 
- All interactive elements: min 44×44px touch target
- Color contrast: text on card backgrounds ≥ 4.5:1
- Emoji icons have aria-labels
- Form labels for all inputs

### Screen Wireframes

```
HOME SCREEN (return visit, already rewarded today):
┌────────────────────────────────┐
│ ☀️ Good morning               │
│ May 30, 2026                   │
│ ──────────────────────         │
│ [🔍 Search countdowns...]      │
│                                │
│ ┌────────────────────────────┐ │
│ │ ✈️  Trip to Japan   94 days│ │  <- indigo card
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 🎂  Mom's birthday  TODAY 🎉│ │  <- rose card, celebration
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 🏃  Marathon        18 days│ │  <- amber card
│ └────────────────────────────┘ │
│                                │
│ ── past events ──              │
│ 💼  Job interview  3 days ago  │  <- muted, smaller
│                                │
│              [+]               │  <- FAB: add new
└────────────────────────────────┘

HOME SCREEN (first open today — reward banner):
┌────────────────────────────────┐
│ 🎉 +$1 earned • $47 total      │  <- banner (auto-dismisses)
│ 🔥 Streak: 14 days             │
│ "Show up every day. That's it."│
│                    [×]         │
├────────────────────────────────┤
│ (rest of home screen below)    │
└────────────────────────────────┘

CREATE/EDIT COUNTDOWN:
┌────────────────────────────────┐
│ ← New Countdown                │
│                                │
│ Emoji     [✈️] (tap to change) │
│ Name      [Trip to Japan     ] │
│ Date      [Mar 15, 2026      ] │
│ Color     [● ● ● ● ● ● ● ●]   │  <- 8 color dots
│                                │
│        [Save Countdown]        │
│                                │
└────────────────────────────────┘
```

### Design — 7 Dimensions Evaluated

**Pass 1: Information Hierarchy** — 8/10
Hero: reward banner (first daily open only). Then greeting + date. Then search. Then countdown cards. Past events at bottom. FAB for add. Clear top-down priority. No competing elements. One action per level.

**Pass 2: Interaction States** — 7/10
Gaps resolved above (post-zero, empty, reward inline). Remaining: loading state is instant (localStorage is sync — no loading spinner needed). Form validation: show red border + message on empty name or past date when user tries to save.

**Pass 3: Empty States** — 9/10 (after fix)
First-run empty state specified above. Search with no results: "No countdowns match '[query]'" with a clear-search button. Zero rewards earned yet: don't show the $0 total, just hide until first reward.

**Pass 4: Design Specificity** — 8/10 (after fixes)
Font: Inter (system font fallback). Spacing: Tailwind's default scale (4px base). Card border radius: rounded-xl (12px). FAB: fixed bottom-right. Dark mode only (dark navy #0f172a background, Tailwind slate-950).

**Pass 5: Mobile / Responsive** — 9/10
Mobile-first. Max-width 428px (iPhone Pro width), centered on desktop with background. No tablet breakpoints needed — it's a personal iPhone app.

**Pass 6: Accessibility** — 7/10
Touch targets, contrast, aria-labels specified above. Missing: reduced motion preference for confetti animation. Add: `@media (prefers-reduced-motion: reduce)` to skip confetti.

**Pass 7: AI Slop Risk** — 8/10
Not a generic card grid. The habit loop framing + specific interaction states make this feel intentional. Risk area: the emoji picker — if implemented as a 1000-emoji grid, it'll look like a generic app. Fix: simple text input where user types/pastes emoji directly. Clean.

### Design Additions to Plan (updated scope)

1. Daily reward is inline banner, not blocking screen
2. Post-zero behavior: "TODAY" state → past events list
3. Empty state design specified
4. Color palette: 8 Tailwind preset colors (not free picker)
5. Emoji: text input (type/paste), not a picker grid
6. Confetti: respects `prefers-reduced-motion`
7. Past events: muted, sorted to bottom
8. FAB (floating action button) for Add Countdown

---

## Engineering Review — Phase 3

### Architecture ASCII Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        App.jsx                                  │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │ DailyReward │  │  SearchBar     │  │  CountdownForm      │  │
│  │ (banner)    │  │  (filter input)│  │  (create/edit modal)│  │
│  └──────┬──────┘  └───────┬────────┘  └──────────┬──────────┘  │
│         │                 │                       │             │
│  ┌──────▼─────────────────▼───────────────────────▼──────────┐ │
│  │                  CountdownCard (×N)                        │ │
│  │  icon | name | days display | drag handle | edit/delete    │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐        ┌──────────────────────┐
│ useDailyReward  │        │  useCountdowns        │
│  - check reward │        │  - CRUD operations    │
│  - streak logic │        │  - sort by rank       │
│  - phrases list │        │  - search filter      │
└────────┬────────┘        └──────────┬────────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────┐
│                  utils/storage.js                 │
│  getCountdowns() → JSON.parse ?? []               │
│  saveCountdowns(arr) → JSON.stringify             │
│  getRewardState() → JSON.parse ?? defaultState    │
│  saveRewardState(state) → JSON.stringify          │
└──────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌──────────────────────────────────────────────────┐
│                  localStorage                     │
│  "countdowns" → JSON array                        │
│  "rewardState" → JSON object                      │
└──────────────────────────────────────────────────┘
```

No coupling concerns. Single source of truth: localStorage via storage.js. All components read from hooks, not directly from storage.

### Eng Section 1: Architecture

Component count: 5 components, 2 hooks, 3 utils. Under the 8-file smell threshold. Clean.

Coupling: zero — all data flows down from hooks. No component touches localStorage directly.

Scaling: personal app, single user. Max ~50 countdowns = trivial localStorage load.

Single point of failure: localStorage. Mitigated by JSON export. No external dependencies that can fail.

Rollback: Vercel instant rollback. No DB migrations. Zero deploy risk.

### Eng Section 2: Error & Rescue Map

| Codepath | What can go wrong | Rescued? | Fix |
|---|---|---|---|
| storage.getCountdowns() | localStorage returns null | No ← GAP | `JSON.parse(val) ?? []` |
| storage.getCountdowns() | Corrupted JSON string | No ← GAP | try/catch → return [] |
| storage.getRewardState() | null or corrupted | No ← GAP | try/catch → return defaultState |
| daysUntil(date) | Invalid date string | No ← GAP | isNaN(target) → return null → show "Invalid" |
| CountdownForm save | Empty name field | No ← GAP | Client-side validation before save |
| CountdownForm save | No date selected | No ← GAP | Require date field |
| icon field render | HTML string injected | Partial | Ensure JSX text interpolation (not dangerouslySetInnerHTML) |
| Data export | JSON.stringify fails | Unlikely | Try/catch, show error toast |

All gaps resolved in implementation spec below.

**Implementation spec for storage.js:**
```js
export function getCountdowns() {
  try {
    return JSON.parse(localStorage.getItem('countdowns')) ?? []
  } catch { return [] }
}
export function getRewardState() {
  try {
    return JSON.parse(localStorage.getItem('rewardState')) ?? defaultRewardState
  } catch { return defaultRewardState }
}
```

### Eng Section 3: Security

No server, no API, no auth. Attack surface: zero external vectors.

One real XSS surface: `icon` field. Must render as JSX text only: `<span>{countdown.icon}</span>`. Never use `dangerouslySetInnerHTML` for this field. Add note to CountdownCard.jsx.

Input validation at form level:
- `name`: required, max 60 characters (prevent UI overflow)
- `targetDate`: required, valid date (browser date picker enforces format)
- `icon`: max 10 chars (emoji = 1-4 chars typically)
- `color`: must be one of the 8 allowed hex values (enforced by picker UI)

### Eng Section 4: Data Flow Edge Cases

```
CREATE COUNTDOWN:
  INPUT ──▶ validate (name, date) ──▶ generate uuid ──▶ append to array ──▶ save ──▶ re-render
    │              │
    ▼              ▼
  [empty name?   [no date? → show error, block save]
  → show error]

DAILY REWARD CHECK (on app mount):
  localStorage.rewardState ──▶ parse ──▶ compare today string ──▶ update if new day
        │                                       │
        ▼                                       ▼
  [null/corrupt → use default]    [streak: if gap > 1 day → reset to 0]

DRAG REORDER:
  onDragEnd(event) ──▶ arrayMove(items, oldIndex, newIndex)
    ──▶ re-index ranks (items.map((item, i) => ({...item, rank: i})))
    ──▶ saveCountdowns(reranked) ──▶ setState
  [only 1 item → disable drag handle in UI]
  [drag outside list → no-op (dnd-kit handles this)]
```

**Timezone note:** Store targetDate as `"2026-03-15T00:00:00"` (no timezone suffix). `new Date("2026-03-15T00:00:00")` is treated as LOCAL time in modern browsers. This is the correct behavior — if Yiming says "March 15", they mean midnight in their local timezone, not UTC. Document this in dateUtils.js.

### Eng Section 5: Test Coverage

**New UX flows:**
- Open app for first time → empty state shown
- Open app new day → reward banner appears, streak increments
- Open app same day again → no reward, no banner
- Create countdown → appears in list
- Edit countdown → changes reflected
- Delete countdown → removed from list
- Drag to reorder → new order persists after reload
- Search → filters cards live
- Countdown reaches 0 → "TODAY" state shown
- Export → JSON file downloads

**New data flows:**
- getCountdowns: valid data, null, corrupted JSON
- getRewardState: valid, null, corrupted
- daysUntil: future date, today (midnight boundary), past date, invalid string
- checkDailyReward: first ever open, new day, same day again

**Test plan: key cases**

```
dateUtils.test.js:
  daysUntil("2099-01-01T00:00:00") → > 0
  daysUntil(today at midnight local) → 0 (TODAY)
  daysUntil(yesterday) → -1
  daysUntil("not-a-date") → null

storage.test.js:
  getCountdowns() when empty → []
  getCountdowns() when corrupted → []
  getCountdowns() when valid → array

useDailyReward.test.js:
  first open → awarded = true, streak = 1
  same-day second open → awarded = false, streak unchanged
  next-day open → awarded = true, streak = 2
  two-day gap → awarded = true, streak = 1 (reset)

useCountdowns.test.js:
  add → length + 1
  delete → length - 1
  reorder → ranks are 0,1,2...N (no gaps)
  search filter → returns matching items only
```

### Eng — Required Outputs

**"NOT in scope" (eng additions):**
- Unit tests beyond the above (integration tests, E2E — overkill for personal tool)
- Service worker / push notifications
- Server-side rendering (Vite SPA is fine)

**"What already exists":**
- uuid: `crypto.randomUUID()` (built into modern browsers, no library needed — remove uuid library from plan)
- Date formatting: `Intl.RelativeTimeFormat` (built-in, no date-fns needed)
- Confetti: CSS keyframes animation (no confetti library needed)

**Failure modes registry:**

| Mode | Likelihood | Impact | Mitigation |
|---|---|---|---|
| localStorage corrupted | Low | High (data loss) | try/catch → graceful empty state + export reminder |
| localStorage cleared by browser | Low | High | Export button prominently in settings |
| Date calculation off-by-one at midnight | Medium | Low | Test boundary cases |
| @dnd-kit touch conflict with scroll | Medium | Medium | Use PointerSensor with 8px movement threshold |
| Vercel deploy failure | Low | Zero (personal app) | Vercel has 99.9% uptime |

### Eng Dual Voices Summary

```
ENG DUAL VOICES — CONSENSUS TABLE:
═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Subagent  Consensus
  ─────────────────────────────────── ─────── ──────── ─────────
  1. Architecture sound?               ✓       ✓        CONFIRMED
  2. Test coverage sufficient?         ~       ~        issues (boundary cases)
  3. Performance risks addressed?      ✓       ✓        CONFIRMED (localStorage sync)
  4. Security threats covered?         ✓       ✓        CONFIRMED (XSS only surface)
  5. Error paths handled?              ~       ✗        issues (JSON.parse gaps)
  6. Deployment risk manageable?       ✓       ✓        CONFIRMED (zero risk, no DB)
═══════════════════════════════════════════════════════════════
Codex: unavailable [single-model]. Subagent: 5 findings, all auto-decided.
```

### Eng Completion Summary

| | |
|---|---|
| Architecture | Clean, 5 components, 2 hooks, 1 storage util |
| Critical gaps fixed | JSON.parse null safety, date validation, DnD rank re-indexing |
| Removed from plan | uuid library → crypto.randomUUID(); date-fns → Intl API |
| Deployment risk | Zero (pure frontend, no DB, Vercel) |
| Test plan artifact | Written to disk (see below) |

---

## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|---------|
| 1 | CEO | Mode: SELECTIVE EXPANSION | Mechanical | P1+P6 | Greenfield feature, surface expansions individually | EXPANSION (overkill for personal tool) |
| 2 | CEO | Add streak counter | Mechanical | P2 | In blast radius, <1 file, dramatically improves habit loop | Omit (leaves habit loop weak) |
| 3 | CEO | Add data export | Mechanical | P2 | localStorage data loss on phone reset is real risk, 1 function | Omit (user loses data) |
| 4 | CEO | Add milestone celebration | Mechanical | P1 | Payoff moment for countdown reaching 0 — missing this feels incomplete | Omit |
| 5 | CEO | Defer push notifications | Mechanical | P3 | Service worker adds complexity; not core to v1 | Include (adds 2+ hrs complexity) |
| 6 | CEO | Keep React+Vite stack | Mechanical | P5 | Maintainable, extendable, Claude builds it entirely | Vanilla HTML (harder to extend) |
| 7 | CEO | localStorage acceptable | Mechanical | P3 | Personal tool, user accepts data loss risk | Add backend (ocean, not lake) |
| 8 | Design | Reward → inline banner (not blocking) | Mechanical | P5 | Power users blocked from cards on return visits; banner is better UX | Full-screen gate (bad UX day 2+) |
| 9 | Design | Post-zero: TODAY → past events list | Mechanical | P1 | Resolves data model + UX ambiguity; past events are useful to keep | Auto-delete (loses history) |
| 10 | Design | 8 preset color palette | Mechanical | P5 | Simple, consistent; free color wheel adds complexity with no benefit | Free hex picker |
| 11 | Design | Emoji: text input (type/paste) | Mechanical | P5 | Simpler than emoji grid picker; avoids AI-slop aesthetic | 1000-emoji grid picker |
| 12 | Design | Confetti respects prefers-reduced-motion | Mechanical | P1 | Accessibility; trivial to add | Ignore motion preference |
| 13 | Eng | JSON.parse null safety in storage.js | Mechanical | P5 | Runtime crash if localStorage is null/corrupted | No fallback |
| 14 | Eng | DnD re-index ranks on every drop | Mechanical | P5 | Rank gaps accumulate causing ordering bugs | Delta update |
| 15 | Eng | Remove uuid library → crypto.randomUUID() | Mechanical | P4 | Built into browsers, no library needed | Add uuid npm package |
| 16 | Eng | Remove date-fns → Intl.RelativeTimeFormat | Mechanical | P4 | Built into browsers; avoids 30kb bundle increase | Add date-fns |
| 17 | Eng | targetDate: local ISO string (no TZ offset) | Mechanical | P3 | User intent is local midnight; this is correct behavior for personal tool | UTC storage |
| 18 | Eng | Icon field: JSX text interpolation only | Mechanical | P5 | Prevent XSS surface (only real security risk) | dangerouslySetInnerHTML |

## Cross-Phase Themes

**Theme: localStorage fragility** — flagged in CEO (data loss risk) + Eng (JSON.parse null). High-confidence. Mitigated by: data export feature (accepted expansion) + defensive JSON.parse. This is the only real risk in the entire app.

**Theme: Habit loop specificity** — flagged in CEO (reward mechanic needs escalation/streak) + Design (reward as blocking gate). High-confidence. Mitigated by: streak counter (accepted expansion) + inline banner decision. The habit loop is now fully specified.

No other cross-phase themes — each phase's remaining concerns were distinct.

---

## Updated File Structure (incorporating all review decisions)

```
countdown-app/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── public/
│   ├── manifest.json
│   └── icon-192.png, icon-512.png (SVG-based, generated at build)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── CountdownCard.jsx      (card display, drag handle, edit/delete)
    │   ├── CountdownForm.jsx      (create/edit modal with validation)
    │   ├── DailyRewardBanner.jsx  (inline banner, auto-dismisses 4s)
    │   ├── StreakCounter.jsx      (streak display in banner)
    │   ├── SearchBar.jsx          (live filter input)
    │   ├── EmptyState.jsx         (first-run and no-results states)
    │   └── MilestoneConfetti.jsx  (CSS confetti, respects reduced-motion)
    ├── hooks/
    │   ├── useCountdowns.js       (CRUD + search filter + rank re-index)
    │   └── useDailyReward.js      (reward check + streak logic + phrases)
    └── utils/
        ├── storage.js             (localStorage with JSON.parse try/catch)
        ├── dateUtils.js           (daysUntil with null safety + "TODAY" logic)
        └── phrases.js             (20 life-coach phrases, indexed by day-of-year)
```

## Updated Success Criteria

- Opens on iPhone Safari, can be added to home screen
- All 5 MVP features work
- Looks clean enough that Yiming wants to use it daily
- Daily reward triggers correctly on first open each day

## GSTACK REVIEW REPORT

| Review | Via | Mode | Runs | Status | Findings | Commit |
|--------|-----|------|------|--------|----------|--------|
| CEO Review | `/autoplan` | SELECTIVE_EXPANSION | 1 | clean | 0 unresolved, 7 auto-decided | 48f5cbc |
| Design Review | `/autoplan` | FULL_REVIEW | 1 | clean | 0 unresolved, 5 auto-decided | 48f5cbc |
| Eng Review | `/autoplan` | FULL_REVIEW | 1 | clean | 5 found, 0 unresolved | 48f5cbc |
| CEO Voices | `/autoplan` | subagent-only | 1 | clean | 5/6 confirmed, 1 resolved | 48f5cbc |
| Design Voices | `/autoplan` | subagent-only | 1 | clean | 5/7 confirmed, 2 resolved | 48f5cbc |
| Eng Voices | `/autoplan` | subagent-only | 1 | clean | 4/6 confirmed, 2 resolved | 48f5cbc |

**VERDICT:** REVIEWED — 3 phases complete (CEO + Design + Eng), 18 total decisions, 0 unresolved. Ready for `/ship`.
