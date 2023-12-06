import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
    const games = input.split("\n").map((game) => {
        const segments = game.match(/^Game (\d+):(.*)/);

        return {
            id: segments?.[1] ?? 0,
            matches: segments?.[2].split(';').map((match) => { 
                const cubes = match.trim().split(', ')

                return Object.fromEntries(cubes.map((cube) => [cube.split(" ")[1], +cube.split(" ")[0]]));
            }) ?? []
        }
    });

    const maxColors = { red: 12, green: 13, blue: 14 };
    const result = games.reduce((accumulator, game) => {
        const isPossible = game.matches.every((match) => Object.keys(maxColors).every((key) => !match[key] || match[key] <= maxColors[key]));
        return accumulator + (isPossible ? +game.id : 0);
    }, 0);

    console.log(result)
});