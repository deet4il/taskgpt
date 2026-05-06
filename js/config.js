/* XP */

export const XP_PER_LEVEL =
  500;

/* MASTERBALL XP */

export const MASTERBALL_XP =
  1000;

/* MASTERBALL BE */

export const MASTERBALL_BE =
  25;

/* MASTERBALL EVERY */

export const MASTERBALL_EVERY =
  5;

/* TOTAL */

export const TOTAL_POKEMON =
  151;

/* LEGENDARIES */

export const LEGENDARIES = [

  144,
  145,
  146,
  150,
  151

];

/* TRAINER TITLES */

export const TRAINER_TITLES = [

  'Novice Trainer',
  'Rookie Trainer',
  'Pokémon Trainer',
  'Ace Trainer',
  'Veteran Trainer',
  'Elite Trainer',
  'Champion'

];

/* TYPE ADVANTAGES */

export const TYPE_ADVANTAGES = {

  Fire: ['Grass'],

  Water: ['Fire', 'Rock'],

  Grass: ['Water', 'Rock'],

  Electric: ['Water'],

  Rock: ['Fire'],

  Psychic: ['Poison'],

  Ground: ['Electric', 'Fire'],

  Fighting: ['Rock'],

  Poison: ['Grass']

};

/* PLAYER TRAINER */

export const PLAYER_TRAINER = {

  name:
    'Trainer',

  portrait:
    './assets/trainers/player.png'

};

/* GYMS */

export const GYMS = [

  {

    level: 3,

    leader:
      'Brock',

    badge:
      'Boulder Badge',

    sprite:
      './assets/trainers/brock.png',

    portrait:
      './assets/trainers/brock.png',

    badgeSprite:
      './assets/badges/boulder.png',

    team: [

      {

        id: 74,

        name: 'Geodude',

        type: 'Rock',

        image:
          getPokemonImage(74)

      },

      {

        id: 95,

        name: 'Onix',

        type: 'Rock',

        image:
          getPokemonImage(95)

      },

      {

        id: 141,

        name: 'Kabutops',

        type: 'Rock',

        image:
          getPokemonImage(141)

      }

    ]

  },

  {

    level: 6,

    leader:
      'Misty',

    badge:
      'Cascade Badge',

    sprite:
      './assets/trainers/misty.png',

    portrait:
      './assets/trainers/misty.png',

    badgeSprite:
      './assets/badges/cascade.png',

    team: [

      {

        id: 120,

        name: 'Staryu',

        type: 'Water',

        image:
          getPokemonImage(120)

      },

      {

        id: 121,

        name: 'Starmie',

        type: 'Water',

        image:
          getPokemonImage(121)

      },

      {

        id: 134,

        name: 'Vaporeon',

        type: 'Water',

        image:
          getPokemonImage(134)

      }

    ]

  },

  {

    level: 9,

    leader:
      'Lt. Surge',

    badge:
      'Thunder Badge',

    sprite:
      './assets/trainers/surge.png',

    portrait:
      './assets/trainers/surge.png',

    badgeSprite:
      './assets/badges/thunder.png',

    team: [

      {

        id: 100,

        name: 'Voltorb',

        type: 'Electric',

        image:
          getPokemonImage(100)

      },

      {

        id: 25,

        name: 'Pikachu',

        type: 'Electric',

        image:
          getPokemonImage(25)

      },

      {

        id: 26,

        name: 'Raichu',

        type: 'Electric',

        image:
          getPokemonImage(26)

      }

    ]

  }

];

/* POKEMON IMAGE */

export function getPokemonImage(
  id
) {

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

}

/* BATTLE SPRITE */

export function getBattleSprite(

  id,
  shiny = false

) {

  if (shiny) {

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`;

  }

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`;

}

/* ENEMY SPRITE */

export function getEnemySprite(
  id
) {

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

}

/* MINI SPRITE */

export function getMiniSprite(
  id
) {

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

}

/* SILHOUETTE */

export function getSilhouetteImage() {

  return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

}