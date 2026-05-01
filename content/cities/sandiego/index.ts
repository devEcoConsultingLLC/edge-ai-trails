import type { CityPack } from '@/lib/engine';
import { meta, branding } from './meta';
import { roles } from './roles';
import { scenes } from './scenes';
import { randomEvents } from './random-events';

export const sandiego: CityPack = {
  meta,
  branding,
  roles,
  scenes,
  randomEvents,
  startScene: 'airport_dropoff',
  victoryScene: 'victory',  // sentinel; eve_entrance is the last playable scene
  interruption: {
    probability: 0.33,
    entryScene: 'pete_ringing',
    triggerOnce: true,
  },
};

export default sandiego;
