# Design System — Dashboard UI

## 1. Purpose

This document defines the visual design system for the dashboard application.

AI-generated UI, components, pages, layouts, forms, cards, navigation, tables, dialogs, and dashboard screens **must follow this design system**.

The existing global CSS variables are the source of truth. Do not introduce unrelated colors, typography, spacing systems, border styles, or visual patterns unless explicitly requested.

---

# 2. Technology & Styling

- Framework: React / Next.js
- Styling: Tailwind CSS
- CSS entry point uses:

```css
@import "tailwindcss";
```

- Dark mode is supported.
- Tailwind theme tokens are mapped to CSS variables using `@theme inline`.
- Use Tailwind utility classes wherever possible.
- Avoid writing custom CSS when an existing Tailwind utility or design token can be used.

---

# 3. Design Philosophy

The dashboard should feel:

- Minimal
- Clean
- Professional
- Modern
- Spacious
- Neutral
- Easy to scan
- Consistent
- Accessible

Avoid:

- Excessive gradients
- Random colors
- Heavy shadows
- Excessive rounded corners
- Decorative effects without purpose
- Overly dense layouts
- Bright saturated backgrounds
- Inconsistent spacing
- Different visual styles between pages

The interface should prioritize usability over decoration.

---

# 4. Color System

## Light Mode

Use the following semantic color tokens.

### Background

```text
background: oklch(0.9900 0 0)
foreground: oklch(0 0 0)
```

The main application background is almost white.

### Card

```text
card: oklch(1 0 0)
card-foreground: oklch(0 0 0)
```

Cards should generally use the card background instead of introducing custom colors.

### Popover

```text
popover: oklch(0.9900 0 0)
popover-foreground: oklch(0 0 0)
```

### Primary

```text
primary: oklch(0 0 0)
primary-foreground: oklch(1 0 0)
```

Primary actions are black with white text.

Examples:

- Primary buttons
- Main CTA
- Active navigation state
- Important controls

### Secondary

```text
secondary: oklch(0.9400 0 0)
secondary-foreground: oklch(0 0 0)
```

Use for secondary buttons and less prominent controls.

### Muted

```text
muted: oklch(0.9700 0 0)
muted-foreground: oklch(0.4400 0 0)
```

Use muted colors for:

- Helper text
- Metadata
- Secondary labels
- Empty states
- Supporting information

### Accent

```text
accent: oklch(0.9400 0 0)
accent-foreground: oklch(0 0 0)
```

Use accent for:

- Hover states
- Selected secondary navigation
- Highlighted UI areas

### Destructive

```text
destructive: oklch(0.6300 0.1900 23.0300)
destructive-foreground: oklch(1 0 0)
```

Use destructive only for:

- Delete
- Remove
- Dangerous actions
- Error/destructive states

Do not use destructive red as a decorative color.

### Border

```text
border: oklch(0.9200 0 0)
```

Use the semantic border token.

Prefer:

```text
border-border
```

instead of arbitrary border colors.

### Input

```text
input: oklch(0.9400 0 0)
```

### Ring

```text
ring: oklch(0 0 0)
```

Use focus rings for keyboard accessibility.

---

# 5. Sidebar Colors

The application has dedicated sidebar tokens.

```text
sidebar: oklch(0.9900 0 0)
sidebar-foreground: oklch(0 0 0)
sidebar-primary: oklch(0 0 0)
sidebar-primary-foreground: oklch(1 0 0)
sidebar-accent: oklch(0.9400 0 0)
sidebar-accent-foreground: oklch(0 0 0)
sidebar-border: oklch(0.9400 0 0)
sidebar-ring: oklch(0 0 0)
```

### Sidebar rules

The sidebar should:

- Remain visually separated from the main content
- Use the sidebar semantic tokens
- Have subtle borders
- Use black/white for primary active states
- Use light gray for hover/secondary states
- Avoid colorful navigation backgrounds

Example:

```jsx
<aside className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
  ...
</aside>
```

---

# 6. Dark Mode

Dark mode is defined by the `.dark` class.

Dark mode must use the existing semantic variables.

Important dark mode colors:

```text
background: oklch(0 0 0)
foreground: oklch(1 0 0)

card: oklch(0.1400 0 0)
card-foreground: oklch(1 0 0)

popover: oklch(0.1800 0 0)
popover-foreground: oklch(1 0 0)

primary: oklch(1 0 0)
primary-foreground: oklch(0 0 0)

secondary: oklch(0.2500 0 0)
secondary-foreground: oklch(1 0 0)

muted: oklch(0.2300 0 0)
muted-foreground: oklch(0.7200 0 0)

accent: oklch(0.3200 0 0)
accent-foreground: oklch(1 0 0)

border: oklch(0.2600 0 0)
input: oklch(0.3200 0 0)
ring: oklch(0.7200 0 0)
```

