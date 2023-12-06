import { zip } from "https://deno.land/std@0.208.0/collections/mod.ts";
import { readFile } from "../readFile.ts";

export async function marginOfError(filePath: string) {
  const lines = await readFile(filePath);
  const timeDistancePairs = zip(
    ...lines.map((line) =>
      line
        .split(":")[1]
        .trim()
        .split(/\s+/)
        .map((x) => parseInt(x))
    )
  );

  const winningTimes = timeDistancePairs.map(([time, targetDistance]) => {
    const times = [];
    for (let i = 1; i < time; i++) {
      const speed = i;
      const moveTime = time - i;
      const distance = speed * moveTime;

      if (distance > targetDistance) {
        times.push(i);
      }
    }

    return times;
  });

  return winningTimes.reduce((acc, times) => {
    return acc * times.length;
  }, 1);
}
