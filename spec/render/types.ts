/**
 * Platform-agnostic render model types. Swift/Kotlin ports should mirror these
 * shapes and pass the same golden vectors under spec/fixtures/render/.
 */

export type PlanPoint = [number, number];

export type StyleToken =
  | "room.fill"
  | "room.fill.selected"
  | "wall.stroke"
  | "opening.stroke"
  | "door.gap"
  | "door.swing"
  | "window.stroke"
  | "component.run"
  | "component.halo"
  | "component.marker"
  | "component.badge";

export interface DrawCommandBase {
  /** Stable id for diffing and test assertions (derived from source + kind). */
  id: string;
  layer: number;
  style: StyleToken;
  /** Entity id (room or plan_element) that produced this command. */
  source_id: string;
  /** Room id (fill commands) or component id (marker commands) for hit-testing. */
  hit_test_id?: string;
}

export interface StrokeDrawCommand extends DrawCommandBase {
  kind: "stroke";
  points: PlanPoint[];
  /** Layer (system) category of a component run stroke; absent on all other strokes. */
  category?: string;
}

export interface FillDrawCommand extends DrawCommandBase {
  kind: "fill";
  polygon: PlanPoint[];
}

export interface ArcDrawCommand extends DrawCommandBase {
  kind: "arc";
  center: PlanPoint;
  radius_m: number;
  start_angle_rad: number;
  end_angle_rad: number;
}

/** Screen-fixed marker for a point component or the midpoint of a run component. */
export interface MarkerDrawCommand extends DrawCommandBase {
  kind: "marker";
  center: PlanPoint;
  /** Layer (system) category of the component. */
  category: string;
  /** Glyph name derived from the category (see CATEGORY_GLYPHS). */
  glyph: string;
}

export type DrawCommand =
  | StrokeDrawCommand
  | FillDrawCommand
  | ArcDrawCommand
  | MarkerDrawCommand;

export interface RenderModel {
  level_id: string;
  commands: DrawCommand[];
}

export type PlanElementKind = "wall" | "door" | "window" | "opening";

export interface RenderPlanElement {
  id: string;
  level_id: string;
  kind: PlanElementKind;
  geometry: {
    type: "point" | "polyline" | "polygon";
    coordinates: PlanPoint[];
  };
}

export interface RenderRoom {
  id: string;
  level_id: string;
  geometry: {
    type: "polygon";
    coordinates: PlanPoint[];
  };
}

/**
 * A component to draw. category is the component's layer (system) category and
 * is supplied by the client. Clients pass only components of visible layers.
 */
export interface RenderComponent {
  id: string;
  level_id: string;
  category: string;
  geometry: {
    type: "point" | "polyline";
    coordinates: PlanPoint[];
  };
}

export interface LevelRenderInput {
  level_id: string;
  plan_elements: RenderPlanElement[];
  rooms: RenderRoom[];
  components?: RenderComponent[];
}
