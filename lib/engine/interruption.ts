import type { CityPack } from './city-pack';

export interface InterruptionPlan {
  willFire: boolean;
  triggerSceneId?: string;  // scene transition that triggers the interruption
  entryScene?: string;      // scene to route to when triggered
  triggerOnce: boolean;
}

// Decide once at game start whether the interruption will fire, and if so,
// which incoming scene transition triggers it. Returning a static plan keeps
// the runtime deterministic for the rest of the playthrough.
export function planInterruption(
  pack: CityPack,
  rng: () => number = Math.random,
): InterruptionPlan {
  const config = pack.interruption;
  if (!config) {
    return { willFire: false, triggerOnce: true };
  }

  if (rng() >= config.probability) {
    return { willFire: false, triggerOnce: config.triggerOnce ?? true };
  }

  // Pick a scene to trigger on. Exclude the start scene (no interruption on
  // the very first scene) and the victory scene (interruption should not
  // hijack a win).
  const candidates = Object.keys(pack.scenes).filter((id) => {
    if (id === pack.startScene) return false;
    if (id === pack.victoryScene) return false;
    if (id === config.entryScene) return false;
    if (pack.scenes[id].excludeFromInterruption) return false;
    return true;
  });

  if (candidates.length === 0) {
    return { willFire: false, triggerOnce: config.triggerOnce ?? true };
  }

  const idx = Math.floor(rng() * candidates.length);
  return {
    willFire: true,
    triggerSceneId: candidates[idx],
    entryScene: config.entryScene,
    triggerOnce: config.triggerOnce ?? true,
  };
}

// Returns true if the runtime should reroute the incoming scene to the
// interruption entry scene.
export function shouldFireInterruption(
  plan: InterruptionPlan,
  incomingSceneId: string,
  hasFired: boolean,
): boolean {
  if (!plan.willFire) return false;
  if (hasFired && plan.triggerOnce) return false;
  return plan.triggerSceneId === incomingSceneId;
}
