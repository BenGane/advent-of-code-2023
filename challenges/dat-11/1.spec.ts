import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = string[][];

const galaxy = "#";
const expansionFactor = 2;

const getExpandableRowsAndCols = (data: Data) => {
  const expandableRows = new Set<number>(
    data
      .map((_, index) => index)
      .filter((index) => !data[index].includes(galaxy)),
  );

  const expandableCols = new Set<number>(
    data[0]
      .map((_, index) => index)
      .filter((index) => data.every((row) => row[index] !== galaxy)),
  );

  return [expandableRows, expandableCols];
};

const getShortestPath = (
  [rowA, colA]: number[],
  [rowB, colB]: number[],
  expandableRows: Set<number>,
  expandableCols: Set<number>,
) => {
  [rowA, rowB] = [Math.min(rowA, rowB), Math.max(rowA, rowB)];
  [colA, colB] = [Math.min(colA, colB), Math.max(colA, colB)];

  const rowDilationFactor = [...expandableRows].filter(
    (row) => row > rowA && row < rowB,
  ).length;

  const colDilationFactor = [...expandableCols].filter(
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

  const [expandableRows, expandableCols] = getExpandableRowsAndCols(data);

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += getShortestPath(
        galaxies[i],
        galaxies[j],
        expandableRows,
        expandableCols,
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
