import { state } from '../state.js';

import {

  GYMS,
  TYPE_ADVANTAGES

} from '../config.js';

import { saveGame } from '../storage.js';

/* UNLOCKED GYM */

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

/* SELECT TEAM */

export function selectBattlePokemon(
  pokemon
) {

  const existing =
    state.selectedTeam.find(
      p =>

        p.id === pokemon.id &&

        p.shiny === pokemon.shiny
    );

  /* REMOVE */

  if (existing) {

    state.selectedTeam =
      state.selectedTeam.filter(
        p => !(

          p.id === pokemon.id &&

          p.shiny === pokemon.shiny

        )
      );

    saveGame();

    return;

  }

  /* LIMIT */

  if (
    state.selectedTeam.length >= 3
  ) {

    alert(
      'Only 3 Pokémon allowed.'
    );

    return;

  }

  state.selectedTeam.push({

    ...pokemon,

    hp: 100,

    fainted: false

  });

  saveGame();

}

/* CREATE BATTLE */

export function createGymBattle() {

  const gym =
    getUnlockedGym();

  if (!gym) {
    return null;
  }

  if (
    state.selectedTeam.length < 3
  ) {

    alert(
      'Select 3 Pokémon first.'
    );

    return null;

  }

  /* PLAYER TEAM */

  const playerTeam =
    state.selectedTeam.map(p => ({

      ...p,

      hp: 100,

      fainted: false

    }));

  /* ENEMY HP SAVE */

  const savedHP =
    state.gymProgress.gymHP[
      gym.badge
    ];

  /* ENEMY TEAM */

  const enemyTeam =
    gym.team.map(pokemon => {

      const saved =
        savedHP?.find(
          x => x.id === pokemon.id
        );

      return {

        ...pokemon,

        hp:
          saved?.hp ?? 100,

        fainted: false

      };

    });

  return {

    gym,

    playerTeam,

    enemyTeam,

    playerIndex: 0,

    enemyIndex: 0

  };

}

/* BASIC */

export function basicAttack() {

  return {

    name:
      'Basic Attack',

    damage: 10,

    cost: 0,

    effective: false

  };

}

/* ELEMENTAL */

export function elementalAttack(

  attackerType,
  defenderType

) {

  let damage = 20;

  let effective = false;

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

    effective = true;

  }

  return {

    name:
      'Elemental Attack',

    damage,

    cost: 10,

    effective

  };

}

/* BURST */

export function burstAttack() {

  return {

    name:
      'Burst Attack',

    damage: 50,

    cost: 25,

    effective: false

  };

}

/* ENERGY */

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

/* DAMAGE */

export function applyDamage(

  pokemon,
  damage

) {

  pokemon.hp -= damage;

  if (pokemon.hp < 0) {
    pokemon.hp = 0;
  }

  if (pokemon.hp <= 0) {

    pokemon.fainted = true;

  }

}

/* NEXT PLAYER */

export function getNextAlivePlayer(
  team
) {

  return team.findIndex(
    p => !p.fainted
  );

}

/* NEXT ENEMY */

export function getNextAliveEnemy(
  team
) {

  return team.findIndex(
    p => !p.fainted
  );

}

/* SAVE GYM HP */

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

/* WIN */

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

/* TEAM STATUS */

export function isTeamDefeated(
  team
) {

  return team.every(
    p => p.fainted
  );

}