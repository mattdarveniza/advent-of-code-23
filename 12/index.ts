// import numCpus from "https://deno.land/x/num_cpus@v0.2.0/mod.ts";
import { readFile } from "../readFile.ts";

export function possibleCombinations(
  line: string,
  brokenInfo: number[]
  // prev = ""
): number {
  if (brokenInfo.length === 0) {
    if (line.includes("#")) {
      return 0;
    } else {
      // console.log(prev.slice(0, -1));
      return 1;
    }
  }

  const minLength =
    brokenInfo.reduce((acc, curr) => acc + curr, 0) + brokenInfo.length - 1;
  let combinations = 0;

  const [brokenLength, ...rest] = brokenInfo;
  for (let i = 0; i <= line.length - minLength; i++) {
    const brokenSection = line.slice(i, brokenLength + i);
    const brokenPossible = [...brokenSection].every((c) => c !== ".");
    const contiguous = line[i + brokenLength] !== "#" && line[i - 1] !== "#";
    if (brokenPossible && contiguous) {
      combinations += possibleCombinations(
        line.slice(i + brokenLength + 1),
        rest
        // prev + ".".repeat(i) + "#".repeat(brokenLength) + "."
      );
    }

    if (brokenSection[0] === "#") {
      // This means a # has been passed over and there are no more combinations
      // possible
      break;
    }
  }

  return combinations;
}

export async function numberOfCombinations(filePath: string) {
  const lines = await readFile(filePath);
  const totalCombinations = lines.reduce((acc, curr, i) => {
    console.log(curr);
    const [line, brokenInfo] = curr.split(" ");
    const combos = possibleCombinations(
      line,
      brokenInfo.split(",").map((x) => parseInt(x))
    );
    console.log(`${i}: ${combos}`);
    return acc + combos;
  }, 0);

  return totalCombinations;
}

export async function numberOfUnfoldedCombinations(filePath: string) {
  const lines = await readFile(filePath);
  // const lines = ["?????????##???????#? 2,1,1,2,2,2"];

  const unfoldedLines = lines.map((line) => {
    const [springs, brokenInfo] = line.split(" ");
    const unfoldedSprings = new Array(5).fill(springs).join("?");
    const unfoldedInfo = new Array(5).fill(brokenInfo).join(",");
    return [unfoldedSprings, unfoldedInfo].join(" ");
  });

  let linesProcessed = 0;
  const combinations: number[] = [];

  const cpus = 6;
  const threads = new Array(cpus).fill(0).map((_, i) => {
    return new Promise<void>((resolve) => {
      const worker = new Worker(new URL("./worker.js", import.meta.url).href, {
        type: "module",
      });

      function processLine() {
        const line = unfoldedLines[linesProcessed++];
        console.log(`${linesProcessed} / ${unfoldedLines.length}`);
        console.log(line);
        worker.postMessage(line);
      }

      worker.onmessage = (e: MessageEvent<number>) => {
        const result = e.data;
        console.log(`complete: ${result}`);
        combinations.push(result);
        if (linesProcessed < unfoldedLines.length) {
          processLine();
        } else {
          console.log(`terminating worker ${i}`);
          worker.terminate();
          resolve();
        }
      };

      processLine();
    });
  });

  await Promise.all(threads);
  const totalCombinations = combinations.reduce(
    (acc, curr) => acc + (curr ?? 0),
    0
  );

  // const totalCombinations = unfoldedLines.reduce((acc, curr, i) => {
  //   console.log(curr);
  //   const [line, brokenInfo] = curr.split(" ");
  //   const combos = possibleCombinations(
  //     line,
  //     brokenInfo.split(",").map((x) => parseInt(x))
  //   );
  //   console.log(`${i} / ${unfoldedLines.length}: ${combos}`);
  //   return acc + combos;
  // }, 0);

  return totalCombinations;
}
