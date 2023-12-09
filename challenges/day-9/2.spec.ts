import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Histories = number[][];

const calculatePrediction = (history: Histories[number]) => {
  let predictionHelper: number[] = [];

  while (history.some((element) => element !== 0)) {
    predictionHelper.push(history[0]);
    history = history.slice(1).map((value, i) => value - history[i]);
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
