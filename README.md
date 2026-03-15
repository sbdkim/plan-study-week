# Plan Study Week

A calm, GitHub Pages-ready study planner for managing subjects, tasks, and study sessions in the browser with Northline branding.

## Status

Initial static MVP scaffolded for deployment on GitHub Pages.

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

## Run Locally

Because this is a static site, you can open `index.html` directly in the browser or serve it with a lightweight local server.

Examples:

- VS Code Live Server
- `npx serve`
- `python -m http.server`

## Deployment

This project is designed for GitHub Pages.

Typical flow:

1. Push the repo to GitHub.
2. Open repository settings.
3. Enable GitHub Pages from the main branch root.
4. Visit the generated Pages URL.

### Recommended Repo Settings

- Repository name: `study-planner`
- Pages source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

If you publish as a project page, the current relative asset paths already work without changes.

## Firebase Notes

The current MVP does not require Firebase.

A sensible next step is:

- Firebase Auth for optional Google sign-in
- Firestore for syncing planner data by user
- Keep local storage as the fallback when signed out

This approach stays friendly to Firebase's free Spark plan for modest usage.

## Branding Note

The public product name is `Plan Study Week`, while the repo slug remains `study-planner` until the rename pass.
