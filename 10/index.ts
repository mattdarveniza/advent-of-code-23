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

function getSymbolForDirections(
  startingDirection: Direction,
  endingDirection: Direction
) {
  switch (endingDirection) {
    case "up":
      switch (startingDirection) {
        case "left":
          return "7";
        case "right":
          return "F";
        case "up":
          return "|";
        default:
          return null;
      }
    case "down":
      switch (startingDirection) {
        case "left":
          return "J";
        case "right":
          return "L";
        case "down":
          return "|";
        default:
          return null;
      }
    case "left":
      switch (startingDirection) {
        case "up":
          return "L";
        case "down":
          return "F";
        case "left":
          return "-";
        default:
          return null;
      }
    case "right":
      switch (startingDirection) {
        case "up":
          return "J";
        case "down":
          return "7";
        case "right":
          return "-";
        default:
          return null;
      }
  }
}

export async function tilesWithinLoop(filePath: string) {
  const map = (await readFile(filePath)) as Line[];

  let startingPosition: [number, number];
  for (const [i, row] of map.entries()) {
    const match = row.match(/S/);
    if (match) {
      startingPosition = [i, match.index!];
      break;
    }
  }

  let loopCoords: Coord[] | null = null;
  let sSymbol: Symbol | null = null;
  // Traverse loop and build a list of loop coordinates
  for (const startingDirection of Object.keys(directions)) {
    let currentPosition = startingPosition!;
    const potentialLoopCoords: Coord[] = [currentPosition];
    let currentSymbol = "S";
    let direction = startingDirection as Direction;

    do {
      const nextPosition: Coord = [
        currentPosition[0] + directions[direction][0],
        currentPosition[1] + directions[direction][1],
      ];
      const nextSymbol = map[nextPosition[0]][nextPosition[1]];

      potentialLoopCoords.push(nextPosition);

      if (nextSymbol === "S") {
        sSymbol = getSymbolForDirections(
          startingDirection as Direction,
          direction
        );
        loopCoords = potentialLoopCoords;
        break;
      }

      const nextDirection = getNextDirection(nextSymbol, direction);

      if (nextDirection === null) {
        break;
      }

      direction = nextDirection;
      currentPosition = nextPosition;
      currentSymbol = nextSymbol;
    } while (currentSymbol !== "S");
  }

  if (!loopCoords) {
    throw new Error("No loop found");
  }

  let tilesWithinLoop = 0;
  for (const [x, row] of map.map((l) => l.replace("S", sSymbol!)).entries()) {
    let inLoop = false;
    for (const [y, symbol] of [...row].entries() as IterableIterator<
      [number, Symbol]
    >) {
      if (loopCoords.some(([x2, y2]) => x === x2 && y === y2)) {
        // Look for north pointing symbols
        if (["|", "L", "J"].includes(symbol)) {
          inLoop = !inLoop;
        }
      } else if (inLoop) {
        tilesWithinLoop++;
      }
    }
  }

  return tilesWithinLoop;
}
