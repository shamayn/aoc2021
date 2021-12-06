const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput[0].trim().split(',').map(Number);

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const simulateFishUsingSums = (fishArr, numDays) => {
  var fishSums = new Array(9).fill(0);
  for (const fish of fishArr) {
    fishSums[fish] += 1;
  }
  for (let d = 0; d < numDays; d++) {
    
    var newfishSums = new Array(9).fill(0);
    // 0 -> 6 and 8
    // 1-8 goes to one less
    for (let i = 1; i < fishSums.length; i++) {
      newfishSums[i - 1] += fishSums[i];
    }
    newfishSums[8] = fishSums[0];
    newfishSums[6] += fishSums[0];
    fishSums = newfishSums.slice();
  }
  return fishSums.reduce((prev, curr) => prev + curr, 0);
}

const goA = (input) => {
  return simulateFishUsingSums(input, 80);
};

const goB = (input) => {
  return simulateFishUsingSums(input, 256);
};

/* Tests */

test(simulateFishUsingSums(testInput, 18), 26);
test(goA(testInput), 5934);
test(goB(testInput), 26984457539);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);