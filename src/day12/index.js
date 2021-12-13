const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  return rawInput.map((row) => row.split('-'));
};

const input = prepareInput(readInput('input.txt'));
const testInput1 = prepareInput([
  'start-A',
  'start-b',
  'A-c',
  'A-b',
  'b-d',
  'A-end',
  'b-end',
]);
const testInput2 = prepareInput([
'dc-end',
'HN-start',
'start-kj',
'dc-start',
'dc-HN',
'LN-dc',
'HN-end',
'kj-sa',
'kj-HN',
'kj-dc',
]);
const testInput3 = prepareInput(readInput('testinput.txt'));

// Visit small caves at most once, 
// and can visit big caves any number of times.
const canVisit0 = (node, path) => {
  if (node[0] === node[0].toUpperCase() || node === 'end') {
    return true; // Big caves can always be visited again
  }
  if (node === 'start' || path.indexOf(node) >= 0) {
    return false;
  }
  return true;
};

// Big caves can be visited any number of times, 
// a single small cave can be visited at most twice, 
// and the remaining small caves can be visited at most once.
// However, the caves named start and end can only be visited exactly once each: 
// once you leave the start cave, you may not return to it, 
// and once you reach the end cave, the path must end immediately.
const canVisit1 = (node, path) => {
  if (node[0] === node[0].toUpperCase() || node === 'end') {
    return true; // Big caves can always be visited again
  }
  if (node === 'start') {
    return false;
  }
  var visitedtwice = path.filter((n, i, arr) => 
    (n === n.toLowerCase() && 
      arr.indexOf(n) !== arr.lastIndexOf(n)));
  if (path.indexOf(node) >= 0 && visitedtwice.length > 0) {
    return false;
  }
  return true;
};

const countPaths = (input, visitRule) => {
  // first process input
  var adj = {};
  input.forEach((row) => {
    adj[row[0]] = adj[row[0]] || [];
    adj[row[0]].push(row[1]);
    adj[row[1]] = adj[row[1]] || [];
    adj[row[1]].push(row[0]);
  });

  var pqueue = []; // queue of paths
  var path = ['start'];
  pqueue.push(path.slice());

  var completedpaths = [];
  while (pqueue.length > 0) {
    path = pqueue.shift(); // first path in the queue
    var last = path[path.length - 1];
    if (last === 'end') {
      completedpaths.push(path);
    } else {
      var adjacents = adj[last].filter((node) => {
        if (visitRule === 1) {
          return canVisit1(node, path);
        } else {
          return canVisit0(node, path);
        }
      });
      adjacents.forEach((node) => {
        var newpath = path.slice();
        newpath.push(node);
        pqueue.push(newpath);
      })     
    }
  }
  return completedpaths.length;
};

const goA = (input) => {
  return countPaths(input, 0);
};

const goB = (input) => {
  return countPaths(input, 1);
};

/* Tests */

test(goA(testInput1), 10);
test(goA(testInput2), 19);
test(goA(testInput3), 226);
test(goB(testInput1), 36);
test(goB(testInput2), 103);
test(goB(testInput3), 3509);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);