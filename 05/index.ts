import { readFile } from "../readFile.ts";

type SeedMap = [number, number, number];

export async function lowestLocation(filePath: string) {
  const lines: string[] = await readFile(filePath);

  const seeds = lines[0]
    .split(" ")
    .slice(1)
    .map((v) => parseInt(v, 10));

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

  const locations = maps.reduce((acc, map) => {
    return acc.map((inputValue) => {
      for (const [destination, source, range] of map) {
        if (inputValue >= source && inputValue <= source + range) {
          return inputValue + (destination - source);
        }
      }

      return inputValue;
    });
  }, seeds);

  return Math.min(...locations);
}
