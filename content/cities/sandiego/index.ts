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
  victoryScene: 'eve_entrance',
  // interruption is intentionally omitted; the Pete Bernard call lands in
  // the next prompt along with InterruptionConfig wiring.
};

export default sandiego;
