"use client";

import { useMemo, useState } from "react";
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import type { Note } from "@/types/note";
import { SearchInput } from "@/components/SearchInput";
import { NoteListItem } from "@/components/NoteListItem";
import { EmptyState } from "@/components/EmptyState";
import { filterNotes } from "@/lib/notes";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({
  notes,
  activeNoteId,
  collapsed,
  onToggle,
  onSelect,
  onCreate,
  onDelete,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const visibleNotes = useMemo(
    () => filterNotes(notes, query),
    [notes, query],
  );

  const iconBtn =
    "rounded-lg p-2 text-muted transition-colors duration-200 ease-out hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

  if (collapsed) {
    return (
      <aside className="flex h-full w-12 shrink-0 flex-col items-center border-r border-border bg-sidebar/80 py-3 backdrop-blur-[2px]">
        <button
          type="button"
          onClick={onToggle}
          className={iconBtn}
          aria-label="Expand sidebar"
          title="Expand sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onCreate}
          className={`mt-1 ${iconBtn}`}
          aria-label="New note"
          title="New note (Ctrl/⌘ N)"
        >
          <Plus className="h-4 w-4" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-sidebar/90 backdrop-blur-[2px] transition-[width] duration-200 ease-out md:w-80">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
        <div className="min-w-0">
          <p className="font-serif truncate text-lg font-semibold tracking-tight text-foreground">
            MarkFlow
          </p>
          <p className="mt-0.5 text-[12px] text-muted">Your quiet notebook</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={iconBtn}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-2.5 border-b border-border px-3 py-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-[#245c4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          New note
        </button>
        <SearchInput value={query} onChange={setQuery} />
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-2 py-2">
        {notes.length === 0 ? (
          <EmptyState
            variant="no-notes"
            actionLabel="Start writing"
            onAction={onCreate}
          />
        ) : visibleNotes.length === 0 ? (
          <EmptyState variant="no-search-results" />
        ) : (
          <ul className="space-y-1" role="listbox" aria-label="Notes">
            {visibleNotes.map((note) => (
              <li key={note.id} role="option" aria-selected={note.id === activeNoteId}>
                <NoteListItem
                  note={note}
                  isActive={note.id === activeNoteId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border px-4 py-3 text-[12px] text-muted">
        {notes.length} {notes.length === 1 ? "note" : "notes"} · saved here
      </div>
    </aside>
  );
}
