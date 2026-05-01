'use client';

import type React from 'react';
import { Button } from '@/components/ui/button';
import { useGameEngine } from '@/hooks/use-game-engine';
import {
  calculateScore,
  canMakeChoice,
  type Choice,
  type CityPack,
  type GameState,
  type PlayerRole,
  type ScoreBreakdown,
} from '@/lib/engine';

export function GameShell({ pack }: { pack: CityPack }) {
  const engine = useGameEngine(pack);

  let content: React.ReactNode;

  if (engine.state === null) {
    content = <TitleScreen pack={pack} onSelectRole={engine.selectRole} />;
  } else if (engine.state.status === 'playing') {
    content = (
      <SceneScreen
        state={engine.state}
        pack={pack}
        onMakeChoice={engine.makeChoice}
      />
    );
  } else if (engine.state.status === 'victory') {
    content = (
      <VictoryScreen
        state={engine.state}
        pack={pack}
        onRestart={engine.restart}
      />
    );
  } else if (engine.state.status === 'gameOver') {
    content = (
      <GameOverScreen
        state={engine.state}
        pack={pack}
        onRestart={engine.restart}
      />
    );
  } else {
    content = <p>Unknown game state.</p>;
  }

  return (
    <div
      style={
        {
          '--city-bg': pack.branding.secondaryColor,
          '--city-fg': pack.branding.primaryColor,
        } as React.CSSProperties
      }
      className="min-h-screen w-full bg-[var(--city-bg)] text-[var(--city-fg)]"
    >
      {content}
    </div>
  );
}

function TitleScreen({
  pack,
  onSelectRole,
}: {
  pack: CityPack;
  onSelectRole: (role: PlayerRole) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{pack.meta.name}</h1>
        <p className="text-sm opacity-70">
          {pack.meta.eventName} ({pack.meta.eventDate})
        </p>
      </div>
      <p>{pack.meta.heroCopy}</p>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Choose your role</h2>
        {pack.roles.map((role) => (
          <button
            key={role.id}
            onClick={() => onSelectRole(role)}
            className="block w-full rounded border border-[var(--city-fg)]/30 p-4 text-left hover:bg-[var(--city-fg)]/5"
          >
            <div className="font-semibold">{role.name}</div>
            {role.description && (
              <div className="text-sm opacity-70">{role.description}</div>
            )}
            <div className="mt-2 text-xs opacity-70">
              Energy {role.startingStats.energy}, Stress{' '}
              {role.startingStats.stress}, Money ${role.startingStats.money},
              Knowledge {role.startingStats.knowledge}, Connections{' '}
              {role.startingStats.connections}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SceneScreen({
  state,
  pack,
  onMakeChoice,
}: {
  state: GameState;
  pack: CityPack;
  onMakeChoice: (choice: Choice) => void;
}) {
  const scene = pack.scenes[state.currentSceneId];
  if (!scene) {
    return (
      <div className="p-6">
        <p>Scene not found: {state.currentSceneId}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <StatsBar state={state} />
      <div>
        <h1 className="text-2xl font-bold">{scene.title}</h1>
        <p className="mt-3">{scene.description}</p>
      </div>
      <div className="space-y-2">
        {scene.choices.map((choice, i) => {
          const enabled = canMakeChoice(state, choice);
          return (
            <Button
              key={i}
              onClick={() => onMakeChoice(choice)}
              disabled={!enabled}
              variant="outline"
              className="w-full justify-start text-left"
            >
              {choice.text}
              {!enabled && choice.requires?.minMoney !== undefined && (
                <span className="ml-2 text-xs opacity-70">
                  (needs ${choice.requires.minMoney})
                </span>
              )}
              {!enabled && choice.requires?.hasItem && (
                <span className="ml-2 text-xs opacity-70">
                  (needs {choice.requires.hasItem})
                </span>
              )}
            </Button>
          );
        })}
        {scene.choices.length === 0 && (
          <p className="text-sm opacity-70">No choices available.</p>
        )}
      </div>
    </div>
  );
}

function StatsBar({ state }: { state: GameState }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded border border-[var(--city-fg)]/30 p-3 text-sm sm:grid-cols-5">
      <div>
        <div className="text-xs opacity-70">Energy</div>
        <div>{state.stats.energy}/100</div>
      </div>
      <div>
        <div className="text-xs opacity-70">Stress</div>
        <div>{state.stats.stress}/100</div>
      </div>
      <div>
        <div className="text-xs opacity-70">Money</div>
        <div>${state.stats.money}</div>
      </div>
      <div>
        <div className="text-xs opacity-70">Knowledge</div>
        <div>{state.stats.knowledge}</div>
      </div>
      <div>
        <div className="text-xs opacity-70">Connections</div>
        <div>{state.stats.connections}</div>
      </div>
      {state.items.length > 0 && (
        <div className="col-span-full">
          <div className="text-xs opacity-70">Items</div>
          <div>{state.items.join(', ')}</div>
        </div>
      )}
    </div>
  );
}

function VictoryScreen({
  state,
  pack,
  onRestart,
}: {
  state: GameState;
  pack: CityPack;
  onRestart: () => void;
}) {
  const breakdown = calculateScore(
    state.stats,
    state.items,
    state.role,
    pack.scoringOverrides,
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Victory</h1>
        <p className="text-sm opacity-70">
          You made it to {pack.meta.eventName}.
        </p>
      </div>
      <ScoreBreakdownDisplay breakdown={breakdown} />
      <Button onClick={onRestart}>Play again</Button>
    </div>
  );
}

function ScoreBreakdownDisplay({ breakdown }: { breakdown: ScoreBreakdown }) {
  const rows: Array<[string, number | string]> = [
    ['Base', breakdown.base],
    ['Energy bonus', breakdown.energyBonus],
    ['Knowledge bonus', breakdown.knowledgeBonus],
    ['Connections bonus', breakdown.connectionsBonus],
    ['Money bonus', breakdown.moneyBonus],
    ['Low-stress bonus', breakdown.lowStressBonus],
    ['Item bonus', breakdown.itemBonus],
    ['Subtotal', breakdown.subtotal],
    ['Role multiplier', breakdown.roleMultiplier.toFixed(2) + 'x'],
  ];
  return (
    <div className="rounded border border-[var(--city-fg)]/30 p-4">
      <h2 className="mb-3 text-lg font-semibold">Score breakdown</h2>
      <dl className="space-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-[var(--city-fg)]/30 pt-2 text-base font-bold">
          <dt>Final score</dt>
          <dd>{breakdown.finalScore}</dd>
        </div>
      </dl>
    </div>
  );
}

function GameOverScreen({
  state,
  pack,
  onRestart,
}: {
  state: GameState;
  pack: CityPack;
  onRestart: () => void;
}) {
  const scene = pack.scenes[state.currentSceneId];
  const reason =
    state.stats.energy <= 0
      ? 'You ran out of energy.'
      : 'Stress overload.';

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Game over</h1>
      {scene && (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{scene.title}</h2>
          <p>{scene.description}</p>
        </div>
      )}
      <p className="text-sm opacity-70">{reason}</p>
      <Button onClick={onRestart}>Try again</Button>
    </div>
  );
}
