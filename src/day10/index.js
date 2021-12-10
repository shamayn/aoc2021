const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput.map((row) => row.split(''));

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const errorScoreMap = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
};

const delimiters = {
  '(': ')', 
  '[': ']', 
  '{': '}',
  '<': '>'
};

const autocompleteScoreMap = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4
};

const computeAutocompleteScore = (completionArray) => {
  return completionArray.reduce((prev, curr) => {
    return (prev * 5) + autocompleteScoreMap[curr];
  }, 0);
};

const checkLineSyntax = (line) => {
  var stackLeft = [];
  var errorScore = 0;
  line.forEach((delim) => {
    if (delim in delimiters) { // left delimiter
      stackLeft.push(delim);
    } else if (delim in errorScoreMap) { // right delimiter
      let comp = stackLeft.pop();
      if (delimiters[comp] !== delim) {
        // console.log(['Expected ', delimiters[comp], ' but found ', delim]);
        errorScore += errorScoreMap[delim];
      }
    }
  });
  return errorScore;
};

const goA = (input) => {
  return input.reduce((prev, curr) => {
    return prev + checkLineSyntax(curr);
  }, 0);
};

const autoComplete = (line) => {
  var stackLeft = [];
  var stackRight = [];
  line.forEach((delim) => {
    if (delim in delimiters) { // left delimiter
      stackLeft.push(delim);
    }
    else { // right delimiter
      stackLeft.pop();
    }
  });

  while (stackLeft.length > 0) {
    stackRight.push(delimiters[stackLeft.pop()]);
  }
  return computeAutocompleteScore(stackRight);
};

const goB = (input) => {
  const incompleteLines = input.filter((line) => checkLineSyntax(line) === 0);
  const scores = incompleteLines.map((line) => autoComplete(line));
  return scores.sort((a, b) => a - b)[(incompleteLines.length - 1) / 2];
};

/* Tests */

test(goA(testInput), 26397);
test(computeAutocompleteScore('}}]])})]'.split('')), 288957);
test(goB(testInput), 288957);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);