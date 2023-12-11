import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];
type Coordinates = [number, number];

const pipeMap: Record<string, string | undefined> = {
  "|": "NS",
  "-": "EW",
  "7": "SW",
  L: "NE",
  J: "NW",
  F: "SE",
};

const isStartingPosition = (position: string) => position === "S";

const getNextCoordinates = (
  data: Data,
  [row, col]: Coordinates,
  [rowPrev, colPrev]: Coordinates,
) => {
  const pipe = data[row][col];

  const left = data[row][col - 1];
  const right = data[row][col + 1];
  const up = data[row - 1]?.[col];
  const down = data[row + 1]?.[col];

  const possibleCoordinates: Coordinates[] = [];

  if (
    (isStartingPosition(pipe) || pipeMap[pipe]?.includes("W")) &&
    pipeMap[left]?.includes("E")
  ) {
    possibleCoordinates.push([row, col - 1]);
  }

  if (
    (isStartingPosition(pipe) || pipeMap[pipe]?.includes("E")) &&
    pipeMap[right]?.includes("W")
  ) {
    possibleCoordinates.push([row, col + 1]);
  }

  if (
    (isStartingPosition(pipe) || pipeMap[pipe]?.includes("N")) &&
    pipeMap[up]?.includes("S")
  ) {
    possibleCoordinates.push([row - 1, col]);
  }

  if (
    (isStartingPosition(pipe) || pipeMap[pipe]?.includes("S")) &&
    pipeMap[down]?.includes("N")
  ) {
    possibleCoordinates.push([row + 1, col]);
  }

  return possibleCoordinates.find(
    ([row, col]) => row !== rowPrev || col !== colPrev,
  );
};

const getStartingCoordinates = (data: Data): Coordinates => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (isStartingPosition(data[i][j])) {
        return [i, j];
      }
    }
  }

  throw new Error("No starting position found...");
};

const compute = (data: Data) => {
  const [startingRow, startingCol] = getStartingCoordinates(data);

  let loopLength = 1;

  let [rowPrev, colPrev] = [startingRow, startingCol];
  let [rowCursor, colCursor] = [startingRow, startingCol];

  do {
    const nextCoordinates = getNextCoordinates(
      data,
      [rowCursor, colCursor],
      [rowPrev, colPrev],
    );

    if (!nextCoordinates) break;

    [rowPrev, colPrev] = [rowCursor, colCursor];
    [rowCursor, colCursor] = nextCoordinates;

    loopLength++;
  } while (rowCursor !== startingRow || colCursor !== startingCol);

  return loopLength / 2;
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
