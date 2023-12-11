import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];

const galaxy = '#';

const expandSpace = (data: Data) => {
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

  const space: Data = [];
  const emptyRow: string[] = [];
  const numRows = data.length + colsToExpand.size;

  for (let i = 0; i < numRows; i++) {
    emptyRow.push('.');
  }


  for (let i = 0; i < data.length; i++) {
    space.push([...emptyRow]);

    if (rowsToExpand.has(i)) {
      space.push([...emptyRow]);
      continue;
    }

    let col = 0;
    const row = space[space.length - 1];

    for (let j = 0; j < data[i].length; j++) {
      if (colsToExpand.has(j)) {
        row[col++] = '.';
        row[col++] = '.';
      } else {
        row[col++] = data[i][j];
      }
    }
  }

  return space
}

const getShortestPath = ([rowA, colA]: number[], [rowB, colB]: number[]) => Math.abs(rowA - rowB) + Math.abs(colA - colB);

const getSumOfShortestPaths = (data: Data) => {
  const galaxies = data.flatMap((row, i) => row.map((_, j) => [i, j])).filter(([row, col]) => data[row][col] === galaxy);
  
  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    const galaxyA = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyB = galaxies[j];
      sum += getShortestPath(galaxyA, galaxyB);
    }
  }

  return sum;
}

const compute = (data: Data) => {
  const expandedSpace = expandSpace(data);
  return getSumOfShortestPaths(expandedSpace);
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
