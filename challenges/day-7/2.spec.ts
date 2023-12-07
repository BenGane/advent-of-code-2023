import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
  input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

const cardHierarchy = "AKQT987654321J"; // cspell: ignore AKQT

const getCardMap = (hand: string) => {
  const cardMap = new Map<string, number>();
  [...hand].forEach((card) => {
    cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
  });
  return cardMap;
};

const getHandRank = (hand: string) => {
  const cardMap = getCardMap(hand);

  switch (cardMap.size) {
    case 1:
      return 1;
    case 2:
      return [...cardMap.values()].includes(4) ? 2 : 3;
    case 3:
      return [...cardMap.values()].includes(3) ? 4 : 5;
    case 4:
      return 6;
    case 5:
      return 7;
    default:
      throw Error("Uncharted territory mate");
  }
};

const getBestHandRank = (hand: string) =>
  [...cardHierarchy].reduce(
    (bestRank, currentCard) =>
      Math.min(getHandRank(hand.replace(/J/g, currentCard)), bestRank),
    Infinity,
  );

const compareHands = (handA: string, handB: string) => {
  const rankA = getBestHandRank(handA);
  const rankB = getBestHandRank(handB);

  if (rankA !== rankB) return rankB - rankA;

  for (let i = 0; i < handA.length; i++) {
    const cardAValue = cardHierarchy.indexOf(handA[i]);
    const cardBValue = cardHierarchy.indexOf(handB[i]);

    if (cardAValue !== cardBValue) return cardBValue - cardAValue;
  }

  return 0;
};

const computeTotalWinnings = (data: { hand: string; bid: number }[]) =>
  data
    .sort(({ hand: a }, { hand: b }) => compareHands(a, b))
    .reduce(
      (accumulator, { bid }, index) => accumulator + bid * (index + 1),
      0,
    );

it("works", () => {
  const lines = input.split("\n");
  const data: { hand: string; bid: number }[] = [];

  for (const line of lines) {
    const [hand, bid] = line.split(" ");
    data.push({ hand, bid: Number.parseInt(bid) });
  }

  console.log(computeTotalWinnings(data));
});
