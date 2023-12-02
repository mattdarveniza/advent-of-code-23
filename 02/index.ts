import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

const LIMITS = {
  red: 12,
  green: 13,
  blue: 14,
};

export async function validGames(filePath: string) {
  const f = await Deno.open(filePath);

  let validGames = 0;
  const decoder = new TextDecoder();
  for await (const uIntLine of readline(f)) {
    const line = decoder.decode(uIntLine);

    let invalid = false;
    const [game, rounds] = line.split(": ");
    const gameId = parseInt(game.split(" ")[1], 10);

    for (const round of rounds.split("; ")) {
      for (const cube of round.split(", ")) {
        const [value, color] = cube.split(" ");

        if (color in LIMITS) {
          if (parseInt(value, 10) > LIMITS[color as "red" | "green" | "blue"]) {
            invalid ||= true;
          }
        }
      }
    }

    if (!invalid) {
      validGames += gameId;
    }
  }

  return validGames;
}

export async function powerOfGames(filePath: string) {
  const f = await Deno.open(filePath);
  let power = 0;

  const decoder = new TextDecoder();
  for await (const uIntLine of readline(f)) {
    const line = decoder.decode(uIntLine);

    const [, rounds] = line.split(": ");
    const maxCubes = { red: 0, green: 0, blue: 0 };
    for (const round of rounds.split("; ")) {
      for (const cube of round.split(", ")) {
        const [value, color] = cube.split(" ") as [
          string,
          "red" | "green" | "blue"
        ];

        if (color in LIMITS) {
          maxCubes[color] = Math.max(maxCubes[color], parseInt(value, 10));
        }
      }
    }

    power += Object.values(maxCubes)
      .filter((v) => v !== 0)
      .reduce((a, b) => a * b, 1);
  }
  return power;
}
