import type {
  ArcDrawCommand,
  DrawCommand,
  FillDrawCommand,
  LevelRenderInput,
  MarkerDrawCommand,
  PlanPoint,
  RenderComponent,
  RenderModel,
  StrokeDrawCommand,
  StyleToken,
} from "./types.js";
import { LAYER_BY_STYLE } from "./style-layers.js";

const COORD_DECIMALS = 6;

/**
 * Glyph name per layer category. There is no per-component glyph override.
 * Must equal components.category_glyphs in style-tokens.json.
 */
export const CATEGORY_GLYPHS: Record<string, string> = {
  plumbing: "droplet",
  electrical: "bolt",
  hvac: "fan",
  roof_structure: "roofline",
  appliances_and_water_heater: "appliance_box",
  exterior_and_site: "tree",
  low_voltage_and_smart_home: "router",
};

function roundCoord(value: number): number {
  const factor = 10 ** COORD_DECIMALS;
  return Math.round(value * factor) / factor;
}

function roundPoint(point: PlanPoint): PlanPoint {
  return [roundCoord(point[0]), roundCoord(point[1])];
}

function normalizePolygon(ring: PlanPoint[]): PlanPoint[] {
  const rounded = ring.map(roundPoint);
  if (rounded.length < 2) {
    return rounded;
  }
  const first = rounded[0];
  const last = rounded[rounded.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) {
    return rounded.slice(0, -1);
  }
  return rounded;
}

function polylineSegments(coordinates: PlanPoint[]): PlanPoint[][] {
  const points = coordinates.map(roundPoint);
  const segments: PlanPoint[][] = [];
  for (let index = 1; index < points.length; index += 1) {
    segments.push([points[index - 1], points[index]]);
  }
  return segments;
}

function segmentLength(a: PlanPoint, b: PlanPoint): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.hypot(dx, dy);
}

function doorSwingArc(
  hinge: PlanPoint,
  end: PlanPoint,
  sourceId: string,
): ArcDrawCommand | null {
  const radius = segmentLength(hinge, end);
  if (radius <= 0) {
    return null;
  }
  const alongWall = Math.atan2(end[1] - hinge[1], end[0] - hinge[0]);
  const swingEnd = alongWall + Math.PI / 2;
  return {
    id: `${sourceId}:door.swing`,
    kind: "arc",
    layer: LAYER_BY_STYLE["door.swing"],
    style: "door.swing",
    source_id: sourceId,
    center: hinge,
    radius_m: roundCoord(radius),
    start_angle_rad: roundCoord(alongWall),
    end_angle_rad: roundCoord(swingEnd),
  };
}

function strokeCommand(
  id: string,
  style: StyleToken,
  sourceId: string,
  points: PlanPoint[],
): StrokeDrawCommand {
  return {
    id,
    kind: "stroke",
    layer: LAYER_BY_STYLE[style],
    style,
    source_id: sourceId,
    points,
  };
}

function markerCommand(
  component: RenderComponent,
  center: PlanPoint,
): MarkerDrawCommand {
  return {
    id: `${component.id}:component.marker`,
    kind: "marker",
    layer: LAYER_BY_STYLE["component.marker"],
    style: "component.marker",
    source_id: component.id,
    hit_test_id: component.id,
    center,
    category: component.category,
    glyph: CATEGORY_GLYPHS[component.category] ?? "",
  };
}

/** Midpoint of the longest segment of an already rounded polyline (first on ties). */
function longestSegmentMidpoint(points: PlanPoint[]): PlanPoint {
  let best: PlanPoint[] = [points[0], points[1]];
  let bestLength = -1;
  for (let index = 1; index < points.length; index += 1) {
    const length = segmentLength(points[index - 1], points[index]);
    if (length > bestLength) {
      bestLength = length;
      best = [points[index - 1], points[index]];
    }
  }
  return roundPoint([(best[0][0] + best[1][0]) / 2, (best[0][1] + best[1][1]) / 2]);
}

function compareCommands(a: DrawCommand, b: DrawCommand): number {
  if (a.layer !== b.layer) {
    return a.layer - b.layer;
  }
  if (a.source_id !== b.source_id) {
    return a.source_id.localeCompare(b.source_id);
  }
  return a.id.localeCompare(b.id);
}

/**
 * Converts plan elements, rooms and components for one level into a stable, sorted list of
 * draw commands. Geometry must already be in meters (per-level plan space, Y-down).
 */
export function generateRenderModel(input: LevelRenderInput): RenderModel {
  const commands: DrawCommand[] = [];

  const levelRooms = input.rooms.filter((room) => room.level_id === input.level_id);
  const levelElements = input.plan_elements.filter(
    (element) => element.level_id === input.level_id,
  );

  for (const room of levelRooms) {
    const polygon = normalizePolygon(room.geometry.coordinates);
    if (polygon.length < 3) {
      continue;
    }
    const fill: FillDrawCommand = {
      id: `${room.id}:room.fill`,
      kind: "fill",
      layer: LAYER_BY_STYLE["room.fill"],
      style: "room.fill",
      source_id: room.id,
      hit_test_id: room.id,
      polygon,
    };
    commands.push(fill);
  }

  for (const element of levelElements) {
    const { coordinates } = element.geometry;
    if (element.geometry.type !== "polyline" || coordinates.length < 2) {
      continue;
    }

    switch (element.kind) {
      case "wall": {
        for (const [segmentIndex, segment] of polylineSegments(coordinates).entries()) {
          commands.push(
            strokeCommand(
              `${element.id}:wall.stroke:${segmentIndex}`,
              "wall.stroke",
              element.id,
              segment,
            ),
          );
        }
        break;
      }
      case "opening": {
        for (const [segmentIndex, segment] of polylineSegments(coordinates).entries()) {
          commands.push(
            strokeCommand(
              `${element.id}:opening.stroke:${segmentIndex}`,
              "opening.stroke",
              element.id,
              segment,
            ),
          );
        }
        break;
      }
      case "door": {
        const hinge = roundPoint(coordinates[0]);
        const end = roundPoint(coordinates[coordinates.length - 1]);
        commands.push(
          strokeCommand(`${element.id}:door.gap`, "door.gap", element.id, [hinge, end]),
        );
        const arc = doorSwingArc(hinge, end, element.id);
        if (arc) {
          commands.push(arc);
        }
        break;
      }
      case "window": {
        for (const [segmentIndex, segment] of polylineSegments(coordinates).entries()) {
          commands.push(
            strokeCommand(
              `${element.id}:window.stroke:${segmentIndex}`,
              "window.stroke",
              element.id,
              segment,
            ),
          );
        }
        break;
      }
      default:
        break;
    }
  }

  const levelComponents = (input.components ?? []).filter(
    (component) => component.level_id === input.level_id,
  );

  for (const component of levelComponents) {
    const { type, coordinates } = component.geometry;
    if (type === "point") {
      if (coordinates.length !== 1) {
        continue;
      }
      commands.push(markerCommand(component, roundPoint(coordinates[0])));
    } else if (type === "polyline") {
      if (coordinates.length < 2) {
        continue;
      }
      for (const [segmentIndex, segment] of polylineSegments(coordinates).entries()) {
        const stroke = strokeCommand(
          `${component.id}:component.run:${segmentIndex}`,
          "component.run",
          component.id,
          segment,
        );
        stroke.category = component.category;
        commands.push(stroke);
      }
      commands.push(
        markerCommand(component, longestSegmentMidpoint(coordinates.map(roundPoint))),
      );
    }
  }

  commands.sort(compareCommands);

  return {
    level_id: input.level_id,
    commands,
  };
}
