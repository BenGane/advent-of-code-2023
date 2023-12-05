import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
    const lines = input.split("\n");

    let total = lines.reduce((accumulator, line) => {
        const segments = line.split(":");
        const winningNumbers = segments[1].split("|")[0].trim().split(/\s+/).map((winningNumber) => +winningNumber);
        const myNumbers = segments[1].split("|")[1].trim().split(/\s+/).map((winningNumber) => +winningNumber);
        const matchingNumbers = myNumbers.filter(myNumber => winningNumbers.includes(myNumber));

        return accumulator + (matchingNumbers.length === 0 ? 0 : Math.pow(2, matchingNumbers.length - 1))
    }, 0);

    console.log(total);
});