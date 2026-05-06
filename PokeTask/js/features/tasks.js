import { state } from '../state.js';

import {

  NORMAL_XP,
  MASTERBALL_XP,
  XP_PER_LEVEL,

  NORMAL_BE,
  MASTERBALL_BE,

  TRAINER_TITLES

} from '../config.js';

import { generatePokemon } from '../api.js';

import { saveGame } from '../storage.js';

export async function createQuest({

  text,
  arcId,
  masterball = false

}) {

  const pokemon =
    await generatePokemon(masterball);

  const quest = {

    id: crypto.randomUUID(),

    text,

    arcId,

    completed: false,

    completedAt: null,

    xpEarned:
      masterball
        ? MASTERBALL_XP
        : NORMAL_XP,

    beEarned:
      masterball
        ? MASTERBALL_BE
        : NORMAL_BE,

    masterball,

    pokemon

  };

  state.quests.push(quest);

  saveGame();

}

export function completeQuest(id) {

  const quest =
    state.quests.find(
      q => q.id === id
    );

  if (!quest || quest.completed) {
    return;
  }

  quest.completed = true;

  quest.completedAt =
    new Date().toLocaleString();

  const exists =
    state.dex.find(
      p =>
        p.id === quest.pokemon.id &&
        p.shiny === quest.pokemon.shiny
    );

  if (!exists) {

    state.dex.push(
      quest.pokemon
    );

  }

  state.xp += quest.xpEarned;

  state.battleEnergy +=
    quest.beEarned;

  while (
    state.xp >= XP_PER_LEVEL
  ) {

    state.xp -= XP_PER_LEVEL;

    state.level++;

  }

  recalculateMasterballs();

  saveGame();

}

export function undoQuest(id) {

  const quest =
    state.quests.find(
      q => q.id === id
    );

  if (!quest || !quest.completed) {
    return;
  }

  quest.completed = false;

  quest.completedAt = null;

  state.xp -= quest.xpEarned;

  state.battleEnergy -=
    quest.beEarned;

  if (state.xp < 0) {
    state.xp = 0;
  }

  if (state.battleEnergy < 0) {
    state.battleEnergy = 0;
  }

  state.level =
    Math.floor(
      state.xp / XP_PER_LEVEL
    ) + 1;

  state.xp =
    state.xp % XP_PER_LEVEL;

  recalculateMasterballs();

  saveGame();

}

function recalculateMasterballs() {

  const completedCount =
    state.quests.filter(
      q => q.completed
    ).length;

  state.masterballs =
    Math.floor(
      completedCount / 5
    );

}

export function deleteQuest(id) {

  state.quests =
    state.quests.filter(
      q => q.id !== id
    );

  saveGame();

}

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

export function createArc({

  name,
  daily = false

}) {

  const arc = {

    id: crypto.randomUUID(),

    name,

    daily

  };

  state.arcs.push(arc);

  saveGame();

}

export function deleteArc(id) {

  state.arcs =
    state.arcs.filter(
      a => a.id !== id
    );

  state.quests =
    state.quests.filter(
      q => q.arcId !== id
    );

  saveGame();

}

export function editArc(
  id,
  newName
) {

  const arc =
    state.arcs.find(
      a => a.id === id
    );

  if (!arc) return;

  arc.name = newName;

  saveGame();

}

export function getTrainerTitle() {

  return (
    TRAINER_TITLES[
      state.level - 1
    ] || 'Legendary Trainer'
  );

}

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

    state.collapsedArcs.push(id);

  }

  saveGame();

}

export async function runDailyReset() {

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  if (
    state.lastDailyReset === today
  ) {
    return;
  }

  for (const arc of state.arcs) {

    if (!arc.daily) continue;

    const quests =
      state.quests.filter(
        q => q.arcId === arc.id
      );

    for (const quest of quests) {

      quest.completed = false;

      quest.completedAt = null;

      const shinyRoll =
        Math.floor(
          Math.random() * 10
        ) === 0;

      quest.pokemon.shiny =
        shinyRoll;

    }

  }

  state.lastDailyReset = today;

  saveGame();

}