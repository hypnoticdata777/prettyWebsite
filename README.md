# Hypnotic Ops

A single-page portfolio/demo site built to practice and showcase **CSS mastery** — layout, animations, custom properties, and modern design techniques — alongside clean vanilla JS and semantic HTML.

---

## What it is

**Hypnotic Ops** is a fictional operations/systems company landing page. It exists as a living CSS playground and practice ground for real-world frontend skills: UI state, rendering, filtering, animations, storage, and visual polish.

---

## Tech stack

| Layer      | Choice                                      |
|------------|---------------------------------------------|
| Markup     | Vanilla HTML5 — fully semantic              |
| Styles     | Vanilla CSS3 — zero frameworks              |
| Scripts    | Vanilla JavaScript (ES2020+) — no libraries |
| Persistence| `localStorage` — no backend required        |
| Build      | None — open `index.html` and go             |

---

## Features

- **Animated background** — floating orbs, film-grain texture, repeating grid, all in CSS
- **Sticky frosted-glass header** — `backdrop-filter`, `color-mix`, sticky positioning
- **Scroll-reveal animations** — `IntersectionObserver` + CSS transitions with stagger delays
- **Animated stat counters** — ease-out cubic `requestAnimationFrame` loop
- **Mouse-tracking card glow** — CSS custom properties (`--x`, `--y`) updated by JS `mousemove`
- **Spinning gradient border** — `@property`, `conic-gradient`, `@keyframes` on primary buttons
- **Dark / light theme toggle** — `data-theme` attribute, respects `prefers-color-scheme` on first load
- **Project filter** — tag-based filtering with active state persisted across reloads
- **System Pulse widget** — interactive workflow node demonstrator
- **Command Log** — journaling widget: add entries, export JSON, clear all; localStorage persistence
- **Contact placeholder** — email input with toast feedback, ready for a real form handler

---

## How to run

No build step. No installs.

```
open index.html
```

Or drag `index.html` into any browser.

---

## Project structure

```
prettyWebsite/
├── index.html   — Semantic HTML, extensively commented for learning
├── style.css    — All styles: variables, layout, animations, responsive
└── app.js       — All behavior: rendering, state, storage, interactions
```

---

## CSS highlights

This site is intentionally a CSS showcase. Key techniques used:

- **CSS custom properties** for full theming (`--bg`, `--a`, `--b`, `--c`, etc.)
- **`color-mix(in oklab, ...)`** for perceptually smooth color blending
- **`clamp()`** for fluid typography without media query breakpoints
- **`@property`** for animating custom properties (spinning gradient border)
- **`backdrop-filter: blur()`** for the frosted-glass header and cards
- **`conic-gradient`** for the animated border on CTA buttons
- **`radial-gradient` at `var(--x) var(--y)`** for the mouse-tracking glow effect
- **`grid-template-columns`** with `fr`, `minmax`, and responsive collapse
- **`prefers-reduced-motion`** media query — all animations disabled for accessibility
- **`prefers-color-scheme`** — system dark/light preference detected on first visit

---

## Accessibility

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`
- `aria-label` on nav and interactive regions
- `aria-live="polite"` on toast and dynamic content areas
- `:focus-visible` keyboard navigation styles
- Form labels properly associated with inputs
- Reduced motion support

---

## Notes

- The contact form is a UI placeholder — no backend is wired up
- The Command Log stores data in `localStorage` only (clears with browser data)
- All project data is hardcoded in `state.projects` in `app.js` — easy to extend
