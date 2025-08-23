export interface Shape {
  type: "points";
  points: Array<{ x: number; y: number }>;
}

export function findClickedShape(shapes: Shape[], x: number, y: number) {
  for (let shapeIdx = 0; shapeIdx < shapes.length; shapeIdx++) {
    const { points } = shapes[shapeIdx];
    let inside = false;

    for (let i = 0; i < points.length; i++) {
      let nextIdx = i + 1;
      if (nextIdx === points.length) nextIdx = 0;

      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[nextIdx];
      if (y1 > y === y2 > y) continue;

      const xIntersection = (x2 - x1) * ((y - y1) / (y2 - y1)) + x1;
      if (x < xIntersection) {
        inside = !inside;
      }
    }

    if (inside) {
      return shapeIdx;
    }
  }

  return undefined;
}
