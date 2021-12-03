const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  return rawInput.map(
    row => row.split('').map(Number));
}

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const decimalReducer = (prev, curr, i, arr) => {
  return prev + (curr * Math.pow(2, arr.length-i-1));
};

// Returns most array and least array
const findMostAndLeast = (input) => {
  var sums = input.reduce((prev, curr) => {
    return prev.map((e, i) => e + curr[i]);
  });
  return [ sums.map(x => (x >= input.length/2) ? 1 : 0), 
    sums.map(x => (x < input.length/2) ? 1 : 0)];
}

const goA = (input) => {
  let gamma = 0;
  let epsilon = 0;
  var mostLeast = findMostAndLeast(input);
  gamma = mostLeast[0].reduce(decimalReducer, 0);
  epsilon = mostLeast[1].reduce(decimalReducer, 0);

  console.log('gamma: ' + gamma + ', epsilon: ' + epsilon);
  return gamma * epsilon;
};

// Returns most and least value at the nth position
const findMostAndLeastAtNthPos = (input, n) => {
  sum = input.map((el) => el[n]).reduce((prev, curr) => prev + curr);

  return [ (sum >= input.length/2) ? 1 : 0, 
    (sum < input.length/2 ? 1 : 0) ];
}

const calculateRatings = (inputArr, least) => {
  result = inputArr.slice();
  for (let i = 0; i < inputArr[0].length; i++) {
    filterVal = findMostAndLeastAtNthPos(result, i)[least]; // refactor to find max only
    result = result.filter((el) => el[i] === filterVal);
    if (result.length === 1) {
      return result;
    }
  }
};

const goB = (input) => {
  let oxygen = calculateRatings(input, 0)[0].reduce(decimalReducer, 0);
  let co2 = calculateRatings(input, 1)[0].reduce(decimalReducer, 0);
  
  console.log('oxygen: ' + oxygen + ', co2: ' + co2);
  return oxygen * co2;
};

/* Tests */

test(goA(testInput), 198);
test(goB(testInput), 230);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);