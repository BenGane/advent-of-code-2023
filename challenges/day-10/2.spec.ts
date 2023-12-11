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

const factor = 2;

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

const getLoopPath = (data: Data): Coordinates[] => {
  const [startingRow, startingCol] = getStartingCoordinates(data);
  const loop: Coordinates[] = [[startingRow, startingCol]];

  let [rowPrev, colPrev] = [startingRow, startingCol];
  let [rowCursor, colCursor] = [startingRow, startingCol];

  while (loop.length === 1 || !(rowCursor === startingRow && colCursor === startingCol)) {
    const nextPossibleCoordinates = getNextPossibleCoordinates([rowCursor, colCursor], data);
    const selectedCoordinates = nextPossibleCoordinates.find(([rowNext, colNext]) => rowNext !== rowPrev || colNext !== colPrev);

    if (!selectedCoordinates) break;

    [rowPrev, colPrev] = [rowCursor, colCursor]; 
    [rowCursor, colCursor] = selectedCoordinates;

    loop.push([rowCursor, colCursor]);
  }

  return loop;
}

const containsCoordinate = (coordinates: Coordinates, path: Coordinates[]) => path.some(([a, b]) => a === coordinates[0] && b === coordinates[1]);

const getNumberOfEnclosedTiles = (data: Data, loopPath: [number, number][]) => {
  const isEnclosed = (coordinates: Coordinates, visited: Coordinates[]= []) => {
    const [row, col] = coordinates;
    if (containsCoordinate([row, col], visited)) return true;

    if (row < 0 || row >= data.length || col < 0 || col >= data[0].length) {
      return false;
    } else if (containsCoordinate(coordinates, loopPath)) {
      return true;
    }

    visited.push(coordinates);

    const left = isEnclosed([row, col - 1], visited);
    const right = isEnclosed([row, col + 1], visited);
    const up = isEnclosed([row - 1, col], visited);
    const down = isEnclosed([row + 1, col], visited);

    return left && right && up && down;
  }

  let count = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 1; j < data[i].length - 1; j++) {
      if (!containsCoordinate([i, j], loopPath) && data[i][j] !== '*' && isEnclosed([i, j])) {
        count++;
      }
    }
  }
  return count;
}

const createNewSolutionSpace = (data: Data) => {
  const solutionSpace: string[][] = [];
  for (let i = 0; i < data.length * factor; i++) {
    solutionSpace.push([])
    for (let j = 0; j < data[0].length * factor; j++) {
      if (i % factor === 0 && j % factor === 0) {
        solutionSpace[i].push(data[Math.floor(i / factor)][Math.floor(j / factor)]);
      } else {
        solutionSpace[i].push('*')
      }
    }
  }
  return solutionSpace;
} 

const updateNewSolutionSpace = (data: Data, originalLoopPath: Coordinates[]): Coordinates[] => {
  const mappedOriginalLoopPath: Coordinates[] = originalLoopPath.map(([row, col]) => [row * factor, col * factor]);
  const newLoopPath: Coordinates[] = [];
  
  for (let i = 0; i < mappedOriginalLoopPath.length; i++) {
    const [aX, aY] = mappedOriginalLoopPath[i];
    const [bX, bY] = mappedOriginalLoopPath[(i + 1) % mappedOriginalLoopPath.length];

    newLoopPath.push([aX, aY]);

    if (aX !== bX) {
      const start = Math.min(aX, bX) + 1;
      const finish = Math.max(aX, bX) - 1;

      for (let j = start; j <= finish; j++) {
        data[j][aY] = '|';
        newLoopPath.push([j, aY]);
      }
    } else if (aY !== bY) {
      const start = Math.min(aY, bY) + 1;
      const finish = Math.max(aY, bY) - 1;

      for (let j = start; j <= finish; j++) {
        data[aX][j] = '-';
        newLoopPath.push([aX, j]);
      }
    } else {
      throw new Error("Impossible...");
    }
  }

  return newLoopPath;
}

const compute = (data: Data) => {
  const newSolutionSpace = createNewSolutionSpace(data);
  const originalLoopPath = getLoopPath(data);

  const newLoopPath = updateNewSolutionSpace(newSolutionSpace, originalLoopPath);
  newSolutionSpace.forEach((row) => console.log(row.join(" ")));

  return getNumberOfEnclosedTiles(newSolutionSpace, newLoopPath);
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log(result);
});
