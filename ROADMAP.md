# ROADMAP

The EDGE AI Trails suite ships in phases. Each phase has acceptance criteria. Status updates as each phase moves through the workflow.

## Phase 1: Suite scaffold

**Status:** In progress

Foundation work: Next.js app, directory structure, engine interface, hub shell, game shell, all four bible files. No city content yet, no live game logic.

**Acceptance:**

- Next.js 16 static export with `basePath: '/edge-ai-trails'`
- Directory structure for engine, city packs, hub, and game shell
- Poppins font loaded locally
- shadcn/ui (New York style) initialized
- Placeholder hub renders at `/edge-ai-trails/`
- Placeholder game shell renders at `/edge-ai-trails/[city]/`
- All four bible files exist and accurately describe the scaffold
- City pack interface and engine type signatures defined (later prompt in this phase)

## Phase 2: Port San Diego as first city pack

**Status:** Planned

Port the existing `eaif-trail-sandiego` game into a `sandiego` city pack. The full game playable end-to-end at `/edge-ai-trails/sandiego/`.

**Acceptance:**

- All 16 sandiego scenes ported into `content/cities/sandiego/scenes.ts`
- Three roles (developer, researcher, executive) with starting stats preserved
- Pete Bernard Easter egg preserved with same probability and outcomes
- Random events preserved
- Sandiego pack registered in `lib/city-registry.ts`
- Sandiego status set to `past` (the event already happened)
- All sandiego brand colors and assets ported into the city pack
- Game plays end-to-end identically to the original sandiego repo

## Phase 3: Supabase wiring

**Status:** Planned

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
