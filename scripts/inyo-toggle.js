import {
  MODULE_ID,
  SETTING_TOGGLES,
  SOCKET_NAME,
  SOCKETS,
} from "./constants.js";

export class InyoTogglesApp extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2,
) {
  static DEFAULT_OPTIONS = {
    id: "inyo-toggle",
    tag: "section",
    window: {
      title: "Current Inyo Tokens Used",
      icon: "fa-solid fa-users",
    },
    position: {
      width: 420,
      height: "auto",
    },
    actions: {
      refresh: InyoTogglesApp.refresh,
      reset: InyoTogglesApp.reset,
      togglePlayer: InyoTogglesApp.togglePlayer,
    },
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/inyo-tokens.hbs`,
    },
  };

  async _prepareContext(options) {
    const toggles = game.settings.get(MODULE_ID, SETTING_TOGGLES) ?? {};

    const players = game.users
      .filter((user) => user.active && !user.isGM)
      .map((user) => {
        const character = user.character;

        return {
          id: user.id,
          name: user.name,
          color: user.color,
          characterName: character?.name ?? "No assigned character",
          characterImg: character?.img ?? "icons/svg/mystery-man.svg",
          checked: Boolean(toggles[user.id])
        };
      });

    return {
      players,
      hasPlayers: players.length > 0,
      disabled: !game.user.isGM,
      isGM: game.user.isGM,
    };
  }

  static async refresh(event, target) {
    this.render({ force: true });
  }

  static async reset(event, target) {
    await game.settings.set(MODULE_ID, SETTING_TOGGLES, {});
    const payload = {
      msgType: SOCKETS.RERENDER,
      senderId: game.userId,
    };
    game.socket.emit(SOCKET_NAME, payload);
    this.render({ force: true });
  }

  static async togglePlayer(event, target) {
    const userId = target.dataset.userId;
    const checked = target.checked;

    const toggles = foundry.utils.deepClone(
      game.settings.get(MODULE_ID, SETTING_TOGGLES) ?? {},
    );

    toggles[userId] = checked;

    await game.settings.set(MODULE_ID, SETTING_TOGGLES, toggles);

    const payload = {
      msgType: SOCKETS.RERENDER,
      senderId: game.userId,
    };
    game.socket.emit(SOCKET_NAME, payload);
  }
}
