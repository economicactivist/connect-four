/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7
const HEIGHT = 6

let currPlayer = 1 // active player: 1 or 2
let board = [] // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // const makeRows = new Array(WIDTH).fill(null)  [ended up being a bad idea]

  for (let i = 0; i < HEIGHT; i++) {
    // TODO: set "board" to empty HEIGHT x WIDTH matrix array
    board.push(Array.from({ length: WIDTH }))
  }
  console.log(board)
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board')
  /*this section creates a table row that can receive click events at the top
   of the table elememtn; the rest of the rows in table element won't be 
   clickable. Because this is the only row "drawn" and appended so far
   it will be appear at the top of the table*/
  const top = document.createElement('tr')
  top.setAttribute('id', 'column-top')
  //note that the event listener is added to entire row instead of individual cells (td's)
  top.addEventListener('click', handleClick)

  /*create cells for the top row and give an id to each cell, starting with zero and ending
   with 6.  Append these cells to the top table row */
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td')
    headCell.setAttribute('id', x)
    top.append(headCell)
  }
  htmlBoard.append(top)

  /* for each table row created, create and append seven cells.  Note that the
   id of each cell in rows below the "column-top" row have two numbers instead of one.
   The first number, represented by the "y" variable, indicates the row and the second, the "x", 
   indicaates the column. Confusingly, this causes "y" to precede "x" here and 
   throughout the script */
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr')
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td')
      cell.setAttribute('id', `${y}-${x}`)
      row.append(cell)
    }
    //append below "column-top"
    htmlBoard.append(row)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  /* TODO: start at the top and go down because it is easier to check the first true 
   case than the last true case */
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y
    }
  }

  /*if there there isn't a value at a row in the "x" column, return the row value. 
   otherwise, return null (which implies all rows have a value becuase the first row has a value) */
  return null
}

/** placeInTable: update DOM to place piece into HTML table of board */
/*using the x value from the click event and y value returned from the findSpotForCol
 function, create a div to be placed in the cell with the cooresponding y-x id */
function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let id = `${y}-${x}`
  const cellToFill = document.getElementById(id)
  const newPiece = document.createElement('div')
  newPiece.classList.add('piece', `p${currPlayer}`)
  //  newPiece.style.top = -50 * (y + 2);  doesn't appear to have any effect
  cellToFill.append(newPiece)
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get id of the cell from "#column-top"
  //what's the point of the "+" operator here?
  let x = +evt.target.id
  console.log(x)

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x)
  if (y === null) {
    return
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  //function only makes it this far if a row was found in board (the in-memory array)
  console.log(board[y][x])
  /*assign a value of "1" or "2" to the row that corresponds to the column extracted from
   evt.target.id */
  board[y][x] = currPlayer
  console.log(board)
  //now that there is both an x and y value, the DOM can be updated
  placeInTable(y, x)

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`)
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!')
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    /*Basically the upper and lower bounds of the arrays in the for loop (specifically,
     horiz, vert, diagDR, and diagDL) will extend beyond legal coordinates on some iterations */
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    )
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ]
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ]
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ]
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ]

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true
      }
    }
  }
}

makeBoard()
makeHtmlBoard()
