"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import type { Note } from "@/types/note";
import { formatAbsoluteDate } from "@/lib/notes";
import { exportNoteAsMarkdown } from "@/lib/export";

interface ToolbarProps {
  note: Note;
  onTitleChange: (title: string) => void;
  onResetTitle: () => void;
  viewMode: "split" | "edit" | "preview";
  onViewModeChange: (mode: "split" | "edit" | "preview") => void;
}

/**
 * Workspace chrome: editable title, view toggles, export.
 */
export function Toolbar({
  note,
  onTitleChange,
  onResetTitle,
  viewMode,
  onViewModeChange,
}: ToolbarProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(note.title);
    setEditing(false);
  }, [note.id, note.title]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commitTitle = () => {
    setEditing(false);
    if (draft.trim() !== note.title) {
      onTitleChange(draft);
    } else {
      setDraft(note.title);
    }
  };

  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border bg-panel/90 px-3 py-3 backdrop-blur-sm md:px-5">
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setDraft(note.title);
                setEditing(false);
              }
            }}
            className="w-full max-w-md rounded-lg border border-border bg-elevated px-2.5 py-1.5 font-serif text-base font-semibold text-foreground outline-none transition-colors duration-200 ease-out focus:border-accent/40 focus:ring-2 focus:ring-accent/25"
            aria-label="Note title"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="max-w-full truncate rounded-lg px-1.5 py-1 text-left font-serif text-base font-semibold text-foreground transition-colors duration-200 ease-out hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            title="Click to rename"
          >
            {note.title}
          </button>
        )}
        <p className="mt-0.5 px-1.5 text-[12px] text-muted">
          Edited {formatAbsoluteDate(note.updatedAt)}
          {note.titleManuallySet && (
            <button
              type="button"
              onClick={onResetTitle}
              className="ml-2 inline-flex items-center gap-1 text-muted transition-colors duration-200 ease-out hover:text-accent"
              title="Use first-line title again"
            >
              <RotateCcw className="h-3 w-3" />
              Auto title
            </button>
          )}
        </p>
      </div>

      <div className="flex items-center rounded-xl border border-border bg-elevated p-0.5 text-xs">
        {(
          [
            ["edit", "Write"],
            ["split", "Both"],
            ["preview", "Read"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => onViewModeChange(mode)}
            className={[
              "rounded-lg px-2.5 py-1.5 font-medium transition-colors duration-200 ease-out",
              viewMode === mode
                ? "bg-accent-soft text-accent"
                : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => exportNoteAsMarkdown(note)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-elevated px-2.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors duration-200 ease-out hover:border-accent/30 hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        title="Export as .md"
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </button>
    </header>
  );
}
