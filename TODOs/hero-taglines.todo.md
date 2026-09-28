# Hero Taglines

Parked mid-discussion. Noah wants to revisit it.

## Goal
Rewrite the rotating hero taglines so they (a) are the first way visitors learn about Noah, and (b) make the typewriter's selective rewrite look like someone indecisively revising their own intro.

## What we learned
- The typewriter (`buildTypewriterFrames` in `@noahwright/design`) keeps words shared by both lines, but **only in the same relative order**. Similar words are edited from their **shared prefix** (`Leading → Leader`, `Air → Chair`), so shared suffixes like "-ing" don't help.
- The lines are shuffled, so overlap has to come from a shared vocabulary rather than hand-ordered chains. The current list keeps **2%** of each new line (12% of transitions are real edits).
- Order-independent matching is requested upstream: NoahWright87/design#24.
- The longest line sets the reserved height (TextCarousel sizes to its tallest item), so keep lines to about 32–34 characters.
- Rule that worked: **every line carries 2+ words from a small shared set**, uses concrete facts rather than buzzwords, and adds new information instead of rephrasing another line.

## Statements to cover
AI at work and home · making and playing games · serious about the craft but with levity · has led engineers and been an IC · Air Force veteran of office jobs ("Chair Force") · the site is always evolving · family matters. Four kids; the caregiving story stays on About, not in the hero.

## Latest draft (draft 3: 10% kept, 32% real edits, shuffled)
- 👔 Leading engineers with empathy
- ⌨️ Engineer first, leader second
- 🤖 Building software with AI
- 🤖 Helping engineers build with AI
- 🎮 Building games with AI, for fun
- 🎮 Playing games with my family
- 👨‍👩‍👧‍👦 Leading a family of six
- 🎨 Designing software for engineers
- ✅ Serious about software quality
- 🤡 Serious about having fun
- 🇺🇸 Ten years in the Air Force
- 💺 Ten years in the Chair Force
- 🚧 Building this site, forever

## Open questions
- [ ] Is "Leading a family of six" right, meaning Noah, his wife and four kids?
- [ ] "Engineer first, leader second" or "Engineer turned leader"?
- [ ] Is "Playing games with my family" true, or should the playing line be about Noah himself?
- [ ] Anything missing, e.g. the Google Foobar story?

## Tasks (once the list is settled)
- [ ] Replace `HERO_TITLES` in `src/components/pages/HomePageClient.tsx`
- [ ] Raise the dwell time to about 3.5s (`interval` on `TextCarousel`; the default is 2.5s)

## Done When
The new list is live and Noah is happy with it (for now 😉).
