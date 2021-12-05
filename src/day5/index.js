const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  // format [[x, y], [x, y]]
  return rawInput.map((row) => row.split('->').map(
    (e) => e.trim().split(',').map(Number)));
};

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const findDimensions = (input) => {
  var x = input.reduce((prev, curr) => { 
    let rowmax = Math.max(curr[0][0], curr[1][0]);
    return (rowmax > prev) ? rowmax : prev;
  }, 0);
  var y = input.reduce((prev, curr) => { 
    let rowmax = Math.max(curr[0][1], curr[1][1]);
    return (rowmax > prev) ? rowmax : prev;
  }, 0);    
  return [x, y];
};

const isDiagonal = (start, end) => {
  return Math.abs(start[0] - end[0]) === Math.abs(start[1] - end[1]);
};

const countOverlaps = (input, includeDiagonals) => {
  console.log("Counting overlaps...");
  const dim = findDimensions(input);
  var points = new Array(dim[1] + 1).fill(0).map(() => new Array(dim[0] + 1).fill(0));
  let overlaps = 0;
  input.forEach((entry) => {
    let start = entry[0], end = entry[1];
    if (start[0] === end[0]) { // horizontal
      // e.g. (2, 2) (2, 1)
      for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); y++) {
        points[y][start[0]] += 1;
        if (points[y][start[0]] === 2) {
          overlaps += 1;
        }
      }
    } else if (start[1] === end[1]) { // vertical
      for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); x++) {
        points[start[1]][x] += 1;
        if (points[start[1]][x] === 2) {
          overlaps += 1;
        }
      }
    } else if (includeDiagonals && isDiagonal(start, end)) {
      var curr = start.slice();
      for (let i = 0; i <= Math.abs(start[0] - end[0]); i++) {
        points[curr[1]][curr[0]] += 1;
        if (points[curr[1]][curr[0]] === 2) {
          overlaps += 1;
        }
        curr[0] = (end[0] > curr[0]) ? curr[0] + 1 : curr[0] - 1;
        curr[1] = (end[1] > curr[1]) ? curr[1] + 1 : curr[1] - 1;
      }
    }
  });

  if (points.length <= 10) {
    visualizePoints(points);
  }

  return overlaps;
};

const goA = (input) => {
  return countOverlaps(input, false);
};

const visualizePoints = (points) => {
  points.forEach((row) => {
    console.log(row.reduce((prev, curr) => {
      return prev + (curr === 0 ? '.' : curr);
    }, ''));
  });
};

const goB = (input) => {
  return countOverlaps(input, true);
};

/* Tests */

test(goA(testInput), 5);
test(goB(testInput), 12);
test(isDiagonal([1, 1], [3, 3]), true);
test(isDiagonal([9, 7], [7, 9]), true);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);