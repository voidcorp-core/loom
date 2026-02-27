---
name: tailwind-patterns
description: "Provides Tailwind CSS patterns, utility conventions, and component styling guidelines. Use when building UI with Tailwind CSS."
allowed-tools: "Read, Write, Edit"
---

# Tailwind CSS Patterns

## Utility-First Approach

- Always use utility classes directly in JSX. Avoid `@apply` except in global base styles.
- Use `cn()` helper for conditional and merged classes:
  ```tsx
  className={cn("base-classes", condition && "conditional-classes", className)}
  ```

## Spacing & Layout

- Use consistent spacing scale: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `gap-8` (32px).
- Prefer `flex` and `grid` for layout. Avoid absolute positioning except for overlays.
- Use `container mx-auto px-4` for page-level content width.
- Standard page padding: `p-6` for main content areas.

## Responsive Design

- Mobile-first: write base styles for mobile, add `sm:`, `md:`, `lg:`, `xl:` for larger screens.
- Common breakpoints:
  - `sm:` (640px) — small tablets
  - `md:` (768px) — tablets
  - `lg:` (1024px) — laptops
  - `xl:` (1280px) — desktops
- Grid responsive pattern: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Typography

- Headings: `text-3xl font-bold tracking-tight` (h1), `text-2xl font-semibold` (h2), `text-lg font-semibold` (h3)
- Body text: `text-sm` or `text-base`
- Muted text: `text-muted-foreground`
- Truncation: `truncate` or `line-clamp-2`

## Colors & Theming

- Always use CSS variable-based colors from the design system: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, etc.
- Never hardcode hex colors. Use the semantic tokens.
- For dark mode, rely on the `dark:` variant only when CSS variables don't handle it.

## Interactive States

- Hover: `hover:bg-accent` or `hover:bg-accent/50`
- Focus: handled by ShadCN defaults via `outline-ring/50`
- Transitions: `transition-colors` for color changes, `transition-all` sparingly
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`

## Component Patterns

- Card: use ShadCN `Card` components. Add `hover:bg-accent/50 transition-colors` for clickable cards.
- Forms: stack fields with `space-y-4`, use `grid gap-4 md:grid-cols-2` for side-by-side fields.
- Buttons: use ShadCN `Button` with appropriate `variant` and `size`.
- Badges: use ShadCN `Badge` with `variant="secondary"` for tags, `variant="outline"` for less emphasis.
