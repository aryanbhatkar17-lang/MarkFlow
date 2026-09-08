"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { Note } from "@/types/note";
import { formatAbsoluteDate, formatRelativeTime } from "@/lib/notes";

interface NoteListItemProps {
  note: Note;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Single sidebar row.
 * Delete uses a two-click confirmation so accidents are harder.
 */
export function NoteListItem({
  note,
  isActive,
  onSelect,
  onDelete,
}: NoteListItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete(note.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(note.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(note.id);
        }
      }}
      className={[
        "group relative flex w-full cursor-pointer flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        isActive
          ? "bg-elevated text-foreground shadow-sm ring-1 ring-border"
          : "text-foreground/70 hover:bg-elevated/70 hover:text-foreground",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="line-clamp-1 text-sm font-medium text-inherit">
          {note.title}
        </span>

        <div
          className={[
            "flex shrink-0 items-center gap-1 transition-opacity duration-200 ease-out",
            confirmDelete
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100",
          ].join(" ")}
        >
          {confirmDelete ? (
            <>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted transition-colors duration-200 ease-out hover:bg-accent-soft hover:text-foreground"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-danger transition-colors duration-200 ease-out hover:bg-danger/10"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="rounded-md p-1 text-muted transition-colors duration-200 ease-out hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label={`Delete ${note.title}`}
              title="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted/80">
        <time
          dateTime={new Date(note.updatedAt).toISOString()}
          title={formatAbsoluteDate(note.updatedAt)}
        >
          {formatRelativeTime(note.updatedAt)}
        </time>
        <span aria-hidden>·</span>
        <time
          dateTime={new Date(note.createdAt).toISOString()}
          title={`Created ${formatAbsoluteDate(note.createdAt)}`}
        >
          created {formatAbsoluteDate(note.createdAt).split(",")[0]}
        </time>
      </div>
    </div>
  );
}
