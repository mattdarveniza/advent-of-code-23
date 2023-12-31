import { sumNumbers } from "./01/main.ts";
import { validGames, powerOfGames } from "./02/index.ts";
import { enginePartSum, gearRatios } from "./03/index.ts";
import { winningCombinations, totalCards } from "./04/index.ts";
import {
  lowestLocationFromSeedNumbers,
  lowestLocationFromSeedRanges,
} from "./05/index.ts";
import { joinedWinningTimes, marginOfError } from "./06/index.ts";
import { rankedHands } from "./07/index.ts";
import { stepsToDestination, ghostStepsToDestination } from "./08/index.ts";
import { sumNextSteps, sumPrevSteps } from "./09/index.ts";
import { furthestDistanceOfLoop, tilesWithinLoop } from "./10/index.ts";
import { sumOfShortestPaths } from "./11/index.ts";
import {
  numberOfCombinations,
  numberOfUnfoldedCombinations,
} from "./12/index.ts";
import { summarizeReflections } from "./13/index.ts";
import { totalLoad, totalLoadAfterCycles } from "./14/index.ts";

console.log(await totalLoadAfterCycles("14/input.txt"));
