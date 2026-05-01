import type { PlayerRole } from '@/lib/engine';

// Starting stats are taken from the original sandiego runtime
// (app/page.tsx INITIAL_STATS overlaid with per-role overrides). Sandiego's
// initial stress is 0 and connections is 0 for every role; the only fields
// that vary by role are money, knowledge, and (for researcher) energy and
// (for executive) stress.
export const roles: PlayerRole[] = [
  {
    id: 'developer',
    name: 'Developer',
    description:
      'Code-driven and balanced. Solid budget, a bit of pre-conference reading, and steady nerves.',
    startingStats: {
      energy: 100,
      stress: 0,
      money: 120,
      knowledge: 10,
      connections: 0,
    },
    scoringMultiplier: 1.0,
  },
  {
    id: 'researcher',
    name: 'Researcher',
    description:
      'Deep technical knowledge but a thinner travel budget and lower stamina from late nights at the lab.',
    startingStats: {
      energy: 90,
      stress: 0,
      money: 80,
      knowledge: 20,
      connections: 0,
    },
    scoringMultiplier: 1.5,
  },
  {
    id: 'executive',
    name: 'Executive',
    description:
      'Deep pockets and good connections, but the calendar is brutal and you arrive already wound up.',
    startingStats: {
      energy: 100,
      stress: 20,
      money: 250,
      knowledge: 0,
      connections: 0,
    },
    scoringMultiplier: 0.8,
  },
];
