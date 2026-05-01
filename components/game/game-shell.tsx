'use client';

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

  if (engine.state === null) {
    return <TitleScreen pack={pack} onSelectRole={engine.selectRole} />;
  }

  const { state } = engine;

  if (state.status === 'playing') {
    return (
      <SceneScreen
        state={state}
        pack={pack}
        onMakeChoice={engine.makeChoice}
      />
    );
  }

  if (state.status === 'victory') {
    return (
      <VictoryScreen state={state} pack={pack} onRestart={engine.restart} />
    );
  }

  if (state.status === 'gameOver') {
    return <GameOverScreen state={state} onRestart={engine.restart} />;
  }

  return <p>Unknown game state.</p>;
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
        <p className="text-sm text-muted-foreground">
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
            className="block w-full rounded border p-4 text-left hover:bg-accent"
          >
            <div className="font-semibold">{role.name}</div>
            {role.description && (
              <div className="text-sm text-muted-foreground">
                {role.description}
              </div>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
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
                <span className="ml-2 text-xs text-muted-foreground">
                  (needs ${choice.requires.minMoney})
                </span>
              )}
              {!enabled && choice.requires?.hasItem && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (needs {choice.requires.hasItem})
                </span>
              )}
            </Button>
          );
        })}
        {scene.choices.length === 0 && (
          <p className="text-sm text-muted-foreground">No choices available.</p>
        )}
      </div>
    </div>
  );
}

function StatsBar({ state }: { state: GameState }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded border p-3 text-sm sm:grid-cols-5">
      <div>
        <div className="text-xs text-muted-foreground">Energy</div>
        <div>{state.stats.energy}/100</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Stress</div>
        <div>{state.stats.stress}/100</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Money</div>
        <div>${state.stats.money}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Knowledge</div>
        <div>{state.stats.knowledge}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Connections</div>
        <div>{state.stats.connections}</div>
      </div>
      {state.items.length > 0 && (
        <div className="col-span-full">
          <div className="text-xs text-muted-foreground">Items</div>
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
        <p className="text-sm text-muted-foreground">
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
    <div className="rounded border p-4">
      <h2 className="mb-3 text-lg font-semibold">Score breakdown</h2>
      <dl className="space-y-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold">
          <dt>Final score</dt>
          <dd>{breakdown.finalScore}</dd>
        </div>
      </dl>
    </div>
  );
}

function GameOverScreen({
  state,
  onRestart,
}: {
  state: GameState;
  onRestart: () => void;
}) {
  const reason =
    state.stats.energy <= 0
      ? 'You ran out of energy.'
      : 'Stress overload.';
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Game over</h1>
        <p className="mt-2">{reason}</p>
      </div>
      <Button onClick={onRestart}>Try again</Button>
    </div>
  );
}