Dark mode sidebar:

```text
sidebar: oklch(0.1800 0 0)
sidebar-foreground: oklch(1 0 0)
sidebar-primary: oklch(1 0 0)
sidebar-primary-foreground: oklch(0 0 0)
sidebar-accent: oklch(0.3200 0 0)
sidebar-accent-foreground: oklch(1 0 0)
sidebar-border: oklch(0.3200 0 0)
sidebar-ring: oklch(0.7200 0 0)
```

AI must ensure components work in both light and dark mode.

---

# 7. Typography

The primary font is:

```text
Geist, sans-serif
```

Use:

```text
font-sans
```

for normal UI.

Monospace:

```text
Geist Mono, monospace
```

Use:

```text
font-mono
```

for:

- Code
- IDs
- Technical values
- Developer information

Serif:

```text
Georgia, serif
```

Use:

```text
font-serif
```

only when specifically required.

### Typography hierarchy

Use clear hierarchy:

```text
Page title      → text-2xl / text-3xl, font-semibold
Section title   → text-lg / text-xl, font-semibold
Card title      → text-base / text-lg, font-semibold
Body            → text-sm / text-base
Metadata        → text-xs / text-sm text-muted-foreground
```

Avoid excessive font sizes.

---

# 8. Border Radius

Base radius:

```text
--radius: 0.5rem
```

Derived values:

```text
radius-sm
radius-md
radius-lg
radius-xl
```

Use moderate rounding.

Recommended:

- Inputs → `rounded-md`
- Buttons → `rounded-md`
- Cards → `rounded-lg`
- Dialogs → `rounded-lg`
- Small badges → `rounded-md`
- Avatars → `rounded-full`

Do not make every component extremely rounded.

---

# 9. Shadows

The design uses subtle shadows.

Available tokens:

```text
shadow-2xs
shadow-xs
shadow-sm
shadow
shadow-md
shadow-lg
shadow-xl
shadow-2xl
```

Default UI should prefer:

```text
shadow-sm
```

or no shadow.

Use stronger shadows only for:

- Dialogs
- Dropdowns
- Popovers
- Floating elements

Avoid heavy shadows on normal dashboard cards.

---

# 10. Spacing

Base spacing:

```text
--spacing: 0.25rem
```

Use Tailwind spacing utilities.

Recommended dashboard spacing:

```text
p-4
p-5
p-6
gap-4
gap-5
gap-6
space-y-4
space-y-6
```

Avoid arbitrary spacing unless necessary.

The layout should feel spacious but not wasteful.

---

# 11. Dashboard Layout

The standard dashboard structure should be:

```text
┌─────────────────────────────────────────────┐
│                                             │
│  Sidebar        Main Content                │
│                                             │
│  Navigation     Page Header                 │
│                 ─────────────               │
│                 Content                     │
│                                             │
│                 Cards / Tables / Forms      │
│                                             │
└─────────────────────────────────────────────┘
```

Recommended structure:

```jsx
<div className="min-h-screen bg-background text-foreground">
  <div className="flex min-h-screen">
    <DashboardNav />

    <main className="min-w-0 flex-1">{children}</main>
  </div>
</div>
```

---

# 12. Dashboard Sidebar

The sidebar should normally have a fixed width on desktop.

Recommended:

```text
w-64
```

Example:

```jsx
<aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
  ...
</aside>
```

### Sidebar structure

Recommended hierarchy:

```text
Logo / Brand

Main
├── Dashboard
├── Analytics
├── Orders
├── Customers
└── Products

Management
├── Team
├── Settings
└── Billing

User section
└── Profile
```

Use section labels in muted text.

Navigation items should have:

```text
px-3
py-2
rounded-md
text-sm
```

Active item:

```text
bg-sidebar-primary
text-sidebar-primary-foreground
```

Inactive item:

```text
text-sidebar-foreground
```

Hover:

```text
bg-sidebar-accent
text-sidebar-accent-foreground
```

---

# 13. Buttons

Buttons should be simple and consistent.

### Primary

```jsx
<Button className="bg-primary text-primary-foreground">Save Changes</Button>
```

### Secondary

Use:

```text
bg-secondary
text-secondary-foreground
```

### Destructive

Use:

```text
bg-destructive
text-destructive-foreground
```

### General rules

- Use concise button labels
- Avoid unnecessary icons
- Icons should support the label
- Maintain consistent height
- Use clear hover and focus states
- Do not create random button colors

