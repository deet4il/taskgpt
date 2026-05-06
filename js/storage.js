import { state } from './state.js';

const STORAGE_KEY =
  'poketask_save';

/* SAVE */

export function saveGame() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(state)

  );

}

/* LOAD */

export function loadGame() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!data) {
    return;
  }

  const parsed =
    JSON.parse(data);

  /* PLAYER */

  state.xp =
    parsed.xp || 0;

  state.level =
    parsed.level || 1;

  state.battleEnergy =
    parsed.battleEnergy || 0;

  state.masterballs =
    parsed.masterballs || 0;

  state.badges =
    parsed.badges || [];

  /* COLLECTION */

  state.dex =
    parsed.dex || [];

  /* TASKS */

  state.arcs =
    parsed.arcs || [];

  state.quests =
    parsed.quests || [];

  state.collapsedArcs =
    parsed.collapsedArcs || [];

  /* DAILY RESET */

  state.lastDailyReset =
    parsed.lastDailyReset || null;

  /* TEAM */

  state.selectedTeam =
    parsed.selectedTeam || [];

  /* GYM */

  state.gymProgress =
    parsed.gymProgress || {

      currentGym: 0,

      gymHP: {}

    };

}

/* WIPE */

export function wipeSave() {

  localStorage.removeItem(
    STORAGE_KEY
  );

}