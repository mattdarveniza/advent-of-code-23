import { readFile } from "../readFile.ts";

// Blurgh plaintext formats are annoying, deal with it. Just captures the two
// series of numbers as strings
const GAME_LINE_REGEX = /Card\s+\d+:\s+((?:\d+\s*)+)\|\s+((?:\d+\s*)+)/;

function winningCombination(line: string) {
  const [, winningMatch, gameMatch] = line.match(GAME_LINE_REGEX) || [];
  const [winningNumbers, gameNumbers] = [winningMatch, gameMatch].map((s) =>
    s
      .trim()
      // Some numbers are separated by multiple spaces so use regex to split
      .split(/\s+/g)
      .map((v) => parseInt(v, 10))
  );

  return gameNumbers.filter((n) => winningNumbers.includes(n)).length;
}

export async function winningCombinations(filePath: string) {
  const lines: string[] = await readFile(filePath);
  let combinations = 0;

  for await (const line of lines) {
    const winningCount = winningCombination(line);

    if (winningCount > 0) {
      // Result doubles for each winning number, ie 1 -> 2 -> 4 -> 8.
      combinations += 2 ** (winningCount - 1);
    }
  }
  return combinations;
}

export async function totalCards(filePath: string) {
  const lines: string[] = await readFile(filePath);
  const cardsCount: number[] = new Array(lines.length).fill(1);

  for (const [i, line] of lines.entries()) {
    const winningCount = winningCombination(line);
    for (let x = 1; x <= winningCount; x++) {
      cardsCount[i + x] += cardsCount[i];
    }
  }

  return cardsCount.reduce((a, b) => a + b, 0);
}
