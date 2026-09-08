"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/types/note";
import { Toolbar } from "@/components/Toolbar";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { EmptyState } from "@/components/EmptyState";

type ViewMode = "split" | "edit" | "preview";

interface WorkspaceProps {
  note: Note | null;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onResetTitle: () => void;
  onCreate: () => void;
}

/**
 * Right pane: toolbar + editor/preview.
 * Defaults to side-by-side split; falls back to tabs on narrow viewports
 * via the view-mode control (user can still force split).
 */
export function Workspace({
  note,
  onContentChange,
  onTitleChange,
  onResetTitle,
  onCreate,
}: WorkspaceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      if (mq.matches) setViewMode((m) => (m === "split" ? "edit" : m));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!note) {
    return (
      <main className="flex min-h-0 flex-1 flex-col bg-panel">
        <EmptyState
          variant="no-selection"
          actionLabel="New note"
          onAction={onCreate}
        />
      </main>
    );
  }

  const showEditor = viewMode === "split" || viewMode === "edit";
  const showPreview = viewMode === "split" || viewMode === "preview";

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <Toolbar
        note={note}
        onTitleChange={onTitleChange}
        onResetTitle={onResetTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex min-h-0 flex-1">
        {showEditor && (
          <section
            className={[
              "min-h-0 min-w-0",
              showPreview ? "w-1/2 border-r border-border" : "w-full",
            ].join(" ")}
            aria-label="Editor pane"
          >
            <Editor value={note.content} onChange={onContentChange} />
          </section>
        )}

        {showPreview && (
          <section
            className={["min-h-0 min-w-0", showEditor ? "w-1/2" : "w-full"].join(
              " ",
            )}
            aria-label="Preview pane"
          >
            <Preview content={note.content} />
          </section>
        )}
      </div>
    </main>
  );
}
