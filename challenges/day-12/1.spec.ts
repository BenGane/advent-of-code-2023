import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];

const compute = (data: Data) => {

};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
