import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

const numbersMap = new Map<string, number>();

const numbers = "0123456789";
const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

[...numbers].forEach((_, index) => {
    numbersMap[numbers[index]] = index;
    numbersMap[words[index]] = index;
})

const keys = Object.keys(numbersMap);

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
    const lines = input.split("\n");

    const totalCalibration = lines.reduce((accumulator, line, index) => {
        let first: number;
        let last = 0;
        let cursor = 0;

        for (let i = 0; i < line.length; i++) {
            const slice = line.slice(cursor, i + 1);
            console.log(slice);

            if (keys.includes(slice)) {
                first ??= numbersMap[slice];
                last = numbersMap[slice];
                cursor = i;
            }

            if (!keys.some((key) => key.startsWith(slice))) {
                cursor = i;
            }

            if (keys.includes(line[i])) {
                first ??= numbersMap[line[i]];
                last = numbersMap[line[i]];
            }
        }

        console.log(line, "->",  numbersMap[first!] * 10 + numbersMap[last])

        return accumulator + numbersMap[first!] * 10 + numbersMap[last];
    }, 0);

    console.log(totalCalibration)
});