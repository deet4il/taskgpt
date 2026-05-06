import { state } from '../state.js';

import {
  GYMS,
  TYPE_ADVANTAGES
} from '../config.js';

import { saveGame } from '../storage.js';

export function getUnlockedGym() {

  return GYMS.find(gym => {

    const unlocked =
      state.level >= gym.level;

    const defeated =
      state.badges.includes(
        gym.badge
      );

    return unlocked && !defeated;

  });

}

export function createGymBattle() {

  const gym =
    getUnlockedGym();

  if (!gym) {
    return null;
  }

  const savedHP =
    state.gymProgress.gymHP[
      gym.badge
    ];

  const enemyTeam =
    gym.team.map(pokemon => {

      const saved =
        savedHP?.find(
          x => x.id === pokemon.id
        );

      return {

        ...pokemon,

        hp:
          saved?.hp ?? 100

      };

    });

  return {

    gym,

    enemyTeam

  };

}

export function basicAttack() {

  return {
    damage: 10,
    cost: 0
  };

}

export function elementalAttack(
  attackerType,
  defenderType
) {

  let damage = 20;

  const strongAgainst =
    TYPE_ADVANTAGES[
      attackerType
    ];

  if (
    strongAgainst &&
    strongAgainst.includes(
      defenderType
    )
  ) {

    damage *= 2;

  }

  return {
    damage,
    cost: 10
  };

}

export function burstAttack() {

  return {
    damage: 50,
    cost: 25
  };

}

export function spendBattleEnergy(
  amount
) {

  if (
    state.battleEnergy < amount
  ) {
    return false;
  }

  state.battleEnergy -= amount;

  saveGame();

  return true;

}

export function saveGymHP(
  badge,
  enemyTeam
) {

  state.gymProgress.gymHP[
    badge
  ] = enemyTeam.map(p => ({

    id: p.id,

    hp: p.hp

  }));

  saveGame();

}

export function winGymBattle(
  gym
) {

  if (
    !state.badges.includes(
      gym.badge
    )
  ) {

    state.badges.push(
      gym.badge
    );

  }

  delete state.gymProgress.gymHP[
    gym.badge
  ];

  saveGame();

}