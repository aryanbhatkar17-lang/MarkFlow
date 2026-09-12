"use client";

import { useMemo } from "react";
import { useNotes } from "@/hooks/useNotes";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Sidebar } from "@/components/Sidebar";
import { Workspace } from "@/components/Workspace";

/**
 * Root client shell for the SPA.
 * Owns note state + shortcuts; children stay mostly presentational.
 */
export function NotesApp() {
  const {
    isHydrated,
    notes,
    activeNote,
    activeNoteId,
    sidebarCollapsed,
    createNewNote,
    selectNote,
    deleteNote,
    updateContent,
    updateTitle,
    resetTitleToAuto,
    toggleSidebar,
  } = useNotes();

  const shortcuts = useMemo(
    () => [
      {
        key: "n",
        mod: false,
        handler: (event: KeyboardEvent) => {
          if(event.altKey){
            createNewNote();
          }
        }
      },
    ],
    [createNewNote],
  );

  useKeyboardShortcuts(shortcuts, isHydrated);

  if (!isHydrated) {
    return (
      <div className="flex h-dvh items-center justify-center text-sm text-muted">
        Opening your notes…
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden text-foreground">
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onSelect={selectNote}
        onCreate={createNewNote}
        onDelete={deleteNote}
      />

      <Workspace
        note={activeNote}
        onContentChange={(content) => {
          if (activeNote) updateContent(activeNote.id, content);
        }}
        onTitleChange={(title) => {
          if (activeNote) updateTitle(activeNote.id, title);
        }}
        onResetTitle={() => {
          if (activeNote) resetTitleToAuto(activeNote.id);
        }}
        onCreate={createNewNote}
      />
    </div>
  );
}
