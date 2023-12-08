import { readFile } from "../readFile.ts";

type Hand = [string, number];

const rankedHandTypes = [
  "Five",
  "Four",
  "Full House",
  "Three",
  "Two Pair",
  "One Pair",
  "High Card",
];

const cardRanks = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

function countOccurences(hand: string) {
  const characters = new Set(hand);
  return [...characters].map(
    (character) => hand.match(new RegExp(character, "g"))?.length ?? 0
  );
}

function handType(hand: string) {
  const occurences = countOccurences(hand);
  if (occurences.includes(5)) {
    return "Five";
  }

  if (occurences.includes(4)) {
    return "Four";
  }

  if (occurences.includes(3) && occurences.includes(2)) {
    return "Full House";
  }

  if (occurences.includes(3)) {
    return "Three";
  }

  if (occurences.filter((x) => x === 2).length === 2) {
    return "Two Pair";
  }

  if (occurences.includes(2)) {
    return "One Pair";
  }

  return "High Card";
}

function sortHands([a]: Hand, [b]: Hand): number {
  const [aType, bType] = [a, b].map(handType);

  const cmp = rankedHandTypes.indexOf(aType) - rankedHandTypes.indexOf(bType);

  if (cmp !== 0) {
    return cmp;
  }

  for (let i = 0; i < 5; i++) {
    const cardCmp = cardRanks.indexOf(a[i]) - cardRanks.indexOf(b[i]);

    if (cardCmp !== 0) {
      return cardCmp;
    }
  }

  return 0;
}

export async function rankedHands(filePath: string) {
  const lines = await readFile(filePath);
  const hands: Hand[] = lines.map((line) => {
    const [hand, bid] = line.split(" ");
    return [hand, parseInt(bid, 10)];
  });

  const sortedHands = hands.toSorted(sortHands).toReversed();

  return sortedHands.reduce((acc, [, bid], i) => {
    return acc + bid * (i + 1);
  }, 0);
}
