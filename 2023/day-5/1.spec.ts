import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
    const segments = input.split("\n\n");

    const createMapping = (line: string) => {
        line = line.replace(" map", "");
        const sections = line.split(":");

        const keys = sections[0].split("-to-");
        const fromKey = keys[0];
        const toKey = keys[1];

        const mappings = sections[1].trim().split("\n");
        const values: {destinationRangeStart: number, sourceRangeStart: number, rangeLength: number}[] = [];

        for (const mapping of mappings) {
            const [destinationRangeStart, sourceRangeStart, rangeLength] = mapping.split(" ").map(value => +value);

            values.push({ destinationRangeStart, sourceRangeStart, rangeLength });
        }

        // Note to self -> Over-engineered this solution, read it too quickly and assumed it would be a recursive DFS question...  
        return { [fromKey]: { [toKey]: values }}
    }

    const seeds = segments[0].split(":")[1].trim().split(" ");
    let mappings: ReturnType<typeof createMapping> = {};

    for (const segment of segments.slice(1)) {
        mappings = { ...mappings, ...createMapping(segment) };
    }

    const findLocation = (seed: string) => {
        let location = +seed;
        for (const fromKey of Object.keys(mappings)) {
            const toKey = Object.keys(mappings[fromKey])[0];
            const values = mappings[fromKey][toKey];

            for (const { destinationRangeStart, sourceRangeStart, rangeLength} of values) {
                if (location >= sourceRangeStart && location < sourceRangeStart + rangeLength) {
                    location += destinationRangeStart - sourceRangeStart;
                    break;
                }
            }
        }
        return location;
    }

    let minimumLocation = Infinity;
    for (const seed of seeds) {
        minimumLocation = Math.min(minimumLocation, findLocation(seed));
    }

    console.log(minimumLocation);
});