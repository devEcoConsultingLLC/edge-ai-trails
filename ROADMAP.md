# ROADMAP

The EDGE AI Trails suite ships in phases. Each phase has acceptance criteria. Status updates as each phase moves through the workflow.

## Phase 1: Suite scaffold

**Status:** Complete (2026-04-30, v0.1.0)

Foundation work: Next.js app, directory structure, engine type contracts, engine runtime as pure functions, hub and game shell pages, all four bible files. No city content yet, no React integration of the engine.

**Acceptance (all met):**

- Next.js 16 static export with `basePath: '/edge-ai-trails'`
- Directory structure for engine, city packs, hub, and game shell
- Poppins font loaded locally
- shadcn/ui (New York style) initialized
- Placeholder hub renders at `/edge-ai-trails/`
- Placeholder game shell renders at `/edge-ai-trails/[city]/`
- All four bible files exist and accurately describe the scaffold
- City pack interface and engine type signatures defined (`lib/engine/types.ts`, `lib/engine/city-pack.ts`)
- Engine runtime as pure functions: scoring, state transitions, random events, interruption (`lib/engine/scoring.ts`, `lib/engine/state.ts`, `lib/engine/random-events.ts`, `lib/engine/interruption.ts`)

## Phase 2: Port San Diego as first city pack

**Status:** Complete (2026-04-30, v0.2.0). One acceptance item deferred (canvas pixel-art); see Deferred section below.

Wired the engine into React, ported the original sandiego game into a city pack, and shipped the pack-themed game UI. Sandiego plays end-to-end at `/edge-ai-trails/sandiego/` with its own branding.

**Acceptance:**

- React state management for the engine (`hooks/use-game-engine.ts` consumes the pure functions)
- Game UI components: title screen, scene display with stats bar, victory screen with score breakdown, game over screen with death narrative, random event toast (`components/game/game-shell.tsx`)
- City pack scaffold at `content/cities/sandiego/`
- All 16 sandiego scenes ported into `content/cities/sandiego/scenes.ts`
- Three roles (developer, researcher, executive) with original starting stats and scoring multipliers
- Pete Bernard call interruption preserved with the same 33% probability and four death paths, wired through the generic interruption mechanism
- Six random events ported, with toast UI surfacing them when they fire
- Sandiego pack registered in `lib/city-registry.ts` with `status: 'past'`
- Sandiego brand colors (`#0d3a4a` accent, `#f4ecdb` background) wired into the GameShell via CSS custom properties; future cities render in their own configured colors
- Game plays end-to-end identically to the original sandiego repo (modulo pixel-art visuals; see Deferred)
- `app/[city]/page.tsx` reads from the registry; `generateStaticParams` enumerates known cities

**Deferred:**

- **Pixel-art canvas renderer (or equivalent visual layer for per-scene art).** The original sandiego repo had per-scene `<canvas>` animations. Edge-ai-trails ships v0.2.0 as text-only. Decision still pending whether to add a canvas-port phase between phase 5 (deploy) and any future polish round, or ship the suite text-only and revisit later. Sandiego is fully playable in its current form.

## Phase 3: Supabase wiring

**Status:** Next

New Supabase project for the suite. City-scoped tables. Admin panel updated to filter by city.

**Acceptance:**

- New Supabase project provisioned
- `leaderboard` table with `city` column and index on `(city, score DESC)`
- `event_stats` table keyed by `city` with `journey_count` and `pete_calls`
- RPC functions for atomic counter increments
- RLS policies (public read, public insert, authenticated delete)
- Admin login modal and full-screen panel with city filter
- Score submission writes the correct `city` value
- Leaderboard reads filter by city
- All Supabase calls wrapped in try/catch, game works without Supabase

## Phase 4: Hub UX

**Status:** Planned

Hub at `/edge-ai-trails/` becomes a real landing page that surfaces upcoming events first and past events under a "Past Events" section.

**Acceptance:**

- Hero card for the soonest upcoming event with prominent CTA
- Upcoming events grid (sorted by event date ascending)
- Past events grid below (sorted by event date descending)
- Each card shows city, event name, date, registration link, and a "Play the Trail" CTA
- Status pulled from each city pack's `meta.status`
- Mobile-responsive

## Phase 5: thedeveco.com integration

**Status:** Planned

Wire the suite into the main devEco site. Old `/trail-sandiego` URL redirects to `/edge-ai-trails/sandiego`.

**Acceptance:**

- `out/` directory built and committed under `public/edge-ai-trails/` in the thedeveco.com repo
- GitHub Actions deploy succeeds
- Suite is live at `thedeveco.com/edge-ai-trails/`
- Sandiego is playable at `thedeveco.com/edge-ai-trails/sandiego/`
- `/trail-sandiego` redirects (HTML or server) to `/edge-ai-trails/sandiego`
- Old `eaif-trail-sandiego` repo marked archived in GitHub once redirect is verified live

## Phase 6: London city pack

**Status:** Planned

Add London as a second city pack. Adapt the sandiego pack as a starting point.

**Acceptance:**

- 16 London-flavored scenes (airport, transit, venue) in `content/cities/london/scenes.ts`
- London-specific copy and references
- London branding (colors, hero image)
- City-specific Easter egg (subject and design TBD with Robert)
- London registered in `lib/city-registry.ts` with `status: 'upcoming'` and the actual event date
- Plays end-to-end at `/edge-ai-trails/london/`
- Hub surfaces London as the soonest upcoming event

## Future cities

As EDGE AI events are announced, drop in new packs under `content/cities/<slug>/` and register them. Hub auto-sorts by event date.
