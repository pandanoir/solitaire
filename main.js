var Immutable = require('immutable');
var NONE = 0;
var PIECE = 1;
var EMPTY = 2;

var englishBoard = Immutable.fromJS([
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
]);
var frenchBoard = Immutable.fromJS([
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
    [NONE, PIECE, PIECE, PIECE, PIECE, PIECE, NONE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [PIECE, PIECE, PIECE, PIECE, PIECE, PIECE, PIECE],
    [NONE, PIECE, PIECE, PIECE, PIECE, PIECE, NONE],
    [NONE, NONE, PIECE, PIECE, PIECE, NONE, NONE],
]);
var gameStatus = frenchBoard;
gameStatus = dig(gameStatus, 3, 3);
console.log(solve(gameStatus, getPieces(gameStatus)));
function solve(board, piece) {
    if (piece === 1) {
        return [];
    }
    var status = board;
    for (var i = 0, _i = board.size; i < _i; i = 0 | i + 1) {
        for (var j = 0, _j = board.get(i).size; j < _j; j = 0 | j + 1) {
            if (board.getIn([i, j]) !== PIECE) {
                continue;
            }
            var possibleDirection = getPossibleDirection(board, j, i);
            var directions = ['left', 'right', 'up', 'down'];
            for (var d = 0, _d = directions.length; d < _d; d = 0 | d + 1) {
                if (!possibleDirection[directions[d]]) {
                    continue;
                }
                var res = solve(move(board, j, i, directions[d]), piece - 1);
                if (!Immutable.List.isList(res)) {
                    // succeeded
                    res.push(['(' + j + ', ' + i + ')', directions[d]]);
                    return res;
                }
            }
        }
    }
    return board;
}
function getPossibleDirection(board, a, b) {
    var possibleDirection = {
        left: false,
        right: false,
        up: false,
        down: false
    };
    if (board.getIn([b, a]) !== PIECE) return possibleDirection;
    var width = board.get(0).size;
    var height = board.size;
    if (a - 2 >= 0 &&
        board.getIn([b, a - 1]) === PIECE && board.getIn([b, a - 2]) === EMPTY)
         possibleDirection.left = true;

    if (a + 2 < width &&
        board.getIn([b, a + 1]) === PIECE && board.getIn([b, a + 2]) === EMPTY)
         possibleDirection.right = true;

    if (b - 2 >= 0 &&
        board.getIn([b - 1, a]) === PIECE && board.getIn([b - 2, a]) === EMPTY)
         possibleDirection.up = true;

    if (b + 2 < height &&
        board.getIn([b + 1, a]) === PIECE && board.getIn([b + 2, a]) === EMPTY)
         possibleDirection.down = true;

    return possibleDirection;
}
function move(board, a, b, direction) {
    var possibleDirection = getPossibleDirection(board, a, b);
    var res = board;
    if (possibleDirection[direction] === false) return false; // cannot move
    res = res.setIn([b, a], EMPTY);
    if (direction === 'left') {
        res = res.setIn([b, a - 1], EMPTY);
        res = res.setIn([b, a - 2], PIECE);
    }
    if (direction === 'right') {
        res = res.setIn([b, a + 1], EMPTY);
        res = res.setIn([b, a + 2], PIECE);
    }
    if (direction === 'up') {
        res = res.setIn([b - 1, a], EMPTY);
        res = res.setIn([b - 2, a], PIECE);
    }
    if (direction === 'down') {
        res = res.setIn([b + 1, a], EMPTY);
        res = res.setIn([b + 2, a], PIECE);
    }
    return res;
}
function dig(board, a, b) {
    return board.setIn([b, a], EMPTY);
}
function getPieces(board) {
    var piece = 0;
    for (var i = 0, _i = board.size; i < _i; i = 0 | i + 1) {
        for (var j = 0, _j = board.get(i).size; j < _j; j = 0 | j + 1) {
            if (board.getIn([i, j]) === PIECE) piece = 0 | piece + 1;
        }
    }
    return piece;
}
function showBoard(board) {
    var res = '';
    var status = [' ■', ' O', '  '];
    for (var i = 0, _i = board.size; i < _i; i = 0 | i + 1) {
        for (var j = 0, _j = board.get(i).size; j < _j; j = 0 | j + 1) {
            res += status[board.getIn([i, j])];
        }
        res += '\n';
    }
    return res;
}
