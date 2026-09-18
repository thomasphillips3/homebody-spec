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
  | "window.stroke";

export interface DrawCommandBase {
  /** Stable id for diffing and test assertions (derived from source + kind). */
  id: string;
  layer: number;
  style: StyleToken;
  /** Entity id (room or plan_element) that produced this command. */
  source_id: string;
  /** Room id for hit-testing; set on room fill commands only. */
  hit_test_id?: string;
}

export interface StrokeDrawCommand extends DrawCommandBase {
  kind: "stroke";
  points: PlanPoint[];
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

export type DrawCommand =
  | StrokeDrawCommand
  | FillDrawCommand
  | ArcDrawCommand;

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

export interface LevelRenderInput {
  level_id: string;
  plan_elements: RenderPlanElement[];
  rooms: RenderRoom[];
}
