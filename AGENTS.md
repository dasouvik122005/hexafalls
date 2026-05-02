<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# HexaFalls — visual conventions

The site is themed as a wizarding scrapbook: hand-drawn lines, cloudy/misty backgrounds, sparse vibrant accents on a midnight bg. **Reach for the rough-themed primitives in `src/components/` before writing plain HTML chrome.**

## Drawing primitives (use these, don't reinvent)

| Component | Use for |
|---|---|
| [`RoughFrame`](src/components/RoughFrame.jsx)   | Card / container outlines. Hand-sketched rectangle + drifting mist halo. |
| [`RoughButton`](src/components/RoughButton.jsx) | Every prominent rectangular CTA. `as` prop accepts `"button"`, `"a"`, or `Link`. Supports `disabled`, `shimmer`, `fill={false}` for outline-only. |
| [`RoughDivider`](src/components/RoughDivider.jsx) | Section breaks AND in-eyebrow mini-lines (set `width={48}`). Optional center `ornament` rune. |
| [`RoughStar`](src/components/RoughStar.jsx)     | Floating decorative star, scattered as scribble accents. |
| [`RoughCorners`](src/components/RoughCorners.jsx) | L-bracket frame at all 4 corners of a positioned container — for image holders. |
| [`RoughTicks`](src/components/RoughTicks.jsx)   | Cartography-style cross marks at corners — for map/chart holders. |
| [`RoughTape`](src/components/RoughTape.jsx)     | Diagonal washi-tape strips at top corners — for "pasted-in scrapbook photo" feel. |

**Rule of versatility**: don't reuse the same decoration on every image holder. Pick the one that fits the holder's metaphor (map → ticks, photo → tape, frame → corners). The site reads as a scrapbook precisely because each surface has its own scribble.

## Theme tokens

CSS vars in [`globals.css`](src/app/globals.css):

```
--hx-midnight  #0B0C10
--hx-slate     #1F2833
--hx-cyan      #66FCF1   primary accent
--hx-gold      #D4AF37   secondary accent (open / shimmer / "live now")
--hx-silver    #C5C6C7   text + outline-only buttons
--hx-violet    #A78BFA   third accent (fog / aurora only)
```

Tailwind exposes these as `bg-cyan-hp`, `text-gold-hp`, `border-silver-hp`, etc. via `@theme inline` in globals.css. **Don't hardcode hex in JSX** — use the tokens (or import the constant from `lib/routes.jsx` for event/team house colors).

Atmospheric helpers (already wired in layout / sections):

- `.hp-stars` – animated sparkle background
- `.hp-scrim` – multi-light radial wash
- `.hp-fog` – page-wide drifting cloud layer (in root layout)
- `.hp-glow`, `.hp-glow-gold` – text-shadow glows
- `.hp-shimmer` – CTA sweep keyframes
- `.hp-float`, `.hp-pulse` – ambient motion
- `.rf-mist` – mist halo (built into `RoughFrame` via `mist` prop)

## Animation rules (perf)

1. **Never animate `filter: blur(...)` in framer-motion `initial`/`whileInView`.** It paints every frame and tanks scroll perf with multiple SVG layers. Use `opacity` + `y` + `scale` only.
2. **Never animate `filter`/`transform` on rough.js SVGs directly.** RoughFrame and the other primitives wrap the SVG in a div and animate that — follow the pattern.
3. GSAP letter-stagger reveals: `opacity` + `y` + optional `rotateX`. Skip blur on the letter sets.
4. Respect `prefers-reduced-motion` — the helper classes above already opt out.

## Routes & data

Single source of truth in [`src/lib/routes.jsx`](src/lib/routes.jsx):
- `SITEMAP` — top-level navbar entries (icon + label + `soon` flag)
- `CALLS` — Hero "Call for X" cards
- `EVENTS` — the 4 hackathon tracks (each carries its own house color: gold, blue, red, green)
- `TEAMS` — the 4 sub-orders (organising-team / evangelists / core-team / volunteers)
- `VOLUNTEER_FORM_URL` — Google Form link

Both `TopBar` and `Footer` consume `SITEMAP`. Both `/events` and `/teams` hubs + their `[slug]` pages read from `EVENTS` / `TEAMS`. Adding/removing a route is a one-liner in `routes.jsx`.

## Page composition pattern

```
<main>
  <TopBar />
  <SectionComponent />   // owns its own parallax stars/scrim/sparkles
  <Footer />
</main>
```

Every section uses `relative isolate overflow-hidden` to scope its parallax stack. The page-wide `.hp-fog` lives in the root layout; section-level scrim/stars sit on top of it.

## Image holders

Every image holder follows this shape:

```jsx
<div className="relative w-full aspect-21/9 overflow-hidden bg-midnight/70 flex items-center justify-center">
  <img src="..." className="..." style={{ WebkitMaskImage: "radial-gradient(...)", maskImage: "..." }} />
  {/* edge vignette */}
  <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(11,12,16,0.55) 85%, rgba(11,12,16,0.95) 100%)" }} />
  {/* hp-stars overlay */}
  <div className="absolute inset-0 hp-stars opacity-15 mix-blend-screen pointer-events-none" />
  {/* ONE rough decoration that fits the metaphor — RoughCorners / RoughTicks / RoughTape */}
  <RoughTape color="#D4AF37" />
</div>
```

The radial mask + vignette dissolves rectangular images into the dark bg; the `hp-stars` mix-blend adds atmosphere; one rough decoration ties it to the scrapbook theme.

## Things that are deliberately NOT rough-themed

Don't convert these — they look noisy when squiggled:
- TopBar / Footer round icon buttons (already small + circular)
- Hero "Call for X" pill links inside cards (already nested inside other rough chrome)
- Tooltips, badges, status pills — keep crisp

## Adding a new page

1. New route folder under `src/app/<path>/page.jsx`.
2. Compose with `TopBar` + your section + `Footer`. Set `metadata` (title + description).
3. The section component should:
   - Be `"use client"` if it has motion
   - Use the parallax-stack pattern (stars, scrim, sparkles inside `relative isolate overflow-hidden`)
   - Eyebrow with `<RoughDivider width={48} />` on each side
   - Headline with `hp-glow` + GSAP letter-stagger if it's a hero-class title
   - Cards in `RoughFrame`, prominent CTAs in `RoughButton`
4. Add the route to `SITEMAP` (`src/lib/routes.jsx`) so it appears in nav + footer + sitemap.xml automatically.
