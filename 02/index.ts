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
