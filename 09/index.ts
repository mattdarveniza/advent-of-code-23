import { readFile } from "../readFile.ts";

function difference(numbers: number[]): number {
  const nextNumbers = numbers.slice(0, -1).map((n, i) => numbers[i + 1] - n);

  if (nextNumbers.every((n) => n === 0)) {
    return numbers.at(-1)!;
  } else {
    return numbers.at(-1)! + difference(nextNumbers);
  }
}

export async function sumNextSteps(filePath: string) {
  const lines = await readFile(filePath);

  const sum = lines.reduce((acc, line) => {
    const numbers = line.split(" ").map((n) => parseInt(n, 10));
    return acc + difference(numbers);
  }, 0);

  return sum;
}
