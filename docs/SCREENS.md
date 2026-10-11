# RoCash: Stitch prompt pack (v2), every screen

About 65 screens in 11 prompts. Each prompt contains its own full screen specs, so you only paste and wait.

## Before you start (10 minutes)
1. Download the Pandi SVGs listed in DESIGN.md section 5 (open each URL, save the file). Convert 4 to PNG by screenshot
   for Stitch references: base, video-call, cloudwatching, teamwork.
2. In Stitch create a Mobile project. Paste DESIGN.md as the first message (or import it as the design system).
3. Upload the Pandi PNGs as reference images once. In every prompt below, "Pandi" means that character. Tell Stitch
   "do not redraw Pandi, use the reference" if it changes him.
4. Paste the STYLE LOCK below at the top of every prompt (already included in each one).
5. If Stitch caps screens per prompt, split a batch at any blank line. Each screen spec is self-contained.
6. Approve each batch before the next. Fix with one short instruction, not a rewrite.

---

## STYLE LOCK (already at the top of each prompt)
```
STYLE LOCK: Native iOS look following Apple Human Interface Guidelines. 390x844, light mode unless stated.
Minimal: grey page #F2F2F7, white inset-grouped cards radius 22, black text, ONE accent green #30B566.
Font SF Pro (Inter as stand-in): Large Title 34 bold, Hero Number 48 bold, Title 22 semibold, Headline 17 semibold,
Body 17, Subhead 15, Footnote 13, tabular numbers. 20px side margins, 4pt grid, 44pt minimum tap targets.
Primary button: black capsule 52px high, white label, one per screen. Secondary: grey capsule.
Translucent blurred tab bar with 5 tabs: Today, Month, Reports, Rewards, Settings (line icons, selected tab green).
Colour is only for data: Transport #007AFF, Data & Airtime #30B0C7, Food #FF9500, Other #8E8E93, saved = green,
over budget = soft coral #FF6259. Category icons are white glyphs on coloured rounded squares like iOS Settings.
Mascot Pandi (red panda in a green hoodie, use the attached reference, never redraw) only on empty states,
onboarding and celebrations, 140-220px, one per screen. User avatars are round Lorelei-style portraits.
Money like "UGX 12,500". Sample user Amara. No heavy shadows, hairline borders only. Tone calm, warm, short.
```

---

## Prompt 1: Launch and sign in (10 screens)
```
[STYLE LOCK]
Design these screens.

A1 Splash: white background, Pandi base pose 200px centred, "RoCash" 34 bold below, tagline "Know where it goes. Keep more of it." in grey.
A2 Welcome (first launch): Pandi 220px, Large Title "Your money, calmly.", one grey line "Track what you spend, see what you save.", black capsule "Get started", text button "I already have an account".
A3 Sign in: back-free screen, Large Title "Sign in". Grouped card with Email and Password rows (eye icon to show password). Black capsule "Sign in". Text link "Forgot password?". Hairline divider with "or". White capsule with hairline "Continue with Google" with the Google G. Footer "New here? Create account".
A4 Sign in, loading: same, button shows a small spinner and label "Signing in", fields dimmed.
A5 Sign in, error: password row outlined in coral, inline coral footnote "That email and password don't match. Try again."
A6 Create account: Large Title "Create account". Email and Password rows, 3-segment password strength bar with label "Good", black capsule "Create account", Google capsule, legal footnote "By continuing you agree to the Terms and Privacy Policy."
A7 Check your email: Pandi delivery pose 180px, Title "Check your inbox", grey line "We sent a link to amara@example.com", black capsule "Open Mail", text "Resend in 0:28".
A8 Forgot password: back chevron, Large Title "Reset password", one Email row, black capsule "Send reset link". Second state below it: confirmation card "Link sent. Check your email."
A9 Set new password: Large Title "New password", Password row with strength bar, black capsule "Update password".
A10 Welcome back (returning user): avatar 96px, Title "Welcome back, Amara", black capsule "Continue", text "Not Amara? Switch account". Nothing else.
```

