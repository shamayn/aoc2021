const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput;

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const goA = (input) => {
  return;
};

const goB = (input) => {
  return;
};

/* Tests */

// test(goA(testInput), expected);
// test(goB(testInput), expected);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);