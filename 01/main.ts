import { readline } from "https://deno.land/x/readline@v1.1.0/mod.ts";

const numberMap: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const regex = new RegExp(
  `(?=([0-9]|${Object.keys(numberMap).join("|")}))`,
  "g"
);

function match(str: string) {
  const regexMatch = [...str.matchAll(regex)];

  if (regexMatch.length === 0) {
    throw new Error("No match found");
  }

  return [0, -1].map((index) => {
    const value = regexMatch.at(index)?.[1] as string;

    if (value in numberMap) {
      return numberMap[value];
    }

    return parseInt(value, 10);
  });
}

export async function sumNumbers(filePath: string) {
  const f = await Deno.open(filePath);

  let sum = 0;
  const decoder = new TextDecoder();
  for await (const uIntLine of readline(f)) {
    const line = decoder.decode(uIntLine);
    const [first, last] = match(line);

    const num = parseInt(`${first}${last}`, 10);
    sum += num;
  }

  return sum;
}
