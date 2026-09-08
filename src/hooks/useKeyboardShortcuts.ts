"use client";

import { useCallback, useEffect } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

interface Shortcut {
  /** Lowercase key, e.g. "n" or "s". */
  key: string;
  /** Require Ctrl (Windows/Linux) or Meta (macOS). */
  mod?: boolean;
  /** Optional Shift. */
  shift?: boolean;
  handler: ShortcutHandler;
}

/**
 * Register global keyboard shortcuts.
 * Skips when the event target is a contenteditable / input — except for
 * shortcuts that intentionally work inside the editor (mod+n, etc.).
 */
export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  enabled = true,
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const shortcut of shortcuts) {
        const modPressed = event.metaKey || event.ctrlKey;
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const modMatches = shortcut.mod ? modPressed : !modPressed;
        const shiftMatches = shortcut.shift
          ? event.shiftKey
          : !event.shiftKey;

        if (keyMatches && modMatches && shiftMatches) {
          event.preventDefault();
          shortcut.handler(event);
          return;
        }
      }
    },
    [enabled, shortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
