import type { CityPack } from '@/lib/engine';

export const sandiego: CityPack = {
  meta: {
    slug: 'sandiego',
    name: 'San Diego',
    eventName: 'EDGE AI San Diego 2026',
    eventDate: '2026-03-19',
    status: 'past',
    eventUrl: 'https://www.edgeaifoundation.org/',
    heroCopy:
      'Navigate from airport drop-off to the EVE venue. Stub pack: real content ports in upcoming prompts.',
  },
  branding: {
    primaryColor: '#0d3a4a',
    secondaryColor: '#f4ecdb',
  },
  roles: [
    {
      id: 'developer',
      name: 'Developer',
      description: 'Balanced loadout. Stub for wiring verification.',
      startingStats: {
        energy: 100,
        stress: 10,
        money: 120,
        knowledge: 10,
        connections: 5,
      },
      scoringMultiplier: 1.0,
    },
  ],
  scenes: {
    stub_start: {
      id: 'stub_start',
      title: 'Airport drop-off',
      description:
        'You step out of the rideshare with your bag. The terminal is in front of you. (Stub scene: real content coming next.)',
      choices: [
        {
          text: 'Head into the terminal',
          effects: { energy: -10, knowledge: 5 },
          nextScene: 'stub_victory',
        },
      ],
    },
    stub_victory: {
      id: 'stub_victory',
      title: 'You made it',
      description: 'EVE venue entrance. (Stub victory scene.)',
      choices: [],
    },
  },
  randomEvents: [],
  startScene: 'stub_start',
  victoryScene: 'stub_victory',
};

export default sandiego;
