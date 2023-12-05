import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
    const isNumber = (string: string) => /^\d+$/.test(string);
    const lines = input.split("\n").map(line => `${line}.`);

    let sumOfParts = 0;

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
                let isPart = false;

                for (let i = row - 1; i <= row + 1; i++) {
                    for (let j = cursorLeft - 1; j <= cursorRight; j++) {
                        const surroundingSymbol = lines[i]?.[j];
                        if (isNumber(surroundingSymbol)) continue;
                        isPart ||= surroundingSymbol !== undefined && surroundingSymbol !== '.'; 
                    }
                }

                sumOfParts = isPart ? sumOfParts + +slice : sumOfParts;
            }
        }
    }

    console.log(sumOfParts);
});