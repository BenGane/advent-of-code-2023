import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Histories = number[][];

const calculatePrediction = (history: Histories[number]) => {
  let prediction = 0;

  for (let i = history.length; i >= 0; i--) {
    prediction += history[history.length - 1];

    if (history.every((number) => number === 0)) {
      break;
    }

    const newHistory: number[] = [];
    for (let j = 1; j < i; j++) {
      newHistory.push(history[j] - history[j - 1]);
    }

    history = newHistory;
  }

  return prediction;
};

const compute = (histories: Histories) => {
  let total = 0;

  for (const history of histories) {
    total += calculatePrediction(history);
  }

  return total;
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
  const histories = input
    .split("\n")
    .map((history) =>
      history.split(" ").map((number) => Number.parseInt(number)),
    );
  return histories;
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
