type Data = string[][];

const galaxy = "#";

const getExpandedRowsAndCols = (data: Data) => {
  const expandedRows = new Set(
    data.map((_, i) => i).filter((i) => !data[i].includes(galaxy)),
  );

  const expandedCols = new Set(
    data[0]
      .map((_, i) => i)
      .filter((i) => data.every((row) => row[i] !== galaxy)),
  );

  return [expandedRows, expandedCols];
};

const getShortestPath = (
  [rowA, colA]: number[],
  [rowB, colB]: number[],
  expandedRows: Set<number>,
  expandedCols: Set<number>,
  expansionFactor: number,
) => {
  [rowA, rowB] = [Math.min(rowA, rowB), Math.max(rowA, rowB)];
  [colA, colB] = [Math.min(colA, colB), Math.max(colA, colB)];

  const rowDilationFactor = [...expandedRows].filter(
    (row) => row > rowA && row < rowB,
  ).length;

  const colDilationFactor = [...expandedCols].filter(
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

export const getSumOfShortestPaths = (data: Data, expansionFactor: number) => {
  const [expandedRows, expandedCols] = getExpandedRowsAndCols(data);
  const galaxyCoordinates = data
    .flatMap((row, i) => row.map((_, j) => [i, j]))
    .filter(([i, j]) => data[i][j] === galaxy);

  let sum = 0;
  for (let i = 0; i < galaxyCoordinates.length; i++) {
    for (let j = i + 1; j < galaxyCoordinates.length; j++) {
      sum += getShortestPath(
        galaxyCoordinates[i],
        galaxyCoordinates[j],
        expandedRows,
        expandedCols,
        expansionFactor,
      );
    }
  }
  return sum;
};
