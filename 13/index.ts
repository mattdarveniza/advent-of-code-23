import { readFile } from "../readFile.ts";

export async function summarizeReflections(filePath: string) {
  const lines = await readFile(filePath);

  const patterns = lines.reduce(
    (acc, curr) => {
      if (curr === "") {
        acc.push([]);
        return acc;
      }

      const last = acc.at(-1)!;
      last.push(curr);
      return acc;
    },
    [[]] as string[][]
  );

  let sum = 0;
  for (const pattern of patterns) {
    // find vertical reflections
    for (let i = 1; i < pattern[0].length; i++) {
      const verticallyReflected = pattern.every((line) => {
        const firstHalf = line.slice(Math.max(0, i * 2 - line.length), i);
        const secondHalf = [...line.slice(i, i * 2)].toReversed().join("");

        return firstHalf === secondHalf;
      });

      if (verticallyReflected) {
        sum += i;
        break;
      }
    }

    // find horizontal reflections
    for (let i = 1; i < pattern.length; i++) {
      const firstHalf = pattern.slice(Math.max(0, i * 2 - pattern.length), i);
      const secondHalf = pattern.slice(i, i * 2).toReversed();

      const horizontallyReflected = firstHalf.every(
        (line, index) => line === secondHalf[index]
      );
      if (horizontallyReflected) {
        sum += i * 100;
        break;
      }
    }
  }

  return sum;
}