---

# 14. Cards

Cards should use the semantic card tokens.

Recommended:

```jsx
<div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
  ...
</div>
```

Cards should contain:

```text
Card header
Card title
Card description
Card content
Optional footer
```

Do not overuse cards. Use them when they create meaningful visual grouping.

---

# 15. Forms

Inputs should be clean and accessible.

Recommended:

```jsx
<Input className="border-input bg-background" placeholder="Enter value" />
```

Labels should be clearly associated with their fields.

Form layout:

```text
Label
Input
Helper text / Error

Label
Input
Helper text / Error
```

Recommended vertical spacing:

```text
space-y-4
```

Use `ring` styles for keyboard focus.

---

# 16. Tables

Tables should be:

- Clean
- Compact
- Easy to scan
- Horizontally scrollable on small screens

Use subtle borders.

Recommended:

```text
border-border
text-muted-foreground
bg-card
```

Avoid excessive cell backgrounds.

Important rows can use subtle accent backgrounds.

---

# 17. Badges

Badges should be small and compact.

Recommended:

```text
rounded-md
px-2
py-0.5
text-xs
font-medium
```

Use semantic states where appropriate:

```text
Success → neutral/subtle positive treatment
Pending → muted/accent treatment
Error → destructive treatment
```

Do not introduce random colors.

---

# 18. Icons

Use a consistent icon library throughout the dashboard.

Icons should generally be:

```text
size-4
```

or:

```text
size-5
```

Do not mix many different icon styles.

Icons should support the interface rather than dominate it.

---

# 19. Responsive Design

The dashboard must work on:

- Desktop
- Tablet
- Mobile

Desktop:

```text
Sidebar visible
Main content beside sidebar
```

Mobile:

```text
Sidebar hidden/collapsed
Mobile navigation or menu button
Main content full width
```

Use responsive Tailwind utilities such as:

```text
sm:
md:
lg:
xl:
```

Avoid hardcoded widths that break mobile layouts.

---

# 20. Content Width

Dashboard content should not unnecessarily stretch across very large screens.

For pages that require a readable maximum width, use:

```text
max-w-7xl
```

or an appropriate smaller max-width.

Use:

```text
mx-auto
```

when content should be centered.

---

# 21. Page Header

A typical page header should look like:

```jsx
<header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

    <p className="text-sm text-muted-foreground">
      Overview of your application.
    </p>
  </div>

  <div className="flex items-center gap-2">...</div>
</header>
```

Page headers should remain simple.

---

# 22. Accessibility

All generated UI must consider accessibility.

Requirements:

- Use semantic HTML
- Buttons must be `<button>` or proper Button components
- Links must be actual links
- Inputs require labels
- Images require meaningful `alt` text
- Keyboard navigation must work
- Focus states must remain visible
- Do not rely only on color to communicate state
- Maintain sufficient text/background contrast
- Interactive elements should have usable hit areas

---

# 23. Dark Mode Rules

Do not hardcode colors like:

```text
bg-white
text-black
bg-gray-100
text-gray-900
```

when a semantic design token exists.

Prefer:

```text
bg-background
text-foreground
bg-card
text-card-foreground
bg-muted
text-muted-foreground
border-border
bg-primary
text-primary-foreground
```

This ensures automatic light/dark mode compatibility.

---

# 24. Preferred Tailwind Tokens

Use these semantic classes whenever possible:

```text
bg-background
text-foreground

bg-card
text-card-foreground

bg-popover
text-popover-foreground

bg-primary
text-primary-foreground

bg-secondary
text-secondary-foreground

bg-muted
text-muted-foreground

bg-accent
text-accent-foreground

bg-destructive
text-destructive-foreground

border-border
bg-input
ring-ring

bg-sidebar
text-sidebar-foreground

bg-sidebar-primary
text-sidebar-primary-foreground

bg-sidebar-accent
text-sidebar-accent-foreground

border-sidebar-border
```

---

# 25. Do Not Invent Design Tokens

AI must not create new colors such as:

```text
#3b82f6
#6366f1
#8b5cf6
#22c55e
#ef4444
```

unless the user explicitly asks for a new color system.

Use the existing semantic tokens.

If a new design token is genuinely required, explain why before introducing it.

---

# 26. Component Consistency

When creating multiple components:

- Use the same border radius
- Use the same typography hierarchy
- Use the same spacing scale
- Use the same semantic colors
- Use the same interaction states
- Use the same icon sizing
- Use the same shadow levels

A button on one page should look like the same button on another page.

A card should look consistent across the entire dashboard.

---

# 27. AI Implementation Rules

