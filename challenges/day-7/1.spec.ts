import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

const cardHierarchy = "AKQT987654321"; // cspell: ignore AKQT

const getHandRank = (hand: string) => {
    const cardMap = new Map<string, number>();
    [...hand].forEach((card) => {
        cardMap.set(card, (cardMap.get(card) ?? 0) + 1);
    });

    switch (cardMap.size) {
        case 1:
            return 1;
        case 2:
            return [...cardMap.values()].includes(4) ? 2 : 3
        case 3:
            return [...cardMap.values()].includes(3) ? 4 : 5
        case 4:
            return 6
        case 5:
            return 7;
        default:
            throw Error("Uncharted territory mate");
    }
}

const compareHands = (handA: string, handB: string) => {
    const aRank = getHandRank(handA);
    const bRank = getHandRank(handB);

    if (aRank !== bRank) return bRank - aRank;

    for (let index = 0; index < handA.length; index++) {
        const cardAValue = cardHierarchy.indexOf(handA[index]);
        const cardBValue = cardHierarchy.indexOf(handB[index]);
        
        if (cardAValue !== cardBValue) return cardBValue - cardAValue;
    }

    return 0;
}

const computeTotalWinnings = (data: { hand: string, bid: number }[]) => {
    data.sort(({ hand: a }, { hand: b}) => compareHands(a, b));
    return data.reduce((accumulator, { bid }, index) => accumulator + bid * (index + 1), 0);
};

it("works", () => {
    const lines = input.split("\n");
    const data: { hand: string, bid: number }[] = [];

    for (const line of lines) {
        const [hand, bid] = line.split(" ");
        data.push({ hand, bid: Number.parseInt(bid) });
    }

    console.log(computeTotalWinnings(data));
});