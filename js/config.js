/* XP */

export const XP_PER_LEVEL = 500;

/* TOTAL */

export const TOTAL_POKEMON = 151;

/* MASTERBALL */

export const MASTERBALL_EVERY = 5;

/* QUEST REWARDS */

export const QUEST_XP = 50;

export const MASTERBALL_XP = 150;

export const QUEST_BE = 10;

export const MASTERBALL_BE = 30;

/* TRAINER TITLES */

export const TRAINER_TITLES = [

  'Novice Trainer',
  'Beginner Trainer',
  'Pokémon Catcher',
  'Rookie Battler',
  'Skilled Trainer',
  'Ace Trainer',
  'Elite Trainer',
  'Veteran Trainer',
  'Gym Challenger',
  'Pokémon Master'

];

/* TYPE ADVANTAGES */

export const TYPE_ADVANTAGES = {

  fire: ['grass', 'bug'],
  water: ['fire', 'rock'],
  grass: ['water', 'rock'],
  electric: ['water'],
  psychic: ['fighting'],
  fighting: ['rock', 'normal'],
  ground: ['electric', 'fire'],
  rock: ['fire', 'bug']

};

/* LEGENDARIES */

export const LEGENDARIES = [

  144,
  145,
  146,
  150,
  151

];

/* GYM LEADERS */

export const GYMS = [

  {
    level: 3,

    leader: 'Brock',

    badge: 'Boulder Badge',

    sprite:
      'https://archives.bulbagarden.net/media/upload/8/88/Spr_RG_Brock.png',

    badgeSprite:
      'https://archives.bulbagarden.net/media/upload/7/7d/Boulder_Badge.png',

    team: [

      {
        id: 74,
        name: 'Geodude',
        type: 'rock'
      },

      {
        id: 95,
        name: 'Onix',
        type: 'rock'
      },

      {
        id: 111,
        name: 'Rhyhorn',
        type: 'ground'
      }

    ]

  },

  {
    level: 6,

    leader: 'Misty',

    badge: 'Cascade Badge',

    sprite:
      'https://archives.bulbagarden.net/media/upload/6/6f/Spr_RG_Misty.png',

    badgeSprite:
      'https://archives.bulbagarden.net/media/upload/9/9c/Cascade_Badge.png',

    team: [

      {
        id: 120,
        name: 'Staryu',
        type: 'water'
      },

      {
        id: 121,
        name: 'Starmie',
        type: 'water'
      },

      {
        id: 54,
        name: 'Psyduck',
        type: 'water'
      }

    ]

  }

];

/* POKEMON IMAGE */

export function getPokemonImage(
  id,
  shiny = false
) {

  if (shiny) {

    return `
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png
`;

  }

  return `
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png
`;

}

/* BATTLE SPRITE */

export function getBattleSprite(
  id,
  shiny = false
) {

  if (shiny) {

    return `
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png
`;

  }

  return `
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png
`;

}

/* SILHOUETTE */

export function getSilhouetteImage() {

  return `
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png
`;

}
