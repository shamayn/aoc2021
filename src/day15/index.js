const { test, readInput } = require('../utils');
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');

const prepareInput = (rawInput) => {
  return rawInput.map(
    row => row.split('').map(Number));
}

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const findAdjacentPoints = (input, point) => { // point in [x,y]
  var adjpoints = [];
  if (point[0] < input.length - 1) {
    adjpoints.push([point[0] + 1, point[1]]);
  }
  if (point[1] < input[0].length - 1) {
    adjpoints.push([point[0], point[1] + 1]);
  }
  if (point[1] > 0) {
    adjpoints.push([point[0], point[1] - 1]);
  }
  if (point[0] > 0) {
    adjpoints.push([point[0] - 1, point[1]]);
  }
  return adjpoints;
};

const getKey = (point) => point[0] + ',' + point[1];

const calculateLeastRisk = (input, start) => {
  var settled = new Set();
  var pq = new goog.structs.PriorityQueue();
  var distances = new Array(input.length).fill(Number.MAX_VALUE).map(() => 
    new Array(input[0].length).fill(Number.MAX_VALUE));

  const end = [input.length - 1, input[0].length - 1];
  distances[start[0]][start[1]] = 0;
  pq.enqueue(0, getKey(start));
  var v = start;
  while (settled.size !== (input.length * input[0].length)) {
    if (pq.size === 0) {
      break;
    }
    var vkey = pq.dequeue();
    v = vkey.split(',').map(Number);

    if (settled.has(vkey)) {
      continue;
    }
    settled.add(vkey);

    var adjpoints = findAdjacentPoints(input, v);
    adjpoints.forEach((p) => {
      var d = distances[v[0]][v[1]] + input[p[0]][p[1]];
      if (d < distances[p[0]][p[1]]) {
        distances[p[0]][p[1]] = d;
        pq.enqueue(d, getKey(p));
      }
    })
  }
  return distances;
}

const goA = (input) => {
  const distances = calculateLeastRisk(input, [0,0]);
  return distances[input.length-1][input[0].length-1];
};

const assembleTiles = (input) => {
  var tile = input;
  var result = getTileRow(input);
  for (var i = 0; i < 4; i++) {
    tile = tile.map(row => {
      return row.map(el => (el === 9) ? 1 : el + 1);
    });
    result = result.concat(getTileRow(tile));
  }
  // prettyPrint(result);
  return result;
};

const getTileRow = (startTile) => {
  var tile = startTile;
  var tiles = [startTile];
  var tilerow = startTile;
  for (var i = 0; i < 4; i++) {
    tile = tile.map(row => {
      return row.map(el => (el === 9) ? 1 : el + 1);
    });
    tiles.push(tile);
  }
  tilerow = tilerow.map((row, rowindex) => {
    for (let i = 1; i < tiles.length; i++) {
      row = row.concat(tiles[i][rowindex]);
    }
    return row;
  });
  return tilerow;
};

const prettyPrint = (grid) => {
  grid.forEach((row) => {
    console.log(row.join(' '));
  });
};

const goB = (input) => {
  var tiles = assembleTiles(input);
  const distances = calculateLeastRisk(tiles, [0,0]);
  return distances[tiles.length - 1][tiles[0].length - 1];
};

/* Tests */

test(goA(testInput), 40);
test(goB(testInput), 315);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);