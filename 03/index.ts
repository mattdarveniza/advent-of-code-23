import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

async function readFile(filePath: string) {
  const f = await Deno.open(filePath);

  const decoder = new TextDecoder();
  const lines = [];
  for await (const uIntLine of readline(f)) {
    lines.push(decoder.decode(uIntLine));
  }

  return lines;
}

const SYMBOL_REGEX = /[^\d\.]/g;

export async function enginePartSum(filePath: string) {
  const lines: string[] = await readFile(filePath);
  let sum = 0;

  for (const [i, line] of lines.entries()) {
    const partNumbers = [...line.matchAll(/\d+/g)];

    for (const partNumberMatch of partNumbers) {
      const [partNumber] = partNumberMatch;
      // get start and end indices. Covers number plus one to left and right
      // for adjacencies.
      const startIndex = Math.max((partNumberMatch.index ?? 0) - 1, 0);
      const endIndex = startIndex + partNumber.length + 2; // +2 = 1 to cancel -1 above, 1 for adjacency

      // check for symbols on same, above and below lines
      const match = [i - 1, i, i + 1].some((index) => {
        return lines[index]?.slice(startIndex, endIndex).match(SYMBOL_REGEX);
      });

      if (match) {
        sum += parseInt(partNumber, 10);
        continue;
      }
    }
  }

  return sum;
}

export async function gearRatios(filePath: string) {
  const lines: string[] = await readFile(filePath);
  let ratiosSum = 0;

  for (const [i, line] of lines.entries()) {
    const gears = [...line.matchAll(/\*/g)];

    for (const gear of gears) {
      const ratios: number[] = [];
      const gearStartIndex = Math.max((gear.index ?? 0) - 1, 0);
      const gearEndIndex = gearStartIndex + 2;

      // look for numbers in the adjacent lines which intersect with the range
      // of indices
      [i - 1, i, i + 1].forEach((index) => {
        const numbers = [...lines[index].matchAll(/\d+/g)];
        for (const numberMatch of numbers) {
          const [number] = numberMatch;
          const numberStartIndex = numberMatch.index ?? 0;
          const numberEndIndex = numberStartIndex + number.length - 1;

          if (
            numberEndIndex >= gearStartIndex &&
            numberStartIndex <= gearEndIndex
          ) {
            ratios.push(parseInt(number, 10));
          }
        }
      });

      if (ratios.length === 2) {
        ratiosSum += ratios[0] * ratios[1];
      }

      if (ratios.length > 2) {
        throw new Error("Too many ratios");
      }
    }
  }

  return ratiosSum;
}
