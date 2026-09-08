/**
 * Core note model persisted in localStorage.
 * All timestamps are Unix ms so sorting / display stay timezone-agnostic.
 */
export interface Note {
  id: string;
  /** Display title — auto-derived from the first markdown line unless manually overridden. */
  title: string;
  /** Raw markdown body. */
  content: string;
  /** When true, title edits from the first line are skipped. */
  titleManuallySet: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Shape of the blob we store under the MarkFlow localStorage key. */
export interface NotesStore {
  notes: Note[];
  /** Currently focused note id (null = nothing selected). */
  activeNoteId: string | null;
  /** Whether the left sidebar is collapsed. */
  sidebarCollapsed: boolean;
}
