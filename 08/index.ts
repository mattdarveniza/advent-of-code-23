import { readFile } from "../readFile.ts";

export async function stepsToDestination(filePath: string) {
  const lines = await readFile(filePath);

  const instructions = lines[0];
  const nodes = Object.fromEntries(
    lines.slice(2).map((line) => {
      const [, node, left, right] =
        line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/) || [];

      return [node, { left, right }];
    })
  );

  let currentNode = "AAA";
  let i = 0;
  while (currentNode !== "ZZZ") {
    const { left, right } = nodes[currentNode];
    currentNode = instructions[i % instructions.length] === "L" ? left : right;
    i++;
  }

  return i;
}
