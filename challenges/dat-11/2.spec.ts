import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];

const galaxy = "#";
const expansionFactor = 1000000;

const getRowsAndColsToExpand = (data: Data) => {
  const rowsToExpand = new Set<number>(
    data
      .map((_, index) => index)
      .filter((index) => !data[index].includes(galaxy)),
  );
  
  const colsToExpand = new Set<number>(
    data[0]
      .map((_, index) => index)
      .filter((col) => data.every((row) => row[col] !== galaxy)),
  );

  return [rowsToExpand, colsToExpand];
};

const getShortestPath = (
  [rowA, colA]: number[],
  [rowB, colB]: number[],
  rowsToExpand: Set<number>,
  colsToExpand: Set<number>,
) => {
  [rowA, rowB] = [Math.min(rowA, rowB), Math.max(rowA, rowB)];
  [colA, colB] = [Math.min(colA, colB), Math.max(colA, colB)];

  const rowDilationFactor = [...rowsToExpand].filter(
    (row) => row > rowA && row < rowB,
  ).length;

  const colDilationFactor = [...colsToExpand].filter(
    (col) => col > colA && col < colB,
  ).length;

  const rowDifference = rowB - rowA;
  const colDifference = colB - colA;

  return (
    rowDifference +
    colDifference +
    (expansionFactor - 1) * (rowDilationFactor + colDilationFactor)
  );
};

const getSumOfShortestPaths = (data: Data) => {
  const galaxies = data
    .flatMap((row, i) => row.map((_, j) => [i, j]))
    .filter(([row, col]) => data[row][col] === galaxy);

  const [rowsToExpand, colsToExpand] = getRowsAndColsToExpand(data);

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += getShortestPath(
        galaxies[i],
        galaxies[j],
        rowsToExpand,
        colsToExpand,
      );
    }
  }
  return sum;
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "2.input.txt"), "utf-8");
  return input.split("\n").map((line) => [...line]);
};

it("works", async () => {
  const data = await parseInputFile();
  const result = getSumOfShortestPaths(data);

  console.log(result);
});
