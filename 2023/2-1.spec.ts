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

    (() => {
      for (const subset of subsets) {
        const data = subset.split(", ");
        for (const datum of data) {
          const number = parseInt(datum.split(" ")[0]);
          const color = datum.split(" ")[1];

          if (color === "red" && number > 12) return;
          if (color === "green" && number > 13) return;
          if (color === "blue" && number > 14) return;
        }
      }

      sum += gameId;
    })();
  }

  console.log(sum);
});
