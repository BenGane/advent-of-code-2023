import { readFile } from "fs/promises";
import { join } from "path";
import { it } from "vitest";

type Data = { springs: string[], damagedSpringGroups: number[] }[];

const damaged = '#';
const unknown = '?';
const operational = '.';

const getCombinations = (springs: string[], currentCombination: string[] = [], index = 0, combinations: string[][] = [])=> {
  while (index < springs.length && springs[index] !== unknown) {
    currentCombination.push(springs[index++]);
  }
  
  if (index == springs.length) {
    combinations.push([...currentCombination]);
    return combinations;
  } 

  getCombinations(springs, [...currentCombination, damaged], index + 1, combinations);   
  getCombinations(springs, [...currentCombination, operational], index + 1, combinations);   

  return combinations;
}

const getNumberOfPossibleArrangements = ({ springs, damagedSpringGroups }: Data[number]) => {
  const combinations = getCombinations(springs);
  return combinations.map((combination) => combination.join("").split(".").filter(Boolean).map((segment) => segment.length)).reduce((total, combination) => {
    return total + (combination.length === damagedSpringGroups.length && combination.every((_, index) => combination[index] === damagedSpringGroups[index]) ? 1 : 0);
  }, 0)
}

const getSumOfAllPossibleArrangements = (data: Data) => {
  return data.reduce((total, entry) => total + getNumberOfPossibleArrangements(entry), 0)
};

const parseInputFile = async () => {
  const input = await readFile(join(__dirname, "1.input.txt"), "utf-8");

  return input.split("\n").map((line) => {
    const segments = line.split(" ");
    const springs = [...segments[0]];
    const damagedSpringGroups = segments[1].split(",").map(Number);
    return { springs, damagedSpringGroups };
  });
};

it("works", async () => {
  const data = await parseInputFile();
  const result = getSumOfAllPossibleArrangements(data);

  console.log(result);
});
