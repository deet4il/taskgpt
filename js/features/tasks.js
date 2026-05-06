import {

  XP_PER_LEVEL,
  MASTERBALL_EVERY,
  MASTERBALL_XP,
  MASTERBALL_BE,

  TRAINER_TITLES

} from '../config.js';

import { state } from '../state.js';

import {

  fetchRandomPokemon,
  fetchRandomLegendary

} from '../api.js';

import { saveGame } from '../storage.js';

/* TRAINER TITLE */

export function getTrainerTitle() {

  const index =
    Math.min(
      TRAINER_TITLES.length - 1,
      Math.floor(
        state.level / 5
      )
    );

  return TRAINER_TITLES[
    index
  ];

}

/* CREATE ARC */

export function createArc({

  name,
  daily

}) {

  state.arcs.push({

    id:
      crypto.randomUUID(),

    name,

    daily,

    createdAt:
      Date.now()

  });

  saveGame();

}

/* CREATE QUEST */

export async function createQuest({

  text,
  arcId,
  masterball

}) {

  const pokemon =
    masterball

      ? await fetchRandomLegendary()

      : await fetchRandomPokemon();

  const quest = {

    id:
      crypto.randomUUID(),

    text,

    arcId,

    completed:
      false,

    completedAt:
      null,

    xpEarned:
      masterball
        ? MASTERBALL_XP
        : 100,

    battleEnergy:
      masterball
        ? MASTERBALL_BE
        : 5,

    pokemon

  };

  state.quests.push(
    quest
  );

  saveGame();

}

/* COMPLETE QUEST */

export function completeQuest(
  questId
) {

  const quest =
    state.quests.find(
      q => q.id === questId
    );

  if (!quest) {
    return;
  }

  if (
    quest.completed
  ) {
    return;
  }

  quest.completed = true;

  quest.completedAt =
    new Date()
      .toLocaleString();

  state.xp +=
    quest.xpEarned;

  state.battleEnergy +=
    quest.battleEnergy;

  /* LEVEL UP */

  while (
    state.xp >= XP_PER_LEVEL
  ) {

    state.xp -=
      XP_PER_LEVEL;

    state.level++;

  }

  /* MASTERBALL REWARD */

  const completedCount =
    state.quests.filter(
      q => q.completed
    ).length;

  if (
    completedCount %
    MASTERBALL_EVERY === 0
  ) {

    state.masterballs++;

  }

  /* POKEDEX */

  const exists =
    state.dex.find(
      p =>

        p.id ===
          quest.pokemon.id &&

        p.shiny ===
          quest.pokemon.shiny
    );

  if (!exists) {

    state.dex.push(
      quest.pokemon
    );

  }

  saveGame();

}

/* UNDO QUEST */

export function undoQuest(
  questId
) {

  const quest =
    state.quests.find(
      q => q.id === questId
    );

  if (!quest) {
    return;
  }

  if (
    !quest.completed
  ) {
    return;
  }

  quest.completed = false;

  quest.completedAt =
    null;

  state.xp -=
    quest.xpEarned;

  if (
    state.xp < 0
  ) {

    state.xp = 0;

  }

  state.battleEnergy -=
    quest.battleEnergy;

  if (
    state.battleEnergy < 0
  ) {

    state.battleEnergy = 0;

  }

  saveGame();

}

/* DELETE QUEST */

export function deleteQuest(
  questId
) {

  state.quests =
    state.quests.filter(
      q => q.id !== questId
    );

  saveGame();

}

/* EDIT QUEST */

export function editQuest(

  questId,
  newText

) {

  const quest =
    state.quests.find(
      q => q.id === questId
    );

  if (!quest) {
    return;
  }

  quest.text =
    newText;

  saveGame();

}

/* DELETE ARC */

export function deleteArc(
  arcId
) {

  state.arcs =
    state.arcs.filter(
      arc => arc.id !== arcId
    );

  state.quests =
    state.quests.filter(
      q => q.arcId !== arcId
    );

  saveGame();

}

/* EDIT ARC */

export function editArc(

  arcId,
  newName

) {

  const arc =
    state.arcs.find(
      a => a.id === arcId
    );

  if (!arc) {
    return;
  }

  arc.name =
    newName;

  saveGame();

}

/* COLLAPSE ARC */

export function toggleArcCollapse(
  arcId
) {

  const collapsed =
    state.collapsedArcs.includes(
      arcId
    );

  if (collapsed) {

    state.collapsedArcs =
      state.collapsedArcs.filter(
        id => id !== arcId
      );

  } else {

    state.collapsedArcs.push(
      arcId
    );

  }

  saveGame();

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

  const dailyArcs =
    state.arcs.filter(
      arc => arc.daily
    );

  const dailyIds =
    dailyArcs.map(
      arc => arc.id
    );

  state.quests =
    state.quests.filter(
      q => !dailyIds.includes(
        q.arcId
      )
    );

  state.lastDailyReset =
    today;

  saveGame();

}
