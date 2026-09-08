"use client";

import { useMemo } from "react";
import { countWordsAndChars } from "@/lib/notes";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Raw markdown textarea.
 * Monospace + custom scrollbar; word/char count lives in the footer strip.
 */
export function Editor({
  value,
  onChange,
  placeholder = "Write freely… markdown works here.",
}: EditorProps) {
  const stats = useMemo(() => countWordsAndChars(value), [value]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck
        className="custom-scrollbar font-mono flex-1 resize-none bg-transparent px-4 py-4 text-[13px] leading-7 text-foreground/90 placeholder:text-muted/60 outline-none focus:outline-none md:px-6 md:py-5 md:text-sm md:leading-7"
        aria-label="Markdown editor"
      />

      <div className="flex shrink-0 items-center justify-between border-t border-border px-4 py-2 text-[11px] tabular-nums text-muted md:px-6">
        <span>
          {stats.words} {stats.words === 1 ? "word" : "words"}
        </span>
        <span>{stats.chars.toLocaleString()} characters</span>
      </div>
    </div>
  );
}
