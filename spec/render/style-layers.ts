import type { StyleToken } from "./types.js";

/** Layer z-order; values must match spec/render/style-tokens.json `layers`. */
export const LAYER_BY_STYLE: Record<StyleToken, number> = {
  "room.fill": 0,
  "wall.stroke": 10,
  "opening.stroke": 20,
  "door.gap": 30,
  "door.swing": 31,
  "window.stroke": 32,
  "room.fill.selected": 0,
};
