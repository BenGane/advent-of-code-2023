import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
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

        return { [fromKey]: { [toKey]: values }}
    }

    const seeds = segments[0].split(":")[1].trim().split(" ");
    let mappings: ReturnType<typeof createMapping> = {};

    for (const segment of segments.slice(1)) {
        // Maintain mapping ordering here
        mappings = { ...mappings, ...createMapping(segment) };
    }

    const findLocation = (seed: string | number) => {
        let location = +seed;
        for (const fromKey of Object.keys(mappings)) {
            const toKey = Object.keys(mappings[fromKey])[0]; // single mapping for now, might have more in question 2?
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
    for (let i = 0; i < seeds.length; i += 2) {
        const [seedFrom, seedRange] = [+seeds[i], +seeds[i + 1] ?? 0];

        for (let seed = seedFrom; seed < seedFrom + seedRange; seed++) {
            minimumLocation = Math.min(minimumLocation, findLocation(seed));
        }
    }

    console.log(minimumLocation);
});