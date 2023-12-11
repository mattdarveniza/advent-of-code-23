import { readFile } from "../readFile.ts";

function expandSpace(lines: string[]) {
  let expandedSpace = [] as string[];

  // Expand rows
  for (const line of lines) {
    expandedSpace.push(line);
    if ([...line].every((c) => c === ".")) {
      expandedSpace.push(line);
    }
  }

  // Expand columns
  let columnsAdded = 0;
  for (let i = 0; i < lines[0].length; i++) {
    if (lines.every((line) => line[i] === ".")) {
      expandedSpace = expandedSpace.map(
        (line) =>
          `${line.slice(0, i + columnsAdded)}.${line.slice(i + columnsAdded)}`
      );
      columnsAdded++;
    }
  }

  return expandedSpace;
}

export async function sumOfShortestPaths(filePath: string) {
  const lines = await readFile(filePath);

  const expandedSpace = expandSpace(lines);

  console.log(expandedSpace.join("\n"));

  // Build list of galaxies
  const galaxyCoordinates: [number, number][] = [];
  for (const [x, line] of expandedSpace.entries()) {
    const lineGalaxies = line.matchAll(/#/g);
    for (const galaxy of lineGalaxies) {
      galaxyCoordinates.push([x, galaxy.index!]);
    }
  }

  // Calculate distances between pairs of galaxies
  const summedDistances = galaxyCoordinates.reduce((outerAcc, [x1, y1], i) => {
    return (
      outerAcc +
      galaxyCoordinates.slice(i + 1).reduce((innerAcc, [x2, y2]) => {
        return innerAcc + Math.abs(x1 - x2) + Math.abs(y1 - y2);
      }, 0)
    );
  }, 0);

  return summedDistances;
}
