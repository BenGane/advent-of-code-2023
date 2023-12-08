import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");

  return [] as string[];
};

it("works", async () => {
  const data = await parseInputFile();

  console.log(data);
});
