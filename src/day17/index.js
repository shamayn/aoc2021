const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => { 
  return rawInput.slice(rawInput.indexOf('x')).split(', ').map((r) => {
    return r.slice(r.indexOf('=') + 1).split('..').map(Number);
  }); 
};

const input = prepareInput('target area: x=277..318, y=-92..-53');
const testInput = prepareInput('target area: x=20..30, y=-10..-5');

const between = (x, min, max) => {
  return x >= min && x <= max;
}

// Target range: [[x0, x1], [y0, y1]]
// Returns max y, accuracy (prev = -1, hit = 0, past = 1)
const fire = (velx, vely, xrange, yrange) => {
  var x = velx, y = vely; // first step
  var done = false;

  var maxy = 0;
  var accuracy = -1;
  while (true) {
    if (y > maxy) {
      maxy = y;
    }
    if (between(x, xrange[0], xrange[1]) &&
      between(y, yrange[0], yrange[1])) {
      accuracy = 0;
      break;
    }
    if (x > xrange[1]) {
      accuracy = 1;
      break;
    }
    if (velx === lastx && y < yrange[0]) {
      accuracy = -1;
      break;
    }
    var lastx = velx;
    velx = (velx === 0) ? 0 : (velx > 0 ? velx - 1 : velx + 1);
    vely -= 1;
    x += velx;
    y += vely; 
  }
  return [maxy, accuracy];
};

// On each step from [x, y]:
// The probe's x position increases by its x velocity.
// The probe's y position increases by its y velocity.
// Due to drag, the probe's x velocity changes by 1 toward the value 0; 
// that is, it decreases by 1 if it is greater than 0, 
// increases by 1 if it is less than 0, or does not change if it is already 0.
// Due to gravity, the probe's y velocity decreases by 1.
const doStep = (pos) => {
  var newx = pos[0] + pos[0], newy = pos[1] + pos[1];
  newx = (newx === 0) ? 0 : (newx > 0 ? newx - 1 : newx + 1);
  newy = newy - 1; 
  return [newx, newy];
};

const findInitialVelocities = (input) => {
  const xrange = input[0], yrange = input[1];
  var maxy = 0; 
  var hitcount = 0; 
  for (let i = 0; i <= xrange[1]; i++) {
    for (let j = yrange[0]; j <= xrange[1]; j++) {
      var res = fire(i, j, xrange, yrange);
      if (res[1] === 0) {
        hitcount++;
        if (res[0] > maxy) {
          maxy = res[0];
        }
      }
    }
  }

  return [maxy, hitcount];
};

/* Tests */

test(findInitialVelocities(testInput)[0], 45); // initial 6,9
test(findInitialVelocities(testInput)[1], 112);

/* Results */

console.time('Time');
const result = findInitialVelocities(input);
const resultA = result[0];
const resultB = result[1];
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);