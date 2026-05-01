import type { SceneData } from '@/lib/engine';

// Ported from the original sandiego runtime (lib/game-scenes.ts) with these
// translations:
// - Sandiego's `cost: N` becomes `requires: { minMoney: N }`. The actual
//   money deduction is already encoded in the choice's `effects.money`.
// - Sandiego's `effects.addItem` / `effects.removeItem` map to our top-level
//   `itemGain` / `itemLose`.
// - Sandiego's per-choice `result` flavor string and `icon` emoji do not
//   have analogs in our schema and are dropped here. They will be reintroduced
//   in a later UI prompt if needed.
// - The `{playerName}` template placeholder used by the original UI is removed
//   from descriptions, since this engine has no player-name input.
// - Em dashes are replaced with commas, periods, or colons per project style.
// - Pete-call scenes (entry, call, four deaths) are wired through the engine's
//   generic InterruptionConfig mechanism. The original sandiego runtime rendered
//   the Pete call as a dedicated PeteCallScreen component with a ringing phase,
//   four-choice call phase, and four animated death scenes; here those phases
//   become regular scenes flagged `excludeFromInterruption: true` so the
//   interruption planner cannot pick them as a random trigger point.
export const scenes: Record<string, SceneData> = {
  airport_dropoff: {
    id: 'airport_dropoff',
    title: 'Airport Drop-Off',
    description:
      "Your Uber screeches to a halt at the curb. 'EDGE AI San Diego 2026, here we come!' you mutter, checking your watch. The terminal looms ahead, packed with travelers. Your flight leaves in 90 minutes. The clock is ticking!",
    choices: [
      {
        text: 'Sprint inside immediately, no time to waste!',
        effects: { energy: -15, stress: 10 },
        nextScene: 'luggage_dilemma',
      },
      {
        text: 'Take a deep breath and walk calmly',
        effects: { energy: -5, stress: -5 },
        nextScene: 'airport_entrance',
      },
      {
        text: 'Tip the driver extra for good luck',
        effects: { money: -10, stress: -10 },
        nextScene: 'airport_entrance',
        requires: { minMoney: 10 },
      },
    ],
  },

  airport_entrance: {
    id: 'airport_entrance',
    title: 'Terminal Entrance',
    description:
      "The automatic doors whoosh open to reveal chaos. Flight status boards flash delays and gate changes. A family argues over a mountain of luggage. Someone's emotional support peacock squawks loudly. Welcome to modern air travel.",
    choices: [
      {
        text: 'Check the departure board first',
        effects: { stress: -5, knowledge: 2 },
        nextScene: 'luggage_dilemma',
      },
      {
        text: 'Head straight to check-in',
        effects: { energy: -5 },
        nextScene: 'luggage_dilemma',
      },
      {
        text: 'Stop at the information desk',
        effects: { stress: -10, knowledge: 3 },
        nextScene: 'luggage_dilemma',
      },
    ],
  },

  luggage_dilemma: {
    id: 'luggage_dilemma',
    title: 'The Luggage Dilemma',
    description:
      'You look down at your suitcase. The check-in line snakes around twice. The carry-on only lane is completely empty. Your suitcase is juuust over the size limit. A porter catches your eye and winks.',
    choices: [
      {
        text: "Risk it as carry-on (it'll probably fit...)",
        effects: { stress: 15, energy: -10 },
        nextScene: 'security_line',
      },
      {
        text: 'Check the bag properly',
        effects: { energy: -10, stress: 5, money: -35 },
        nextScene: 'security_line',
        requires: { minMoney: 35 },
      },
      {
        text: "Pay the porter for 'expedited handling'",
        effects: { money: -25, stress: -15, connections: 1 },
        nextScene: 'security_line',
        requires: { minMoney: 25 },
      },
      {
        text: 'Stuff essentials into laptop bag, abandon suitcase',
        effects: { stress: 20, energy: -5 },
        nextScene: 'security_line',
      },
    ],
  },

  security_line: {
    id: 'security_line',
    title: 'Security Serpent',
    description:
      "The security line stretches endlessly, a human snake of frustration. A TSA agent yells 'LAPTOPS OUT! SHOES OFF!' Someone ahead forgot about their water bottle. A baby is crying. Another baby joins in harmony.",
    choices: [
      {
        text: 'Wait patiently in the regular line',
        effects: { energy: -20, stress: 20 },
        nextScene: 'tsa_checkpoint',
      },
      {
        text: 'Try the TSA PreCheck line (if eligible)',
        effects: { energy: -5, stress: -5 },
        nextScene: 'tsa_checkpoint',
      },
      {
        text: 'Strike up conversation with nearby traveler',
        effects: { stress: -10, connections: 1, knowledge: 2 },
        nextScene: 'tsa_checkpoint',
      },
      {
        text: 'Meditate to pass the time',
        effects: { stress: -15, energy: 5 },
        nextScene: 'tsa_checkpoint',
      },
    ],
  },

  tsa_checkpoint: {
    id: 'tsa_checkpoint',
    title: 'TSA Checkpoint',
    description:
      "You reach the X-ray machines. A stern agent examines IDs with the intensity of someone defusing a bomb. Your laptop bag goes through the scanner. The machine BEEPS. The agent's eyes narrow.",
    choices: [
      {
        text: 'Remain calm and cooperative',
        effects: { stress: 10, energy: -5 },
        nextScene: 'food_court',
      },
      {
        text: "'It's probably my neural compute stick!'",
        effects: { stress: -5, knowledge: 3 },
        nextScene: 'food_court',
      },
      {
        text: 'Make a nervous joke',
        effects: { stress: 25 },
        nextScene: 'food_court',
      },
      {
        text: 'Offer to explain what is in your bag',
        effects: { energy: -10, knowledge: 2, connections: 1 },
        nextScene: 'food_court',
      },
    ],
  },

  food_court: {
    id: 'food_court',
    title: 'Food Court Temptation',
    description:
      "You've made it past security! The food court beckons with its siren call of overpriced pizza and questionable sushi. Your stomach growls. The gate is a 10-minute walk. You have maybe 35 minutes until boarding.",
    choices: [
      {
        text: 'Grab a quick coffee and energy bar',
        effects: { money: -12, energy: 20, stress: -5 },
        nextScene: 'gate_rush',
        requires: { minMoney: 12 },
      },
      {
        text: 'Get a proper meal, you need the fuel',
        effects: { money: -22, energy: 35, stress: 10 },
        nextScene: 'gate_rush',
        requires: { minMoney: 22 },
      },
      {
        text: 'Skip food entirely, no time!',
        effects: { energy: -15, stress: 15 },
        nextScene: 'gate_rush',
      },
      {
        text: 'Buy snacks for the plane',
        effects: { money: -15, energy: 10 },
        nextScene: 'gate_rush',
        requires: { minMoney: 15 },
        itemGain: 'snacks',
      },
    ],
  },

  gate_rush: {
    id: 'gate_rush',
    title: 'The Gate Rush',
    description:
      "You check your watch. 20 minutes to boarding. Gate B42 is in Terminal B. You're in Terminal A. The moving walkway is broken. A golf cart driver asks if you need a ride. 'NOW BOARDING FLIGHT 847 TO SAN DIEGO.'",
    choices: [
      {
        text: 'SPRINT! Full speed ahead!',
        effects: { energy: -30, stress: 20 },
        nextScene: 'boarding',
      },
      {
        text: 'Take the golf cart ($10 tip expected)',
        effects: { money: -10, energy: -5, stress: -10 },
        nextScene: 'boarding',
        requires: { minMoney: 10 },
      },
      {
        text: 'Fast walk, pace yourself',
        effects: { energy: -15, stress: 10 },
        nextScene: 'boarding',
      },
      {
        text: 'Find an alternate route through shops',
        effects: { energy: -10, stress: 5, knowledge: 1 },
        nextScene: 'boarding',
      },
    ],
  },

  boarding: {
    id: 'boarding',
    title: 'Boarding Call',
    description:
      "You made it! The gate agent scans your boarding pass. BEEP. Green light. But wait, there's a commotion. A passenger is arguing about overhead bin space. The line isn't moving. Your seat is 23C. Middle seat.",
    choices: [
      {
        text: 'Wait patiently for your zone',
        effects: { stress: 10, energy: -5 },
        nextScene: 'plane_seat',
      },
      {
        text: 'Ask politely if you can board early',
        effects: { stress: -5, connections: 1 },
        nextScene: 'plane_seat',
      },
      {
        text: 'Pretend to need extra time to board',
        effects: { stress: 15 },
        nextScene: 'plane_seat',
      },
      {
        text: 'Help the arguing passenger with their bag',
        effects: { energy: -10, stress: -10, connections: 1 },
        nextScene: 'plane_seat',
      },
    ],
  },

  plane_seat: {
    id: 'plane_seat',
    title: 'Finding Your Seat',
    description:
      'You navigate the narrow aisle, bags bumping shoulders. 21... 22... 23C. Your seatmates are already settled: a large man spilling into your space, and a teenager with music blasting from headphones. The overhead bin above is full.',
    choices: [
      {
        text: 'Accept your fate and squeeze in',
        effects: { stress: 20, energy: -10 },
        nextScene: 'plane_events',
      },
      {
        text: 'Ask the flight attendant about other seats',
        effects: { stress: -10, connections: 1 },
        nextScene: 'plane_events',
      },
      {
        text: 'Strike up conversation with seatmates',
        effects: { stress: -5, energy: -5, connections: 1, knowledge: 2 },
        nextScene: 'plane_events',
      },
      {
        text: 'Put on noise-canceling headphones immediately',
        effects: { stress: -15 },
        nextScene: 'plane_events',
      },
    ],
  },

  plane_events: {
    id: 'plane_events',
    title: 'In-Flight Adventures',
    description:
      'The plane reaches cruising altitude. The seatbelt sign dings off. A baby starts crying. The drink cart approaches. Turbulence shakes the cabin. Someone opens a pungent meal. Another passenger keeps kicking your seat.',
    choices: [
      {
        text: 'Work on your EDGE AI presentation',
        effects: { energy: -15, knowledge: 10, stress: 5 },
        nextScene: 'plane_landing',
      },
      {
        text: 'Sleep through the flight',
        effects: { energy: 30, stress: -20 },
        nextScene: 'plane_landing',
      },
      {
        text: 'Watch the in-flight AI documentary',
        effects: { knowledge: 8, stress: -10 },
        nextScene: 'plane_landing',
      },
      {
        text: 'Network with nearby passengers',
        effects: { energy: -10, connections: 2, knowledge: 5 },
        nextScene: 'plane_landing',
      },
    ],
  },

  plane_landing: {
    id: 'plane_landing',
    title: 'Descent into San Diego',
    description:
      "The captain announces your descent. Through the window, you see the Pacific Ocean sparkling, the curved coastline of San Diego, and... is that the famous Convention Center? Palm trees dot the landscape. You're almost there!",
    choices: [
      {
        text: 'Review your schedule for the conference',
        effects: { knowledge: 5, stress: -5 },
        nextScene: 'san_arrival',
      },
      {
        text: 'Take photos of the view',
        effects: { stress: -10, energy: -5 },
        nextScene: 'san_arrival',
      },
      {
        text: 'Mentally prepare for the final stretch',
        effects: { stress: -15, knowledge: 3 },
        nextScene: 'san_arrival',
      },
    ],
  },

  san_arrival: {
    id: 'san_arrival',
    title: 'Welcome to San Diego!',
    description:
      'Wheels down! San Diego International Airport. The warm California sun greets you as you exit the jetway. Palm trees sway outside the windows. Signs point to Ground Transportation. EVE venue is 15 minutes away. The home stretch!',
    choices: [
      {
        text: 'Head straight to Ground Transportation',
        effects: { energy: -5 },
        nextScene: 'transport_choice',
      },
      {
        text: 'Stop at baggage claim first',
        effects: { energy: -10, stress: 10 },
        nextScene: 'transport_choice',
      },
      {
        text: 'Grab a San Diego souvenir',
        effects: { money: -20, stress: -10 },
        nextScene: 'transport_choice',
        requires: { minMoney: 20 },
        itemGain: 'souvenir',
      },
    ],
  },

  transport_choice: {
    id: 'transport_choice',
    title: 'Getting to EVE',
    description:
      'You emerge into the San Diego sunshine. The venue, EVE, is in the heart of downtown near the Gaslamp Quarter. Options abound: Uber/Lyft surge pricing is 2.3x, the trolley runs every 15 minutes, a taxi line stretches around the corner.',
    choices: [
      {
        text: 'Take a rideshare (Uber/Lyft)',
        effects: { money: -35, energy: -5, stress: -10 },
        nextScene: 'downtown_journey',
        requires: { minMoney: 35 },
      },
      {
        text: 'Hop on the San Diego Trolley',
        effects: { money: -5, energy: -10, stress: 5, knowledge: 2 },
        nextScene: 'downtown_journey',
        requires: { minMoney: 5 },
      },
      {
        text: 'Share a taxi with another conference attendee',
        effects: { money: -15, connections: 1 },
        nextScene: 'downtown_journey',
        requires: { minMoney: 15 },
      },
      {
        text: "Walk, it's only a couple miles!",
        effects: { energy: -25, stress: 10, knowledge: 3 },
        nextScene: 'downtown_journey',
      },
    ],
  },

  downtown_journey: {
    id: 'downtown_journey',
    title: 'Through Downtown San Diego',
    description:
      "You're in downtown San Diego! The historic Gaslamp Quarter's Victorian buildings mix with modern architecture. Street performers entertain crowds. You spot signs directing to 'EDGE AI FOUNDATION' pointing toward a sleek venue ahead.",
    choices: [
      {
        text: 'Follow the EDGE AI signs directly',
        effects: { energy: -5 },
        nextScene: 'eve_approach',
      },
      {
        text: 'Detour through Gaslamp for a quick look',
        effects: { energy: -10, stress: -15, knowledge: 2 },
        nextScene: 'eve_approach',
      },
      {
        text: 'Stop for authentic San Diego tacos',
        effects: { money: -12, energy: 20, stress: -10 },
        nextScene: 'eve_approach',
        requires: { minMoney: 12 },
      },
      {
        text: 'Network with other conference-goers on the street',
        effects: { energy: -5, connections: 2, knowledge: 3 },
        nextScene: 'eve_approach',
      },
    ],
  },

  eve_approach: {
    id: 'eve_approach',
    title: 'Approaching EVE',
    description:
      "There it is: EVE, the venue for EDGE AI San Diego 2026! A massive banner reads 'EDGE AI FOUNDATION: From tinyML to the Edge of AI'. Attendees stream through the entrance. You see booths, hear presentations, feel the energy. So close!",
    choices: [
      {
        text: 'Walk confidently to registration',
        effects: { stress: -20 },
        nextScene: 'eve_entrance',
      },
      {
        text: 'Take a moment to appreciate the journey',
        effects: { stress: -25, knowledge: 5 },
        nextScene: 'eve_entrance',
      },
      {
        text: 'Sprint the final stretch triumphantly',
        effects: { energy: -10 },
        nextScene: 'eve_entrance',
      },
    ],
  },

  // Last playable scene. Its single choice transitions to the 'victory'
  // sentinel, which trips the engine's victory check and flips status to
  // 'victory'. The sentinel is not a real scene; see CityPack.victoryScene.
  eve_entrance: {
    id: 'eve_entrance',
    title: 'Welcome to EDGE AI!',
    description:
      'You step through the doors of EVE. The registration desk greets you with a warm smile. Your badge is ready. Inside, you hear the buzz of innovation: Qualcomm, Intel, UCSD, DeepX, all here. Keynotes, workshops, demos await. You did it!',
    choices: [
      {
        text: 'Accept your badge and enter the conference!',
        effects: { stress: -50, knowledge: 20, connections: 5 },
        nextScene: 'victory',
      },
    ],
  },

  // Pete Bernard call interruption. Routed to via the city pack's
  // InterruptionConfig (probability 0.33). Every path through the call ends in
  // game over, so each Pete-call response choice tanks both stress and energy
  // to clamped game-over thresholds. Each scene below sets
  // `excludeFromInterruption: true` so the planner cannot pick a Pete sub-scene
  // as the random trigger point.
  pete_ringing: {
    id: 'pete_ringing',
    title: 'Your phone rings',
    description:
      'Your phone buzzes violently. The screen lights up with a name you know all too well: Pete Bernard, CEO of the EDGE AI Foundation. He never calls. A chill runs down your spine.',
    choices: [
      {
        text: 'Answer the phone',
        effects: {},
        nextScene: 'pete_call',
      },
    ],
    excludeFromInterruption: true,
  },

  pete_call: {
    id: 'pete_call',
    title: 'Pete Bernard is calling...',
    description:
      "Something about this call feels... ominous. There is no escaping Pete Bernard.",
    choices: [
      {
        text: 'Answer the call and try to sound cool: "SUP!"',
        effects: { stress: 100, energy: -100 },
        nextScene: 'pete_death_1',
      },
      {
        text: 'Look at your phone, grin evilly, and slowly slide it back into your pocket',
        effects: { stress: 100, energy: -100 },
        nextScene: 'pete_death_2',
      },
      {
        text: 'Your special Pete-ringer triggers flashbacks to the call before EDGE AI Milan...',
        effects: { stress: 100, energy: -100 },
        nextScene: 'pete_death_3',
      },
      {
        text: 'Hand your phone to a nearby stranger and let them answer it',
        effects: { stress: 100, energy: -100 },
        nextScene: 'pete_death_4',
      },
    ],
    excludeFromInterruption: true,
  },

  pete_death_1: {
    id: 'pete_death_1',
    title: 'South of the Border',
    description:
      "You wake up in Tijuana. You realize you're in a bath tub full of ice as the back pain kicks in...",
    choices: [],
    excludeFromInterruption: true,
  },

  pete_death_2: {
    id: 'pete_death_2',
    title: 'The One That Got Away',
    description:
      "You wake up in your bed and realize you weren't able to make it to the EDGE AI San Diego event... *sadge*",
    choices: [],
    excludeFromInterruption: true,
  },

  pete_death_3: {
    id: 'pete_death_3',
    title: 'Infinite Descent',
    description:
      'You wake up on the airplane as the pilot announces your descent to San Diego airport. A kid kicks the back of your seat and you strangely fall back to sleep. You wake up to the same kid kicking your seat and hear the pilot announce your descent to San Diego airport... You strangely fall back to sleep... and this happens forever.',
    choices: [],
    excludeFromInterruption: true,
  },

  pete_death_4: {
    id: 'pete_death_4',
    title: 'Stranger Danger',
    description:
      "The stranger you handed the phone to suddenly explodes into a plume of smoke as your phone falls to the ground. You question whether you should continue your journey to San Diego as you look down at your phone ringing on the floor... It's Pete again...",
    choices: [],
    excludeFromInterruption: true,
  },
};
