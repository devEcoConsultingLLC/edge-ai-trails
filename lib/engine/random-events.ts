import type { GameState, RandomEvent } from './types';
import { applyStatDelta } from './state';

// Walk the events list once. The first event whose probability roll succeeds
// fires. Returns null if none fire. Caller can reorder events to influence
// priority, or pass a deterministic rng for testing.
export function rollRandomEvent(
  events: RandomEvent[],
  rng: () => number = Math.random,
): RandomEvent | null {
  for (const event of events) {
    if (rng() < event.probability) {
      return event;
    }
  }
  return null;
}

export function applyRandomEvent(
  state: GameState,
  event: RandomEvent,
): GameState {
  const nextStats = applyStatDelta(state.stats, event.effects);
  let nextItems = state.items;
  if (event.itemGain && !nextItems.includes(event.itemGain)) {
    nextItems = [...nextItems, event.itemGain];
  }

  // A random event can push stats into game-over territory but cannot win
  // the game. Re-evaluate game-over threshold only.
  let nextStatus = state.status;
  if (
    state.status === 'playing' &&
    (nextStats.energy <= 0 || nextStats.stress >= 100)
  ) {
    nextStatus = 'gameOver';
  }

  return {
    ...state,
    status: nextStatus,
    stats: nextStats,
    items: nextItems,
  };
}
