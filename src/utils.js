const { sep } = require("path");
const { readFileSync } = require("fs");
const getCallerFile = require("get-caller-file");
const { isDeepStrictEqual } = require("util");
const kleur = require("kleur");
const { curry } = require("@arrows/composition");

const readInput = (filename) => {
  const file = getCallerFile()
    .split(sep)
    .slice(0, -1)
    .concat(filename)
    .join(sep);

  return readFileSync(file).toString().trim().split('\n');
}

let index = 0;

const test = curry((result, expected) => {
  const passed = isDeepStrictEqual(result, expected);

  if (passed) {
    console.log(kleur.green(`Test ${index}: passed`));
  } else {
    console.log(kleur.gray("-----------------------------------------"));
    console.log(kleur.red(`${index}: failed`));
    console.log(kleur.gray("\nResult:"));
    console.dir(result, { colors: true, depth: 0 });
    console.log(kleur.gray("\nExpected:"));
    console.dir(expected, { colors: true, depth: 0 });
    console.log(kleur.gray("-----------------------------------------"));
  }

  index++;
})

module.exports = { test, readInput };
