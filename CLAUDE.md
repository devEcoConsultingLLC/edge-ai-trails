# CLAUDE.md - Project Brief for Claude Code

## Project Overview

**EDGE AI Trails** is a suite of Oregon Trail-inspired choose-your-own-adventure browser games, one per EDGE AI conference city. Players navigate the journey to a specific event venue. Each city ships as a self-contained content pack consumed by a shared engine. Built by [devEco Consulting LLC](https://thedeveco.com).

The first city in the suite is San Diego (ported from the original `eaif-trail-sandiego` repo). London is next. More cities will follow as EDGE AI events are announced.

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5
- **UI:** Tailwind CSS 4 via `@tailwindcss/postcss`, shadcn/ui (New York style), Radix primitives, Lucide icons
- **Font:** Poppins via `next/font/local` from `app/fonts/`
- **Backend:** Supabase (client-side only, no server-side, no API routes)
- **Package manager:** pnpm

## Build and Deploy

```bash
pnpm install
pnpm dev       # local dev server
pnpm build     # static export to out/
```

- **Static export:** `output: 'export'` in `next.config.mjs`
- **Base path:** `/edge-ai-trails`
- **Deploy target:** the built `out/` directory is copied into the [thedeveco.com](https://thedeveco.com) repo at `public/edge-ai-trails/` and deployed via GitHub Pages.

## Architecture

The suite is structured as a generic engine plus per-city content packs.

### Engine (`lib/engine/`)

Generic game state machine, scoring, and choice resolution. Knows nothing about specific cities, scenes, or events. Type contracts are defined in `lib/engine/types.ts` and `lib/engine/city-pack.ts`. The runtime (state machine, scoring, choice resolver) is implemented in subsequent prompts.

### City packs (`content/cities/<slug>/`)

Each city is a self-contained module exporting a `CityPack` object. Pack shape (sketch, will be formalized when the engine ships):

```ts
// Sketch. Full interface in lib/engine/city-pack.ts.
export interface CityPack {
  meta: CityMeta;                            // slug, event name, date, status, registration URL, hero copy
  branding: CityBranding;                    // colors, badge, hero image
  roles: PlayerRole[];                       // typically 3 (developer, researcher, executive)
  scenes: Record<string, SceneData>;
  randomEvents: RandomEvent[];
  startScene: string;
  victoryScene: string;
  interruption?: InterruptionConfig;         // optional city-specific Easter egg
  scoringOverrides?: Partial<ScoringWeights>;
}
```

Cities register themselves by export from `content/cities/<slug>/index.ts`, and `lib/city-registry.ts` aggregates them. Adding a new city means dropping in a new directory and registering it.

### Hub (`app/edge-ai-trails/`)

Lists upcoming and past trails based on `meta.eventDate` and `meta.status`. Hero card for the soonest upcoming event. Past events accessible under a "Past Events" section.

### Game shell (`app/edge-ai-trails/[city]/`)

Reads the city slug from the route, looks up the pack in the registry, hands it to the engine, and renders. Same shell renders any city.

## Supabase

A single Supabase project serves the entire suite. Tables are city-scoped via a `city` column.

Schema will be defined in phase 3. Until then, `lib/supabase.ts` initializes the client but no calls are made.

All Supabase calls must be wrapped in try/catch. Game must work fully without Supabase.

## Critical Conventions

- **No em dashes.** Anywhere. Use commas, periods, or parentheses.
- **Conventional commits.** All commit messages follow the spec.
- **Regular merge** on PRs (not squash, not rebase). This repo overrides the global devEco squash-merge default. Each PR's commit history is preserved on `main`, so prompts should produce clean atomic commits per logical step.
- **kebab-case** branch names.
- **City packs are sealed.** No engine code or hub code may import from a specific city pack. Engine reads packs through the registry only.
- **No city-specific logic in the engine.** If a behavior is unique to one city, it lives in that city's pack as a config value or a scoring override.

## File Structure

```
app/
  layout.tsx              root layout with banner and Poppins
  page.tsx                hub, served at /edge-ai-trails/ via basePath
  [city]/page.tsx         game shell, served at /edge-ai-trails/[city]/
  globals.css             Tailwind + theme
  fonts/                  Poppins .ttf

components/
  top-banner.tsx          devEco banner, admin lock icon (added in phase 3)
  game/
    game-shell.tsx        full game UI: title, scene, victory, game over
  ui/                     shadcn primitives

content/
  cities/sandiego/        first city pack (stub during phase 2 prompt 1, real content lands in subsequent prompts)
  cities/<slug>/          future city packs

hooks/
  use-game-engine.ts      React state machine consuming the engine pure functions

lib/
  engine/                 game logic, types, scoring
  city-registry.ts        registry
  supabase.ts             client init
  utils.ts                cn() helper
```

## Current Phase

Phase 1: Suite scaffold. In progress.

See `ROADMAP.md` for the full phase plan.

## Session End Checklist

Update at the end of every session that ships:

1. **CLAUDE.md** if architecture, conventions, or current phase changed.
2. **README.md** if setup, deploy, or stack changed.
3. **ROADMAP.md** if phase status changed.
4. **CHANGELOG.md** for every commit. No exceptions.
