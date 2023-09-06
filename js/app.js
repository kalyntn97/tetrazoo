import tetrominos from './data.js'
/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
let currentT, nextT
let TSequence = []
let playBoard 
let lockedT = []
// const frameDuration = 100

/*------------------------ Cached Element References ------------------------*/
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const board = document.querySelector('.board')
const preview = document.querySelector('.preview')

/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('DOMContentLoaded', init)
// startBtn.addEventListener('click', gameLoop)
// stopBtn.addEventListener('click', gameOver)
document.addEventListener('keydown', userInput)

/*-------------------------------- Functions --------------------------------*/
function init() {
  playBoard = Array(20).fill().map(() => Array(10).fill(0))
  currentT = getNextT()
  nextT = getNextT()
  render()
}

function render() {
  displayCurrentT(currentT)
  displayNextT(nextT)
}

function displayCurrentT(array) {
  for (let i = 0; i < array.Tarr.length; i++) {
    for (let j = 0; j < array.Tarr[0].length; j++) {
      if (array.Tarr[i][j] === 1) {
        const cell = document.createElement('div')
        cell.classList.add('cell', `${array.name}`)
        cell.style.gridRow = array.row + i + 1
        cell.style.gridColumn = array.column + j + 1
        board.appendChild(cell)
      }
    }
  }
}

function displayNextT(array) {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild)
  }
  for (let i = 0; i < array.Tarr.length; i++) {
    for (let j = 0; j < array.Tarr[0].length; j++) {
      if (array.Tarr[i][j] === 1) {
        const cell = document.createElement('div')
        cell.classList.add('cell', `${array.name}`)
        cell.style.gridRow = i + 1
        cell.style.gridColumn = j + 1
        preview.appendChild(cell)
      }
    }
  }
}

function displayLockedT() {
  for (const t of lockedT) {
    const cell = document.createElement('div')
        cell.classList.add('cell', 'locked', `${t.name}`)
        cell.style.gridRow = t.row + i + 1
        cell.style.gridColumn = t.column + j + 1
        board.appendChild(cell)
  }
  console.log(lockedT)
}

function getNextT() {
  if (TSequence.length === 0) {
    generateRandomT()
    generateRandomT()
  } else {
    generateRandomT()
  }
  return TSequence.splice(0, 1)[0]
}

function generateRandomT() {
  const randomNum = Math.floor(Math.random() * Object.keys(tetrominos).length)
  let randomT = {
    name: Object.keys(tetrominos)[randomNum],
    Tarr: Object.values(tetrominos)[randomNum]
  }
  let row = 0 /* row at which T spawns on board */
  let column /* column at which T spawns on board */
  if (randomT.name === 'O') {
    column = playBoard[0].length / 2 - 1
  } else {
    column = playBoard[0].length / 2 - 2
  }
  randomT.row = row
  randomT.column = column
  TSequence.push(randomT)
}

function lockCurrentT() {
  clearPlayBoard(currentT)
  if (posValid(currentT,0)) {
    currentT.row = currentT.row + 1
  } else {
    for (let i = 0; i < currentT.Tarr.length; i++) {
      for (let j = 0; j < currentT.Tarr[0].length; j++) {
        if (currentT.Tarr[i][j] === 1) {
          const name = currentT.name  
          const row = currentT.row + i
          const column = currentT.column + j
          playBoard[row][column] = 1
          lockedT.push({name, row, column})       
        }
      }
    }
    displayLockedT()
    clearFullRows()
    currentT = nextT
    nextT = getNextT()
    
  }
  render()
}
  
function clearFullRows() {
  let completedRows = []
  for (let row = playBoard.length - 1; row >=0; row--) {
    if (playBoard[row].every(cell => cell === 1)) {
      completedRows.push(row)
    }
  }
  for (const row of completedRows) {
    playBoard.splice(row, 1)
    playBoard.unshift(Array(10).fill(0))
  } 
}

/* Listen to keyboard events */
function userInput(e) {
  /* Up arrow */
  clearPlayBoard(currentT)
  if (e.which === 38) {
    if (posValid(currentT, 0)) {
      rotateCurrentT(currentT)
    }
    lockCurrentT()
    console.log(playBoard)
    console.log(currentT.row, currentT.column)
  
    /* Down arrow */
  } else if (e.which === 40) {
    if (posValid(currentT, 0)) {
      currentT.row = currentT.row + 1
    }
    lockCurrentT()
    console.log(playBoard)
    console.log(currentT.row, currentT.column)
  
    /* Left arrow */
  } else if (e.which === 37) {
    if (posValid(currentT, -1)) {
      currentT.column = currentT.column - 1
    }
    lockCurrentT()
    console.log(playBoard)
    console.log(currentT.row, currentT.column)
  
    /* Right arrow */
  } else if (e.which === 39) {
    if (posValid(currentT, 1)) {
      currentT.column = currentT.column + 1
    }
    lockCurrentT()
    console.log(playBoard)
    console.log(currentT.row, currentT.column)
  }
  render()
}

function rotateCurrentT() {
  const after = currentT.Tarr.map((row, i) =>
    row.map((column, j) => currentT.Tarr[currentT.Tarr.length - j - 1][i]))
  currentT.Tarr = after
}

function posValid(array, side) {
  for (let i = 0; i < array.Tarr.length; i++) {
    for (let j = 0; j < array.Tarr[0].length; j++) {
      if (array.Tarr[i][j] === 1) {
        const row = array.row + i
        const column = array.column + j + side
        if (row >= playBoard.length || column < 0 || column >= playBoard[0].length) {
          return false
        }
        if (playBoard[row][column] === 1) {
          return false
        }
      }
    }
  }
  return true
}

function clearPlayBoard(array) {
  for (let i = 0; i < array.Tarr.length; i++) {
    for (let j = 0; j < array.Tarr[0].length; j++) {
      if (array.Tarr[i][j] === 1) {
        const row = array.row + i
        const column = array.column + j
        if (!lockedT.some(t => t.row === row && t.column === column)) {
          playBoard[row][column] = 0
        }
      }
    }
  }
  while (board.lastChild) {
    board.removeChild(board.lastChild)
  }
}


