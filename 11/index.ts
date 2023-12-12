import { readFile } from "../readFile.ts";

function expandSpace(lines: string[], expansionFactor = 2) {
  let expandedSpace = [...lines] as string[];

  const insertedSpace = "_".repeat(expansionFactor);

  // Expand columns
  let columnsAdded = 0;
  for (let i = 0; i < lines[0].length; i++) {
    console.log(`Column ${i}`);
    if (lines.every((line) => line[i] === ".")) {
      expandedSpace = expandedSpace.map((line) => {
        return `${line.slice(0, i + columnsAdded)}${insertedSpace}${line.slice(
          i + columnsAdded + 1
        )}`;
      });
      columnsAdded += expansionFactor - 1;
    }
  }

  const expandedLine = "_".repeat(expandedSpace[0].length);

  // Expand rows
  const linesToSkip: number[] = [];
  expandedSpace = expandedSpace.flatMap((line, i) => {
    console.log(`Line ${i}`);
    const ogLine = lines[i];
    if ([...ogLine].every((c) => c === ".")) {
      linesToSkip.push(i + linesToSkip.length * (expansionFactor - 1));
      const newLines = new Array(expansionFactor).fill(expandedLine);
      return newLines;
    } else {
      return [line];
    }
  });

  return [expandedSpace, linesToSkip] as const;
}

export async function sumOfShortestPaths(filePath: string) {
  const lines = await readFile(filePath);

  const expansionFactor = 1000000;
  const [expandedSpace, linesToSkip] = expandSpace(lines, expansionFactor);

  // console.log(expandedSpace.join("\n"));
  console.log(linesToSkip);

  // Build list of galaxies
  const galaxyCoordinates: [number, number][] = [];
  for (const [x, line] of expandedSpace.entries()) {
    if (linesToSkip.some((i) => x >= i && x < i + expansionFactor)) {
      console.log(`skipping ${x}`);
      continue;
    }
    console.log(`Line length: ${line.length}`);
    const lineGalaxies = [...line]
      .map((c, i) => (c === "#" ? i : null))
      .filter((i): i is number => i !== null);
    for (const galaxy of lineGalaxies) {
      console.log(`Galaxy at ${x}, ${galaxy}`);
      galaxyCoordinates.push([x, galaxy]);
    }
  }

  console.log(galaxyCoordinates.length);
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
