"use client";

import { useEffect, useState } from "react";

export function SearchShortcut() {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(navigator.platform?.toLowerCase().includes("mac") ?? /mac/i.test(navigator.userAgent));
  }, []);

  return (
    <kbd
      className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex"
    >
      <span className="text-xs">{isMac ? "\u2318" : "Ctrl+"}</span>K
    </kbd>
  );
}
