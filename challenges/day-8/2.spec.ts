import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = { instructions: string, directions: Map<string, [string, string]> };

const getGreatestCommonDivisor = (a: number, b: number) =>  b === 0 ? a : getGreatestCommonDivisor(b, a % b);
const getLeastCommonMultiple = (a: number, b: number) => a * b / getGreatestCommonDivisor(a, b);

const computeSteps = ({ instructions, directions }: Data) => {
  const cursors = [...directions.keys()].filter((key) => key.endsWith('A'));
  const minimumDistances = cursors.map(() => Infinity);

  let steps = 0;
  while (minimumDistances.includes(Infinity)) {
    const directionIndex = instructions[steps % instructions.length] === 'L' ? 0 : 1;
    for (let i = 0; i < cursors.length; i++) {
      cursors[i] = directions.get(cursors[i])![directionIndex];
      if (cursors[i].endsWith('Z')) {
        minimumDistances[i] = Math.min(minimumDistances[i], steps + 1);
      }
    }
    steps++;
  }

  return minimumDistances.reduce((accumulator, distance) => getLeastCommonMultiple(accumulator, distance), 1);
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
