# Security+ SY0-701 Prep

CompTIA Security+ SY0-701 study pack — recovered from a USB backup, repaired, and expanded.

**Open `index.html`** (or visit the GitHub Pages site) — everything runs client-side, no server or build step needed.

## What's inside

- **28 sections**, each with: interactive simulator, topic quiz, study notes, instant-feedback practice exam, and a section final exam
- **3 CompTIA-style full practice exams** — 90 questions each, all sections interleaved, escalating difficulty (Foundations → Intermediate → Expert), 90-minute timer, scaled 100–900 scoring with 750 pass mark
- **3 mega exams** (realistic / harder / hardest)
- **Analytics dashboard** (`analytics.html`) — every timed exam saves your result locally: readiness verdict, predicted score, per-section strengths/weaknesses, and a prioritized study plan

## iPhone / mobile

- Fully responsive, touch-sized controls, iOS no-zoom input sizing
- Add-to-homescreen ready (PWA manifest + icon): launches standalone like a native app
- Works offline once loaded — everything is static

## Structure

- `exam-simulator/` — all course exam pages, quizzes, and study notes
- `library.html` — every exam ordered by section (start here)
- `analytics.html` — progress analytics (data stays in your browser via localStorage)
- `section-3-threat-actors/`, `study-notes-pdf/`, `cert-timeline/` — extra materials
- `planner-app/` — study planner app source
- `build-*.js`, `add-analytics.js`, `fix-descriptions.js`, `check-pages.js` — generator/maintenance scripts used to build and repair the pack
