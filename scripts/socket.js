import { MODULE_ID, SOCKETS, SOCKET_NAME } from "./constants.js";
import { InyoTogglesApp } from "./inyo-toggle.js";

export function socket() {
  game.socket.on(SOCKET_NAME, (payload) => {
    // console.log("VALK | socket payload! ", payload);
    if (game.userId == payload.senderId) return;
    // console.log("VALK | pl", payload);
    if (payload.msgType == SOCKETS.RERENDER) {
      updateApps(payload);
    }
  });
}

export async function updateApps(payload) {
  for (const app of foundry.applications.instances.values()) {
    if (app instanceof InyoTogglesApp) {
      app.render({ force: true });
    }
  }
}