## Prompt 2: Onboarding (6 screens)
```
[STYLE LOCK]
Design 6 onboarding screens. A thin 6-segment progress bar at the top (current segment black). No back button on step 1. Black capsule "Continue" pinned at the bottom.

B1 Hello: Pandi waving (video-call pose) 220px, Large Title "Hi, I'm Pandi.", Body grey "I'll help you see where your money goes and keep a little more of it."
B2 Your name: Large Title "What should we call you?", one big text field (28pt) with a blinking cursor and the keyboard showing, footnote "You can change this later." No greeting yet.
B3 Pick your look: avatar preview 120px centred with a green ring, grid 4x3 of round avatars (Lorelei style, soft pastel backgrounds), selected one has a 3px green ring, segmented control "Lorelei | Notionists | Thumbs", grey capsule "Shuffle".
B4 Daily rhythm: Pandi whiteboard pose 120px at the top, Title "Set your daily goals", inset grouped list: Currency "UGX", Daily budget "UGX 20,000", Daily saving goal "UGX 5,000", footnote "Change anytime in Settings."
B5 Categories: Title "Your categories", grouped list of Transport, Data & Airtime, Food, Other (coloured icon squares), last row "+ Add your own" in green. Footnote "Other is always there if you can't find the word."
B6 All set: Pandi teamwork pose 220px, Large Title "You're all set, Amara.", three icon rows "Log in 5 seconds", "Keep your streak", "Collect badges", black capsule "Start with today".
```

## Prompt 3: Today (9 screens)
```
[STYLE LOCK]
Design the Today tab in these states. Tab bar visible with Today selected. Header: small grey caps date "SATURDAY 10 OCTOBER", Large Title "Today", round avatar 36px top right, small gold flame chip with the streak number next to it. Floating black capsule "+ Add" above the tab bar.

C1 Active day: white card with a thick green progress ring (rounded ends) showing 62%, centre Hero Number "UGX 7,500" and caption "left of UGX 20,000". Below, an inset list with two rows: "Spent  UGX 12,500" and "Saved  UGX 5,000 of 5,000" with a thin green bar. Section header "Today" then 3 entries (Food "Lunch" 4,500 12:40; Transport "Boda ride" 3,000 08:15; Data & Airtime "Airtime" 5,000 07:50) with coloured icon squares.
C2 Empty (day 0): same header, ring is an empty grey track with "UGX 20,000" and caption "available today", streak chip shows 0. Pandi cloudwatching pose 180px, Title "Nothing logged yet", grey line "Add your first entry and your streak begins.", black capsule "Add entry".
C3 Over budget: ring complete in coral with a thin second lap, centre "UGX 3,200" and caption "over today's UGX 20,000" in coral, grey line "That's okay. Tomorrow starts fresh." No mascot.
C4 Goal hit: ring full green with a soft glow and a check mark, banner row "Saving goal reached", Pandi teamwork pose 140px, restrained confetti dots.
C5 No-spend day: ring full green with a leaf icon, Title "No-spend day", Pandi yoga pose 160px, grey line "A day of zero. Nice."
C6 Loading skeleton: same layout as C1 with soft grey shimmering blocks.
C7 Entry detail sheet (medium detent over C1): category icon square, Hero Number "UGX 4,500", rows Category Food, Note Lunch, Date Today 12:40, then grey capsule "Edit" and destructive red text "Delete entry".
C8 Swipe to delete: one row swiped left revealing a red "Delete" action, toast capsule at the bottom "Entry deleted  Undo".
C9 Offline: small grey capsule "Offline, will sync" under the title, everything else as C1.
```

## Prompt 4: Add flow (6 screens)
```
[STYLE LOCK]
Design the Add flow. All are a large-detent bottom sheet over a dimmed Today, drag handle on top.

D1 Add, Spent, empty: segmented control "Spent | Saved" (Spent selected), Hero Number "0" centred with small "UGX" prefix, "Recents" row of capsules "Lunch 4,500", "Boda 3,000", horizontally scrolling category capsules (Transport, Data & Airtime, Food, Other, "+ New") with coloured icon dots, note row "Add a note", date capsule "Today", a 3x4 keypad (1-9, 00, 0, delete) with large rounded grey keys, black capsule "Save" disabled.
D2 Add, Spent, filled: amount "4,500", Food capsule selected with orange tint and check, note "Lunch", black capsule "Save" enabled.
D3 Add, Saved: "Saved" selected, accent green on the amount and selected states, no category capsules, note placeholder "What's it for?", suggestion capsule "Daily goal 5,000", black capsule "Save".
D4 New category: sheet with name field and counter "0/30", 12-icon grid, row of 8 colour dots, live preview capsule, black capsule "Create". Second state: coral footnote "You already have a category called Food."
D5 Date: capsules "Today", "Yesterday", "Pick a date" opening an iOS graphical calendar, future days greyed out.
D6 Saved: back on Today, toast capsule floating above the tab bar "Added UGX 4,500 to Food  Undo", the new row highlighted for a moment, ring slightly advanced.
```

