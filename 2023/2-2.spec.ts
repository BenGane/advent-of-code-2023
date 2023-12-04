import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
  input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const gameId = parseInt(line.split(": ")[0].replace(/\D/g, ""));
    const subsets = line.split(": ")[1].split("; ");

    let maxRed = 0;
    let maxGreen = 0;
    let maxBlue = 0;

    for (const subset of subsets) {
      const data = subset.split(", ");
      for (const datum of data) {
        const number = parseInt(datum.split(" ")[0]);
        const color = datum.split(" ")[1];

        if (color === "red") maxRed = Math.max(maxRed, number);
        if (color === "green") maxGreen = Math.max(maxGreen, number);
        if (color === "blue") maxBlue = Math.max(maxBlue, number);
      }
    }

    const power = maxRed * maxGreen * maxBlue;

    sum += power;
  }

  console.log(sum);
});
