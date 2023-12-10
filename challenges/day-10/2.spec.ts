import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = {};

const compute = (data: Data) => {
}

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");

  return [];
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
