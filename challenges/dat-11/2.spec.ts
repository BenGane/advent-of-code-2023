import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];

const galaxy = '#';

const getRowsAndColsToExpand = (data: Data) => {
  const rowsToExpand = new Set<number>();
  const colsToExpand = new Set<number>();

  for (let i = 0; i < data.length; i++) {
    let expandCurrentRow = true;
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] === galaxy) {
        expandCurrentRow = false;
        break;
      }
    }
    if (expandCurrentRow) {
      rowsToExpand.add(i);
    }
  }

  for (let j = 0; j < data[0].length; j++) {
    let expandCurrentCol = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i][j] === galaxy) {
        expandCurrentCol = false;
        break;
      }
    }
    if (expandCurrentCol) {
      colsToExpand.add(j);
    }
  }

  return [rowsToExpand, colsToExpand];
}

const expansionRate = 10;

const getShortestPath = ([rowA, colA]: number[], [rowB, colB]: number[], rowsToExpand: Set<number>, colsToExpand: Set<number>) => {
  [rowA, rowB] = [Math.min(rowA, rowB), Math.max(rowA, rowB)];
  [colA, colB] = [Math.min(colA, colB), Math.max(colA, colB)];

  const rowDilation = [...rowsToExpand].filter((row) => row > rowA && row < rowB).length; 
  const colDilation = [...colsToExpand].filter((col) => col > colA && col < colB).length; 

  return Math.abs(rowA - rowB) + Math.abs(colA - colB) + (expansionRate - 1) * (rowDilation + colDilation);
}

const getSumOfShortestPaths = (data: Data) => {
  const galaxies = data.flatMap((row, i) => row.map((_, j) => [i, j])).filter(([row, col]) => data[row][col] === galaxy);
  const [rowsToExpand, colsToExpand] = getRowsAndColsToExpand(data);

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const galaxyA = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyB = galaxies[j];
      sum += getShortestPath(galaxyA, galaxyB, rowsToExpand, colsToExpand);
    }
  }

  return sum;
}

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = getSumOfShortestPaths(data);

  console.log(result);
});
