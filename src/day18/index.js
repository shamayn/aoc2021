const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  return rawInput.map((row) => {
    return JSON.parse(row);
  });
};

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const calcMagnitude = (input) => {
  if (!Array.isArray(input)) {
    return input;
  }
  return 3 * calcMagnitude(input[0]) + 2 * calcMagnitude(input[1]);
};

const addandreduce = (prev, curr) => {
  var pair = [prev, curr];
  var result = reduce(pair);
  return result;
};

class Node {
  constructor() {
    this.val = null;
    this.left = null;
    this.right = null;
    this.level = 0;
  }
}

// Helper function to allocate a new node
// with the given data
const newNode = (val, level) => {
    var node = new Node();
    node.val = val;
    node.id = -1;
    node.left = null;
    node.right = null;
    node.level = level;
    return node;
};

const reduce = (pair) => {
  var leaves = [];
  var root = buildTree(pair, 0, leaves);
  var actioncount = -1;
  while (actioncount !== 0) {
    actioncount = explodeReduce(root, leaves, 0);
    if (actioncount === 0) {
      actioncount = splitReduce(root, leaves, 0);
    }
    updateTreeVal(root);
  } 
  return root.val;
};

const buildTree = (pair, level, leaves) => {
  var node = newNode(pair, level);
  if (typeof node.val === 'number') {
    leaves.push(node);
    node.id = leaves.length - 1;
    return node;
  }
  node.left = buildTree(pair[0], level+1, leaves);
  node.right = buildTree(pair[1], level+1, leaves);
  return node;
};

const updateTreeVal = (node) => {
  if (node === null) {
    return null;
  }
  var left = updateTreeVal(node.left);
  var right = updateTreeVal(node.right);
  if (left === null && right === null) {
    return node.val;
  }
  node.val = [left, right];
  return node.val;
};

const explodeReduce = (node, leaves, actioncount) => {
  // console.log('updateLeaves', (node === null) ? null : node.val, 'actioncount', actioncount);
  if (node === null) {
    return actioncount;
  }
  if (node.left === null && node.right === null) {
    return actioncount;
  }
  if (actioncount > 0) {
    return actioncount;
  }
  actioncount = explodeReduce(node.left, leaves, actioncount);
  if (node.left !== null && node.right !== null &&
    !Array.isArray(node.left.val) && !Array.isArray(node.left.val) && 
    node.level === 4 && actioncount === 0) {
      var leftval = node.left.val;
      var rightval = node.right.val;
      node.val = 0;
      node.id = node.left.id; 
      var leftindex = leaves.indexOf(node.left);
      if (leftindex > 0) {
        leaves[leftindex - 1].val += leftval;
      }
      if (leftindex + 2 < leaves.length) {
        leaves[leftindex + 2].val += rightval;
      }
      leaves.splice(leftindex, 2, node);
      node.left = null;
      node.right = null;
      actioncount++;
      return actioncount;
  }
  actioncount = explodeReduce(node.right, leaves, actioncount);
  node.val = [node.left.val, node.right.val];
  return actioncount;
};

const splitReduce = (node, leaves, actioncount) => {
  if (node === null) {
    return actioncount;
  }
  if (node.left === null && node.right === null) {
    return actioncount;
  }
  if (actioncount > 0) {
    return actioncount;
  }
  actioncount = splitReduce(node.left, leaves, actioncount);
  if ((node.left.val >= 10 || node.right.val >= 10) && actioncount === 0) {
      // e.g. 13 => [5, 6]
      // this node becomes a parent node
      const splitleft = (node.left.val > 9) ? true : false;
      var splitnode = splitleft ? node.left : node.right;
      const splitindex = leaves.indexOf(splitnode);

      splitnode.left = newNode(Math.floor(splitnode.val / 2), splitnode.level + 1);
      splitnode.right = newNode(Math.round(splitnode.val / 2), splitnode.level + 1);
      splitnode.left.id = splitnode.id;
      splitnode.right.id = Math.max(...leaves.map((x) => x.id)) + 1;
      splitnode.val = [splitnode.left.val, splitnode.right.val];
      splitnode.id = -1;
      if (splitleft) {
        node.left = splitnode;
      } else {
        node.right = splitnode;
      }
      node.val = [node.left.val, node.right.val];

      leaves.splice(splitindex, 1, splitnode.left, splitnode.right);
      actioncount++;
      return actioncount;
  }
  actioncount = splitReduce(node.right, leaves, actioncount);
  node.val = [node.left.val, node.right.val];
  return actioncount;
};

const finalSum = (input) => {
  var result = input.reduce((prev, curr) => 
    addandreduce(prev, curr));
  return result;
};

const goA = (input) => {
  return calcMagnitude(finalSum(input));
};

const goB = (input) => {
  var max = 0;
  input.forEach((row, i) => {
    input.forEach((row2, j) => {
      if (i != j) {
        var rowmax = Math.max(calcMagnitude(addandreduce(row, row2)),
          calcMagnitude(addandreduce(row, row2)));
        if (rowmax > max) {
          max = rowmax;
        }
      }
    })
  });
  return max;
};

/* Tests */
test(calcMagnitude([[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]), 3488);
test(JSON.stringify(reduce([[[[[9,8],1],2],3],4]), 1), JSON.stringify([[[[0,9],2],3],4]));
test(JSON.stringify(reduce([7,[6,[5,[4,[3,2]]]]])), JSON.stringify([7,[6,[5,[7,0]]]]));
test(JSON.stringify(reduce([[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]])), JSON.stringify([[[[0,7],4],[[7,8],[6,0]]],[8,1]]));
test(JSON.stringify(reduce([[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]])), JSON.stringify([[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]));
test(goA(testInput), 4140);
test(goB(testInput), 3993);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);