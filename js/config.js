export const XP_PER_LEVEL = 500;

export const NORMAL_XP = 50;

export const MASTERBALL_XP = 150;

export const NORMAL_BE = 5;

export const MASTERBALL_BE = 15;

export const SHINY_RATE = 10;

export const TOTAL_POKEMON = 151;

export const LEGENDARIES = [
  144,
  145,
  146,
  150,
  151
];

export const TRAINER_TITLES = [

  'Novice Trainer',

  'Beginner Trainer',

  'Rookie Trainer',

  'Pokémon Catcher',

  'Battle Trainer',

  'Ace Trainer',

  'Veteran Trainer',

  'Elite Trainer',

  'Gym Challenger',

  'Gym Conqueror',

  'Regional Champion',

  'Master Trainer',

  'Legendary Trainer'

];

export const GYMS = [

  {
    level: 3,
    leader: 'Brock',
    badge: 'Boulder Badge',
    type: 'rock',
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png',
    badgeSprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/boulder-badge.png',
    team: [
      {
        id: 74,
        name: 'GEODUDE',
        type: 'rock'
      },
      {
        id: 95,
        name: 'ONIX',
        type: 'rock'
      },
      {
        id: 111,
        name: 'RHYHORN',
        type: 'ground'
      }
    ]
  },

  {
    level: 6,
    leader: 'Misty',
    badge: 'Cascade Badge',
    type: 'water',
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/2.png',
    badgeSprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cascade-badge.png',
    team: [
      {
        id: 120,
        name: 'STARYU',
        type: 'water'
      },
      {
        id: 121,
        name: 'STARMIE',
        type: 'psychic'
      },
      {
        id: 54,
        name: 'PSYDUCK',
        type: 'water'
      }
    ]
  },

  {
    level: 9,
    leader: 'Lt. Surge',
    badge: 'Thunder Badge',
    type: 'electric',
    sprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/3.png',
    badgeSprite:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-badge.png',
    team: [
      {
        id: 25,
        name: 'PIKACHU',
        type: 'electric'
      },
      {
        id: 100,
        name: 'VOLTORB',
        type: 'electric'
      },
      {
        id: 26,
        name: 'RAICHU',
        type: 'electric'
      }
    ]
  }

];

export const TYPE_ADVANTAGES = {

  fire: ['grass', 'bug', 'ice'],

  water: ['fire', 'rock', 'ground'],

  grass: ['water', 'rock', 'ground'],

  electric: ['water', 'flying'],

  rock: ['fire', 'ice', 'flying'],

  ground: ['electric', 'fire', 'rock'],

  psychic: ['fighting', 'poison'],

  ice: ['grass', 'ground', 'flying'],

  bug: ['grass', 'psychic'],

  poison: ['grass']

};

export function getPokemonImage(
  id,
  shiny = false
) {

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
    shiny ? 'shiny/' : ''
  }${id}.png`;

}

export function getBattleSprite(
  id,
  shiny = false
) {

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
    shiny ? 'shiny/' : ''
  }${id}.png`;

}

export function getSilhouetteImage() {

  return 'https://upload.wikimedia.org/wikipedia/commons/5/55/Question_Mark.svg';

}