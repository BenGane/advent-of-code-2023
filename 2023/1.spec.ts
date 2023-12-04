import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
    const isNumber = (string: string) => string >= '0' && string <= '9'
    const lines = input.split("\n");

    const totalCalibration = lines.reduce((accumulator, currentLine) => {
        const first = [...currentLine].find(isNumber) ?? 0;
        const last = [...currentLine].reverse().find(isNumber) ?? 0;
        return accumulator + +first * 10 + +last;
    }, 0);

    console.log(totalCalibration)
});