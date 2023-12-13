import { possibleCombinations } from "./index.ts";

// export function possibleCombinations(line, brokenInfo, prev = "") {
//   if (brokenInfo.length === 0) {
//     if (line.includes("#")) {
//       return 0;
//     } else {
//       // console.log(prev.slice(0, -1));
//       return 1;
//     }
//   }

//   const minLength =
//     brokenInfo.reduce((acc, curr) => acc + curr, 0) + brokenInfo.length - 1;
//   let combinations = 0;

//   const [brokenLength, ...rest] = brokenInfo;
//   for (let i = 0; i <= line.length - minLength; i++) {
//     const brokenSection = line.slice(i, brokenLength + i);
//     const brokenMatches = brokenSection.match(/\?|#/g);
//     const contiguous = line[i + brokenLength] !== "#" && line[i - 1] !== "#";
//     if (brokenMatches?.length === brokenLength && contiguous) {
//       combinations += possibleCombinations(
//         line.slice(i + brokenLength + 1),
//         rest,
//         prev + ".".repeat(i) + "#".repeat(brokenLength) + "."
//       );
//     }

//     if (brokenSection[0] === "#") {
//       // This means a # has been passed over and there are no more combinations
//       // possible
//       break;
//     }
//   }

//   return combinations;
// }

self.onmessage = (e) => {
  const [springs, brokenInfo] = e.data.split(" ");
  const combos = possibleCombinations(
    springs,
    brokenInfo.split(",").map((x) => parseInt(x))
  );
  postMessage(combos);
};
