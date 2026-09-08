import type { Note } from "@/types/note";


export const UNTITLED = "Untitled";

export const WELCOME_MARKDOWN = `# Welcome to MarkFlow

A fast, local-first markdown notepad.

## Features

- **Live preview** with GitHub Flavored Markdown
- **Auto-save** to your browser (\`localStorage\`)
- **Keyboard shortcuts** — \`Ctrl/Cmd + N\` for a new note
- Export any note as a \`.md\` file

### Try a checklist

- [x] Open MarkFlow
- [ ] Write something great
- [ ] Export it

> Tip: Titles come from the first line. Click the title to rename manually.

\`\`\`ts
const idea = "ship it";
console.log(idea);
\`\`\`
`;

export function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function deriveTitleFromContent(content: string): string {
  const firstLine = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!firstLine) return UNTITLED;

  const cleaned = firstLine
    // ATX headings: # ## ### …
    .replace(/^#{1,6}\s+/, "")
    // Unordered list markers
    .replace(/^[-*+]\s+/, "")
    // Ordered list markers
    .replace(/^\d+\.\s+/, "")
    // Blockquote prefix
    .replace(/^>\s+/, "")
    // Inline code ticks / bold / italic remnants (lightweight)
    .replace(/[*_`~]/g, "")
    .trim();

  if (!cleaned) return UNTITLED;
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}…` : cleaned;
}

export function createNote(partial?: Partial<Pick<Note, "title" | "content">>): Note {
  const now = Date.now();
  const content = partial?.content ?? "";
  const title =
    partial?.title ??
    (content ? deriveTitleFromContent(content) : UNTITLED);

  return {
    id: createId(),
    title,
    content,
    titleManuallySet: Boolean(partial?.title),
    createdAt: now,
    updatedAt: now,
  };
}

export function sortNotesByUpdatedDesc(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function filterNotes(notes: Note[], query: string): Note[] {
  const q = query.trim().toLowerCase();
  if (!q) return notes;
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q),
  );
}

export function countWordsAndChars(text: string): { words: number; chars: number } {
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  return { words, chars: text.length };
}

export function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAbsoluteDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
