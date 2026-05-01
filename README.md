# EDGE AI Trails

A suite of Oregon Trail-inspired choose-your-own-adventure browser games, one per EDGE AI conference city. Built by [devEco Consulting LLC](https://thedeveco.com).

Each game walks players through the journey to a specific event venue: airport drop-off, flight chaos, ground transport, and finally the venue entrance. Stats, choices, items, random events, and a city-specific Easter egg per event.

## Status

**v0.2.0 shipped 2026-04-30.** Sandiego is playable end-to-end at the local dev URL. Phase 3 (Supabase wiring for journey counter, leaderboard, and admin panel) is next.

Canvas pixel-art for per-scene visuals was part of the original sandiego experience; this iteration ships text-only. A canvas decision is pending.

See `[ROADMAP.md](http://ROADMAP.md)` for the full plan and `[CHANGELOG.md](http://CHANGELOG.md)` for what has shipped.

## Tech Stack

- Next.js 16 with static export
- React 19, TypeScript 5
- Tailwind CSS 4
- shadcn/ui (New York style), Radix UI, Lucide icons
- Supabase for journey counter, leaderboard, and admin auth
- Poppins font (local files, no Google Fonts dependency)

## Getting Started

```bash
pnpm install
pnpm dev          # start dev server at http://localhost:3000/edge-ai-trails/
pnpm build        # build static export to out/
```

## How It Deploys

This app is a static export (`output: 'export'`, `basePath: '/edge-ai-trails'`). The built `out/` directory is copied into the [thedeveco.com](https://thedeveco.com) repo at `public/edge-ai-trails/` and deployed to GitHub Pages via GitHub Actions.

Live URL once deployed: [thedeveco.com/edge-ai-trails/](https://thedeveco.com/edge-ai-trails/) (not yet active).

## City Packs

Each city is a self-contained content pack under `content/cities/<slug>/`. Adding a new city is a matter of creating a new pack and registering it in `lib/city-registry.ts`. The shared engine and game shell render any registered city.

## Supabase

Schema and wiring documented in `CLAUDE.md` once phase 3 ships. Until then, the suite runs without Supabase.

## License

See [LICENSE.md](LICENSE.md).