## Prompt 5: Month and Reports (8 screens)
```
[STYLE LOCK]
Design the Month and Reports tabs.

E1 Month (Month tab selected): Large Title "October", chevrons for previous and next month, calendar grid with 40px round day cells: under budget = soft green fill, over budget = soft coral fill, nothing logged = plain, today = black outline, no-spend day shows a tiny leaf. Below, an inset card with rows "Spent UGX 186,000", "Saved UGX 52,000", "Best day 7 Oct". Footnote legend.
E2 Day detail sheet (medium detent): "Wednesday 7 October", total "UGX 14,200", entry list with category squares, last row "+ Add entry for this day" in green.
E3 Month, empty: grid plain, Pandi painting pose 180px, Title "A blank page", line "Log a day and watch it fill with colour.", black capsule "Log today".
E4 Month picker: sheet listing months grouped by year with small spent totals, future months greyed.
F1 Reports (Reports tab selected): Large Title "Reports", segmented control "Week | Month | Year", two big numbers "Spent UGX 186,000 (down 18%)" and "Saved UGX 52,000 (up 9%)", bar chart with dark neutral bars for spent and green bars for saved, donut chart of spend by category in the four category colours with a ranked list Food 41%, Transport 28%, Data & Airtime 21%, Other 10%, one plain insight row "You spent 18% less on Transport than last week."
F2 Reports, Year: 12 monthly bars, best month labelled.
F3 Category detail: pushed screen titled "Food", total, smooth line over the period, list of its entries.
F4 Reports, empty: Pandi reading pose 180px, Title "Reports need a few days", line "You've logged 1 of 3 days.", three progress dots (one filled), grey capsule "Add entry".
```

## Prompt 6: Rewards (6 screens)
```
[STYLE LOCK]
Design the Rewards tab. Badges are round medallions 72px: earned = coloured flat circle with a white glyph, locked = grey with a small lock.

G1 Rewards (active): Large Title "Rewards". Level card "Level 3 · Planner" with a green XP bar "340 / 500 XP". Streak card with a gold flame, "6 day streak", and 7 weekday dots (6 filled). Row "This week: Log 5 days" with progress 3 of 5. Section "Badges  5 of 14" with a 3-column grid of medallions with names (First Step, Piggy Starter, Made It Mine, Zero Day, On a Roll earned; the rest locked).
G2 Rewards, day 0: Level 1 "Starter" with an empty XP bar "0 / 100 XP", Pandi clipboard pose 160px, Title "Your shelf is empty", line "Every entry fills it up.", locked badge grid with "First Step" labelled "Next up".
G3 Badge detail sheet: medallion 120px, name "On a Roll", description "Log 3 days in a row", "Earned 3 Oct", "+30 XP". A locked variant shows the lock and "How to earn: log 3 days in a row."
G4 Badge unlocked (full-screen modal): dimmed backdrop, medallion large with a soft ring, restrained confetti, Pandi skateboard pose 140px, Title "New badge", name and description, black capsule "Nice".
G5 Level up: "Level 4 · Saver", XP bar overflowing into the next level, Pandi gaming pose 160px, black capsule "Keep going".
G6 Streak milestone: large gold flame, "7 days", week dots all filled, Pandi skateboard pose 140px, black capsule "Nice".
```