When generating or modifying UI:

1. First inspect the existing project structure.
2. Reuse existing components whenever possible.
3. Reuse existing design tokens.
4. Do not replace the global CSS unless explicitly requested.
5. Do not create a second color system.
6. Do not create unnecessary custom CSS.
7. Use Tailwind classes.
8. Make components responsive.
9. Support dark mode.
10. Keep the UI minimal and professional.
11. Preserve existing functionality.
12. Do not modify unrelated files.
13. Do not install new packages unless required.
14. If an existing UI component already solves the problem, reuse it.
15. Prefer semantic HTML and accessible interactions.

---

# 28. Example Dashboard Shell

```jsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex md:flex-col">
          <DashboardNav />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

---

# 29. Example Card

```jsx
<div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
  <div className="space-y-1">
    <h2 className="text-lg font-semibold">Total Revenue</h2>

    <p className="text-sm text-muted-foreground">
      Revenue generated this month.
    </p>
  </div>

  <div className="mt-6 text-3xl font-semibold">$24,500</div>
</div>
```

---

# 30. Example Navigation Item

```jsx
<a
  href="/dashboard"
  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
>
  <LayoutDashboard className="size-4" />
  <span>Dashboard</span>
</a>
```

Active state:

```jsx
<a
  href="/dashboard"
  className="flex items-center gap-3 rounded-md bg-sidebar-primary px-3 py-2 text-sm font-medium text-sidebar-primary-foreground"
>
  <LayoutDashboard className="size-4" />
  <span>Dashboard</span>
</a>
```

---

# 31. Final Rule

**The existing `globals.css` is the design source of truth.**

Before creating any new UI, AI should check this `design.md` and follow the existing semantic tokens.

The final interface should look like one unified product—not a collection of independently designed pages.

# 7A. Custom Typography Components

The project provides reusable typography component classes in the global stylesheet.

AI should **prefer these classes** for page headings, subheadings, and body/intro text instead of recreating the same Tailwind classes manually.

## `.heading`

Used for primary page headings and major titles.

```css
.heading {
  @apply text-2xl md:text-3xl lg:text-4xl font-bold text-foreground;
}
```

### Usage

```jsx
<h1 className="heading">Dashboard</h1>
```

### Responsive scale

```text
Mobile  → text-2xl
Tablet  → text-3xl
Desktop → text-4xl
```

### Rules

- Use for the main heading of a page.
- Use only one primary `.heading` per page when possible.
- Do not add another font size or font weight unless specifically required.
- Color is controlled by `text-foreground`.

---

## `.subheading`

Used for section headings, secondary headings, and supporting titles.

```css
.subheading {
  @apply text-xl md:text-2xl lg:text-3xl font-semibold text-muted-foreground;
}
```

### Usage

```jsx
<h2 className="subheading">Recent Activity</h2>
```

### Responsive scale

```text
Mobile  → text-xl
Tablet  → text-2xl
Desktop → text-3xl
```

### Rules

- Use for secondary page/section headings.
- Use below the primary `.heading`.
- Do not use `.subheading` for small card titles.
- Color should remain `text-muted-foreground`.

---

## `.body-text`

Used for introductory paragraphs, descriptions, and important supporting text.

```css
.body-text {
  @apply text-base md:text-lg lg:text-xl text-muted-foreground;
}
```

### Usage

```jsx
<p className="body-text">
  Monitor your application performance and activity from one place.
</p>
```

### Responsive scale

```text
Mobile  → text-base
Tablet  → text-lg
Desktop → text-xl
```

### Rules

- Use for page introductions and prominent descriptions.
- Use `text-sm` or `text-xs` directly for metadata and compact UI text.
- Do not use `.body-text` for table cells, navigation items, or small labels.
- Color should remain `text-muted-foreground`.

---

# Typography Hierarchy

Use the following hierarchy when creating a new dashboard page:

```text
.heading
    ↓
.body-text
    ↓
Section
.subheading
    ↓
Regular UI text
    ↓
Metadata / helper text
```

Example:

```jsx
<div>
  <h1 className="heading">Dashboard</h1>

  <p className="body-text mt-2">
    Overview of your application and recent activity.
  </p>

  <section className="mt-8">
    <h2 className="subheading">Recent Activity</h2>
  </section>
</div>
```

## AI Rule

When generating UI:

- Prefer `.heading` for primary page titles.
- Prefer `.subheading` for secondary section titles.
- Prefer `.body-text` for prominent descriptions.
- Do not duplicate these Tailwind combinations manually if the semantic class already fits.
- Maintain the existing responsive typography scale.
- Do not introduce new typography classes without a clear requirement.
