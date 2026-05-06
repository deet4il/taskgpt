import { state } from './state.js';

const STORAGE_KEY = 'poketask_save';

export function saveGame() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );

}

export function loadGame() {

  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data) return;

  const parsed =
    JSON.parse(data);

  state.xp =
    parsed.xp || 0;

  state.level =
    parsed.level || 1;

  state.masterballs =
    parsed.masterballs || 0;

  state.battleEnergy =
    parsed.battleEnergy || 0;

  state.arcs =
    parsed.arcs || [];

  state.quests =
    parsed.quests || [];

  state.dex =
    parsed.dex || [];

  state.badges =
    parsed.badges || [];

  state.lastDailyReset =
    parsed.lastDailyReset || null;

  state.collapsedArcs =
    parsed.collapsedArcs || [];

  state.gymProgress =
    parsed.gymProgress || {

      currentGym: 0,

      gymHP: {}

    };

}