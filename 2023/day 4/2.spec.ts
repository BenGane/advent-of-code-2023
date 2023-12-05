import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
    const lines = input.split("\n");
});