import { state } from '../state.js';

import {

  XP_PER_LEVEL,
  TOTAL_POKEMON,

  GYMS,

  getSilhouetteImage

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

  getUnlockedGym,
  selectBattlePokemon

} from '../features/battle.js';

import { DOM } from './dom.js';

/* MAIN */

export function render() {

  renderStats();

  renderArcOptions();

  renderTeam();

  renderArcs();

  renderArchive();

  renderDex();

  renderGym();

  attachEvents();

}

/* STATS */

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
    state.quests.filter(
      q => q.completed
    ).length;

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

  /* BADGES */

  DOM.badgeContainer.innerHTML =
    '';

  state.badges.forEach(badge => {

    const gym =
      GYMS.find(
        g => g.badge === badge
      );

    if (!gym) return;

    const img =
      document.createElement(
        'img'
      );

    img.src =
      gym.badgeSprite;

    img.className =
      'badge-img';

    DOM.badgeContainer.appendChild(
      img
    );

  });

}

/* ARC SELECT */

function renderArcOptions() {

  DOM.arcSelect.innerHTML =
    '';

  state.arcs.forEach(arc => {

    const option =
      document.createElement(
        'option'
      );

    option.value =
      arc.id;

    option.textContent =
      arc.daily
        ? `${arc.name} (Daily)`
        : arc.name;

    DOM.arcSelect.appendChild(
      option
    );

  });

}

/* TEAM */

function renderTeam() {

  const container =
    document.getElementById(
      'teamContainer'
    );

  container.innerHTML = '';

  state.dex.forEach(pokemon => {

    const selected =
      state.selectedTeam.find(
        p =>

          p.id === pokemon.id &&

          p.shiny === pokemon.shiny
      );

    const card =
      document.createElement(
        'div'
      );

    card.className =
      `
        team-card
        ${
          selected
            ? 'selected'
            : ''
        }
        ${
          pokemon.shiny
            ? 'shiny'
            : ''
        }
      `;

    card.innerHTML = `

      <img
        class="team-img"
        src="${pokemon.image}"
      >

      <div class="team-name">

        ${pokemon.name}

        ${
          pokemon.shiny
            ? ' ✨'
            : ''
        }

      </div>

      <div class="team-type">

        ${pokemon.type}

      </div>

    `;

    card.onclick = () => {

      selectBattlePokemon(
        pokemon
      );

      render();

    };

    container.appendChild(card);

  });

}

/* ARCS */

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

        if (arc.daily) {
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

      <div class="quest-top">

        <div class="quest-left">

          <button
            class="icon-btn edit-btn"
            data-collapse-arc="${arc.id}"
          >

            ${collapsed ? '▶' : '▼'}

          </button>

          <div>

            <div class="arc-title">

              ${arc.name}

            </div>

            <div class="arc-sub">

              ${
                arc.daily
                  ? 'Daily Arc'
                  : 'Standard Arc'
              }

            </div>

          </div>

        </div>

        <div class="quest-actions">

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
        id="arc-content-${arc.id}"
        class="${
          collapsed
            ? 'hidden'
            : ''
        }"
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
        `
          quest-card
          ${
            quest.completed
              ? 'completed-quest'
              : ''
          }
          ${
            quest.pokemon.shiny
              ? 'shiny'
              : ''
          }
        `;

      card.innerHTML = `

        <div class="quest-top">

          <div class="quest-left">

            <img
              class="quest-img"
              src="${
                quest.completed
                  ? quest.pokemon.image
                  : getSilhouetteImage()
              }"
            >

            <div>

              <div class="quest-title">

                ${quest.text}

              </div>

              <div class="quest-sub">

                ${
                  quest.completed
                    ? quest.pokemon.name
                    : 'Unknown Pokémon'
                }

                ${
                  quest.pokemon.shiny
                    ? ' ✨'
                    : ''
                }

              </div>

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

}

/* ARCHIVE */

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

  if (
    archived.length === 0
  ) {

    DOM.archiveContainer.innerHTML = `

      <div class="guide">

        No archived quests yet.

      </div>

    `;

    return;

  }

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
      `
        quest-card
        archive-card
        ${
          quest.pokemon.shiny
            ? 'shiny'
            : ''
        }
      `;

    card.innerHTML = `

      <div class="quest-top">

        <div class="quest-left">

          <img
            class="quest-img"
            src="${quest.pokemon.image}"
          >

          <div>

            <div class="quest-title">

              ${quest.text}

            </div>

            <div class="quest-sub">

              ${quest.pokemon.name}

              ${
                quest.pokemon.shiny
                  ? ' ✨'
                  : ''
              }

            </div>

            <div class="quest-sub">

              +${quest.xpEarned} XP

            </div>

            <div class="quest-sub">

              ${quest.completedAt}

            </div>

            <div class="quest-sub">

              From:
              ${arc?.name}

            </div>

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

/* DEX */

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
      `
        dex-card
        ${
          unlocked?.shiny
            ? 'shiny'
            : ''
        }
      `;

    card.innerHTML = `

      <img
        class="dex-img"
        src="${
          unlocked
            ? unlocked.image
            : getSilhouetteImage()
        }"
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

/* GYM */

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
          class="gym-leader"
          src="${gym.sprite}"
        >

        <div>

          <div class="gym-title">

            ${gym.leader}

          </div>

          <div class="gym-sub">

            ${gym.badge}

          </div>

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

/* EVENTS */

function attachEvents() {

  /* COMPLETE */

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

  /* UNDO */

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

  /* DELETE QUEST */

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

  /* EDIT QUEST */

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

  /* DELETE ARC */

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

  /* EDIT ARC */

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

  /* COLLAPSE */

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