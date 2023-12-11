import { readFile } from "../readFile.ts";

type Coord = [number, number];

type Symbol = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

const directions = {
  left: [0, -1],
  right: [0, 1],
  up: [-1, 0],
  down: [1, 0],
} as const;

type Direction = keyof typeof directions;

interface Line extends String {
  [index: number]: Symbol;
}

function getNextDirection(
  symbol: Symbol,
  lastDirection: Direction
): Direction | null {
  switch (symbol) {
    case "|":
      if (lastDirection === "up" || lastDirection === "down") {
        return lastDirection;
      }
      break;
    case "-":
      if (lastDirection === "left" || lastDirection === "right") {
        return lastDirection;
      }
      break;
    case "L":
      if (lastDirection === "down") {
        return "right";
      }

      if (lastDirection === "left") {
        return "up";
      }
      break;
    case "J":
      if (lastDirection === "down") {
        return "left";
      }

      if (lastDirection === "right") {
        return "up";
      }
      break;
    case "7":
      if (lastDirection === "right") {
        return "down";
      }

      if (lastDirection === "up") {
        return "left";
      }
      break;
    case "F":
      if (lastDirection === "up") {
        return "right";
      }

      if (lastDirection === "left") {
        return "down";
      }
      break;
  }

  return null;
}

export async function furthestDistanceOfLoop(filePath: string) {
  const map = (await readFile(filePath)) as Line[];

  let startingPosition: [number, number];
  for (const [i, row] of map.entries()) {
    const match = row.match(/S/);
    if (match) {
      startingPosition = [i, match.index!];
      break;
    }
  }

  for (const startingDirection of Object.keys(directions)) {
    let currentPosition = startingPosition!;
    let currentSymbol = "S";
    let direction = startingDirection as Direction;
    let pathLength = 0;

    do {
      const nextPosition: Coord = [
        currentPosition[0] + directions[direction][0],
        currentPosition[1] + directions[direction][1],
      ];
      const nextSymbol = map[nextPosition[0]][nextPosition[1]];

      if (nextSymbol === "S") {
        return (pathLength + 1) / 2;
      }

      const nextDirection = getNextDirection(nextSymbol, direction);

      if (nextDirection === null) {
        break;
      }

      direction = nextDirection;
      currentPosition = nextPosition;
      currentSymbol = nextSymbol;
      pathLength++;
    } while (currentSymbol !== "S");
  }
}
