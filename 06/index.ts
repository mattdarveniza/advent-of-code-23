import { zip } from "https://deno.land/std@0.208.0/collections/mod.ts";
import { readFile } from "../readFile.ts";

function winningTimes(time: number, targetDistance: number) {
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
}

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

  const winningTimesForGames = timeDistancePairs.map(([time, targetDistance]) =>
    winningTimes(time, targetDistance)
  );

  return winningTimesForGames.reduce((acc, times) => {
    return acc * times.length;
  }, 1);
}

export async function joinedWinningTimes(filePath: string) {
  const lines = await readFile(filePath);
  const [time, distance] = lines.map((line) =>
    parseInt(line.split(":")[1].trim().replace(/\s/g, ""), 10)
  );
  return winningTimes(time, distance).length;
}
