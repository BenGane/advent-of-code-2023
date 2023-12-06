import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
    const lines = input.split("\n");
    const copies = lines.map(() => 1);

    for (let i = 0; i < lines.length; i++) {
        const segments = lines[i].split(":");
        const winningNumbers = segments[1].split("|")[0].trim().split(/\s+/).map((winningNumber) => +winningNumber);
        const myNumbers = segments[1].split("|")[1].trim().split(/\s+/).map((winningNumber) => +winningNumber);
        const matchingNumbers = myNumbers.filter(myNumber => winningNumbers.includes(myNumber));

        for (let j = i + 1; j <= Math.min(lines.length - 1, i + matchingNumbers.length); j++) {
            copies[j] += copies[i];
        }
    }

    const total = copies.reduce((accumulator, count) => accumulator + count, 0);
    console.log(total);
});