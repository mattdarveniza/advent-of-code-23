import { readFile } from "../readFile.ts";

function difference(
  numbers: number[],
  [start, end]: [number, number | undefined]
): number {
  const extraIndex = start + (end ?? -1);
  const extraNumber = numbers.at(extraIndex)!;
  const nextNumbers = numbers
    .slice(start, end)
    .map((n, i) => numbers[i - extraIndex] - n);

  if (nextNumbers.every((n) => n === 0)) {
    return extraNumber;
  } else {
    return extraNumber + difference(nextNumbers, [start, end]);
  }
}

export async function sumNextSteps(filePath: string) {
  const lines = await readFile(filePath);

  const sum = lines.reduce((acc, line) => {
    const numbers = line.split(" ").map((n) => parseInt(n, 10));
    return acc + difference(numbers, [0, -1]);
  }, 0);

  return sum;
}

export async function sumPrevSteps(filePath: string) {
  const lines = await readFile(filePath);

  const sum = lines.reduce((acc, line) => {
    const numbers = line.split(" ").map((n) => parseInt(n, 10));
    return acc + difference(numbers, [1, undefined]);
  }, 0);

  return sum;
}
