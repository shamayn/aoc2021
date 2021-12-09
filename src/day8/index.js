const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  return rawInput.map((entry) => entry.split('|').map((el) => el.trim().split(' ')));
}

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const getPatterns = (pattern) => {
  var patternByLength = new Map();
  var configArr = new Array(7).fill('');
   // 0-7, from top to bottom, left to right
  //  0000
  // 1    2
  // 1    2
  //  3333
  // 4    5
  // 4    5
  //  6666

  pattern.forEach((p) => {
      if(!patternByLength.has(p.length)) {
        patternByLength.set(p.length, []);
      }
      patternByLength.get(p.length).push(p);
  }); 
  // console.log(patternByLength);

  var patternArr = new Array(10);
  patternArr[1] = patternByLength.get(2)[0];
  patternArr[4] = patternByLength.get(4)[0];
  patternArr[7] = patternByLength.get(3)[0];
  patternArr[8] = patternByLength.get(7)[0];

  configArr[0] = findDifference(patternArr[7], patternArr[1])[0]; // difference of 7 and 1
  // 4 plus top plus one more character => 9 (which has length six)
  var sixLengths = patternByLength.get(6).slice();
  sixLengths.filter((p, i) => {
    var diff = findDifference(p, patternArr[4] + configArr[0]);
    if (diff.length === 1) {
      configArr[6] = diff[0];
      patternArr[9] = p;
      sixLengths.splice(i, 1);
      return true;
    }
  });
  // to find bottom left, check the difference between 9 and 8
  configArr[4] = findDifference(patternArr[8], patternArr[9])[0];

  // to find top left and find 0
  patternArr[6] = sixLengths.filter((p, i) => {
    var diff = findDifference(p, patternArr[7] + configArr[6] + configArr[4]);
    if (diff.length === 1) {
      configArr[1] = diff[0];
      patternArr[0] = p;
    } else {
      return true;
    }
  })[0];

  // find middle
  configArr[3] = findDifference(patternArr[8], patternArr[0])[0];
  // find top right from 6
  configArr[2] = findDifference(patternArr[8], patternArr[6])[0];
  // last one
  configArr[5] = findDifference('abcdefg', configArr.toString())[0];

  // now find the last patterns for 3, 4, 5 which all have 5 segments

  patternArr[3] = patternArr[7] + configArr[3] + configArr[6];
  patternArr[2] = configArr[0] + configArr[2] + configArr[3] + configArr[4] + configArr[6];
  patternArr[5] = configArr[0] + configArr[1] + configArr[3] + configArr[5] + configArr[6];

  return patternArr.map((el) => el.split('').sort().join(''));
};

const findDifference = (p1, p2) => {
  var set2 = new Set(p2.split(''));
  const difference = p1.split('').filter(x => !set2.has(x));
  return difference;
}

const decodeOutputValues = (entry) => {
  const patternArr = getPatterns(entry[0]);
  const output = entry[1];
  outputVal = output.reduce((prev, curr, i, arr) => {
    const val = patternArr.indexOf(curr.split('').sort().join(''));
    return prev + (val * Math.pow(10, (arr.length - i - 1)));
  }, 0);
  return outputVal;
};

const goA = (input) => {
  // Digit: to number of segments
  // 0: 6 segments
  // 1: 2 segments
  // 2: 5 segments
  // 3: 5 segments
  // 4: 4 segments
  // 5: 5 segments
  // 6: 6 segments
  // 7: 3 segments
  // 8: 7 segments
  // 9: 6 segments
  var count1478 = input.reduce((prev, curr) => {
    let count = curr[1].reduce((p, c) => {
      return p + ((c.length === 2 || c.length === 4 || 
        c.length === 3 || c.length === 7) ? 1 : 0); 
    }, 0);
    return prev + count;
  }, 0);
  return count1478;
};

const goB = (input) => {
  return input.reduce((prev, curr) => {
    return prev + decodeOutputValues(curr);
  }, 0);
};

/* Tests */

test(goA(testInput), 26);
test(goB(testInput), 61229);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);