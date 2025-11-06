# Job Tracker

Job Tracker is a single-page React application for organizing job applications, capturing key details, and tracking progress from draft to offer. The app persists data locally, making it simple to resume where you left off without external dependencies.

## Features

- **Application management** – add, view, update, and delete job applications with company, position, level, status, job link, applied date, and notes.
- **Status timeline** – review status changes and note edits in a chronological timeline with clear visual cues for the latest update.
- **Notes editor** – edit and save notes directly from the detail view with automatic activity logging.
- **Filters & search** – quickly locate applications by status or keyword.
- **Local persistence** – data is stored in browser storage through a simple storage utility; no database setup required.

## Getting Started

```bash
npm install
npm run dev
```

Open the local development URL shown in the terminal (default: `http://localhost:5173`).

## Available Scripts

- `npm run dev` – start the Vite development server with hot module replacement.
- `npm run build` – produce a production-ready build in the `dist` directory.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint checks across the codebase.

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS (utility classes)](https://tailwindcss.com)
- [Lucide React icons](https://lucide.dev)

## Data Storage

All application data is saved via `window.storage`, backed by `localStorage` for development. Clearing browser storage will reset the application state.
