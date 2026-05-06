import {
  LEGENDARIES,
  SHINY_RATE,
  TOTAL_POKEMON,
  getPokemonImage
} from './config.js';

import { state } from './state.js';

export async function fetchPokemon(id) {

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`
  );

  const pokemonData = await response.json();

  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );

  const speciesData = await speciesResponse.json();

  const entry =
    speciesData.flavor_text_entries.find(
      e => e.language.name === 'en'
    );

  return {
    id,
    name: pokemonData.name.toUpperCase(),
    type: pokemonData.types[0].type.name,
    description: entry
      ? entry.flavor_text.replace(/\f/g, ' ')
      : 'A mysterious Pokémon.',
  };

}

export function rollShiny() {

  return Math.floor(Math.random() * SHINY_RATE) === 0;

}

export function getAvailablePokemon() {

  const ownedIds = state.dex
    .filter(p => !p.shiny)
    .map(p => p.id);

  const available = [];

  for (let i = 1; i <= TOTAL_POKEMON; i++) {

    if (LEGENDARIES.includes(i)) continue;

    if (!ownedIds.includes(i)) {
      available.push(i);
    }

  }

  if (available.length === 0) {

    for (let i = 1; i <= TOTAL_POKEMON; i++) {

      if (!LEGENDARIES.includes(i)) {
        available.push(i);
      }

    }

  }

  return available;

}

export async function generatePokemon(masterball = false) {

  let id;

  if (masterball) {

    id =
      LEGENDARIES[
        Math.floor(Math.random() * LEGENDARIES.length)
      ];

  } else {

    const available = getAvailablePokemon();

    id =
      available[
        Math.floor(Math.random() * available.length)
      ];

  }

  const shiny = rollShiny();

  const data = await fetchPokemon(id);

  return {
    ...data,
    shiny,
    image: getPokemonImage(id, shiny)
  };

}