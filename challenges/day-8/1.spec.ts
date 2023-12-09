import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Node = string;
type Network = Map<Node, [Node, Node]>;
type Data = { instructions: string; network: Network };

const targetNode = "ZZZ";
const startingNode = "AAA";

const getNextNode = (node: Node, instruction: string, network: Network) =>
  network.get(node)![instruction === "L" ? 0 : 1];

const computeSteps = ({ instructions, network }: Data) => {
  let steps = 0;
  let node = startingNode;

  while (node !== targetNode) {
    node = getNextNode(
      node,
      instructions[steps++ % instructions.length],
      network,
    );
  }

  return steps;
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
  const lines = input.split("\n\n");

  const instructions = lines[0];
  const network = new Map<Node, [Node, Node]>();

  for (const entry of lines[1].split("\n")) {
    const segments = entry.split(" = ");
    const key = segments[0];
    const [left, right] = segments[1].replace(/[\(\),]/g, "").split(" ");
    network.set(key, [left, right]);
  }

  return { instructions, network };
};

it("works", async () => {
  const data = await parseInputFile();
  const result = computeSteps(data);

  console.log(result);
});
