---
name: nextjs-conventions
description: "Enforces Next.js 15+ / React 19 / TypeScript conventions and best practices. Use when working on any Next.js project to ensure consistent patterns."
allowed-tools: "Read, Write, Edit, Glob, Grep"
---

# Next.js Conventions

## App Router

- Use the App Router (`src/app/`) exclusively. Never use the Pages Router.
- Every route segment should have a `page.tsx`. Use `layout.tsx` for shared UI.
- Use `loading.tsx` for Suspense boundaries and `error.tsx` for error boundaries.
- Use `not-found.tsx` for 404 pages at the appropriate route level.

## Server vs Client Components

- **Default to Server Components**. Only add `"use client"` when you need:
  - Event handlers (`onClick`, `onChange`, etc.)
  - React hooks (`useState`, `useEffect`, `useRef`, etc.)
  - Browser-only APIs (`window`, `localStorage`, etc.)
- Never import server-only modules in client components.
- Pass server data to client components via props, not by importing server functions.

## Data Fetching

- Fetch data in Server Components using `async/await` directly.
- Use Server Actions (`"use server"`) for mutations. Define them in `src/actions/`.
- Always revalidate with `revalidatePath()` or `revalidateTag()` after mutations.
- Use `Suspense` boundaries for streaming and progressive rendering.

## File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: define in `src/types/` with `.ts` extension
- Server Actions: `src/actions/{entity}.actions.ts`

## TypeScript

- Enable `strict: true` in `tsconfig.json`.
- Prefer `interface` over `type` for object shapes.
- Never use `any`. Use `unknown` if the type is truly unknown.
- Use `satisfies` operator for type-safe object literals.

## Styling

- Use Tailwind CSS utility classes as the primary styling method.
- Use `cn()` from `@/lib/utils` to merge conditional classes.
- Avoid inline styles. Avoid CSS modules unless absolutely necessary.
- Follow mobile-first responsive design: base styles for mobile, `md:` and `lg:` for larger screens.

## Imports

- Use the `@/` path alias for all imports from `src/`.
- Group imports: React/Next.js first, then external libs, then internal modules.
- Prefer named exports over default exports (except for page/layout components).

## Performance

- Use `next/image` for all images with proper `width`, `height`, and `alt`.
- Use `next/link` for internal navigation. Never use `<a>` for internal links.
- Use `next/font` for font loading.
- Lazy load heavy client components with `dynamic()` from `next/dynamic`.
