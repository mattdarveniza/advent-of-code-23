import { readFile } from "../readFile.ts";

function* smudgedPatterns(pattern: string[]) {
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[0].length; x++) {
      yield pattern.map((line, iY) => {
        if (iY !== y) {
          return line;
        }

        return [...line].toSpliced(x, 1, line[x] === "#" ? "." : "#").join("");
      });
    }
  }
}

function hasVerticalReflection(
  pattern: string[],
  ignoreValue?: number | false
): number | false {
  for (let i = 1; i < pattern[0].length; i++) {
    const verticallyReflected = pattern.every((line) => {
      const firstHalf = line.slice(Math.max(0, i * 2 - line.length), i);
      const secondHalf = [...line.slice(i, i * 2)].toReversed().join("");

      return firstHalf === secondHalf;
    });

    if (verticallyReflected && i !== ignoreValue) {
      return i;
    }
  }

  return false;
}

function hasHorizontalReflection(
  pattern: string[],
  ignoreValue?: number | false
): number | false {
  for (let i = 1; i < pattern.length; i++) {
    const firstHalf = pattern.slice(Math.max(0, i * 2 - pattern.length), i);
    const secondHalf = pattern.slice(i, i * 2).toReversed();

    const horizontallyReflected = firstHalf.every(
      (line, index) => line === secondHalf[index]
    );
    if (horizontallyReflected && i !== ignoreValue) {
      return i;
    }
  }

  return false;
}

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
  for (const originalPattern of patterns) {
    const originalVerticalReflection = hasVerticalReflection(originalPattern);
    const originalHorizontalReflection =
      hasHorizontalReflection(originalPattern);
    let anyPatternFound = false;
    for (const pattern of smudgedPatterns(originalPattern)) {
      let found = false;
      // find vertical reflections
      const verticalReflection = hasVerticalReflection(
        pattern,
        originalVerticalReflection
      );
      if (
        verticalReflection &&
        !(
          originalVerticalReflection &&
          verticalReflection === originalVerticalReflection
        )
      ) {
        sum += verticalReflection;
        found = true;
      }

      // find horizontal reflections
      const horizontalReflection = hasHorizontalReflection(
        pattern,
        originalHorizontalReflection
      );
      if (
        horizontalReflection &&
        !(
          originalHorizontalReflection &&
          horizontalReflection === originalHorizontalReflection
        )
      ) {
        sum += horizontalReflection * 100;
        found = true;
      }

      if (found) {
        anyPatternFound = true;
        break;
      }
    }

    if (!anyPatternFound) {
      debugger;
    }
  }

  return sum;
}
