const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  const div = rawInput.indexOf('');
  var xlen = 0, ylen = 0;
  const dots = rawInput.slice(0, div).map((d) => {
    var dotpair = d.split(',').map(Number);
    if (dotpair[0] > xlen) {
      xlen = dotpair[0];
    }
    if (dotpair[1] > ylen) {
      ylen = dotpair[1];
    }
    return dotpair;   
  });

  var dotArray = new Array(ylen + 1).fill(0).map(() => 
    new Array(xlen + 1).fill(0));
  dots.forEach((d) => {
    dotArray[d[1]][d[0]] = 1;
  });
  const folds = rawInput.slice(div + 1).map((f) => {
    var fpair = f.slice(11).split('=');
    fpair[1] = Number(fpair[1]);
    return fpair;
  });
  return [dotArray, folds];
}

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const drawPaper = (dotArray) => {
  var count = 0;
  dotArray.forEach((row) => {
    console.log(row.reduce((prev, curr) => {
      return prev + (curr === 0 ? '.' : '#');
    }, ''));
  });
  return count;
};

const doFold = (dotArray, fold) => {
  var newArray = [];
  var dotCount = 0;

  if (fold[0] === 'y') {
    newArray = dotArray.slice(0, fold[1]).map((row, i) => row.map((el, j) => {
     var newval = (el === 1 || dotArray[dotArray.length - i - 1][j] === 1) ? 1 : 0;
     if (newval === 1) {
      dotCount += 1;
     }
     return newval;
    }));
  } else if (fold[0] === 'x') {
    newArray = dotArray.map((row, i) => {
      return row.slice(0, fold[1]).map((el, j) => {
        var newval = (el === 1 || dotArray[i][dotArray[0].length - j - 1]) ? 1 : 0;
        if (newval === 1) {
          dotCount += 1;
        }
        return newval;
      });
    });
  }
  return [newArray, dotCount];
};

const goA = (input) => {
  // fold once
  var foldres = doFold(input[0], input[1][0]);
  return foldres[1];
};

const goB = (input) => {
  var dotInput = input[0];
  const folds = input[1];

  folds.forEach((fold) => {
    var foldres = doFold(dotInput, fold);
    dotInput = foldres[0];
  });
  drawPaper(dotInput);
};

/* Tests */

test(goA(testInput), 17);
goB(testInput), 0;

/* Results */

console.time('Time');
const resultA = goA(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:');
goB(input);