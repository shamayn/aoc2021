const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => {
  return rawInput.map(
    row => row.split(' ')).map(([dir, x]) => [dir, Number(x)]);
};

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const handleUpDown = (value, dir, x) => {
  if (dir === 'down') {
    value += x;
  } else if (dir === 'up') {
    value -= x;
  }
  return value;
};

const goA = (input) => {
  const result = input.reduce(
      ({depth, hpos}, [dir, x]) => ({
        depth: handleUpDown(depth, dir, x),
        hpos: dir === 'forward' ? hpos + x : hpos,
      }),
      {depth: 0, hpos: 0} // initial value
  );
  
  console.log('depth: ' + result.depth + ' hpos: ' + result.hpos);
  return result.depth * result.hpos;
};

const goB = (input) => {
  const result = input.reduce(
      ({depth, hpos, aim}, [dir, x]) => ({
        aim: handleUpDown(aim, dir, x),
        hpos: dir === 'forward' ? hpos + x : hpos,
        depth: dir === 'forward' ? depth + (aim * x) : depth,
      }),
      {depth: 0, hpos: 0, aim: 0} // initial value
  );

  console.log('depth: ' + result.depth + ' hpos: ' + result.hpos + ' aim: ' + result.aim);
  return result.depth * result.hpos;
};

/* Tests */

test(goA(testInput), 150);
test(goB(testInput), 900);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);