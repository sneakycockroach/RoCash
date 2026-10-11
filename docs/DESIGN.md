# RoCash Design System (v2)

Principle: look like it shipped with iOS. Calm, white, precise. Colour is reserved for data and one accent.
Everything follows Apple's Human Interface Guidelines: clarity (content first), deference (UI stays out of the way),
depth (layers and motion explain where you are). Android gets the same design, never a different one.

## 1. What makes it feel made for the person
- Their **name and avatar** appear on Today and Settings (never before they have entered a name).
- A quiet time-aware caption on Today: "Saturday 10 October" and a greeting only after onboarding ("Good evening, Amara").
- **Recents row** in the Add sheet: their own most frequent entries as one-tap capsules ("Lunch 4,500").
- **Smart default category** by time of day and history (Food around midday, Transport in the morning rush).
- Their **currency**, their **daily goals**, their own **categories** everywhere.
- Pandi reacts to what they did (calm when over budget, cheering when they hit a goal), never judges.

## 2. Colour tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| bg | #F2F2F7 | #000000 | Page (grouped background) |
| surface | #FFFFFF | #1C1C1E | Cards, grouped lists |
| surface-raised | #FFFFFF | #2C2C2E | Sheets, popovers |
| fill | rgba(118,118,128,0.12) | rgba(118,118,128,0.24) | Chips, inputs, keypad keys |
| label | #000000 | #FFFFFF | Primary text |
| label-2 | rgba(60,60,67,0.60) | rgba(235,235,245,0.60) | Secondary text |
| label-3 | rgba(60,60,67,0.30) | rgba(235,235,245,0.30) | Placeholders, disabled |
| separator | #C6C6C8 | #38383A | Hairlines (0.5px) |
| accent | #30B566 | #3CD070 | Progress, saved money, selected tab. Sample the real value from Pandi's hoodie |
| accent-soft | rgba(48,181,102,0.14) | rgba(60,208,112,0.20) | Soft highlights |
| over | #FF6259 | #FF7A72 | Over budget (calm coral, never alarm red) |
| destructive | #FF3B30 | #FF453A | Delete and sign out only |
| gold | #FFB800 | #FFD60A | Streak flame and XP only |
| button | #000000 on white text | #FFFFFF with black text | Primary buttons (inverts in dark mode) |

Category colours (stored in the database, the same in both modes):
Transport #007AFF, Data & Airtime #30B0C7, Food #FF9500, Other #8E8E93.
Custom category picker: #AF52DE, #FF2D55, #5856D6, #A2845E, #00C7BE, #FFCC00.
Spent is shown in label colour (neutral). Green always means saved or progress. Colour never carries meaning alone.

Dark mode is true black with lifted grey surfaces and no shadows (elevation = lighter surface), exactly like iOS.

## 3. Typography
Font: SF Pro. Web: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, Roboto, sans-serif`.
Stitch stand-in: Inter. Numbers always `tabular-nums`.

| Style | Size / weight | Use |
|---|---|---|
| Large Title | 34 bold | Screen titles |
| Hero Number | 48 bold | Today remaining, amount entry |
| Title 2 | 22 semibold | Sheet titles, card headings |
| Headline | 17 semibold | Rows, buttons |
| Body | 17 regular | Content |
| Subhead | 15 regular | Secondary text |
| Footnote | 13 regular | Captions, legends |
Support Dynamic Type (rem units). Never go below 12.

## 4. Layout, shape, depth
- 4pt base grid. Side margins 20. Gap between sections 28. Inside cards 16.
- Cards: radius 22, white on grey (inset grouped lists), rows 52 high, hairline separators inset 16.
- Primary button: capsule, 52 high, full width, black with white label (inverted in dark). One per screen.
- Secondary button: capsule, 52 high, `fill` background, label colour text. Tertiary: text only.
- Chips: capsule, 36 high, `fill` background, 12 side padding, tinted icon dot for categories.
- Category icon: 32 square, radius 8, solid category colour, white glyph (same pattern as iOS Settings).
- Sheets: radius 28 on top, drag handle, detents medium and large, dimmed backdrop.
- Tab bar: 5 tabs (Today, Month, Reports, Rewards, Settings), blurred translucent material (blur 24, saturate 180%),
  hairline top, icons 24 line 1.75 stroke, selected = accent icon and label, unselected = label-2.
- Add button (Today only): black capsule "+ Add" floating 16 above the tab bar, centred.
- Depth: hairline 0.5px borders in light mode plus a very soft shadow (y2, blur 8, 6%). None in dark.
- Safe areas: respect notch and home indicator. 44pt minimum touch target.
- Icons: Lucide (line, 1.75 stroke, rounded). Never mix icon sets.

## 5. Pandi (the mascot)
Source: svgapp.ai, MIT licensed, red panda in a green hoodie. Keep the licence notice (Settings > About > Credits).
Rules: only on empty states, onboarding, celebrations and install guides. 140 to 220px, centred, one per screen,
never decorating a busy screen, never in a dialog about money loss. Download the SVGs and bundle them in the app.
Do not use the video files (transparent WebM is not reliable on iPhone). Animate the SVG with Framer Motion instead.

Download URL pattern: `https://svgapp.ai/static/poses/pandi-<name>.svg`. Base: `https://svgapp.ai/static/mascots/pandi.svg`.

