import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Node = string;
type Network = Map<Node, [Node, Node]>;
type Data = { instructions: string; network: Network };

const isStartingNode = (node: Node) => node.endsWith("A");
const isFinishingNode = (node: Node) => node.endsWith("Z");

const getGreatestCommonDivisor = (a: number, b: number) =>
  b === 0 ? a : getGreatestCommonDivisor(b, a % b);

const getLeastCommonMultiple = (a: number, b: number) =>
  (a * b) / getGreatestCommonDivisor(a, b);

const getNextNode = (node: Node, instruction: string, network: Network) =>
  network.get(node)![instruction === "L" ? 0 : 1];

const getStepsToFinishingNode = (
  node: Node,
  instructions: string,
  network: Network,
) => {
  let steps = 0;

  while (!isFinishingNode(node)) {
    node = getNextNode(
      node,
      instructions[steps++ % instructions.length],
      network,
    );
  }

  return steps;
};

const computeSteps = ({ instructions, network }: Data) => {
  const nodes = [...network.keys()].filter((node) => isStartingNode(node));
  const allSteps = nodes.map((node) =>
    getStepsToFinishingNode(node, instructions, network),
  );

  return allSteps.reduce(
    (leastCommonMultiple, distance) =>
      getLeastCommonMultiple(leastCommonMultiple, distance),
    1,
  );
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  const lines = input.split("\n\n");

  const instructions = lines[0];
  const network = new Map<Node, [Node, Node]>();

  for (const entry of lines[1].split("\n")) {
    const segments = entry.split(" = ");
    const node = segments[0];
    const [left, right] = segments[1].replace(/[\(\),]/g, "").split(" ");
    network.set(node, [left, right]);
  }

  return { instructions, network };
};

it("works", async () => {
  const data = await parseInputFile();
  const result = computeSteps(data);

  console.log(result);
});
