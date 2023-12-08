import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
  input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
  const isNumber = (string: string) => /^\d+$/.test(string);
  const lines = input.split("\n").map((line) => `${line}.`);

  const gearMap = {};

  for (let row = 0; row < lines.length; row++) {
    let cursorLeft = 0;
    let cursorRight = 0;

    for (let col = 0; col < lines[row].length - 1; col++) {
      const symbol = lines[row][col];
      const nextSymbol = lines[row][col + 1];

      if (!isNumber(symbol)) {
        cursorLeft = col;
        cursorRight = col + 1;
      }

      if (isNumber(symbol)) {
        cursorLeft = isNumber(lines[row][cursorLeft]) ? cursorLeft : col;
        cursorRight = isNumber(lines[row][cursorRight]) ? cursorRight + 1 : col + 1;
      }

      const slice = lines[row].slice(cursorLeft, cursorRight);

      if (isNumber(slice) && !isNumber(nextSymbol)) {
        for (let i = row - 1; i <= row + 1; i++) {
          for (let j = cursorLeft - 1; j <= cursorRight; j++) {
            const surroundingSymbol = lines[i]?.[j];
            if (surroundingSymbol === "*") {
              gearMap[i] ??= {};
              gearMap[i][j] ??= [];
              gearMap[i][j].push(+slice);
            }
          }
        }
      }
    }
  }

  let gearRatio = 0;

  for (const gearRow of Object.keys(gearMap)) {
    for (const gearCol of Object.keys(gearMap[gearRow])) {
      const numbersAdjacentToGears = gearMap[gearRow][gearCol];
      if (numbersAdjacentToGears.length === 2) {
        gearRatio += numbersAdjacentToGears[0] * numbersAdjacentToGears[1];
      }
    }
  }

  console.log(gearRatio);
});
