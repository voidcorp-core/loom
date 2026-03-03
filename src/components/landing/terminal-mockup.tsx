import { cn } from "@/lib/utils";

interface TerminalLine {
  text: string;
  prefix?: string;
  className?: string;
}

interface TerminalMockupProps {
  lines: TerminalLine[];
  title?: string;
  className?: string;
}

export function TerminalMockup({
  lines,
  title = "Terminal",
  className,
}: TerminalMockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-[oklch(0.16_0.004_49.25)] text-sm shadow-2xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="flex-1 text-center text-xs text-white/40">
          {title}
        </span>
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            {line.prefix && (
              <span className="select-none text-green-400">{line.prefix}</span>
            )}
            <span className={cn("text-white/80", line.className)}>
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
