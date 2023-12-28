import { readFile } from "../readFile.ts";

const rockRegex = /O/g;

function invertAxes(lines: string[]) {
  return lines.map((_, i) => lines.map((row) => row[i]).join(""));
}

function rollNorth(lines: string[], log = true) {
  const now = Date.now();
  const result = invertAxes(rollWest(invertAxes(lines), false));

  if (log) {
    // console.debug(`North: ${Date.now() - now}ms`);
  }

  return result;
}

function rollSouth(lines: string[]) {
  const now = Date.now();
  // Just reverse, roll north and unreverse
  const result = rollNorth(lines.toReversed(), false).toReversed();

  // console.debug(`South: ${Date.now() - now}ms`);
  return result;
}

function rollWest(lines: string[], log = true) {
  const now = Date.now();
  const result = lines.map((line) => {
    for (const match of line.matchAll(rockRegex)) {
      // Move rock west until blocked
      let prevIndex = match.index! - 1;
      while (prevIndex >= 0 && !["O", "#"].includes(line[prevIndex])) {
        line = (line.slice(0, prevIndex) + "O." + line.slice(prevIndex + 2))
          // ensure we don't add on any extra chars to end of line
          .slice(0, line.length);
        prevIndex--;
      }
    }
    return line;
  });

  if (log) {
    // console.debug(`West: ${Date.now() - now}ms`);
  }

  return result;
}

function rollEast(lines: string[]) {
  const now = Date.now();
  // Just reverse, roll west and unreverse
  const result = rollWest(
    lines.map((line) => [...line].toReversed().join("")),
    false
  ).map((line) => [...line].toReversed().join(""));

  // console.debug(`East: ${Date.now() - now}ms`);

  return result;
}

export async function totalLoad(filePath: string) {
  const lines = await readFile(filePath);

  // Roll all rocks north
  const rolledLines = rollNorth(lines);

  // Count all rocks
  return rolledLines.reduce((acc, curr, i) => {
    return acc + (curr.match(rockRegex)?.length ?? 0) * (lines.length - i);
  }, 0);
}

const cycle = [rollNorth, rollWest, rollSouth, rollEast];

export async function totalLoadAfterCycles(filePath: string) {
  const lines = await readFile(filePath);

  const cycles = 1000000000;
  let rolledLines = lines;
  let lastDate = Date.now();
  let lastI = 0;
  for (let i = 0; i < cycles; i++) {
    const nextRolledLines = cycle.reduce((acc, roll) => roll(acc), rolledLines);
    const now = Date.now();
    if (now - lastDate > 1000) {
      const cyclesPerSecond = (i - lastI) / ((now - lastDate) / 1000);
      console.clear();
      console.log(
        `Cycle ${i + 1} of ${cycles}\nCPS: ${cyclesPerSecond}\nETA: ${new Date(
          now + ((cycles - i) / cyclesPerSecond) * 1000
        ).toLocaleString()}`
      );
      lastI = i;
      lastDate = now;
    }

    // Break out if the lines have stabilized
    if (nextRolledLines.every((line, i) => line === rolledLines[i])) {
      console.log(`Stabilized after ${i + 1} cycles`);
      break;
    }

    rolledLines = nextRolledLines;
  }

  return rolledLines.reduce((acc, curr, i) => {
    return acc + (curr.match(rockRegex)?.length ?? 0) * (lines.length - i);
  }, 0);
}
