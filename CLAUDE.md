# Loom

Loom is a scaffolding tool for AI-assisted development. It consists of two parts:

1. **Backoffice** (Next.js) — web interface to browse and manage a library of agents, skills, and presets
2. **CLI** (`@folpe/loom` on npm) — scaffolds agents, skills, and context files into any project

The backoffice reads from GitHub via Octokit. The CLI bundles the library and generates output for multiple targets (Claude Code, Cursor, custom).

## Stack

- Next.js 16 (App Router) / React 19 / TypeScript 5 (strict)
- Tailwind CSS 4 / ShadCN UI
- NextAuth for authentication
- Octokit for GitHub API (read-only)
- CLI: Commander.js / @clack/prompts / tsup

## Project structure

```
src/              # Next.js backoffice
  app/            # App Router pages
  components/     # Shared UI components
  services/       # GitHub API services (Octokit)
  types/          # Shared TypeScript types
cli/              # CLI tool (@folpe/loom)
  src/            # CLI source (Commander.js)
  data/           # Synced from library/ at build time (gitignored)
library/          # Source of truth for agents, skills, presets
  agents/         # Agent definitions (AGENT.md)
  skills/         # Skill definitions (SKILL.md)
  presets/        # Preset configs (YAML)
```

## Conventions

- RSC by default, "use client" only when strictly needed
- Functional components only, no class components
- kebab-case for all new files
- `library/` is the source of truth — `cli/data/` is synced via prebuild script, never edit directly
- Agents use `model: inherit` — the runtime defines the model, not the agent

## Commands

```bash
# Backoffice
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run lint         # Run linter

# CLI
cd cli
pnpm build           # Build CLI (syncs library → cli/data first)
pnpm dev             # Watch mode
node dist/index.js   # Run locally
```

<!-- loom:agents:start -->
## Agents

This project uses 8 specialized agents coordinated by an orchestrator (`.claude/orchestrator.md`).

| Agent | Role | Description |
|-------|------|-------------|
| `frontend` | Frontend | Handles React/Next.js components, pages, layouts, and client-side logic |
| `backend` | Backend | Handles API routes, server actions, database queries, and authentication |
| `ux-ui` | UX/UI | Designs UI components, creates design system tokens, and handles accessibility |
| `database` | Database | Designs schemas, writes migrations, and optimizes queries |
| `tests` | Tests | Writes unit tests, integration tests, and end-to-end tests |
| `review-qa` | Review & QA | Reviews code quality, security, and performance. Suggests improvements. |
| `performance` | Performance | Audits and optimizes application performance, bundle size, and runtime efficiency |
| `security` | Security | Audits code for vulnerabilities, hardens configurations, and enforces security best practices |

<!-- loom:agents:end -->

<!-- loom:skills:start -->
## Skills

Installed skills providing domain-specific conventions and patterns:

- `nextjs-conventions`
- `tailwind-patterns`
- `supabase-patterns`
- `shadcn-ui`
- `api-design`
- `ui-ux-guidelines`
- `cli-development`

<!-- loom:skills:end -->

## How to use

The orchestrator agent (`.claude/orchestrator.md`) is the main entry point. It analyzes tasks, breaks them into subtasks, and delegates to the appropriate specialized agents. Each agent has access to its assigned skills for domain-specific guidance.
