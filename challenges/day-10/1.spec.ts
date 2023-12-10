import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];
type Coordinates = [number, number];

const isStartingPosition = (position: string) => position === 'S';

const pipeMap: Record<string, string | undefined> = {
  '|': 'NS',
  '-': 'EW',
  'L': 'NE',
  'J': 'NW',
  '7': 'SW',
  'F': 'SE',
}

const getNextPossibleCoordinates = (coordinates: Coordinates, data: Data) => {
  const [row, col] = coordinates;
  const pipe = data[row][col];

  const left = data[row][col - 1];
  const right = data[row][col + 1];
  const up = data[row - 1]?.[col];
  const down = data[row + 1]?.[col];

  const possibleCoordinates: Coordinates[] = [];

  if ((isStartingPosition(pipe) || pipeMap[pipe]?.includes("W")) && pipeMap[left]?.includes("E")) {
    possibleCoordinates.push([row, col - 1]);
  }

  if ((isStartingPosition(pipe) || pipeMap[pipe]?.includes("E")) && pipeMap[right]?.includes("W")) {
    possibleCoordinates.push([row, col + 1]);
  }

  if ((isStartingPosition(pipe) || pipeMap[pipe]?.includes("N")) && pipeMap[up]?.includes("S")) {
    possibleCoordinates.push([row - 1, col]);
  }

  if ((isStartingPosition(pipe) || pipeMap[pipe]?.includes("S")) && pipeMap[down]?.includes("N")) {
    possibleCoordinates.push([row + 1, col]);
  }

  return possibleCoordinates;
}

const getStartingCoordinates = (data: Data): Coordinates=> {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (isStartingPosition(data[i][j])) {
        return [i, j];
      }
    }
  }

  throw new Error("No starting position found...");
}

const compute = (data: Data) => {
  const [startingRow, startingCol] = getStartingCoordinates(data);
  const path = [[startingRow, startingCol]];

  let [rowPrev, colPrev] = [startingRow, startingCol];
  let [rowCursor, colCursor] = [startingRow, startingCol];

  while (path.length === 1 || !(rowCursor === startingRow && colCursor === startingCol)) {
    const nextPossibleCoordinates = getNextPossibleCoordinates([rowCursor, colCursor], data);
    const selectedCoordinates = nextPossibleCoordinates.find(([rowNext, colNext]) => rowNext !== rowPrev || colNext !== colPrev);

    if (!selectedCoordinates) {
      break;
    };

    [rowPrev, colPrev] = [rowCursor, colCursor]; 
    [rowCursor, colCursor] = selectedCoordinates;

    path.push([rowCursor, colCursor]);
  }

  console.log(path, path.map(([i, j]) => data[i][j]));

  return path.length / 2
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
