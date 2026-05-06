import { state } from '../state.js';

import {

  QUEST_XP,
  MASTERBALL_XP,

  QUEST_BE,
  MASTERBALL_BE,

  MASTERBALL_EVERY,

  XP_PER_LEVEL,

  TRAINER_TITLES

} from '../config.js';

import {

  fetchPokemon

} from '../api.js';

import {

  saveGame

} from '../storage.js';

/* CREATE ARC */

export function createArc({

  name,
  daily

}) {

  state.arcs.push({

    id: crypto.randomUUID(),

    name,

    daily

  });

  saveGame();

}

/* DELETE ARC */

export function deleteArc(
  id
) {

  state.arcs =
    state.arcs.filter(
      arc => arc.id !== id
    );

  state.quests =
    state.quests.filter(
      quest =>
        quest.arcId !== id
    );

  saveGame();

}

/* EDIT ARC */

export function editArc(
  id,
  newName
) {

  const arc =
    state.arcs.find(
      arc => arc.id === id
    );

  if (!arc) return;

  arc.name = newName;

  saveGame();

}

/* COLLAPSE ARC */

export function toggleArcCollapse(
  id
) {

  const exists =
    state.collapsedArcs.includes(
      id
    );

  if (exists) {

    state.collapsedArcs =
      state.collapsedArcs.filter(
        x => x !== id
      );

  } else {

    state.collapsedArcs.push(
      id
    );

  }

  saveGame();

}

/* CREATE QUEST */

export async function createQuest({

  text,
  arcId,
  masterball = false

}) {

  const pokemon =
    await fetchPokemon(
      masterball
    );

  state.quests.push({

    id: crypto.randomUUID(),

    text,

    arcId,

    completed: false,

    completedAt: null,

    masterball,

    pokemon,

    xpEarned:
      masterball
        ? MASTERBALL_XP
        : QUEST_XP,

    beEarned:
      masterball
        ? MASTERBALL_BE
        : QUEST_BE

  });

  saveGame();

}

/* COMPLETE QUEST */

export function completeQuest(
  id
) {

  const quest =
    state.quests.find(
      q => q.id === id
    );

  if (!quest) return;

  if (quest.completed) return;

  quest.completed = true;

  quest.completedAt =
    new Date()
      .toLocaleString();

  /* DEX */

  const alreadyOwned =
    state.dex.find(
      p =>
        p.id ===
          quest.pokemon.id &&
        p.shiny ===
          quest.pokemon.shiny
    );

  if (!alreadyOwned) {

    state.dex.push(
      quest.pokemon
    );

  }

  /* XP */

  state.xp +=
    quest.xpEarned;

  /* BE */

  state.battleEnergy +=
    quest.beEarned;

  /* LEVEL */

  while (
    state.xp >=
    XP_PER_LEVEL
  ) {

    state.xp -=
      XP_PER_LEVEL;

    state.level++;

  }

  /* MASTERBALLS */

  const completed =
    state.quests.filter(
      q => q.completed
    ).length;

  state.masterballs =
    Math.floor(
      completed /
      MASTERBALL_EVERY
    );

  saveGame();

}

/* UNDO QUEST */

export function undoQuest(
  id
) {

  const quest =
    state.quests.find(
      q => q.id === id
    );

  if (!quest) return;

  if (!quest.completed) return;

  quest.completed = false;

  quest.completedAt = null;

  state.xp -=
    quest.xpEarned;

  state.battleEnergy -=
    quest.beEarned;

  if (state.xp < 0) {
    state.xp = 0;
  }

  if (
    state.battleEnergy < 0
  ) {

    state.battleEnergy = 0;

  }

  /* RECALCULATE LEVEL */

  state.level =
    Math.floor(
      state.xp /
      XP_PER_LEVEL
    ) + 1;

  /* RECALCULATE MASTERBALLS */

  const completed =
    state.quests.filter(
      q => q.completed
    ).length;

  state.masterballs =
    Math.floor(
      completed /
      MASTERBALL_EVERY
    );

  saveGame();

}

/* DELETE QUEST */

export function deleteQuest(
  id
) {

  state.quests =
    state.quests.filter(
      q => q.id !== id
    );

  saveGame();

}

/* EDIT QUEST */

export function editQuest(
  id,
  newText
) {

  const quest =
    state.quests.find(
      q => q.id === id
    );

  if (!quest) return;

  quest.text = newText;

  saveGame();

}

/* TRAINER TITLE */

export function getTrainerTitle() {

  return (

    TRAINER_TITLES[
      state.level - 1
    ] ||

    'Pokémon Master'

  );

}

/* DAILY RESET */

export async function runDailyReset() {

  const today =
    new Date()
      .toDateString();

  if (
    state.lastDailyReset ===
    today
  ) {
    return;
  }

  for (const arc of state.arcs) {

    if (!arc.daily) {
      continue;
    }

    const quests =
      state.quests.filter(
        q => q.arcId === arc.id
      );

    for (const quest of quests) {

      quest.completed = false;

      quest.completedAt = null;

    }

  }

  state.lastDailyReset =
    today;

  saveGame();

}
