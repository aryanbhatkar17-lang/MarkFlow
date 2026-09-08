"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewProps {
  content: string;
}

/**
 * Live GFM preview.
 * Serif body for a reading-desk feel; soft accent links.
 */
export function Preview({ content }: PreviewProps) {
  if (!content.trim()) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-sm text-muted">
        Your preview will appear as you write.
      </div>
    );
  }

  return (
    <div className="custom-scrollbar h-full overflow-y-auto px-4 py-4 md:px-6 md:py-5">
      <article
        className="
          prose prose-sm max-w-none font-serif
          prose-headings:scroll-mt-4 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
          prose-p:text-foreground/80 prose-p:leading-relaxed
          prose-a:text-accent prose-a:underline prose-a:decoration-accent/30 prose-a:underline-offset-2 hover:prose-a:decoration-accent
          prose-strong:text-foreground
          prose-code:rounded-md prose-code:bg-accent-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.85em] prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
          prose-pre:border prose-pre:border-border prose-pre:bg-sidebar prose-pre:shadow-none
          prose-blockquote:border-accent/40 prose-blockquote:text-muted
          prose-hr:border-border
          prose-li:marker:text-accent/70
          prose-table:text-sm
          prose-th:border-border prose-td:border-border
        "
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
