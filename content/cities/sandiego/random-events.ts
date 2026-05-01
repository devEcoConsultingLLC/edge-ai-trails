import type { RandomEvent } from '@/lib/engine';

// The original sandiego runtime rolled a single 15% chance per choice and,
// on success, picked one event uniformly from this set. Our engine evaluates
// each event independently per choice, so to approximate that behavior we
// give each event probability ~ 0.15 / 6 = 0.025. With six events, the
// chance that at least one fires is ~ 1 - (1 - 0.025)^6 ~ 14.4%, close to
// the original 15%. Stat effects, item changes, and message text are
// preserved from the original (lib/page.tsx events array).
export const randomEvents: RandomEvent[] = [
  {
    id: 'found_money',
    probability: 0.025,
    message: 'You found a $20 bill on the ground!',
    effects: { money: 20 },
  },
  {
    id: 'phone_battery',
    probability: 0.025,
    message: 'Your phone battery dropped 20%!',
    effects: { stress: 10 },
  },
  {
    id: 'free_coffee',
    probability: 0.025,
    message: 'A stranger bought you coffee!',
    effects: { energy: 15, stress: -5 },
  },
  {
    id: 'overheard_ai',
    probability: 0.025,
    message: 'You overheard an interesting Edge AI conversation!',
    effects: { knowledge: 5 },
  },
  {
    id: 'old_colleague',
    probability: 0.025,
    message: 'You bumped into an old colleague!',
    effects: { connections: 1 },
  },
  {
    id: 'sudden_rain',
    probability: 0.025,
    message: 'Sudden rain! You got a bit wet.',
    effects: { stress: 5 },
  },
];
