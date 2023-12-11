import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";
import { getSumOfShortestPaths, Data } from "./code";

const parseInputFile = async (): Promise<Data> => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = getSumOfShortestPaths(data, 2);
  console.log(result);
});
