# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Pete Bernard call interruption ported into `content/cities/sandiego/scenes.ts`. Six new Pete-related scenes (entry, call, four death scenes), each marked `excludeFromInterruption: true` so they are not picked as random trigger points.
- `interruption` field wired on the sandiego pack: probability 0.33, entryScene set to the first Pete scene, triggerOnce true.
- `excludeFromInterruption?: boolean` on the `SceneData` type. `planInterruption` now filters out scenes with this flag from candidate triggers.
- `GameOverScreen` now renders the current scene's title and description (the death narrative) above the stat-based reason. Affects regular game-overs as well: the player sees the situation they died in, not just a generic message.

### Changed

- `lib/engine/interruption.ts` `planInterruption`: candidate filter now also excludes scenes with `excludeFromInterruption: true`.
- `components/game/game-shell.tsx` `GameOverScreen`: signature now takes `pack` for scene lookup.
- `lib/engine/city-pack.ts`: documented the `victoryScene` sentinel convention. By design, the value of `victoryScene` should not exist in `scenes`; it is a trigger ID used by `applyChoice` to flip status to victory.
- `content/cities/sandiego/index.ts`: `victoryScene` changed from `'eve_entrance'` (a real scene) to `'victory'` (sentinel).
- `content/cities/sandiego/scenes.ts`: restored `eve_entrance` as the last playable scene. Its final-bonus choices now transition to the `'victory'` sentinel.

### Fixed

- The original sandiego `eve_entrance` scene with its final-bonus choices is now reachable. Previously the engine flipped to victory status the moment a choice transitioned into `eve_entrance`, so the scene never rendered and its stat bonuses were never applied. Score breakdowns are now consistent with the original sandiego game.

### Added (earlier in this Unreleased cycle)

- `hooks/use-game-engine.ts` React state machine consuming the engine pure functions. Composes `applyChoice`, `rollRandomEvent`, `applyRandomEvent`, and the interruption helpers into a single hook.
- `components/game/game-shell.tsx` rendering title screen, scene display with stats bar, victory screen with score breakdown, and game over screen.
- `lib/engine/state.ts` adds the `canMakeChoice` helper for evaluating choice requirements (money, items).
- `lib/city-registry.ts` registers the sandiego pack.
- `app/[city]/page.tsx` reads from the registry, renders `<GameShell />` for known cities, and shows a "Trail not found" page for unknown slugs. The phase-1 placeholder shim is gone; `generateStaticParams` now reads from `getCitySlugs()`.
- Real sandiego content ported into `content/cities/sandiego/`:
  - `meta.ts` with CityMeta and CityBranding
  - `roles.ts` with three roles (developer, researcher, executive) and their original starting stats and scoring multipliers
  - `scenes.ts` with all 16 journey scenes from airport drop-off to EVE entrance, preserving original titles, descriptions, choices, and stat effects
  - `random-events.ts` with the original event set (finding money, phone battery, coffee, overhearing, meeting colleagues, rain)
  - `index.ts` composes the modules into a CityPack
- Stub `content/cities/sandiego/index.ts` is replaced by the new module structure.

### Notes

- Random event probabilities are tuned per-event to approximate sandiego's 15% per-choice total. Per-event probability is roughly 0.025 with six events.
- Branding colors and visual rendering are unchanged in this prompt; the GameShell does not yet consume `pack.branding`. That wiring lands in a later phase 2 prompt.

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
