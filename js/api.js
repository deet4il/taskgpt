import {

  LEGENDARIES,

  getPokemonImage

} from './config.js';

/* RANDOM */

function random(min, max) {

  return Math.floor(

    Math.random() *

    (max - min + 1)

  ) + min;

}

/* SHINY */

function isShiny() {

  return Math.random() < 0.02;

}

/* FETCH POKEMON */

export async function fetchPokemon(
  id
) {

  const response =
    await fetch(

      `https://pokeapi.co/api/v2/pokemon/${id}`

    );

  const data =
    await response.json();

  const speciesResponse =
    await fetch(
      data.species.url
    );

  const species =
    await speciesResponse.json();

  const entry =
    species.flavor_text_entries.find(
      e => e.language.name === 'en'
    );

  return {

    id:
      data.id,

    name:
      data.name
        .charAt(0)
        .toUpperCase() +

      data.name.slice(1),

    type:
      data.types[0]
        .type.name
        .charAt(0)
        .toUpperCase() +

      data.types[0]
        .type.name
        .slice(1),

    image:
      isShiny()

        ? data.sprites.other[
            'official-artwork'
          ].front_shiny

        : getPokemonImage(
            data.id
          ),

    shiny:
      isShiny(),

    description:
      entry
        ? entry.flavor_text
            .replace(/\f/g, ' ')
        : 'No Pokédex entry.'

  };

}

/* RANDOM POKEMON */

export async function fetchRandomPokemon() {

  const id =
    random(1, 151);

  return await fetchPokemon(
    id
  );

}

/* RANDOM LEGENDARY */

export async function fetchRandomLegendary() {

  const id =

    LEGENDARIES[
      random(
        0,
        LEGENDARIES.length - 1
      )
    ];

  return await fetchPokemon(
    id
  );

}