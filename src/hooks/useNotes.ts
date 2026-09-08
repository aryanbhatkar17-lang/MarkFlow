"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  WELCOME_MARKDOWN,
  createNote,
  deriveTitleFromContent,
  filterNotes,
  sortNotesByUpdatedDesc,
} from "@/lib/notes";
import type { Note, NotesStore } from "@/types/note";

const STORAGE_KEY = "markflow.notes.v1";

/** Seed used only before hydration / on a truly empty first visit. */
function buildInitialStore(): NotesStore {
  const welcome = createNote({ content: WELCOME_MARKDOWN });
  return {
    notes: [welcome],
    activeNoteId: welcome.id,
    sidebarCollapsed: false,
  };
}

/**
 * Domain hook: all note CRUD + selection lives here.
 * Components stay presentational; this owns the persistence boundary.
 */
export function useNotes() {
  const [store, setStore, isHydrated] = useLocalStorage<NotesStore>(
    STORAGE_KEY,
    buildInitialStore(),
    350,
  );

  const notesSorted = useMemo(
    () => sortNotesByUpdatedDesc(store.notes),
    [store.notes],
  );

  const activeNote = useMemo(
    () => store.notes.find((n) => n.id === store.activeNoteId) ?? null,
    [store.notes, store.activeNoteId],
  );

  const createNewNote = useCallback(() => {
    const note = createNote();
    setStore((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
      activeNoteId: note.id,
    }));
    return note;
  }, [setStore]);

  const selectNote = useCallback(
    (id: string) => {
      setStore((prev) => ({ ...prev, activeNoteId: id }));
    },
    [setStore],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setStore((prev) => {
        const remaining = prev.notes.filter((n) => n.id !== id);
        const nextActive =
          prev.activeNoteId === id
            ? remaining[0]?.id ?? null
            : prev.activeNoteId;
        return {
          ...prev,
          notes: remaining,
          activeNoteId: nextActive,
        };
      });
    },
    [setStore],
  );

  /**
   * Update markdown body. Auto-refreshes title from the first line
   * unless the user has manually renamed the note.
   */
  const updateContent = useCallback(
    (id: string, content: string) => {
      setStore((prev) => ({
        ...prev,
        notes: prev.notes.map((n) => {
          if (n.id !== id) return n;
          const nextTitle = n.titleManuallySet
            ? n.title
            : deriveTitleFromContent(content);
          return {
            ...n,
            content,
            title: nextTitle,
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [setStore],
  );

  /** Manual title edit — locks auto-title until content still drives display. */
  const updateTitle = useCallback(
    (id: string, title: string) => {
      const trimmed = title.trim() || "Untitled";
      setStore((prev) => ({
        ...prev,
        notes: prev.notes.map((n) =>
          n.id === id
            ? {
                ...n,
                title: trimmed,
                titleManuallySet: true,
                updatedAt: Date.now(),
              }
            : n,
        ),
      }));
    },
    [setStore],
  );

  /** Clear the manual flag so the next content edit re-derives the title. */
  const resetTitleToAuto = useCallback(
    (id: string) => {
      setStore((prev) => ({
        ...prev,
        notes: prev.notes.map((n) => {
          if (n.id !== id) return n;
          return {
            ...n,
            titleManuallySet: false,
            title: deriveTitleFromContent(n.content),
            updatedAt: Date.now(),
          };
        }),
      }));
    },
    [setStore],
  );

  const toggleSidebar = useCallback(() => {
    setStore((prev) => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, [setStore]);

  const search = useCallback(
    (query: string): Note[] => filterNotes(notesSorted, query),
    [notesSorted],
  );

  return {
    isHydrated,
    notes: notesSorted,
    activeNote,
    activeNoteId: store.activeNoteId,
    sidebarCollapsed: store.sidebarCollapsed,
    createNewNote,
    selectNote,
    deleteNote,
    updateContent,
    updateTitle,
    resetTitleToAuto,
    toggleSidebar,
    search,
  };
}
