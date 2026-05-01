# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- `hooks/use-game-engine.ts` React state machine consuming the engine pure functions. Composes `applyChoice`, `rollRandomEvent`, `applyRandomEvent`, and the interruption helpers into a single hook.
- `components/game/game-shell.tsx` rendering title screen, scene display with stats bar, victory screen with score breakdown, and game over screen.
- `content/cities/sandiego/index.ts` stub city pack with one role and two scenes for end-to-end wiring verification. Real sandiego content ports in subsequent prompts.
- `lib/engine/state.ts` adds the `canMakeChoice` helper for evaluating choice requirements (money, items).
- `lib/city-registry.ts` registers the sandiego pack.
- `app/[city]/page.tsx` reads from the registry, renders `<GameShell />` for known cities, and shows a "Trail not found" page for unknown slugs. The phase-1 placeholder shim is gone; `generateStaticParams` now reads from `getCitySlugs()`.

### Removed

- Phase-1 placeholder `generateStaticParams` shim in `app/[city]/page.tsx` (replaced by registry-driven slug generation).

## [0.1.0] - 2026-04-30

### Added

- Initial bible files: `CLAUDE.md`, `README.md`, `ROADMAP.md`, `CHANGELOG.md`. These establish the project documentation that Claude Code reads on ramp-up for every subsequent session.
- Next.js 16 static export scaffold with `basePath: '/edge-ai-trails'`
- Directory structure for engine (`lib/engine/`), city packs (`content/cities/`), hub (`app/edge-ai-trails/`), and game shell (`app/edge-ai-trails/[city]/`)
- shadcn/ui initialized with New York style, base color slate, Lucide icons
- Poppins font loaded via `next/font/local` from `app/fonts/` (four weights)
- Placeholder hub page rendering at `/edge-ai-trails/`
- Placeholder game shell rendering at `/edge-ai-trails/[city]/` with city slug echo
- `components/top-banner.tsx` with static devEco branding (auth wiring deferred to phase 3)
- `lib/supabase.ts` with env-driven client init (no calls yet)
- `lib/city-registry.ts` exporting an empty `cities` array
- `lib/utils.ts` with the shadcn `cn()` helper
- `LICENSE.md` carried over from `eaif-trail-sandiego`
- `.env.local.example` documenting Supabase env vars
- `.gitignore` for standard Next.js outputs
- `lib/engine/types.ts` defining the core game types (`PlayerStats`, `Choice`, `SceneData`, `RandomEvent`, `PlayerRole`, `ScoringWeights`, `ScoreBreakdown`, `GameState`, `GameStatus`, `InterruptionConfig`) and the `DEFAULT_SCORING` constant.
- `lib/engine/city-pack.ts` defining the `CityPack`, `CityMeta`, `CityBranding`, and `CityStatus` interfaces.
- `lib/engine/index.ts` barrel re-exporting all engine types.
- `lib/city-registry.ts` now uses the real `CityPack` type and exposes `findCityBySlug` and `getCitySlugs` helpers.
- `lib/engine/scoring.ts` with the pure `calculateScore` function returning a full `ScoreBreakdown`.
- `lib/engine/state.ts` with `initializeGame`, `applyChoice`, and the `applyStatDelta` helper.
- `lib/engine/random-events.ts` with `rollRandomEvent` and `applyRandomEvent`.
- `lib/engine/interruption.ts` with `planInterruption` and `shouldFireInterruption`. Generic mechanism for city-specific Easter eggs (sandiego's Pete call, future London equivalent).
- `lib/engine/index.ts` re-exports the new modules.

### Changed

- `app/[city]/page.tsx` placeholder for `generateStaticParams` documented as phase-1 placeholder. Phase 2 will replace it with values read from `lib/city-registry.ts`.
- `CLAUDE.md` "File Structure" section now matches the actual `app/` layout shipped in PR #1 (hub at `app/page.tsx`, game shell at `app/[city]/page.tsx`).
- `CLAUDE.md` "Critical Conventions" updated: this repo uses regular merge on PRs, not squash. Project-level override of the global devEco convention.
- `CLAUDE.md` "Architecture > Engine" and "Architecture > City packs" sections updated to reference the real type contracts in `lib/engine/`.

### Removed

- Dead `app/[city]/generateStaticParams.ts` helper file. Next.js does not load `generateStaticParams` from a sibling file.
- `lib/engine/.gitkeep` (directory now has real files).

### Notes

- This repo is a fresh start. It does not share git history with `eaif-trail-sandiego`, the original single-city game from which the engine architecture is derived. The sandiego repo remains as the historical record of the March 2026 event ship.
- Suite version starts at `0.1.0`. Phase 1 will close out at this version once the engine and city pack interface ship.
