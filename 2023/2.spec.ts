import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, it } from "vitest";

let input: string;

const numbers = [..."0123456789"];
const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

beforeAll(async () => {
    input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
});

it("works", async () => {
    const lines = input.split("\n");

    const totalCalibration = lines.reduce((accumulator, line) => {
        const firstNumbersFound = [...numbers].map(number => ({ index: line.indexOf(number), number })).filter(({ index }) => index !== -1);
        const lastNumbersFound = [...numbers].map(number => ({ index: line.lastIndexOf(number), number })).filter(({ index }) => index !== -1);

        firstNumbersFound.sort((a, b) => a.index - b.index);
        lastNumbersFound.sort((a, b) => a.index - b.index);

        const firstWordsFound = words.map(word => ({ index: line.indexOf(word), word: word })).filter(({ index }) => index !== -1);
        const lastWordsFound = words.map(word => ({ index: line.lastIndexOf(word), word: word })).filter(({ index }) => index !== -1);

        firstWordsFound.sort((a, b) => a.index - b.index);
        lastWordsFound.sort((a, b) => a.index - b.index);

        const firstWord = firstWordsFound[0] ?? { index: Infinity };
        const lastWord = lastWordsFound[lastWordsFound.length - 1] ?? { index: -Infinity};

        const firstNumber = firstNumbersFound[0] ?? { index: Infinity };
        const lastNumber = lastNumbersFound[lastNumbersFound.length - 1] ?? { index: -Infinity };

        const first = firstWord?.index <= firstNumber?.index ? words.indexOf(firstWord.word) : +firstNumber.number; 
        const last = lastWord?.index >= lastNumber?.index ? words.indexOf(lastWord.word) : +lastNumber.number; 

        return accumulator + first * 10 + last;
    }, 0);

    console.log(totalCalibration)
});