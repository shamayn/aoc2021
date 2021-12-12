const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput.map((row) => row.split('').map(Number));

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const findAdjacentPoints = (input, point) => { // point in [x,y]
  var adjpoints = [];
  for (let i = ((point[0] === 0) ? 0 : point[0] - 1); 
    i <= ((point[0] === input.length - 1) ? input.length - 1 : point[0] + 1); i++) {
     for (let j = ((point[1] === 0) ? 0 : point[1] - 1); 
      j <= ((point[1] === input[0].length - 1) ? input[0].length - 1 : point[1] + 1); j++) {
        if (!(i === point[0] && j === point[1])) {
          adjpoints.push([i, j]);
        }
     }
  }
  return adjpoints;
};

const doStep = (input) => {
  var flashCount = 0;
  var flashers = []; // coordinates of all the flashers

  // increment
  var result = input.map((row, i) => row.map((el, j) => {
    if (el === 9) {
      flashers.push([i, j]);
    }
    return el + 1;
  }));

  while (flashers.length > 0) {
    var flashpoint = flashers.pop();
    var adjpoints = findAdjacentPoints(result, flashpoint);
    adjpoints.forEach((p) => {
      result[p[0]][p[1]] += 1;
      if (result[p[0]][p[1]] === 10) {
         flashers.push(p);
      }
    });
  }

  result = result.map((row) => 
    row.map((el) => {
      if (el > 9) {
        flashCount += 1;
      }
      return (el > 9 ? 0 : el);
    }));

  // console.log(result.map((row) => row.join('')).join('\n'));

  return [result, flashCount];
};

const goA = (input) => {
  var flashCount = 0;
  for (let i = 0; i < 100; i++) {
    let count = 0;
    [ input, count ] = doStep(input);
    flashCount += count;
  }
  return flashCount;
};

const isSimultaneous = (input) => {
  var first = input[0][0];
  for (row of input) {
    for (el of row) {
      if (el != first) {
        return false;
      }
    }
  }
  return true;
};

const goB = (input) => {
  var levels = input.slice();
  var step = 0;
  while (!isSimultaneous(levels)) {
    step += 1;
    [ levels, count ] = doStep(levels);
  }
  return step;
};

/* Tests */

test(goA(testInput), 1656);
test(goB(testInput), 195);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);