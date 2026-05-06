import { DOM } from './ui/dom.js';

import { render } from './ui/render.js';

import {

  createArc,
  createQuest,
  runDailyReset

} from './features/tasks.js';

import {

  createGymBattle,

  basicAttack,
  elementalAttack,
  burstAttack,

  spendBattleEnergy,

  saveGymHP,
  winGymBattle

} from './features/battle.js';

import {

  loadGame,
  saveGame

} from './storage.js';

import {

  getBattleSprite

} from './config.js';

import { state } from './state.js';

/* LOAD */

loadGame();

/* DAILY RESET */

await runDailyReset();

/* RENDER */

render();

/* ADD ARC */

DOM.addArcBtn.onclick = () => {

  const name =
    DOM.arcInput.value.trim();

  if (!name) {

    alert(
      'Enter Arc name.'
    );

    return;

  }

  createArc({

    name,

    daily:
      DOM.dailyArc.checked

  });

  DOM.arcInput.value = '';

  DOM.dailyArc.checked = false;

  render();

};

/* ADD QUEST */

DOM.addQuestBtn.onclick =
async () => {

  const text =
    DOM.questInput.value.trim();

  const arcId =
    DOM.arcSelect.value;

  if (!text) {

    alert(
      'Enter Quest.'
    );

    return;

  }

  if (!arcId) {

    alert(
      'Create an Arc first.'
    );

    return;

  }

  await createQuest({

    text,

    arcId,

    masterball: false

  });

  DOM.questInput.value = '';

  render();

};

/* MASTERBALL QUEST */

DOM.addMasterballBtn.onclick =
async () => {

  if (
    state.masterballs <= 0
  ) {

    alert(
      'No Masterballs available.'
    );

    return;

  }

  const text =
    DOM.questInput.value.trim();

  const arcId =
    DOM.arcSelect.value;

  if (!text) {

    alert(
      'Enter Quest.'
    );

    return;

  }

  if (!arcId) {

    alert(
      'Create an Arc first.'
    );

    return;

  }

  state.masterballs--;

  saveGame();

  await createQuest({

    text,

    arcId,

    masterball: true

  });

  DOM.questInput.value = '';

  render();

};

/* DEX TOGGLE */

DOM.dexToggle.onclick = () => {

  DOM.dexContainer
    .classList
    .toggle('hidden');

};

/* GUIDE TOGGLE */

DOM.guideToggle.onclick = () => {

  DOM.guideContent
    .classList
    .toggle('hidden');

};

/* GYM BATTLE */

document.addEventListener(
  'click',
  event => {

    if (
      event.target.id !==
      'startGymBattle'
    ) {
      return;
    }

    startGymBattle();

  }
);

function startGymBattle() {

  const battle =
    createGymBattle();

  if (!battle) {

    alert(
      'No available gym.'
    );

    return;

  }

  const playerTeam =
    state.dex
      .slice(0, 3)
      .map(p => ({

        ...p,

        hp: 100

      }));

  if (
    playerTeam.length < 3
  ) {

    alert(
      'Need at least 3 Pokémon.'
    );

    return;

  }

  const enemyTeam =
    battle.enemyTeam;

  let playerIndex = 0;

  let enemyIndex = 0;

  DOM.battleScreen.innerHTML = `

    <div class="battle-ui">

      <h2 class="battle-title">
        VS ${battle.gym.leader}
      </h2>

      <div class="battle-field">

        <div>

          <img
            id="enemySprite"
            class="battle-sprite"
          >

          <div
            id="enemyHP"
            class="hp-bar"
          ></div>

        </div>

        <div>

          <img
            id="playerSprite"
            class="battle-sprite"
          >

          <div
            id="playerHP"
            class="hp-bar"
          ></div>

        </div>

      </div>

      <div
        id="battleLog"
        class="battle-log"
      ></div>

      <div class="battle-actions">

        <button
          id="basicAttack"
        >
          Basic
        </button>

        <button
          id="elementalAttack"
        >
          Elemental
        </button>

        <button
          id="burstAttack"
        >
          Burst
        </button>

      </div>

    </div>

  `;

  DOM.battleScreen
    .classList
    .remove('hidden');

  updateBattleUI();

  function updateBattleUI() {

    const player =
      playerTeam[playerIndex];

    const enemy =
      enemyTeam[enemyIndex];

    document.getElementById(
      'playerSprite'
    ).src =
      getBattleSprite(
        player.id,
        player.shiny
      );

    document.getElementById(
      'enemySprite'
    ).src =
      getBattleSprite(
        enemy.id
      );

    document.getElementById(
      'playerHP'
    ).style.width =
      `${player.hp}%`;

    document.getElementById(
      'enemyHP'
    ).style.width =
      `${enemy.hp}%`;

  }

  function log(text) {

    document.getElementById(
      'battleLog'
    ).innerHTML += `
      <div>${text}</div>
    `;

  }

  function enemyTurn() {

    const player =
      playerTeam[playerIndex];

    player.hp -= 10;

    log(
      'Enemy attacks!'
    );

    if (player.hp <= 0) {

      player.hp = 0;

      playerIndex++;

      if (
        playerIndex >=
        playerTeam.length
      ) {

        loseBattle();

        return;

      }

    }

    updateBattleUI();

  }

  function attack(type) {

    const player =
      playerTeam[playerIndex];

    const enemy =
      enemyTeam[enemyIndex];

    let move;

    if (type === 'basic') {

      move =
        basicAttack();

    }

    if (type === 'elemental') {

      move =
        elementalAttack(
          player.type,
          enemy.type
        );

    }

    if (type === 'burst') {

      move =
        burstAttack();

    }

    const enough =
      spendBattleEnergy(
        move.cost
      );

    if (!enough) {

      alert(
        'Not enough BE.'
      );

      return;

    }

    enemy.hp -= move.damage;

    log(
      `${player.name} dealt ${move.damage} damage!`
    );

    if (enemy.hp <= 0) {

      enemy.hp = 0;

      enemyIndex++;

      if (
        enemyIndex >=
        enemyTeam.length
      ) {

        winBattle();

        return;

      }

    }

    saveGymHP(
      battle.gym.badge,
      enemyTeam
    );

    updateBattleUI();

    enemyTurn();

  }

  function winBattle() {

    log(
      'Gym defeated!'
    );

    winGymBattle(
      battle.gym
    );

    render();

    alert(
      `You earned the ${battle.gym.badge}!`
    );

    DOM.battleScreen
      .classList
      .add('hidden');

  }

  function loseBattle() {

    log(
      'Battle lost!'
    );

    saveGymHP(
      battle.gym.badge,
      enemyTeam
    );

    alert(
      'Gym HP saved.'
    );

    DOM.battleScreen
      .classList
      .add('hidden');

  }

  document.getElementById(
    'basicAttack'
  ).onclick =
    () => attack(
      'basic'
    );

  document.getElementById(
    'elementalAttack'
  ).onclick =
    () => attack(
      'elemental'
    );

  document.getElementById(
    'burstAttack'
  ).onclick =
    () => attack(
      'burst'
    );

}

/* SERVICE WORKER */

if (
  'serviceWorker'
  in navigator
) {

  window.addEventListener(
    'load',
    () => {

      navigator
        .serviceWorker
        .register(
          './sw.js'
        );

    }
  );

}