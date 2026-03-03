# Loom

AI agents, scaffolded in seconds.

Loom is a scaffolding tool for AI-assisted development. It consists of two parts:

- **Backoffice** ([loom.voidcorp.io](https://loom.voidcorp.io)) — web interface to browse, create, and manage a library of agents, skills, and presets. Publish to the marketplace for others to discover and install.
- **CLI** (`@folpe/loom` on npm) — scaffold agents, skills, and presets into any project from the terminal.

## Quick Start

```bash
# Scaffold a full preset into your project
npx @folpe/loom init

# Or add individual resources
npx @folpe/loom add agent frontend
npx @folpe/loom add skill nextjs-conventions
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `loom init [preset]` | Interactive setup — pick a target, preset, agents, and skills |
| `loom add <type> <slug>` | Add a single agent or skill to your project |
| `loom list [type]` | List available agents, skills, and presets |
| `loom marketplace search [query]` | Search community resources |
| `loom marketplace install <slug>` | Install a resource from the marketplace |

### Targets

Loom supports multiple AI coding assistants:

| Target | Flag | Output |
|--------|------|--------|
| Claude Code (default) | `--claude` | `.claude/` + `CLAUDE.md` |
| Cursor | `--cursor` | `.cursor/` + `.cursorrules` |
| Custom | `--target custom --target-dir <dir>` | Custom directory |

### Examples

```bash
# Interactive mode — guided setup
loom init

# Non-interactive — scaffold a preset with modifications
loom init fullstack --claude
loom init fullstack --remove-agent database --add-skill api-design --cursor

# Add from marketplace
loom marketplace search "react" --type skill
loom marketplace install react-specialist
```

## Backoffice

The backoffice at [loom.voidcorp.io](https://loom.voidcorp.io) provides:

- **Library management** — browse, create, edit, and delete agents, skills, and presets
- **Marketplace** — publish your creations for the community, discover and install others'
- **Dashboard** — overview of your library with quick access to resources

### Running locally

```bash
npm install
npm run dev
```

## Stack

- **Backoffice**: Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS 4 / ShadCN UI
- **Data**: Drizzle ORM + Neon PostgreSQL
- **Auth**: NextAuth (GitHub provider)
- **CLI**: Commander.js / @clack/prompts / tsup

## Project Structure

```
src/              # Next.js backoffice
  app/            # App Router pages
  components/     # Shared UI components
  actions/        # Server actions (CRUD, marketplace)
  db/             # Drizzle schema and migrations
  types/          # Shared TypeScript types
cli/              # CLI tool (@folpe/loom)
  src/            # CLI source (Commander.js)
  data/           # Synced from library/ at build time
library/          # Source of truth for bundled agents, skills, presets
```

## What Gets Scaffolded

```
your-project/
├── CLAUDE.md                    # Project context file
├── .claude/
│   ├── orchestrator.md          # Agent coordination rules
│   ├── agents/
│   │   ├── frontend/AGENT.md
│   │   ├── backend/AGENT.md
│   │   └── review-qa/AGENT.md
│   └── skills/
│       ├── nextjs-conventions/
│       └── tailwind-patterns/
├── src/
└── package.json
```

## License

MIT
