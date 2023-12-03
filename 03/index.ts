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
      const endIndex = startIndex + partNumber.length + 2; // +2 = 1 to reach end of number, 1 for adjacency

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
