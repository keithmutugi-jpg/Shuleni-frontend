# Shuleni — Frontend

React + Vite + Tailwind v4 frontend for **Shuleni**, an online school platform.
The visual style is copied from the team's Figma wireframe ("Chat interface
wireframe"): monochrome black/white/gray, dotted canvas background, rounded
cards, black pill nav/buttons, and a book-logo mark.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

Requires Node 18+.

## Design system

Everything design-related lives in two places so the whole team stays
consistent without needing to open Figma every time:

- `src/index.css` — color tokens (`--sh-*` CSS variables), the dotted
  `.sh-canvas` background, and the `.sh-label` (small uppercase tracked
  caption) utility.
- `src/components/ui.jsx` — shared primitives: `Card`, `Button`, `Field`,
  `Input`, `Avatar`, `Pill`. Build new screens out of these instead of
  hand-rolling new styles, and the look will match automatically.
- `src/components/Logo.jsx` — the book-icon wordmark.
- `src/components/TopNav.jsx` + `src/layouts/AppShell.jsx` — the shared
  header/footer/help-button chrome wrapping every logged-in screen.

## Routing & role ownership

`src/AppRouter.jsx` defines three parallel route trees so each role gets the
same shell and nav, pointed at role-specific pages:

| Route prefix | Role | Home page |
|---|---|---|
| `/` , `/register` | Public | `LoginScreen`, `RegisterSchoolScreen` |
| `/owner/*` | School owner | `OwnerDashboard` |
| `/educator/*` | Educator | `EducatorDashboard` |
| `/student/*` | Student | `StudentDashboard`, `ExamInterface` (no shell — distraction-free) |

Each role tree shares `resources`, `attendance`, and `chats` routes.

## Team breakdown → files

- **Keith** — Auth, routing, school-owner dashboard
  `AppRouter.jsx`, `pages/LoginScreen.jsx`, `pages/RegisterSchoolScreen.jsx`,
  `pages/OwnerDashboard.jsx`, `components/UserManagementModal.jsx`
- **Jayson** — Educator portal & attendance
  `pages/EducatorDashboard.jsx`, `pages/AttendanceView.jsx`,
  `components/StudentRosterTable.jsx`
- **Immanuel** — Resource library
  `pages/ResourceLibrary.jsx`, `components/FolderCard.jsx`,
  `components/UploadResourceModal.jsx`
- **Glen** — Student portal, exams, chats
  `pages/StudentDashboard.jsx`, `pages/ExamInterface.jsx`,
  `pages/ChatRoom.jsx`

Shared school data is now loaded from the Django REST API. `src/data/mock.js` remains only for static schedule/sample UI content.

## API configuration

The frontend reads `VITE_API_URL` and defaults to the deployed Shuleni backend:
`https://shuleni-backend.onrender.com/api`.

For local development, create `.env` from `.env.example` and set:
`VITE_API_URL=http://localhost:8000/api`.

Resources, exams, attendance, chat messages, users and exam results are persisted server-side and are scoped to the authenticated school.
