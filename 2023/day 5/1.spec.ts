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
        const sourceRangeToDestinationRangeMapping = Object.fromEntries((() => {
            const entries: [number, number][] = [];
            for (let i = 0; i <= 99; i++) {
                entries.push([i, i]);
            }
            return entries;
        })());

        for (const mapping of mappings) {
            const [destinationRangeStart, sourceRangeStart, rangeLength] = mapping.split(" ").map(value => +value);

            for (let i = 0; i < rangeLength; i++) {
                sourceRangeToDestinationRangeMapping[sourceRangeStart + i] = destinationRangeStart + i;
            }
        }

        return { [fromKey]: { [toKey]: sourceRangeToDestinationRangeMapping }}
    }

    const seeds = segments[0].split(":")[1].trim().split(" ");
    let mappings: Record<string, Record<string, Record<string, number>>> = {};

    for (const segment of segments.slice(1)) {
        // Maintain mapping ordering here
        mappings = { ...mappings, ...createMapping(segment) };
    }



    const findLocation = (seed: string) => {
        let location = +seed;
        for (const fromKey of Object.keys(mappings)) {
            const toKey = Object.keys(mappings[fromKey])[0]; // single mapping for now, might have more in question 2?
            location = mappings[fromKey][toKey][location];
        }
        return location;
    }

    let minimumLocation = Infinity;
    for (const seed of seeds) {
        minimumLocation = Math.min(minimumLocation, findLocation(seed));
    }
    console.log(minimumLocation);
});