import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
  input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

const cardHierarchy = "AKQJT987654321"; // cspell: ignore AKQJT

const getCardMap = (hand: string) => [...hand].reduce((map, card) => map.set(card, (map.get(card) ?? 0) + 1), new Map<string, number>())

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

const compareHands = (handA: string, handB: string) => {
  const rankA = getHandRank(handA);
  const rankB = getHandRank(handB);

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
