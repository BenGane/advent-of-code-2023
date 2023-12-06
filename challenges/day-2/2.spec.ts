import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
    const games = input.split("\n").map((game) => {
        const segments = game.match(/^Game (\d+):(.*)/);

        return {
            id: segments?.[1] ?? 0,
            matches: segments?.[2].split(';').map((match) => { 
                const cubes = match.trim().split(', ')

                return Object.fromEntries(cubes.map((cube) => [cube.split(" ")[1],  +cube.split(" ")[0]]));
            }) ?? []
        }
    });

    const result = games.reduce((accumulator, game) => {
        const minimums = { red: 0, blue: 0, green: 0 };

        game.matches.forEach((match) => {
            Object.keys(minimums).forEach((color) => {
                minimums[color] = Math.max(match[color] ?? minimums[color], minimums[color]);
            });
        })

        const powerSet = Object.values(minimums).reduce((total, minimum) => total *= minimum, 1);
        return accumulator + powerSet;
    }, 0);

    console.log(result);
});