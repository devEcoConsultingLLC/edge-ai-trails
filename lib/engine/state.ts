import type {
  Choice,
  GameState,
  PlayerRole,
  PlayerStats,
  StatDelta,
} from './types';
import type { CityPack } from './city-pack';

// Energy and stress are bounded 0 to 100. Other stats are bounded 0 and up.
function clampStat(key: keyof PlayerStats, value: number): number {
  if (key === 'energy' || key === 'stress') {
    return Math.max(0, Math.min(100, value));
  }
  return Math.max(0, value);
}

export function applyStatDelta(stats: PlayerStats, delta: StatDelta): PlayerStats {
  const next: PlayerStats = { ...stats };
  for (const key of Object.keys(delta) as Array<keyof PlayerStats>) {
    const change = delta[key];
    if (change !== undefined) {
      next[key] = clampStat(key, stats[key] + change);
    }
  }
  return next;
}

export function initializeGame(pack: CityPack, role: PlayerRole): GameState {
  return {
    status: 'playing',
    currentSceneId: pack.startScene,
    stats: { ...role.startingStats },
    items: [],
    role,
    history: [pack.startScene],
  };
}

// Apply a choice to game state. Returns a new GameState. Does not handle
// random events or interruptions; those are composed by the runtime layer
// after applyChoice runs.
export function applyChoice(
  state: GameState,
  choice: Choice,
  pack: CityPack,
): GameState {
  const nextStats = applyStatDelta(state.stats, choice.effects);

  let nextItems = state.items;
  if (choice.itemLose) {
    nextItems = nextItems.filter((i) => i !== choice.itemLose);
  }
  if (choice.itemGain && !nextItems.includes(choice.itemGain)) {
    nextItems = [...nextItems, choice.itemGain];
  }

  const nextSceneId = choice.nextScene;
  const nextHistory = [...state.history, nextSceneId];

  // Victory takes precedence so a victory-state scene with low energy still
  // counts as a win.
  let nextStatus: GameState['status'] = 'playing';
  if (nextSceneId === pack.victoryScene) {
    nextStatus = 'victory';
  } else if (nextStats.energy <= 0 || nextStats.stress >= 100) {
    nextStatus = 'gameOver';
  }

  return {
    status: nextStatus,
    currentSceneId: nextSceneId,
    stats: nextStats,
    items: nextItems,
    role: state.role,
    history: nextHistory,
  };
}
