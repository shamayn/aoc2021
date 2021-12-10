const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput.map((el) => el.split('').map(Number));

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const findLowPoints = (input) => {
  var lowpointvals = [];
  var lowpointcoords = [];
  input.forEach((row, rowindex) => {
     row.forEach((pointval, pointindex) => {
      var adjpoints = findAdjacentPoints(input, [rowindex, pointindex]);
      if (Math.min(...adjpoints[0]) > pointval) {
        lowpointvals.push(pointval);
        lowpointcoords.push([rowindex, pointindex]);
      }
    });   
  });
  return [lowpointvals, lowpointcoords];
};

const goA = (input) => {
  const lowpointvals = findLowPoints(input)[0];
  return lowpointvals.reduce((prev, curr) => prev + curr + 1, 0);
};

const findAdjacentPoints = (input, point) => { // point in [x,y]
  var adjpointvals = [];
  var adjpointcoords = [];
  for (let i = ((point[0] === 0) ? 0 : point[0] - 1); 
    i <= ((point[0] === input.length - 1) ? input.length - 1 : point[0] + 1); i++) {
     for (let j = ((point[1] === 0) ? 0 : point[1] - 1); 
      j <= ((point[1] === input[0].length - 1) ? input[0].length - 1 : point[1] + 1); j++) {
        if ((i === point[0] || j === point[1]) && !(i === point[0] && j === point[1])) {
          adjpointvals.push(input[i][j]);
          adjpointcoords.push([i, j]);
        }
     }
  }
  return [adjpointvals, adjpointcoords];
};

const calculateBasinCount = (input, lowpoint) => {
  var pointQueue = [lowpoint];
  var visited = new Array(input.length).fill(0).map(() => new Array(input[0].length).fill(0));
  while (pointQueue.length > 0) {
    let point = pointQueue.pop();
    visited[point[0]][point[1]] = 1;
    const adjpoints = findAdjacentPoints(input, point);
    const result = adjpoints[1].filter((el) => {
      return (input[el[0]][el[1]] !== 9 && !visited[el[0]][el[1]]);
    });
    if (result.length !== 0) {
      pointQueue.push(...result);
    }
  }

  return visited.reduce((prev, curr) => {
    return prev + curr.reduce((p, c) => p + c, 0);
  }, 0);
};

const goB = (input) => {
  const lowpointcoords = findLowPoints(input)[1];
  var basinCounts = [];
  lowpointcoords.forEach((el) => basinCounts.push(calculateBasinCount(input, el)));
  return basinCounts.sort((a, b) => b - a).slice(0, 3).reduce((prev, curr) => prev * curr, 1);
};

/* Tests */

test(goA(testInput), 15);
test(goB(testInput), 1134);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);