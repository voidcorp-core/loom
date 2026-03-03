import Link from "next/link";
import {
  Bot,
  Sparkles,
  Layers,
  Share2,
  Shield,
  Terminal,
  Code2,
  FolderTree,
} from "lucide-react";
import { CopyCommand } from "@/components/ui/copy-command";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { FeatureCard } from "@/components/landing/feature-card";
import { LoomWeaver } from "@/components/landing/loom-weaver";
import { InteractiveCLI } from "@/components/landing/interactive-cli";
import { FAQSection } from "@/components/landing/faq-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <LoomWeaver />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-medium text-primary">Free & Open Source</span>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            AI agents,{" "}
            <span className="text-primary">
              scaffolded in seconds.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Loom scaffolds production-ready AI agents, skills, and presets into
            any project. No lock-in, just pure code.
          </p>
          <div className="mx-auto mt-10 max-w-lg">
            <InteractiveCLI />
          </div>
        </div>
      </section>

      {/* Value Props — How it works */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Scaffold in seconds
            </h2>
            <p className="mt-2 text-muted-foreground">
              Three commands. Full AI development environment.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Terminal,
                title: "Scaffold in Seconds",
                command: "loom add agent:customer-support --skill:zendesk",
                description:
                  "One command to scaffold an agent with its skills, tools, and orchestration rules.",
              },
              {
                icon: Code2,
                title: "Framework Agnostic",
                command: "cat .claude/agents/frontend.md",
                description:
                  "Plain Markdown and YAML files. Eject anytime — your code, your rules.",
              },
              {
                icon: Share2,
                title: "Share and Discover",
                command: "loom publish my-agent",
                description:
                  "Publish to the marketplace. Install community agents with a single command.",
              },
            ].map((prop) => (
              <div
                key={prop.title}
                className="rounded-xl border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <prop.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{prop.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {prop.description}
                </p>
                <code className="block rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-muted-foreground">
                  $ {prop.command}
                </code>
              </div>
            ))}
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
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <FeatureCard
              icon={Bot}
              title="Agent Management"
              description="Specialized AI agents with defined roles, tools, and orchestration rules — ready to drop into your project."
            />
            <FeatureCard
              icon={Sparkles}
              title="Skills System"
              description="Domain-specific conventions and patterns that guide agents to write code matching your stack and style."
            />
            <FeatureCard
              icon={Layers}
              title="Presets"
              description="Pre-configured bundles of agents and skills. Pick a preset and scaffold an entire team in one command."
            />
            <FeatureCard
              icon={Terminal}
              title="Powerful CLI"
              description="Init, add, list, publish — manage your entire agent library from the terminal with simple commands."
            />
            <FeatureCard
              icon={Shield}
              title="No Lock-in"
              description="Loom generates plain files. No runtime dependency, no vendor lock-in. Eject anytime."
            />
            <FeatureCard
              icon={Share2}
              title="Marketplace"
              description="Discover and share community-contributed agents, skills, and presets. One command to install."
            />
          </div>
        </div>
      </section>

      {/* Objection Handler — Your Code, Your Stack */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Your Code, Your Stack
              </h2>
              <p className="mt-3 text-muted-foreground">
                Loom doesn&apos;t add runtime dependencies. It generates plain
                Markdown and YAML files directly in your project. Inspect them,
                edit them, or delete them — it&apos;s all just files.
              </p>
              <div className="mt-6">
                <CopyCommand command="npm install -g @folpe/loom" />
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 font-mono text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <FolderTree className="h-4 w-4" />
                <span>Project structure</span>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <div>your-project/</div>
                <div className="pl-4">├── .claude/</div>
                <div className="pl-8 text-primary">├── agents/</div>
                <div className="pl-12 text-foreground/70">├── frontend.md</div>
                <div className="pl-12 text-foreground/70">├── backend.md</div>
                <div className="pl-12 text-foreground/70">└── review-qa.md</div>
                <div className="pl-8 text-primary">├── skills/</div>
                <div className="pl-12 text-foreground/70">├── nextjs-conventions.md</div>
                <div className="pl-12 text-foreground/70">└── tailwind-patterns.md</div>
                <div className="pl-8 text-primary">└── orchestrator.md</div>
                <div className="pl-4 text-primary">├── CLAUDE.md</div>
                <div className="pl-4">├── src/</div>
                <div className="pl-4">└── package.json</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Repeat */}
      <section className="border-y border-white/8 bg-card/30 py-16">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Ready to scaffold?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Get started with a single command.
          </p>
          <div className="mt-6">
            <CopyCommand command="npx @folpe/loom init" />
          </div>
          <div className="mt-4">
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Or explore the library in the backoffice &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to know about Loom.
            </p>
          </div>
          <FAQSection />
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
