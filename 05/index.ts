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

// NOTE: Assumed the ranges in input file are contiguous and non-overlapping
// (which in this case they are). Won't work if there are gaps between ranges in
// the map
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

  const maps = parseLinesToSeedMap(lines);

  const locationRanges = maps.reduce((ranges, map) => {
    // pre-sort the mapping list by source to help with stable range-creation
    const sortedMap = map.toSorted((a, b) => a[1] - b[1]);
    const sortedRanges = ranges.toSorted((a, b) => a[0] - b[0]);

    const outputRanges: [number, number][] = [];
    for (const [start, end] of sortedRanges) {
      for (const [i, [destination, source, range]] of sortedMap.entries()) {
        const diff = destination - source;

        // When the range is before the start of the maps
        if (i === 0 && start < source) {
          if (end < source) {
            // no overlap
            outputRanges.push([start, end]);
          } else {
            // overlap
            outputRanges.push([start, source - 1]);
          }
        } else {
          // When the range start is within the map range
          if (start < source + range) {
            let rangeStart = start + diff;
            // When the range start is before the map range (ie some has previously been mapped)
            if (start < source) {
              rangeStart = source + diff;
            }

            // When the range end is within the map range
            if (end < source + range) {
              outputRanges.push([rangeStart, end + diff]);
              break;
            }
            // When the end of range is larger than the map range
            else {
              outputRanges.push([rangeStart, source + range + diff]);
            }
          }
        }
      }

      // When the range is after the end of the maps
      const lastRangeMap = sortedMap.at(-1);
      if (lastRangeMap && lastRangeMap[1] + lastRangeMap[2] < end) {
        if (lastRangeMap[1] + lastRangeMap[2] < start) {
          outputRanges.push([start, end]);
        } else {
          outputRanges.push([lastRangeMap[1] + lastRangeMap[2] + 1, end]);
        }
      }
    }
    console.log(JSON.stringify(outputRanges));
    return outputRanges;
  }, seedRanges);

  const smallestLocation = Math.min(...locationRanges.map((range) => range[0]));

  // const locations = seedsToLocations(seeds, maps);
  return smallestLocation;
}
