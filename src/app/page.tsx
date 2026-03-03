import Link from "next/link";
import {
  Bot,
  Sparkles,
  Layers,
  Search,
  MousePointerClick,
  Terminal,
  Store,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyCommand } from "@/components/ui/copy-command";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { TerminalMockup } from "@/components/landing/terminal-mockup";
import { FeatureCard } from "@/components/landing/feature-card";
import { StepCard } from "@/components/landing/step-card";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <span className="font-medium">Now on npm</span>
            <span className="text-muted-foreground">&mdash; v1.1.0</span>
          </div>
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Scaffold AI agents{" "}
            <span className="text-muted-foreground">into any project</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            A curated library of agents, skills & presets for Claude Code.
            Browse, pick, and scaffold — in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://www.npmjs.com/package/@folpe/loom"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                View on npm
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="mx-auto mt-12 max-w-lg">
            <TerminalMockup
              title="loom init"
              lines={[
                { text: "npx @folpe/loom init", prefix: "$" },
                { text: "" },
                {
                  text: "Welcome to Loom!",
                  className: "text-green-400 font-semibold",
                },
                { text: "Scanning project...", className: "text-white/50" },
                { text: "" },
                {
                  text: "? Select a preset:",
                  className: "text-cyan-400",
                },
                {
                  text: "  > fullstack-nextjs",
                  className: "text-white font-semibold",
                },
                {
                  text: "    frontend-react",
                  className: "text-white/50",
                },
                {
                  text: "    api-backend",
                  className: "text-white/50",
                },
                { text: "" },
                {
                  text: "Scaffolded 4 agents, 6 skills into .claude/",
                  className: "text-green-400",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need
            </h2>
            <p className="mt-2 text-muted-foreground">
              A modular library to supercharge your AI-assisted workflow.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Bot}
              title="Agents"
              description="Specialized AI agents with defined roles, tools, and orchestration rules — ready to drop into your project."
            />
            <FeatureCard
              icon={Sparkles}
              title="Skills"
              description="Domain-specific conventions and patterns that guide agents to write code matching your stack and style."
            />
            <FeatureCard
              icon={Layers}
              title="Presets"
              description="Pre-configured bundles of agents and skills. Pick a preset and scaffold an entire team in one command."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three steps to a fully configured AI development environment.
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <StepCard
              step={1}
              icon={Search}
              title="Browse"
              description="Explore the library of agents, skills, and presets — or search the community marketplace."
            />
            <StepCard
              step={2}
              icon={MousePointerClick}
              title="Pick"
              description="Select exactly what you need. Mix and match agents and skills, or grab a full preset."
            />
            <StepCard
              step={3}
              icon={Terminal}
              title="Scaffold"
              description="Run loom init and your selection is scaffolded into your project's .claude/ directory."
            />
          </div>
        </div>
      </section>

      {/* CLI */}
      <section id="cli" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Powerful CLI
              </h2>
              <p className="mt-3 text-muted-foreground">
                Install the CLI globally and scaffold agents, skills & presets
                from your terminal.
              </p>
              <div className="mt-6">
                <CopyCommand command="npm install -g @folpe/loom" />
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                    loom init
                  </code>
                  <span>Scaffold a preset into your project</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                    loom add
                  </code>
                  <span>Add individual agents or skills</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                    loom list
                  </code>
                  <span>Browse the full library</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-foreground">
                    loom marketplace
                  </code>
                  <span>Explore community contributions</span>
                </div>
              </div>
            </div>
            <TerminalMockup
              title="loom add"
              lines={[
                { text: "loom add agent frontend", prefix: "$" },
                { text: "" },
                {
                  text: "Adding agent: frontend",
                  className: "text-cyan-400",
                },
                {
                  text: "  → .claude/agents/frontend.md",
                  className: "text-white/60",
                },
                { text: "" },
                { text: "loom add skill nextjs-conventions", prefix: "$" },
                { text: "" },
                {
                  text: "Adding skill: nextjs-conventions",
                  className: "text-cyan-400",
                },
                {
                  text: "  → .claude/skills/nextjs-conventions.md",
                  className: "text-white/60",
                },
                { text: "" },
                { text: "Done.", className: "text-green-400 font-semibold" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Discover community-contributed agents, skills, and presets.
            Share your own creations with the community.
          </p>
          <div className="mt-6">
            <Button size="lg" variant="outline" asChild>
              <Link href="/marketplace">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
