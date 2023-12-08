import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = { instructions: string, directions: Map<string, [string, string]> };

const targetNode = 'ZZZ';
const startingNode = 'AAA';

const getDirectionIndex = (instruction: string) => instruction === 'L' ? 0 : 1;

const computeSteps = ({ instructions, directions }: Data) => {
  let steps = 0;
  let cursor = startingNode;
  
  while (cursor !== targetNode) {
    const instruction = instructions[steps % instructions.length];
    const directionIndex = getDirectionIndex(instruction);

    cursor = directions.get(cursor)![directionIndex];
    steps++;
  }

  return steps;
}

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
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
