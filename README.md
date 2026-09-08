# MarkFlow

Local-first markdown notepad — Notion/Linear-inspired dark UI, live GFM preview, and debounced `localStorage` autosave.

## Stack

- **Next.js** (App Router) + React Client Components
- **Tailwind CSS** + `@tailwindcss/typography`
- **react-markdown** + **remark-gfm**
- **lucide-react** icons

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/                 # Next.js shell (layout, page, globals)
  components/          # UI: Sidebar, Workspace, Editor, Preview, …
  hooks/               # useLocalStorage, useNotes, useKeyboardShortcuts
  lib/                 # note helpers + .md export
  types/               # Note / NotesStore types
```

## Features

- Collapsible sidebar with search, create, delete (confirm), last-modified sort
- Split editor + live preview (Editor / Split / Preview modes)
- Auto titles from the first markdown line (manual rename supported)
- Word / character count, `.md` export
- `Ctrl/Cmd + N` → new note
- Debounced autosave to `localStorage` (`markflow.notes.v1`)
