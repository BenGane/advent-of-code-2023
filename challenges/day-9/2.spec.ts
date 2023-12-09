import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Histories = number[][];

const calculatePrediction = (history: Histories[number]) => {
  let predictionHelper: number[] = [];

  for (let i = history.length; i >= 0; i--) {
    predictionHelper.push(history[0]);

    if (history.every((number) => number === 0)) {
      break;
    }

    const newHistory: number[] = [];
    for (let j = 1; j < i; j++) {
      newHistory.push(history[j] - history[j - 1]);
    }

    history = newHistory;
  }

  return predictionHelper
    .reverse()
    .reduce((prediction, value) => value - prediction, 0);
};

const compute = (histories: Histories) =>
  histories.reduce((total, history) => total + calculatePrediction(history), 0);

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  const histories = input
    .split("\n")
    .map((history) => history.split(" ").map(Number));

  return histories;
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
