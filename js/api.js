import {

  LEGENDARIES,

  TOTAL_POKEMON,

  getPokemonImage

} from './config.js';

/* RANDOM ID */

function getRandomPokemonId(
  allowLegendary = false
) {

  let id;

  do {

    id =
      Math.floor(
        Math.random() *
        TOTAL_POKEMON
      ) + 1;

  } while (

    !allowLegendary &&
    LEGENDARIES.includes(id)

  );

  return id;

}

/* SHINY ROLL */

function isShiny() {

  return (
    Math.floor(
      Math.random() * 10
    ) === 0
  );

}

/* FETCH POKEMON */

export async function fetchPokemon(
  masterball = false
) {

  const id =
    getRandomPokemonId(
      masterball
    );

  const shiny =
    isShiny();

  /* BASIC DATA */

  const pokemonResponse =
    await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`
    );

  const pokemonData =
    await pokemonResponse.json();

  /* SPECIES DATA */

  const speciesResponse =
    await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );

  const speciesData =
    await speciesResponse.json();

  /* ENTRY */

  const flavor =
    speciesData
      .flavor_text_entries
      .find(
        entry =>
          entry.language.name ===
          'en'
      );

  /* TYPE */

  const type =
    pokemonData.types?.[0]
      ?.type?.name || 'normal';

  return {

    id,

    shiny,

    name:
      pokemonData.name
        .charAt(0)
        .toUpperCase() +
      pokemonData.name.slice(1),

    type,

    image:
      getPokemonImage(
        id,
        shiny
      ),

    description:
      flavor?.flavor_text
        ?.replace(/\f/g, ' ')
        ?.replace(/\n/g, ' ')
      ||
      'No Pokédex entry.'

  };

}
