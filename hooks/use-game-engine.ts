'use client';

import { useCallback, useState } from 'react';
import type {
  Choice,
  GameState,
  PlayerRole,
  RandomEvent,
} from '@/lib/engine';
import {
  applyChoice,
  applyRandomEvent,
  initializeGame,
  planInterruption,
  rollRandomEvent,
  shouldFireInterruption,
} from '@/lib/engine';
import type { CityPack } from '@/lib/engine';
import type { InterruptionPlan } from '@/lib/engine/interruption';

export interface UseGameEngineReturn {
  state: GameState | null;
  lastEvent: RandomEvent | null;
  selectRole: (role: PlayerRole) => void;
  makeChoice: (choice: Choice) => void;
  clearLastEvent: () => void;
  restart: () => void;
}

export function useGameEngine(pack: CityPack): UseGameEngineReturn {
  const [state, setState] = useState<GameState | null>(null);
  const [interruptionPlan, setInterruptionPlan] =
    useState<InterruptionPlan | null>(null);
  const [hasInterruptionFired, setHasInterruptionFired] = useState(false);
  const [lastEvent, setLastEvent] = useState<RandomEvent | null>(null);

  const selectRole = useCallback(
    (role: PlayerRole) => {
      const initial = initializeGame(pack, role);
      setState(initial);
      setInterruptionPlan(planInterruption(pack));
      setHasInterruptionFired(false);
      setLastEvent(null);
    },
    [pack],
  );

  const makeChoice = useCallback(
    (choice: Choice) => {
      if (!state || state.status !== 'playing') return;

      let next = applyChoice(state, choice, pack);

      if (next.status !== 'playing') {
        setState(next);
        return;
      }

      if (
        interruptionPlan &&
        !hasInterruptionFired &&
        shouldFireInterruption(
          interruptionPlan,
          next.currentSceneId,
          hasInterruptionFired,
        )
      ) {
        const entry = interruptionPlan.entryScene!;
        next = {
          ...next,
          currentSceneId: entry,
          history: [...next.history.slice(0, -1), entry],
        };
        setHasInterruptionFired(true);
      }

      if (next.status === 'playing' && pack.randomEvents.length > 0) {
        const event = rollRandomEvent(pack.randomEvents);
        if (event) {
          next = applyRandomEvent(next, event);
          setLastEvent(event);
        }
      }

      setState(next);
    },
    [state, pack, interruptionPlan, hasInterruptionFired],
  );

  const clearLastEvent = useCallback(() => {
    setLastEvent(null);
  }, []);

  const restart = useCallback(() => {
    setState(null);
    setInterruptionPlan(null);
    setHasInterruptionFired(false);
    setLastEvent(null);
  }, []);

  return { state, lastEvent, selectRole, makeChoice, clearLastEvent, restart };
}
