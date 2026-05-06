import { state } from '../state.js';

import {

  XP_PER_LEVEL,
  TOTAL_POKEMON,
  GYMS,

  getSilhouetteImage,
  getBattleSprite

} from '../config.js';

import {

  getTrainerTitle,

  completeQuest,
  undoQuest,

  deleteQuest,
  editQuest,

  deleteArc,
  editArc,

  toggleArcCollapse

} from '../features/tasks.js';

import {

  getUnlockedGym

} from '../features/battle.js';

import { DOM } from './dom.js';

export function render() {

  renderStats();

  renderArcOptions();

  renderArcs();

  renderArchive();

  renderDex();

  renderGym();

}

function renderStats() {

  DOM.trainerTitle.textContent =
    getTrainerTitle();

  DOM.levelText.textContent =
    `Level ${state.level}`;

  DOM.xpText.textContent =
    `${state.xp} / ${XP_PER_LEVEL} XP`;

  DOM.xpBar.style.width =
    `${(state.xp / XP_PER_LEVEL) * 100}%`;

  DOM.questCount.textContent =
    state.quests.length;

  DOM.dexCount.textContent =
    `${state.dex.length} / ${TOTAL_POKEMON}`;

  DOM.shinyCount.textContent =
    state.dex.filter(
      p => p.shiny
    ).length;

  DOM.masterballCount.textContent =
    state.masterballs;

  DOM.battleEnergy.textContent =
    state.battleEnergy;

  DOM.badgeContainer.innerHTML =
    '';

  state.badges.forEach(badge => {

    const gym =
      GYMS.find(
        g => g.badge === badge
      );

    if (!gym) return;

    const img =
      document.createElement('img');

    img.src = gym.badgeSprite;

    img.className =
      'badge-img';

    DOM.badgeContainer.appendChild(
      img
    );

  });

}

function renderGym() {

  const gym =
    getUnlockedGym();

  if (!gym) {

    DOM.gymContainer.innerHTML =
      '';

    return;

  }

  DOM.gymContainer.innerHTML = `

    <div class="gym-box">

      <div class="gym-top">

        <img
          src="${gym.sprite}"
          class="gym-leader"
        >

        <div>

          <h2 class="gym-title">
            ${gym.leader}
          </h2>

          <p class="gym-sub">
            ${gym.badge}
          </p>

        </div>

      </div>

      <button
        id="startGymBattle"
        class="gym-btn"
      >
        Challenge Gym
      </button>

    </div>

  `;

}

function renderArcOptions() {

  DOM.arcSelect.innerHTML = '';

  state.arcs.forEach(arc => {

    const option =
      document.createElement(
        'option'
      );

    option.value = arc.id;

    option.textContent =
      arc.daily
        ? `${arc.name} (Daily)`
        : arc.name;

    DOM.arcSelect.appendChild(
      option
    );

  });

}

function renderArcs() {

  DOM.arcContainer.innerHTML =
    '';

  state.arcs.forEach(arc => {

    const collapsed =
      state.collapsedArcs.includes(
        arc.id
      );

    const quests =
      state.quests.filter(q => {

        const belongs =
          q.arcId === arc.id;

        if (!belongs) {
          return false;
        }

        if (
          arc.daily
        ) {
          return true;
        }

        return !q.completed;

      });

    const box =
      document.createElement(
        'div'
      );

    box.className =
      'arc-box';

    box.innerHTML = `

      <div class="flex justify-between items-start mb-4">

        <div class="flex items-center gap-3">

          <button
            class="icon-btn edit-btn"
            data-collapse-arc="${arc.id}"
          >
            ${collapsed ? '▶' : '▼'}
          </button>

          <div>

            <h2 class="arc-title">
              ${arc.name}
            </h2>

            <p class="arc-sub">
              ${
                arc.daily
                  ? 'Daily Arc'
                  : 'Standard Arc'
              }
            </p>

          </div>

        </div>

        <div class="flex gap-2">

          <button
            class="icon-btn edit-btn"
            data-edit-arc="${arc.id}"
          >
            Edit
          </button>

          <button
            class="icon-btn delete-btn"
            data-delete-arc="${arc.id}"
          >
            Delete
          </button>

        </div>

      </div>

      <div
        class="${collapsed ? 'hidden' : ''}"
        id="arc-content-${arc.id}"
      ></div>

    `;

    const content =
      box.querySelector(
        `#arc-content-${arc.id}`
      );

    quests.forEach(quest => {

      const card =
        document.createElement(
          'div'
        );

      card.className =
        `quest-card mb-4 ${
          quest.pokemon.shiny
            ? 'shiny'
            : ''
        } ${
          quest.completed
            ? 'completed-quest'
            : ''
        }`;

      card.innerHTML = `

        <div class="quest-top">

          <div class="quest-left">

            <img
              src="${
                quest.completed
                  ? quest.pokemon.image
                  : getSilhouetteImage()
              }"
              class="quest-img"
            >

            <div>

              <h3 class="quest-title">
                ${quest.text}
              </h3>

              <p class="quest-sub">

                ${
                  quest.completed
                    ? `${quest.pokemon.name}${
                        quest.pokemon.shiny
                          ? ' ✨'
                          : ''
                      }`
                    : 'Unknown Pokémon'
                }

              </p>

            </div>

          </div>

          <div class="quest-actions">

            ${
              !quest.completed
                ? `
                  <button
                    class="icon-btn complete-btn"
                    data-complete="${quest.id}"
                  >
                    Complete
                  </button>
                `
                : ''
            }

            <button
              class="icon-btn edit-btn"
              data-edit="${quest.id}"
            >
              Edit
            </button>

            <button
              class="icon-btn delete-btn"
              data-delete="${quest.id}"
            >
              Delete
            </button>

          </div>

        </div>

      `;

      content.appendChild(card);

    });

    DOM.arcContainer.appendChild(
      box
    );

  });

  attachEvents();

}

