const { test, readInput } = require('../utils');

const prepareInput = (rawInput) => rawInput;

const input = prepareInput(readInput('input.txt'));
const testInput = prepareInput(readInput('testinput.txt'));

const readBoards = (input) => {
  boardList = input.slice(2);
  boards = [];
  while (boardList.length > 0) {
    boards.push(boardList.slice(0, 5).map(
      (el) => el.split(' ').filter((x) => x != '').map(Number)));
    boardList = boardList.slice(6);
  }
  console.log('Read ' + boards.length + ' boards');
  return boards;
};

const markBoard = (board, mboard, drawnum) => {
  var markB = mboard.slice();
  board.forEach((row, i) =>  {
    if (row.indexOf(drawnum) > -1) {
      markB[i][row.indexOf(drawnum)] = 1;
    }
  });
  return markB;
}

const sumUnmarked = (board, markBoard) => {
  var markB = markBoard.slice();
  var sum = 0;
  for (var row = 0; row < 5; row++) {
    count = markB[row].reduce((prev, curr, i) => { 
      return prev + (1-curr) * board[row][i];
    }, 0 );
    sum += count;
  }
  return sum;
}

const isWinner = (markBoard) => {
  var horiz = markBoard.filter(
    (row) => row.reduce((prev, curr) => prev + curr, 0) === 5);
  if (horiz.length > 0) { return true };
  // check vertical
  var vertical = markBoard.reduce((prev, curr) => {
    return prev.map((e, i) => e + curr[i]);
  });
  if (vertical.indexOf(5) >= 0) { return true; }
}

const playBingo = (input, first) => {
  console.log('Finding bingo winner...');
  var sum = 0, winner = 0;

  var draws = input[0].trim().split(',').map(Number);
  var boards = readBoards(input);
  var marks = [];
  for (let i = 0; i < boards.length; i++) {
    marks.push(new Array(5).fill(0).map(() => new Array(5).fill(0)));
  }

  var winners = new Set();

  drawloop:
    for (let d = 0; d < draws.length; d++) {
      // mark and check all boards
  boardloop:
     for (let b = 0; b < boards.length; b++) {
      marks[b] = markBoard(boards[b], marks[b], draws[d]);
      if (isWinner(marks[b])) {
        sum = sumUnmarked(boards[b], marks[b]);
        winner = draws[d];

        if (first === true) {
          break drawloop;
        } else {
          winners.add(b);
          if (winners.size === boards.length) {
            // last to win
            break drawloop;
          }
        }
      }
     }
    }
  console.log('Sum ' + sum + ' on draw ' + winner);
  return sum * winner;
}

const goA = (input) => {
  return playBingo(input, true);
};

const goB = (input) => {
  return playBingo(input, false);
};

/* Tests */

test(goA(testInput), 4512);
test(goB(testInput), 1924);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);