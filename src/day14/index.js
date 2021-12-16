const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  var start = rawInput[0].trim().split('');
  var rules = new Map();
  rawInput.slice(2).forEach((r) => {
    var rule = r.split(' -> ');
    rules.set(rule[0], rule[1]);
  });
  return [ start, rules ];
}
const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

// Part 1 helper function: build out the whole polymer string
const doStep = (start, rules) => {
  var result = [];

  var shiftby = 0;
  for (let i = 0; i < start.length - 1; i++) {
    var pair = start.slice(i, i+2);
    result.push(pair[0]);
    if (rules.has(pair.join(''))) {
      result.push(rules.get(pair.join('')));
    }
  }
  result.push(start[start.length - 1]);
  return result;
};

const countDiff = (polymer) => {
  var counts = new Map();
  polymer.forEach((el) => {
    var count = counts.has(el) ? counts.get(el) : 0;
    counts.set(el, count + 1);
  });
  return Math.max(...counts.values()) - Math.min(...counts.values());
};

const goA = (input) => {
  var start = input[0];
  const rules = input[1];
  for (let i = 0; i < 10; i++) {
    start = doStep(start, rules);
  }
  return countDiff(start);
};

class Node {
  constructor() {
    this.val = [];
    this.left = null;
    this.right = null;
    this.level = 0;
  }
}

// Helper function to allocate a new node
// with the given data
const newNode = (pair, level) => {
    var node = new Node();
    node.val = pair;
    node.left = null;
    node.right = null;
    node.level = level;
    return node;
};

const addMaps = (map1, map2) => {
  if (map1 === null) {
    return new Map(map2);
  }
  var result = new Map(map1);
  if (map2 === null) {
    return result;
  }
  map2.forEach((val, key) => {
    var value = result.has(key) ? result.get(key) + map2.get(key) : map2.get(key);
    result.set(key, value);
  }) 
  return result;
};

// Recursive function for part 2. 
// Improves performance by using tree traversal with memoization.
// root is a pair e.g. ['N', 'N']
const getCounts = (root, rules, cache) => {

  if (root === null || root.level >= 40) { // root.height === 40?
    return null;
  }
  const cachekey = root.val.join('') + root.level;
  if (cache.has(cachekey)) {
    return cache.get(cachekey);
  }
  var thisMap = new Map();

  if (rules.has(root.val.join(''))) {
    var insert = rules.get(root.val.join(''));
    root.left = newNode([root.val[0], insert], root.level + 1);
    root.right = newNode([insert, root.val[1]], root.level + 1);
    thisMap.set(insert, 1);
  }

  var nodeCounts = addMaps(getCounts(root.left, rules, cache), getCounts(root.right, rules, cache));

  const result = addMaps(thisMap, nodeCounts);
  cache.set(cachekey, result);
  return result;
};

const goB = (input) => {
  const start = input[0];
  const rules = input[1];
  var counts = new Map();
  var cache = new Map();
  start.forEach((el) => counts.set(el, (counts.has(el) ? counts.get(el) + 1 : 1)));

  var length = start.length;
  for (let i = 0; i < start.length - 1; i++) {
    var pair = newNode(start.slice(i, i+2), 0);
    counts = addMaps(counts, getCounts(pair, rules, cache));
  }
  return Math.max(...counts.values()) - Math.min(...counts.values());
};

/* Tests */

test(goA(testInput), 1588);
test(goB(testInput), 2188189693529);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);