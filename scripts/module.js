import { MODULE_ID, SETTING_TOGGLES } from "./constants.js";

import { InyoTogglesApp } from "./inyo-toggle.js";
import { socket } from "./socket.js";

Hooks.once("init", async function () {
  game.settings.register(MODULE_ID, SETTING_TOGGLES, {
    name: "Inyo Character Toggle States",
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });
});

Hooks.once("ready", () => {
  game.inyoToggles = {
    open: () => new InyoTogglesApp().render(true),
  };

  socket();

  console.log(`${MODULE_ID} | Ready.`);
});

Hooks.once("setup", () => {
  Hooks.on("getSceneControlButtons", (controls) => {
    // if (!game.user.isGM) return;
    // controls.push({
    //   activeTool: "inyo-token-toggle",
    //   icon: "fa-solid fa-shield",
    //   layer: "vcpra",
    //   name: "Valk's CPR Additions",
    //   tools: [inyoTokenToggle],
    // });

    // const vcpraGroup = controls.find((g) => g.name === "vcpra");
    // if (!vcpraGroup) return;

    // if (vcpraGroup.tools.some((t) => t.name === "inyo-token-toggle")) return;

    const tokenGroup = controls.find((g) => g.name == "token");
    if (!tokenGroup) return;

    if (tokenGroup.tools.some((t) => t.name === "inyo-token-toggle")) return;

    const inyoTokenToggle = {
      name: "inyo-token-toggle",
      title: "Inyo Token Tracker",
      icon: "fa-solid fa-users-gear",
      visible: true,
      button: true,
      onClick: () => new InyoTogglesApp().render(true),
    };

    tokenGroup.tools.push(inyoTokenToggle);
  });
});

Hooks.on("userConnected", () => {
  for (const app of foundry.applications.instances.values()) {
    if (app instanceof InyoTogglesApp) {
      app.render({ force: true });
    }
  }
});
