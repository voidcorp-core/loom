"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is Loom truly free?",
    answer:
      "Yes. Loom is open-source under MIT. The CLI, the library, and the backoffice are all free to use, fork, and extend. No hidden limits, no paywalls.",
  },
  {
    question: "How does this compare to LangChain Hub?",
    answer:
      "LangChain Hub focuses on prompts and chains for LangChain. Loom scaffolds full agent configurations — including system prompts, tool access, skill files, and orchestration rules — directly into your project. It's framework-agnostic and works with Claude Code, Cursor, and more.",
  },
  {
    question: "Can I create and share my own agents?",
    answer:
      "Absolutely. Create agents and skills locally with the CLI, then publish them to the Loom Marketplace with `loom publish`. Other developers can install them with a single command.",
  },
  {
    question: "What languages and frameworks are supported?",
    answer:
      "Loom generates plain Markdown and YAML files — it works with any language or framework. The agents and skills are instructions for AI assistants, not runtime code. Your stack, your rules.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-lg border bg-card/50 transition-colors hover:bg-card"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium"
            >
              {faq.question}
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