function renderArchive() {

  DOM.archiveContainer.innerHTML =
    '';

  const archived =
    state.quests
      .filter(q => {

        const arc =
          state.arcs.find(
            a => a.id === q.arcId
          );

        if (!arc) return false;

        return (
          q.completed &&
          !arc.daily
        );

      })
      .reverse();

  archived.forEach(quest => {

    const arc =
      state.arcs.find(
        a => a.id === quest.arcId
      );

    const card =
      document.createElement(
        'div'
      );

    card.className =
      `quest-card archive-card ${
        quest.pokemon.shiny
          ? 'shiny'
          : ''
      }`;

    card.innerHTML = `

      <div class="quest-top">

        <div class="quest-left">

          <img
            src="${quest.pokemon.image}"
            class="quest-img"
          >

          <div>

            <h3 class="quest-title">
              ${quest.text}
            </h3>

            <p class="quest-sub">
              ${quest.pokemon.name}
              ${
                quest.pokemon.shiny
                  ? '✨'
                  : ''
              }
            </p>

            <p class="archive-meta">
              +${quest.xpEarned} XP
            </p>

            <p class="archive-meta">
              ${quest.completedAt}
            </p>

            <p class="archive-meta">
              From:
              ${arc?.name || 'Unknown'}
            </p>

          </div>

        </div>

        <div class="quest-actions">

          <button
            class="icon-btn edit-btn"
            data-undo="${quest.id}"
          >
            Undo
          </button>

          <button
            class="icon-btn delete-btn"
            data-delete="${quest.id}"
          >
            Delete
          </button>

        </div>

      </div>

    `;

    DOM.archiveContainer.appendChild(
      card
    );

  });

}

function renderDex() {

  DOM.dexContainer.innerHTML =
    '';

  for (
    let i = 1;
    i <= TOTAL_POKEMON;
    i++
  ) {

    const unlocked =
      state.dex.find(
        p => p.id === i
      );

    const card =
      document.createElement(
        'div'
      );

    card.className =
      `dex-card ${
        unlocked?.shiny
          ? 'shiny'
          : ''
      }`;

    card.innerHTML = `

      <img
        src="${
          unlocked
            ? unlocked.image
            : getSilhouetteImage()
        }"
        class="dex-img"
      >

      <div class="dex-name">

        ${
          unlocked
            ? unlocked.name
            : '???'
        }

      </div>

      <div class="dex-entry">

        ${
          unlocked
            ? unlocked.description
            : 'Pokédex entry locked.'
        }

      </div>

    `;

    DOM.dexContainer.appendChild(
      card
    );

  }

}

function attachEvents() {

  document
    .querySelectorAll(
      '[data-complete]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        completeQuest(
          btn.dataset.complete
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-undo]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        undoQuest(
          btn.dataset.undo
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-delete]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        deleteQuest(
          btn.dataset.delete
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-edit]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        const text =
          prompt(
            'Edit Quest'
          );

        if (!text) return;

        editQuest(
          btn.dataset.edit,
          text
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-delete-arc]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        deleteArc(
          btn.dataset.deleteArc
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-edit-arc]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        const text =
          prompt(
            'Edit Arc'
          );

        if (!text) return;

        editArc(
          btn.dataset.editArc,
          text
        );

        render();

      };

    });

  document
    .querySelectorAll(
      '[data-collapse-arc]'
    )
    .forEach(btn => {

      btn.onclick = () => {

        toggleArcCollapse(
          btn.dataset.collapseArc
        );

        render();

      };

    });

}