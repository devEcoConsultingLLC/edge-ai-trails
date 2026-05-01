import type {
  PlayerStats,
  PlayerRole,
  ScoringWeights,
  ScoreBreakdown,
} from './types';
import { DEFAULT_SCORING } from './types';

export function calculateScore(
  stats: PlayerStats,
  items: string[],
  role: PlayerRole,
  weightOverrides?: Partial<ScoringWeights>,
): ScoreBreakdown {
  const weights: ScoringWeights = { ...DEFAULT_SCORING, ...weightOverrides };

  const energyBonus = stats.energy * weights.energy;
  const knowledgeBonus = stats.knowledge * weights.knowledge;
  const connectionsBonus = stats.connections * weights.connections;
  const moneyBonus = stats.money * weights.money;
  const lowStressBonus = (100 - stats.stress) * weights.lowStressBonus;
  const itemBonus = items.length * weights.perItem;

  const subtotal =
    weights.base +
    energyBonus +
    knowledgeBonus +
    connectionsBonus +
    moneyBonus +
    lowStressBonus +
    itemBonus;

  const finalScore = Math.round(subtotal * role.scoringMultiplier);

  return {
    base: weights.base,
    energyBonus,
    knowledgeBonus,
    connectionsBonus,
    moneyBonus,
    lowStressBonus,
    itemBonus,
    subtotal,
    roleMultiplier: role.scoringMultiplier,
    finalScore,
  };
}
