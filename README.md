# Plan Study Week

A calm browser-based study planner for managing subjects, tasks, and study sessions with a GitHub Pages-ready static setup.

## Live Demo
This project is ready for GitHub Pages deployment, but no published URL is documented in the repo yet.

## Key Features
- Local-first planner with browser storage
- Subject, task, and study-session tracking
- Weekly goal progress by subject
- Responsive dashboard for desktop and mobile
- Firebase-friendly architecture for future auth and sync

## Tech Stack
- HTML
- CSS
- JavaScript
- Optional Firebase later for auth and cross-device sync

## Setup / Run Locally
Open `index.html` directly in the browser, or serve the repo with a lightweight local server such as `npx serve` or `python -m http.server`.

## Tests
No automated test suite is set up yet for this static MVP.

## Deployment Notes
- The project is designed for GitHub Pages deployment from the repository root.
- Relative asset paths already work for local use and project-page publishing.
- Recommended repo slug: `plan-study-week`.

## Project Layout
- `index.html` main planner shell
- `app.js` planner behavior and local-state handling
- `styles.css` layout and visual styling
- `shared/` reused styling assets
- `tasks/current-plan.md` working notes for the MVP

## Notes
- The current MVP does not require Firebase.
- A sensible next step is Firebase Auth plus Firestore sync, while keeping `localStorage` as the signed-out fallback.
- The public product name is `Plan Study Week`, and the repo slug target is `plan-study-week`.
