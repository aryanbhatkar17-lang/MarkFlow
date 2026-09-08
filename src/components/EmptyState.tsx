"use client";

import { FileText, NotebookPen } from "lucide-react";

interface EmptyStateProps {
  variant: "no-notes" | "no-selection" | "no-search-results";
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Soft empty states — illustration + copy, no heavy card chrome.
 */
export function EmptyState({
  variant,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const copy = {
    "no-notes": {
      title: "Nothing here yet",
      body: "Start a note whenever a thought shows up — it stays on this device.",
      Icon: NotebookPen,
    },
    "no-selection": {
      title: "Pick a page",
      body: "Open something from the side, or begin a fresh note.",
      Icon: FileText,
    },
    "no-search-results": {
      title: "No matches",
      body: "Try another word, or clear search to see everything again.",
      Icon: FileText,
    },
  }[variant];

  const { Icon, title, body } = copy;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
        {body}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-[#245c4c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