## Prompt 7: Settings, part 1 (8 screens)
```
[STYLE LOCK]
Design Settings. iOS inset grouped lists, rows 52px high with a coloured icon square, label, value in grey and a chevron.

H1 Settings (tab selected): Large Title "Settings". Profile row (avatar 64, "Amara", email, chevron). Groups with small grey caps headers: MONEY (Daily budget UGX 20,000, Saving goal UGX 5,000, Currency UGX), CATEGORIES (Manage categories), APP (Appearance System, Install RoCash), DATA (Export my data), ACCOUNT (Sign out, Delete account in red). Footer "RoCash 1.0 · Developed by Shina" and a small "Credits" link.
H2 Profile: large avatar 120 with "Change" under it, Name row "Amara", Email row (read only), Sign-in method row "Google".
H3 Avatar picker sheet: same as onboarding B3 with "Save" in the top right.
H4 Daily goals: two rows with amounts, tapping opens a keypad sheet. Footnote "Used for your ring and streak."
H5 Currency: searchable list with ISO code and name, green check on UGX.
H6 Categories: group DEFAULT with lock icons (Transport, Data & Airtime, Food, Other) and footnote "Defaults can't be removed." Group YOURS with two custom categories (drag handles), row "+ Add category" in green.
H7 Categories, no custom ones: group YOURS replaced by Pandi designer pose 140px, headline "Make one that's truly yours", grey capsule "Add category".
H8 Edit category sheet: name field, icon grid, colour dots, preview, destructive text "Archive category", footnote "Past entries are kept."
```

## Prompt 8: Settings, part 2 and system states (9 screens)
```
[STYLE LOCK]
Design these screens.

H9 Appearance: three large selectable cards "System", "Light", "Dark" each with a mini phone preview, selected one has a green border and check.
H10 Install on iPhone (sheet): Pandi delivery pose 140px, Title "Add RoCash to your Home Screen", 3 numbered steps with icons: "Tap the Share button in Safari", "Choose Add to Home Screen", "Open RoCash from your Home Screen", grey capsule "Got it".
H11 Install on Android: sheet with one black capsule "Install RoCash" and three benefit rows (Opens instantly, Works offline, Full screen).
H12 Export data: rows "All entries (CSV)" and "Savings (CSV)", black capsule "Download", success toast.
H13 Sign out: iOS action sheet "Sign out of RoCash?" with red "Sign out" and "Cancel".
H14 Delete account: sheet, Title "Delete your account?", calm paragraph "This removes your entries, badges and profile for good.", text field "Type DELETE", red capsule "Delete everything" disabled until typed, grey "Cancel". No mascot.
H15 About and credits: version, "Developed by Shina", credits list "Pandi by svgapp.ai (MIT)", "DiceBear avatars (MIT code, CC0 styles)", Privacy Policy, Terms.
I1 Offline (first load, nothing cached): Pandi campfire pose 180px, Title "You're offline", line "Your entries are safe and will sync.", grey capsule "Try again".
I2 Install nudge (appears after the first entry, medium sheet): Pandi delivery pose 120px, Title "Keep RoCash one tap away", line "Add it to your Home Screen.", black capsule "Show me how", text "Not now".
```

## Prompt 9: System states (4 screens)
```
[STYLE LOCK]
Design these small system states.

I3 Session expired: medium sheet, Title "Please sign in again", line "For your security, your session ended.", black capsule "Sign in".
I4 Update available: toast capsule at the top "New version ready  Refresh" over Today.
I5 Something went wrong: centred Title "That didn't work", line "Check your connection and try again.", grey capsule "Try again".
I6 Loading skeletons for Month and Reports: shimmering grey blocks matching the real layouts.
```

## Prompt 10: Dark mode, part 1
```
Dark mode of the same RoCash design. Use the dark tokens: true black page #000000, surfaces #1C1C1E, raised #2C2C2E, white text, secondary text rgba(235,235,245,0.6), accent green #3CD070, over #FF7A72, gold #FFD60A, hairlines #38383A, no shadows. Primary buttons invert: white capsule with black label. Keep every layout, copy and sample data identical. Pandi stays the same, add a very subtle light edge. Regenerate in dark mode: A1, A2, A3, A5, A10, B1, B2, B3, B4, B6, C1, C2, C3, C4.
```

## Prompt 11: Dark mode, part 2
```
Dark mode (same dark tokens as before, true black page, surfaces #1C1C1E, inverted primary buttons, no shadows). Regenerate: C5, C7, D1, D2, D3, D4, D6, E1, E2, E3, F1, F4, G1, G2, G3, G4, H1, H2, H6, H7, H9, H10, I1, I2.
Then run a consistency check on all screens in both modes: spacing on the 4pt grid, one primary button per screen, text contrast 4.5:1 or better, one mascot at most per screen, no more than one hero block per screen. Fix only what breaks these rules.
```

---

## After the screens
Export the whole project (HTML, DESIGN.md and PNG per screen) and bring it to the next chat. Block 3 (AI Studio) will use this
spec: screens, avatar picker, Pandi poses, motion and the database.
