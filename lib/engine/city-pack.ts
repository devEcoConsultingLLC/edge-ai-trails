import type {
  PlayerRole,
  RandomEvent,
  SceneData,
  ScoringWeights,
  InterruptionConfig,
} from './types';

export type CityStatus = 'upcoming' | 'live' | 'past';

export interface CityMeta {
  slug: string;              // URL-safe, e.g. 'sandiego', 'london'
  name: string;              // display name, e.g. 'San Diego'
  eventName: string;         // e.g. 'EDGE AI San Diego 2026'
  eventDate: string;         // ISO 8601 date, e.g. '2026-03-19'
  status: CityStatus;
  registrationUrl?: string;  // omit when status is 'past'
  eventUrl?: string;         // optional EDGE AI Foundation event page
  heroCopy: string;          // short copy for the hub card
}

export interface CityBranding {
  primaryColor: string;      // hex, used for accents
  secondaryColor: string;    // hex, used for backgrounds
  badge?: string;            // path to a city-specific badge asset
  heroImage?: string;        // path to a hero image asset
}

export interface CityPack {
  meta: CityMeta;
  branding: CityBranding;
  roles: PlayerRole[];                       // typically 3, matching the original sandiego pattern
  scenes: Record<string, SceneData>;         // keyed by scene id
  randomEvents: RandomEvent[];
  startScene: string;                        // scene id to start at after role selection
  victoryScene: string;                      // scene id that signals victory
  interruption?: InterruptionConfig;         // optional Easter egg
  scoringOverrides?: Partial<ScoringWeights>;
}
