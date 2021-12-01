const { test, readInput } = require("../utils")

const prepareInput = (rawInput) => {
  return rawInput.trim().split('\n').map(Number);
};

const input = prepareInput(readInput("input.txt"))
const testInput = prepareInput(readInput("testinput.txt"))

const goAtrad = (input) => {
  console.log('Counting depth measurement increases...')
  let count = 0;
  for (let i=1; i < input.length; ++i) {
    if (input[i] > input[i-1]) {
      count += 1;
    }
  }
  return count;
};

const goA = (input) => {
  console.log('Counting depth measurement increases using filter function...')

  result = input.filter((el, i, arr) => el < arr[i+1] && !isNaN(el));
  return result.length;
};

const goBtrad = (input) => {
  console.log('Summing 3 measurement windows and counting increases...')
  let count = 0;
  for (let i=1; i <= input.length-2; i++) {
    sumA = input[i-1] + input[i] + input[i+1];
    sumB = input[i] + input[i+1] + input[i+2];
    if (sumB > sumA) {
      count++;
    }
  }
  return count;
};

const goB = (input) => {
  console.log('Summing 3 measurement windows and counting increases using filter function...')
  result = input.map((el, i, arr) => el + arr[i+1] + arr[i+2]);
  return goA(result);
};

/* Tests */

test(goA(testInput), 7);
test(goB(testInput), 5)

/* Results */

console.time("Time")
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd("Time");

console.log("Solution to part 1:", resultA);
console.log("Solution to part 2:", resultB);