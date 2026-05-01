// Core game types. Generic across all city packs.
// Logic that consumes these types lives in sibling files (state machine,
// scoring, choice resolver) and will be added in subsequent prompts.

export interface PlayerStats {
  energy: number;       // 0 to 100. Reaching 0 ends the game.
  stress: number;       // 0 to 100. Reaching 100 ends the game.
  money: number;        // 0 or higher. No upper bound.
  knowledge: number;    // 0 or higher. No upper bound.
  connections: number;  // 0 or higher. No upper bound.
}

// A choice's effects on stats. Any subset of stats may change.
// Negative values reduce; positive values increase.
export type StatDelta = Partial<Record<keyof PlayerStats, number>>;

export interface ChoiceRequirement {
  minMoney?: number;
  hasItem?: string;
}

export interface Choice {
  text: string;
  effects: StatDelta;
  nextScene: string;
  itemGain?: string;
  itemLose?: string;
  requires?: ChoiceRequirement;
}

export interface SceneData {
  id: string;
  title: string;
  description: string;
  choices: Choice[];
  art?: string;          // asset key resolved by the city pack's branding/assets
  // Scenes that are part of an interruption sequence (e.g., Pete-call sub-scenes)
  // should set this to true so they are not picked as random interruption triggers
  // by planInterruption. Default: false (the scene is a normal candidate).
  excludeFromInterruption?: boolean;
}

export interface RandomEvent {
  id: string;
  probability: number;   // 0 to 1, evaluated per choice
  message: string;
  effects: StatDelta;
  itemGain?: string;
}

export interface PlayerRole {
  id: string;            // e.g. 'developer'
  name: string;          // e.g. 'Developer'
  description?: string;  // optional flavor text shown in role select
  startingStats: PlayerStats;
  scoringMultiplier: number;
}

// Scoring formula weights. The runtime score is:
//   subtotal = base + energy*W.energy + knowledge*W.knowledge
//            + connections*W.connections + money*W.money
//            + (100 - stress)*W.lowStressBonus + items.length*W.perItem
//   final   = round(subtotal * role.scoringMultiplier)
export interface ScoringWeights {
  base: number;
  energy: number;
  knowledge: number;
  connections: number;
  money: number;
  lowStressBonus: number;
  perItem: number;
}

// Default weights, derived from the original sandiego formula.
// City packs can override any subset via CityPack.scoringOverrides.
export const DEFAULT_SCORING: ScoringWeights = {
  base: 1000,
  energy: 5,
  knowledge: 20,
  connections: 50,
  money: 2,
  lowStressBonus: 3,
  perItem: 25,
};

export interface ScoreBreakdown {
  base: number;
  energyBonus: number;
  knowledgeBonus: number;
  connectionsBonus: number;
  moneyBonus: number;
  lowStressBonus: number;
  itemBonus: number;
  subtotal: number;
  roleMultiplier: number;
  finalScore: number;
}

export type GameStatus = 'title' | 'playing' | 'victory' | 'gameOver';

export interface GameState {
  status: GameStatus;
  currentSceneId: string;
  stats: PlayerStats;
  items: string[];
  role: PlayerRole;
  history: string[];     // scene IDs visited in order
}

// City-specific Easter egg / interruption mechanic.
// Generic by design: sandiego uses this for the Pete Bernard call,
// London (and future cities) define their own.
export interface InterruptionConfig {
  probability: number;   // 0 to 1, evaluated once per playthrough
  entryScene: string;    // scene ID to jump to when interruption fires
  triggerOnce?: boolean; // default true: fires at most once per playthrough
}
