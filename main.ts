import { sumNumbers } from "./01/main.ts";
import { validGames, powerOfGames } from "./02/index.ts";
import { enginePartSum, gearRatios } from "./03/index.ts";
import { winningCombinations, totalCards } from "./04/index.ts";
import {
  lowestLocationFromSeedNumbers,
  lowestLocationFromSeedRanges,
} from "./05/index.ts";

console.log(await lowestLocationFromSeedRanges("05/input.txt"));
