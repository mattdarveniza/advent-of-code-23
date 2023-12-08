import { readFile } from "../readFile.ts";

const parseLines = (lines: string[]) => {
  const instructions = lines[0];
  const nodes = Object.fromEntries(
    lines.slice(2).map((line) => {
      const [, node, left, right] =
        line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/) || [];

      return [node, { left, right }];
    })
  );

  return [instructions, nodes] as const;
};

export async function stepsToDestination(filePath: string) {
  const lines = await readFile(filePath);
  const [instructions, nodes] = parseLines(lines);

  let currentNode = "AAA";
  let i = 0;
  while (currentNode !== "ZZZ") {
    const { left, right } = nodes[currentNode];
    currentNode = instructions[i % instructions.length] === "L" ? left : right;
    i++;
  }

  return i;
}

export async function ghostStepsToDestination(filePath: string) {
  const lines = await readFile(filePath);
  const [instructions, nodes] = parseLines(lines);

  const iterationsPerNode = Object.keys(nodes)
    .filter((node) => node.endsWith("A"))
    .map((nodeName) => {
      let currentNode = nodeName;
      let i = 0;
      while (!currentNode.endsWith("Z")) {
        const { left, right } = nodes[currentNode];
        currentNode =
          instructions[i % instructions.length] === "L" ? left : right;
        i++;
      }

      return i;
    });

  // Find LCM because.... maths?
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  return iterationsPerNode.reduce((acc, n) => (acc * n) / gcd(acc, n), 1);
}
