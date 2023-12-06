import { readFile } from "../readFile.ts";

type SeedMap = [number, number, number];

function parseLinesToSeedMap(lines: string[]): SeedMap[][] {
  const maps: SeedMap[][] = [];
  for (let i = 2; i < lines.length; i++) {
    let line = lines[i];
    const map: SeedMap[] = [];
    if (line && line.includes("map")) {
      while ((line = lines[++i])) {
        map.push(line.split(" ").map((v) => parseInt(v, 10)) as SeedMap);
      }
      maps.push(map);
    }
  }

  return maps;
}

function* seedsToLocations(
  seeds: Iterable<number>,
  maps: SeedMap[][]
): Generator<number> {
  for (const inputValue of seeds) {
    yield maps.reduce((input, map) => {
      for (const [destination, source, range] of map) {
        if (input >= source && input <= source + range) {
          return input + (destination - source);
        }
      }
      return input;
    }, inputValue);
  }
}

export async function lowestLocationFromSeedNumbers(filePath: string) {
  const lines: string[] = await readFile(filePath);

  const seeds = lines[0]
    .split(" ")
    .slice(1)
    .map((v) => parseInt(v, 10));

  const maps = parseLinesToSeedMap(lines);
  const locations = seedsToLocations(seeds, maps);
  return Math.min(...locations);
}

function* seedsFromRanges(ranges: [number, number][]) {
  for (const [start, end] of ranges) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
}

export async function lowestLocationFromSeedRanges(filePath: string) {
  const lines: string[] = await readFile(filePath);

  const seedRanges = lines[0]
    .split(" ")
    .slice(1)
    .reduce((acc: [number, number][], _, i, array) => {
      if (i % 2 === 0) {
        const [start, range] = array
          .slice(i, i + 2)
          .map((v) => parseInt(v, 10));
        acc.push([start, start + range]);
      }
      return acc;
    }, []);

  const seeds = seedsFromRanges(seedRanges);

  const seedCount = seedRanges.reduce((acc, [, end]) => acc + end, 0);

  console.log(`Total values: ${seedCount}`);

  const maps = parseLinesToSeedMap(lines);
  const locations = seedsToLocations(seeds, maps);

  let min = Infinity;
  let i = 0;
  let progress = 0;
  for (const location of locations) {
    const newProgress = Math.floor((i++ / seedCount) * 100);
    console.log(`${i} / ${seedCount} ${newProgress}%: ${min}`);
    if (newProgress > progress) {
      progress = newProgress;
      console.log(
        `\n----------------- Progress: ${progress}% -----------------\n`
      );
    }

    if (location < min) {
      min = location;
    }
  }

  console.log("\n------------ Complete ------------\n");
  return min;
}
