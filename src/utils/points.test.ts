import { describe, test } from "node:test";
import { equal } from "node:assert";
import { findClickedShape, type Shape } from "./points";

describe("findClickedShape", () => {
  const shapes: Shape[] = [
    {
      type: "points",
      points: [
        { x: 0, y: 0 },
        { x: 5, y: 0 },
        { x: 5, y: 5 },
        { x: 0, y: 5 },
      ],
    },
    {
      type: "points",
      points: [
        { x: 6, y: 6 },
        { x: 12, y: 6 },
        { x: 12, y: 12 },
        { x: 6, y: 12 },
      ],
    },
  ];

  const testCases = [
    {
      input: { x: 3, y: 3 },
      expected: 0,
    },
    {
      input: { x: 6, y: 3 },
      expected: undefined,
    },
    {
      input: { x: 7, y: 7 },
      expected: 1,
    },
  ];

  for (const testCase of testCases) {
    const { input, expected } = testCase;
    const result = expected !== undefined ? "inside" : "outside";

    test(`${JSON.stringify(input)} should be ${result}`, () => {
      equal(findClickedShape(shapes, input.x, input.y), expected);
    });
  }
});
