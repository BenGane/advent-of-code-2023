import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

const waysToBeatRecord = ({ time, distance }: { time: number, distance: number }) => {
    let numberOfWaysToBeatRecord = 0;

    for (let i = 1; i < time; i++) {
        numberOfWaysToBeatRecord += i * (time - i) > distance ? 1 : 0
    }

    return numberOfWaysToBeatRecord;
}                                                                        

it("works", async () => {
    const lines = input.split("\n");
    
    const time = +lines[0].split(":")[1].trim().split(/\s+/).join("");
    const distance = +lines[1].split(":")[1].trim().split(/\s+/).join("");

    const total = waysToBeatRecord({ time, distance });
    
    console.log(total);
});