| Pose file | Where it is used |
|---|---|
| pandi.svg (base) | Splash, Welcome |
| video-call | Onboarding 1 (waving hello) |
| whiteboard | Onboarding 4 (set your goals) |
| teamwork | Onboarding 6 (all set), goal hit |
| cloudwatching | Today, empty day 0 |
| yoga | Today, no-spend day |
| painting | Month, empty |
| reading | Reports, empty |
| clipboard | Rewards, day 0 |
| skateboard | Badge unlocked, streak milestone |
| gaming | Level up |
| designer | Categories, no custom ones yet |
| delivery | Check your email, install guides, install nudge |
| campfire | Offline |
| building | Spare: first saving milestone |
| hammock, picnic, flying-a-kite | Spare for future moments |

Pandi's colours (orange fur, green hoodie) are the app's only decoration. That is why the UI itself stays neutral.

## 6. Avatars
Library: DiceBear, run locally in the app (not the web API), so avatars work offline and nothing is sent anywhere.
Pin versions: `@dicebear/core@9` and `@dicebear/collection@9` (version 10 changed how styles load).
Styles offered (all CC0, no attribution required): **Lorelei** (default), **Notionists**, **Thumbs**.
Picker: big live preview (120), grid of 12 options (4 by 3), selected one gets a 3px accent ring, style switch as a
segmented control, "Shuffle" button. Background tint chosen from 6 soft colours.
Stored in the profile as `avatar_style`, `avatar_seed`, `avatar_bg`. Rendered as circles (Settings 64, Today 36).

## 7. Motion (Framer Motion)
Feel: responsive, springy, interruptible, never decorative. Everything the user does gets an instant reply (under 100ms).
- Springs: default `{ type: "spring", stiffness: 380, damping: 34 }`. Soft `{ 300, 30 }`. Bouncy `{ 260, 18 }` (celebrations only).
- Press: scale 0.97 for 90ms, springs back. Buttons never change colour on press, they scale.
- Navigation: push slides in from the right with the previous screen moving left 30% (parallax), swipe back is interactive.
- Sheets: spring up with detents, drag to dismiss with velocity, rubber-band at the limits, backdrop dims.
- Tabs: selected indicator morphs between tabs (shared `layoutId`), content cross-fades 150ms, each tab keeps its scroll.
- Today ring: animates from its previous value with the default spring. Numbers count up 600ms ease-out, only on first load or after a save.
- Lists: rows enter with 8px rise and fade, 30ms stagger, max 6 rows. Delete closes the gap with a layout animation.
- Add flow: the Add button morphs into the sheet. Each keypad digit gives the amount a tiny scale pulse. Save collapses the sheet and the new row slides in from the top.
- Pandi: gentle float (translateY +-3px, 3s ease-in-out), enters with a soft spring, pauses when off screen.
- Celebrations (badge, level up, goal hit only): medallion scale-in with bouncy spring, up to 40 confetti particles, 1.6s, once per event.
- Loading: skeleton shimmer, never a spinner on a full screen.
- Reduced motion: replace all movement with 150ms fades.
- Performance: animate only transform and opacity. Target 60fps on mid-range Android.

## 8. Copy voice
Calm, warm, short. Sentences under 12 words. Never shame. Say "over by UGX 3,200", not "overspent".
Empty states: one headline, one line of help, one button. Error messages say what happened and what to do next.

## 9. Empty-state template (every list, chart and collection)
Pandi pose 140 to 220, centred. Headline (Title 2). One line (Subhead, label-2). One primary or secondary button.
Never the words "No data".

## 10. Accessibility
Text contrast 4.5:1 or better in both modes. Do not rely on colour alone (pair with icon or label).
Labels on all icons. Focus rings for keyboard. Honour reduced motion and Dynamic Type.

## 11. Sample data (keep identical on every screen)
User: Amara. Currency UGX. Daily budget UGX 20,000. Daily saving goal UGX 5,000.
Today: spent UGX 12,500, saved UGX 5,000. October: spent UGX 186,000, saved UGX 52,000.
Streak 6 days. Level 3 "Planner", 340 of 500 XP. 5 of 14 badges earned.
Entries today: Food "Lunch" 4,500 at 12:40; Transport "Boda ride" 3,000 at 08:15; Data & Airtime "Airtime" 5,000 at 07:50.
