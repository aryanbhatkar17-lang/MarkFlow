/**
 * Trigger a browser download for the active note as a .md file.
 */

import type { Note } from "@/types/note";

/** Sanitize a title into a safe filename stem. */
function toFilename(title: string): string {
  const stem = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${stem || "untitled"}.md`;
}

export function exportNoteAsMarkdown(note: Note): void {
  const blob = new Blob([note.content], {
    type: "text/markdown;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = toFilename(note.title);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  // Delay revoke so the download has a chance to start
  setTimeout(() => URL.revokeObjectURL(url), 250);
}
