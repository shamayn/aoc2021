const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput[0].trim().split(',').map(Number);

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

calculateFuelAtPos = (crabs, pos) => {
  return crabs.reduce((prev, curr) => {
    var fuel = Math.abs(curr - pos);
    //console.log('Move from ' + curr + ' to ' + pos + ': ' + fuel + ' fuel');
    return prev + fuel;
  }, 0);
}

calculateExpensiveFuelAtPos = (crabs, pos) => {
  return crabs.reduce((prev, curr) => {
    const n = Math.abs(curr - pos);
    var fuel = (n * (n + 1))/2;
    // console.log('Move from ' + curr + ' to ' + pos + ': ' + fuel + ' fuel');
    return prev + fuel;
  }, 0);
}

const goA = (input) => {
  var minFuel = 100000000000; // some large number
  for (let i = Math.min(...input); i < Math.max(...input); i++) {
    fuelAtPos = calculateFuelAtPos(input, i);
    if (fuelAtPos < minFuel) {
      minFuel = fuelAtPos;
    }
  }
  return minFuel;
};

const goB = (input) => {
  var minFuel = 100000000000;
  for (let i = Math.min(...input); i < Math.max(...input); i++) {
    fuelAtPos = calculateExpensiveFuelAtPos(input, i);
    if (fuelAtPos < minFuel) {
      minFuel = fuelAtPos;
    }
  }
  return minFuel;
};

/* Tests */

test(goA(testInput), 37);
test(goB(testInput), 168);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);