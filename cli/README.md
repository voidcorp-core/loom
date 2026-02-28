# @folpe/loom

CLI to scaffold Claude Code projects with curated agents, skills, and presets.

Loom provides a ready-to-use library of specialized AI agents (frontend, backend, security, tests...) and skills (Next.js conventions, Tailwind patterns...) that integrate directly into your project's `.claude/` directory.

## Install

```bash
npm i -g @folpe/loom
```

## Usage

### List available agents, skills, and presets

```bash
loom list           # list everything
loom list agents    # agents only
loom list skills    # skills only
loom list presets   # presets only
```

### Add a single agent or skill

```bash
loom add agent frontend
loom add skill tailwind-patterns
```

Files are written to `.claude/agents/` and `.claude/skills/` in your current directory.

### Initialize a full project from a preset

```bash
loom init saas-default
```

A preset installs a set of agents + skills and generates a `CLAUDE.md` configuration file — everything Claude Code needs to work with your project.

Run `loom init` without arguments to choose interactively.

## What's included

**Agents** — specialized AI roles, each with a focused system prompt:

| Agent | Role |
|-------|------|
| `orchestrator` | Analyzes tasks and delegates to the right agent |
| `frontend` | React/Next.js components, pages, layouts |
| `backend` | API routes, server actions, data layer |
| `database` | Schemas, migrations, query optimization |
| `tests` | Unit, integration, and E2E tests |
| `review-qa` | Code review, quality checks |
| `security` | Vulnerability audits, hardening |
| `performance` | Profiling, optimization |
| `ux-ui` | UI components, design systems |
| `marketing` | Copy, landing pages, SEO |

**Skills** — reusable knowledge files:

| Skill | Description |
|-------|-------------|
| `nextjs-conventions` | Next.js 15+ / React 19 / TypeScript patterns |
| `tailwind-patterns` | Tailwind CSS utilities and component patterns |
| `hero-copywriting` | High-converting marketing copy guidelines |

## License

MIT
