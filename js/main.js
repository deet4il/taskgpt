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

  applyDamage,

  getNextAlivePlayer,
  getNextAliveEnemy,

  saveGymHP,
  winGymBattle,

  isTeamDefeated

} from './features/battle.js';

import {

  loadGame,
  saveGame,
  wipeSave

} from './storage.js';

import {

  PLAYER_TRAINER,

  getBattleSprite,
  getEnemySprite,
  getMiniSprite

} from './config.js';

import { state } from './state.js';

/* LOAD */

loadGame();

/* DAILY RESET */

await runDailyReset();

/* RENDER */

render();

/* ARC */

DOM.addArcBtn.onclick =
() => {

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

/* QUEST */

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

/* MASTERBALL */

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

/* DEX */

DOM.dexToggle.onclick =
() => {

  DOM.dexContainer
    .classList
    .toggle('hidden');

};

/* GUIDE */

DOM.guideToggle.onclick =
() => {

  DOM.guideContent
    .classList
    .toggle('hidden');

};

/* WIPE */

DOM.wipeDataBtn.onclick =
() => {

  const confirmed =
    confirm(
      'Delete ALL save data?'
    );

  if (!confirmed) {
    return;
  }

  wipeSave();

  location.reload();

};

/* START GYM */

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

/* START BATTLE */

function startGymBattle() {

  const battle =
    createGymBattle();

  if (!battle) {
    return;
  }

  let playerIndex =
    battle.playerIndex;

  let enemyIndex =
    battle.enemyIndex;

  DOM.battleScreen.innerHTML = `

    <div class="battle-ui">

      <h2 class="battle-title">

        VS ${battle.gym.leader}

      </h2>

      <div class="battle-field">

        <!-- PLAYER -->

        <div class="battle-side">

          <img
            class="trainer-portrait player-portrait"
            src="${PLAYER_TRAINER.portrait}"
          >

          <img
            id="playerSprite"
            class="battle-sprite"
          >

          <div class="battle-shadow"></div>

          <div
            id="playerName"
            class="battle-name"
          ></div>

          <div
            id="playerHP"
            class="hp-bar"
          ></div>

          <div
            id="playerReserve"
            class="reserve-strip"
          ></div>

        </div>

        <!-- ENEMY -->

        <div class="battle-side">

          <img
            class="trainer-portrait enemy-portrait"
            src="${battle.gym.portrait}"
          >

          <img
            id="enemySprite"
            class="battle-sprite enemy-sprite"
          >

          <div class="battle-shadow"></div>

          <div
            id="enemyName"
            class="battle-name"
          ></div>

          <div
            id="enemyHP"
            class="hp-bar"
          ></div>

          <div
            id="enemyReserve"
            class="reserve-strip"
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

          Basic Attack

        </button>

        <button
          id="elementalAttack"
        >

          Elemental Attack

        </button>

        <button
          id="burstAttack"
        >

          Burst Attack

        </button>

      </div>

    </div>

  `;

  DOM.battleScreen
    .classList
    .remove('hidden');

  updateBattleUI();

  /* UI */

  function updateBattleUI() {

    const player =
      battle.playerTeam[
        playerIndex
      ];

    const enemy =
      battle.enemyTeam[
        enemyIndex
      ];

    /* ACTIVE */

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
      getEnemySprite(
        enemy.id
      );

    document.getElementById(
      'playerName'
    ).textContent =
      `${player.name}
      (${player.hp} HP)`;

    document.getElementById(
      'enemyName'
    ).textContent =
      `${enemy.name}
      (${enemy.hp} HP)`;

    document.getElementById(
      'playerHP'
    ).style.width =
      `${player.hp}%`;

    document.getElementById(
      'enemyHP'
    ).style.width =
      `${enemy.hp}%`;

    /* RESERVES */

    renderReserveTeam(

      'playerReserve',

      battle.playerTeam,

      playerIndex,

      true

    );

    renderReserveTeam(

      'enemyReserve',

      battle.enemyTeam,

      enemyIndex,

      false

    );

  }

  /* RESERVE */

  function renderReserveTeam(

    containerId,
    team,
    activeIndex,
    isPlayer

  ) {

    const container =
      document.getElementById(
        containerId
      );

    container.innerHTML = '';

    team.forEach((pokemon, index) => {

      const img =
        document.createElement(
          'img'
        );

      img.src =
        isPlayer

          ? getBattleSprite(
              pokemon.id,
              pokemon.shiny
            )

          : getMiniSprite(
              pokemon.id
            );

      img.className =
        'reserve-pokemon';

      if (
        index === activeIndex
      ) {

        img.classList.add(
          'active-reserve'
        );

      }

      if (
        pokemon.fainted
      ) {

        img.classList.add(
          'fainted'
        );

      }

      container.appendChild(
        img
      );

    });

  }

  /* LOG */

  function log(text) {

    document.getElementById(
      'battleLog'
    ).innerHTML += `
      <div>${text}</div>
    `;

  }

  /* ENEMY TURN */

  function enemyTurn() {

    const player =
      battle.playerTeam[
        playerIndex
      ];

    applyDamage(
      player,
      10
    );

    log(
      'Enemy attacked!'
    );

    if (
      player.fainted
    ) {

      log(
        `${player.name}
        fainted!`
      );

      playerIndex =
        getNextAlivePlayer(
          battle.playerTeam
        );

      if (
        playerIndex === -1
      ) {

        loseBattle();

        return;

      }

      log(
        `${battle.playerTeam[playerIndex].name}
        entered battle!`
      );

    }

    updateBattleUI();

  }

  /* ATTACK */

  function attack(type) {

    const player =
      battle.playerTeam[
        playerIndex
      ];

    const enemy =
      battle.enemyTeam[
        enemyIndex
      ];

    let move;

    if (
      type === 'basic'
    ) {

      move =
        basicAttack();

    }

    if (
      type === 'elemental'
    ) {

      move =
        elementalAttack(

          player.type,
          enemy.type

        );

    }

    if (
      type === 'burst'
    ) {

      move =
        burstAttack();

    }

    const enough =
      spendBattleEnergy(
        move.cost
      );

    if (!enough) {

      alert(
        'Not enough Battle Energy.'
      );

      return;

    }

    applyDamage(
      enemy,
      move.damage
    );

    log(
      `${player.name}
      used
      ${move.name}!`
    );

    log(
      `${move.damage}
      damage dealt!`
    );

    if (
      move.effective
    ) {

      log(
        'Super effective!'
      );

    }

    if (
      enemy.fainted
    ) {

      log(
        `${enemy.name}
        fainted!`
      );

      enemyIndex =
        getNextAliveEnemy(
          battle.enemyTeam
        );

      if (
        enemyIndex === -1
      ) {

        winBattle();

        return;

      }

      log(
        `${battle.enemyTeam[enemyIndex].name}
        entered battle!`
      );

    }

    saveGymHP(

      battle.gym.badge,

      battle.enemyTeam

    );

    updateBattleUI();

    enemyTurn();

  }

  /* WIN */

  function winBattle() {

    log(
      'Gym defeated!'
    );

    winGymBattle(
      battle.gym
    );

    render();

    alert(
      `You earned the
      ${battle.gym.badge}!`
    );

    DOM.battleScreen
      .classList
      .add('hidden');

  }

  /* LOSE */

  function loseBattle() {

    log(
      'Battle lost!'
    );

    saveGymHP(

      battle.gym.badge,

      battle.enemyTeam

    );

    alert(
      'Gym HP saved.'
    );

    DOM.battleScreen
      .classList
      .add('hidden');

  }

  /* BUTTONS */

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