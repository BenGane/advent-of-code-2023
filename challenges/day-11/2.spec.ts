import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";
import { getSumOfShortestPaths } from "./code";

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = getSumOfShortestPaths(data, 1000000);
  console.log(result);
});
