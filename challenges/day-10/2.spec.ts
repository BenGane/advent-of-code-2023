import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];
type Coordinates = [number, number];

const isStartingPosition = (position: string) => position === "S";

const pipeMap: Record<string, string | undefined> = {
  "|": "NS",
  "-": "EW",
  L: "NE",
  J: "NW",
  "7": "SW",
  F: "SE",
};

const expansionFactor = 2;
const expansionPlaceholder = "*";

const getNextCoordinates = (data: Data, [row, col]: Coordinates, [rowPrev, colPrev]: Coordinates) => {
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

const getLoopPath = (data: Data): Coordinates[] => {
  const [startingRow, startingCol] = getStartingCoordinates(data);
  const loop: Coordinates[] = [[startingRow, startingCol]];

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

    loop.push([rowCursor, colCursor]);
  } while (rowCursor !== startingRow || colCursor !== startingCol);

  return loop;
};

const getKey = ([row, col]: Coordinates) => `${row},${col}`;

const getNumberOfEnclosedTiles = (data: Data, loopPath: Coordinates[]) => {
  const resultsCache = new Map<number, Map<number, boolean>>();
  const loopPathSet = new Set<string>(loopPath.map(getKey));

  const isEnclosed = (
    coordinates: Coordinates,
    visited: Coordinates[] = [],
    visitedKeys = new Set<string>(),
  ): [boolean, Coordinates[]] => {
    const [row, col] = coordinates;
    const coordinatesKey = getKey(coordinates);

    if (resultsCache.get(row)?.has(col)) {
      return [!!resultsCache.get(row)?.get(col), visited];
    }

    if (visitedKeys.has(coordinatesKey)) {
      return [true, visited];
    }

    if (row < 0 || row >= data.length || col < 0 || col >= data[0].length) {
      return [false, visited];
    } else if (loopPathSet.has(coordinatesKey)) {
      return [true, visited];
    }

    visited.push(coordinates);
    visitedKeys.add(coordinatesKey);

    const [left] = isEnclosed([row, col - 1], visited, visitedKeys);
    const [right] = isEnclosed([row, col + 1], visited, visitedKeys);
    const [up] = isEnclosed([row - 1, col], visited, visitedKeys);
    const [down] = isEnclosed([row + 1, col], visited, visitedKeys);

    return [left && right && up && down, visited];
  };

  const cacheResults = (coordinates: Coordinates[], value: boolean) => {
    coordinates.forEach(([row, col]) => {
      const rowResults = resultsCache.get(row) ?? new Map<number, boolean>();
      resultsCache.set(row, rowResults);
      rowResults.set(col, value);
    });
  };

  let count = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 1; j < data[i].length - 1; j++) {
      if (loopPathSet.has(`${i},${j}`) || data[i][j] === expansionPlaceholder) {
        continue;
      }

      const [enclosed, visited] = isEnclosed([i, j]);
      const [visitedRow, visitedCol] = visited[0] ?? [-1, -1];

      if (!resultsCache.get(visitedRow)?.has(visitedCol)) {
        cacheResults(visited, enclosed);
      }

      enclosed && count++;
    }
  }
  return count;
};

const createExpandedGrid = (data: Data) => {
  const expandedGrid: string[][] = [];
  for (let i = 0; i < data.length * expansionFactor; i++) {
    expandedGrid.push([]);
    for (let j = 0; j < data[0].length * expansionFactor; j++) {
      expandedGrid[i].push(
        i % expansionFactor === 0 && j % expansionFactor === 0
          ? data[Math.floor(i / expansionFactor)][
              Math.floor(j / expansionFactor)
            ]
          : expansionPlaceholder,
      );
    }
  }
  return expandedGrid;
};

const updateExpandedGrid = (
  data: Data,
  originalLoopPath: Coordinates[],
): Coordinates[] => {
  const mappedOriginalLoopPath: Coordinates[] = originalLoopPath.map(
    ([row, col]) => [row * expansionFactor, col * expansionFactor],
  );
  const newLoopPath: Coordinates[] = [];

  for (let i = 0; i < mappedOriginalLoopPath.length; i++) {
    const [aX, aY] = mappedOriginalLoopPath[i];
    const [bX, bY] =
      mappedOriginalLoopPath[(i + 1) % mappedOriginalLoopPath.length];

    newLoopPath.push([aX, aY]);

    if (aX !== bX) {
      const start = Math.min(aX, bX) + 1;
      const finish = Math.max(aX, bX) - 1;

      for (let j = start; j <= finish; j++) {
        data[j][aY] = "|";
        newLoopPath.push([j, aY]);
      }
    } else if (aY !== bY) {
      const start = Math.min(aY, bY) + 1;
      const finish = Math.max(aY, bY) - 1;

      for (let j = start; j <= finish; j++) {
        data[aX][j] = "-";
        newLoopPath.push([aX, j]);
      }
    }
  }

  return newLoopPath;
};

const compute = (data: Data) => {
  const originalLoopPath = getLoopPath(data);
  const expandedGrid = createExpandedGrid(data);
  const newLoopPath = updateExpandedGrid(expandedGrid, originalLoopPath);
  return getNumberOfEnclosedTiles(expandedGrid, newLoopPath);
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = compute(data);

  console.log("Day 10 part 2", result);
});
