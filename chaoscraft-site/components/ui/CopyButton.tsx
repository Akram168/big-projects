"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyButton({ text, className, label = "Copy IP" }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button onClick={copy}
      className={cn("text-sm font-medium px-3.5 py-2 rounded-full border transition-colors",
        copied
          ? "border-[var(--brand)] text-[var(--brand-soft)] bg-[var(--brand)]/10"
          : "border-[var(--border-hi)] text-[var(--text)] bg-[var(--bg-card)] hover:border-[var(--brand)]",
        className)}>
      {copied ? "Copied ✓" : label}
    </button>
  );
}
