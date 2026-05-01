# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

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

### Notes

- This repo is a fresh start. It does not share git history with `eaif-trail-sandiego`, the original single-city game from which the engine architecture is derived. The sandiego repo remains as the historical record of the March 2026 event ship.
- Suite version starts at `0.1.0`. Phase 1 will close out at this version once the engine and city pack interface ship.
