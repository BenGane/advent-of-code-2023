import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = { instructions: string, directions: Map<string, [string, string]> };

const computeSteps = ({ instructions, directions }: Data) => {
  let steps = 0;
  let cursor = 'AAA';
  
  while (cursor !== 'ZZZ') {
    const conversion = instructions[steps % instructions.length] === 'L' ? 0 : 1;
    cursor = directions.get(cursor)![conversion];
    steps++;
  }

  return steps;
}

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  const lines = input.split('\n\n');

  const instructions = lines[0];
  const directions = new Map<string, [string, string]>();

  for (const entry of lines[1].split("\n")) {
    const segments = entry.split(" = ");
    const key = segments[0];
    const [left, right] = segments[1].replace(/[\(\),]/g, "").split(" ");
    directions.set(key, [left, right]);
  }

  return { instructions, directions };
};

it("works", async () => {
  const data = await parseInputFile();
  const result = computeSteps(data); 

  console.log(result);
});
