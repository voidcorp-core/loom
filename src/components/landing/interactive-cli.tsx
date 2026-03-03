"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const COMMAND = "npx @folpe/loom init";

const OUTPUT_LINES = [
  { text: "", delay: 400 },
  { text: "Welcome to Loom!", className: "text-primary font-semibold", delay: 600 },
  { text: "Scanning project...", className: "text-muted-foreground", delay: 800 },
  { text: "", delay: 200 },
  { text: "? Select a preset:", className: "text-cyan-400", delay: 600 },
  { text: "  > fullstack-nextjs", className: "text-foreground font-semibold", delay: 300 },
  { text: "    frontend-react", className: "text-muted-foreground", delay: 200 },
  { text: "    api-backend", className: "text-muted-foreground", delay: 200 },
  { text: "", delay: 400 },
  { text: "Scaffolded 4 agents, 6 skills into .claude/", className: "text-primary", delay: 0 },
];

export function InteractiveCLI() {
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "done">("typing");
  const [copied, setCopied] = useState(false);

  // Typing animation
  useEffect(() => {
    if (phase !== "typing") return;
    if (typedChars >= COMMAND.length) {
      const timer = setTimeout(() => setPhase("output"), 500);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setTypedChars((c) => c + 1), 60);
    return () => clearTimeout(timer);
  }, [typedChars, phase]);

  // Output lines animation
  useEffect(() => {
    if (phase !== "output") return;
    if (visibleLines >= OUTPUT_LINES.length) {
      setPhase("done");
      return;
    }
    const delay = OUTPUT_LINES[visibleLines]?.delay ?? 300;
    const timer = setTimeout(() => setVisibleLines((l) => l + 1), delay);
    return () => clearTimeout(timer);
  }, [visibleLines, phase]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(COMMAND);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border bg-card text-sm text-left shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-muted-foreground">Terminal</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy command"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Terminal content */}
      <div className="p-4 font-mono text-[13px] leading-relaxed">
        {/* Command line */}
        <div className="flex gap-2">
          <span className="select-none text-primary">$</span>
          <span className="text-foreground">
            {COMMAND.slice(0, typedChars)}
            {phase === "typing" && (
              <span className="inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-primary" />
            )}
          </span>
        </div>

        {/* Output lines */}
        {OUTPUT_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={line.className ?? "text-foreground/80"}>
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>
    </div>
  );
}
