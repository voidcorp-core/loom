---
name: shadcn-ui
description: "ShadCN UI component patterns, composition, and accessibility guidelines. Use when building interfaces with ShadCN components. Inspired by ibelick/ui-skills baseline-ui."
allowed-tools: "Read, Write, Edit, Glob, Grep"
---

# ShadCN UI Patterns

## Installation & Setup

- Install components individually with `npx shadcn@latest add <component>` — never install all at once.
- Components are copied to `src/components/ui/` — they are yours to customize.
- Configure `components.json` for path aliases and styling preferences.
- Use `cn()` from `src/lib/utils` for class merging (clsx + tailwind-merge).

## Component Usage

- **Always use ShadCN primitives** before building custom components:
  - `Button` for all clickable actions (with appropriate `variant` and `size`)
  - `Card` for content containers
  - `Dialog` for modal overlays
  - `Sheet` for slide-out panels
  - `DropdownMenu` for action menus
  - `Select` for option picking
  - `Table` for data display
  - `Form` + `Input` + `Label` for forms
  - `Badge` for tags and status indicators
  - `Tabs` for content switching
  - `Toast` / `Sonner` for notifications
- Never rebuild keyboard or focus behavior by hand — use the component primitives.
- Never mix primitive systems (Radix, Headless UI, React Aria) within the same surface.

## Forms

- Use `react-hook-form` + `zod` with ShadCN's `Form` component:
  ```tsx
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })
  ```
- Stack form fields with `space-y-4`.
- Use `grid gap-4 md:grid-cols-2` for side-by-side fields on desktop.
- Show validation errors inline with `FormMessage`.
- Use `FormDescription` for helper text below fields.

## Data Tables

- Use ShadCN `DataTable` pattern with `@tanstack/react-table`:
  - Define columns with type-safe `ColumnDef`.
  - Support sorting, filtering, and pagination.
  - Add row actions via `DropdownMenu`.
- Use `tabular-nums` on numeric columns for alignment.
- Add loading skeletons with ShadCN `Skeleton` for async data.

## Dialogs & Alerts

- Use `Dialog` for informational or form-based modals.
- Use `AlertDialog` for destructive or irreversible actions — never a plain `Dialog`.
- Keep dialog content focused — one primary action per dialog.
- Always provide a way to dismiss (close button, escape key, outside click).

## Theming

- Use CSS variables from the ShadCN theme system: `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, etc.
- Never hardcode hex colors — always use semantic tokens.
- Support dark mode via the `dark` class on `<html>` — CSS variables handle the switch.
- Limit accent color usage to one per view.

## Accessibility

- All icon-only buttons must have `aria-label`.
- Use `sr-only` class for screen-reader-only text.
- Ensure all interactive elements have visible focus states (ShadCN handles this by default).
- Use `role` and `aria-*` attributes when composing custom components.
- Never block paste in `input` or `textarea` elements.

## Animation

- Never add animation unless explicitly requested.
- Use `transition-colors` for hover/focus state changes.
- Keep interaction feedback under 200ms.
- Avoid animating layout properties (`width`, `height`, `margin`, `padding`) — use `transform` and `opacity` only.
- Respect `prefers-reduced-motion` media query.

## Anti-Patterns to Avoid

- Never use `h-screen` — use `h-dvh` for correct mobile viewport.
- Never use arbitrary `z-index` values — use a fixed scale.
- Never use gradients or glow effects unless explicitly requested.
- Never use custom easing curves unless explicitly requested.
- Empty states must have one clear next action.
