import tetrominos from './data.js'
/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
let currentT, nextT, playBoard, timer, TSequence, lockedT, score, lastRow, level, gameOver


/*------------------------ Cached Element References ------------------------*/
const buttons = document.querySelectorAll('.button')
const board = document.querySelector('.board')
const preview = document.querySelector('.preview')
const scoreEl = document.getElementById('score')
const levelEl = document.getElementById('level')

/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('DOMContentLoaded', init)
buttons.forEach(button => button.addEventListener('click', gameControls))
document.addEventListener('keydown', userInput)


/*-------------------------------- Functions --------------------------------*/

/* initialize the game */
function init() {
  playBoard = Array(20).fill().map(() => Array(10).fill(0))
  TSequence = []
  currentT = 0
  nextT = getNextT()
  lockedT = []
  lastRow = -1
  score = 0
  gameOver = false
  scoreEl.innerHTML = score
  levelEl.innerHTML = 1
  displayNextT()
}

function reset() {
  /* stop the timer for animation */
  clearInterval(timer)
  timer = null
  /* clear all cells from game board */
  while (board.firstChild) {
    board.removeChild(board.firstChild)
  }
  /* reset Pause button to Start */
  const pauseBtn = document.getElementById('startBtn')
  if (pauseBtn.innerText === 'Pause') {
    pauseBtn.innerText = 'Start'
  }
  /* hide game over screen */
  gameOver = false
  const gameOverScreen = document.getElementById('gameOver')
  gameOverScreen.style.visibility = 'hidden'
  /* initialize the game */
  init()
}

function render() {
  if (currentT === 0) {
    currentT = nextT
    nextT = getNextT()
  }
  displayCurrentT()
  displayNextT()
  displayLockedT()
}

/* button events */
function gameControls(e) {
  if (e.target.id === 'startBtn') {
    startGame()
    if (e.target.innerText === 'Start') {
      e.target.innerText = 'Pause'
    } else if (e.target.innerText === 'Pause') {
      e.target.innerText = 'Start'
    }
  }
  if (e.target.id === 'resetBtn') {
    reset()
  }
}

/* start the game loop */
function startGame() {
  if (timer) {
    clearInterval(timer)
    timer = null
  } else {
    render()
    /* check for game over */
    for (let column = 0; column < playBoard[0].length; column++) {
      if (playBoard[currentT.row + currentT.Tarr.length][column] === 1) {
        gameOver = true
        showGameOverScreen()
        clearInterval(timer)
        timer = null
      }
    }
    timer = setInterval(dropTAnimation, 1000)
  }
}

function showGameOverScreen() {
  const gameOverScreen = document.getElementById('gameOver')
  gameOverScreen.style.visibility = 'visible'
}

/* animation to move T down over time */
function dropTAnimation() {
    clearGameBoard()
    currentT.row = currentT.row + 1
    lockCurrentT()
    render()
  }

function displayCurrentT() {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      if (currentT.Tarr[i][j] === 1) {
        const cell = document.createElement('div')
        cell.classList.add('cell', `${currentT.name}`)
        cell.style.gridRow = currentT.row + i + 1 /* row to start drawing */
        cell.style.gridColumn = currentT.column + j + 1 /* column to start drawing */
        board.appendChild(cell)
      }
    }
  }
}

function displayNextT() {
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild)
  }
  for (let i = 0; i < nextT.Tarr.length; i++) {
    for (let j = 0; j < nextT.Tarr[0].length; j++) {
      if (nextT.Tarr[i][j] === 1) {
        const cell = document.createElement('div')
        cell.classList.add('cell', `${nextT.name}`)
        cell.style.gridRow = i + 1
        cell.style.gridColumn = j + 1
        preview.appendChild(cell)
      }
    }
  }
}

function displayLockedT() {
  lockedT.forEach(t => {
    for (let i = 0; i < t.Tarr.length; i++) {
      for (let j = 0; j < t.Tarr[0].length; j++) {
        if (t.Tarr[i][j] === 1) {
          const cell = document.createElement('div')
          cell.classList.add('cell', 'locked', `${t.name}`)
          cell.dataset.row = t.row + i /* position in board */
          cell.dataset.column = t.column + j /* position in board */
          cell.style.gridRow = t.row + i + 1
          cell.style.gridColumn = t.column + j + 1 
          board.appendChild(cell)
        }
      }  
    }
  })
}

/* get the next T in sequence */
function getNextT() {
  if (TSequence.length === 0) {
    generateRandomT()
  }
  return TSequence.splice(0, 1)[0]
}

/* generate a T sequence containing T objects */
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

/* lock the current T position into playBoard */
function lockCurrentT() {
  if (!posValid(0)) { 
    const row = currentT.row
    const column = currentT.column
    const name = currentT.name
    const Tarr = currentT.Tarr
    for (let i = 0; i < currentT.Tarr.length; i++) {
      for (let j = 0; j < currentT.Tarr[0].length; j++) {
        if (currentT.Tarr[i][j] === 1) {
          playBoard[currentT.row + i][currentT.column + j] = 1
        }
      }
    }
    /* add current T to locked T array */
    lockedT.push({name, row, column, Tarr})
    /* clear out full rows */ 
    clearFullRows()
    /* get new T */
    currentT = nextT
    nextT = getNextT()
  }
}

/* clear full rows */
function clearFullRows() {
  /* get the number of filled rows */
  let filledRows = 0
  let lastFilledRow = 0
  let firstFilledRow = -1
  for (let row = playBoard.length - 1; row >= 0; row--) {
    if (playBoard[row].every(column => column === 1)) {
      if (firstFilledRow === -1) {
        firstFilledRow = row
      }
      filledRows++
      lastFilledRow = row
    }
  }
  /* shift the rows above the filled rows down */
  let next = 0
  for (let row = lastFilledRow - 1; row >= 0; row--) {
    for (let column = 0; column < playBoard[row].length; column++) {
      if (firstFilledRow - next > 0) {
        playBoard[firstFilledRow - next][column] = playBoard[row][column]
      }
    }
    next++
  }
  /* add back empty rows to playBoard */
  for (let row = lastFilledRow - firstFilledRow; row >= 0; row--) {
    playBoard[row] = Array(10).fill(0)
  }

  // /* get the score for each cleared row */
  score = score + filledRows * 10
  scoreEl.innerHTML = score
  
  /* remove filled rows from the game board */
  for (let row = firstFilledRow; row >= lastFilledRow; row--) {
    const cellsToRemove = document.querySelectorAll(`.cell[data-row="${row}"]`)
    const cellsToRemoveArray = Array.from(cellsToRemove)
    cellsToRemoveArray.forEach(cell => cell.parentNode.removeChild(cell))
    
    const cellsToShift = document.querySelectorAll(`.cell[data-row="${row - 1}"]`)
    
    // Shift elements down one row
    cellsToShift.forEach(cell => {
      const currentRow = parseInt(cell.getAttribute('data-row'))
      cell.setAttribute('data-row', currentRow)
      cell.setAttribute('class', currentRow)
    })
  }
}



/* Listen to keyboard events */
function userInput(e) {
  /* Up arrow */
  clearGameBoard()
  if (e.which === 38) {
    if (posValid(0)) {
      rotateCurrentT(currentT)
    }
  
    /* Down arrow */
  } else if (e.which === 40) {
    if (posValid(0)) {
      currentT.row = currentT.row + 1
    } else {
      lockCurrentT()
    }

    /* Left arrow */
  } else if (e.which === 37) {
    if (posValid(-1)) {
      currentT.column = currentT.column - 1
    }

    /* Right arrow */
  } else if (e.which === 39) {
    if (posValid(1)) {
      currentT.column = currentT.column + 1
    }
  }

    /* Space bar */
  if (e.which === 32) {
    for (let row = playBoard.length - 1; row >= 0; row--) {
      if (playBoard[row][currentT.column] === 0) {
        lastRow = row
        break
      }
    }
    dropToLastRowRecursive()
  }
  render()
}

function rotateCurrentT() {
  const after = currentT.Tarr.map((row, i) =>
    row.map((column, j) => currentT.Tarr[currentT.Tarr.length - j - 1][i]))
  currentT.Tarr = after
}

function dropToLastRowRecursive() {
  if (posValid(0)) {
    currentT.row += 1
    dropToLastRowRecursive()
  } else if (!posValid(0)) {
    lockCurrentT()
  }
}

function posValid(side) {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      if (currentT.Tarr[i][j] === 1) {
        const row = currentT.row + i
        const column = currentT.column + j + side
        /* check if current T is out of playBoard */
        if (row + 1 >= playBoard.length || column < 0 || column >= playBoard[0].length) {
          return false
        }
        /* check if current T collides with an existing T on playBoard */
        if (playBoard[row+1][column] === 1) {
          return false
        }
      }
    } 
  }
  return true
} 

function clearGameBoard() {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      if (currentT.Tarr[i][j] === 1) {
        const row = currentT.row + i
        const column = currentT.column + j
        /* clear playBoard value of all cells except for locked Ts */
        if (!lockedT.some(t => t.row === row && t.column === column)) {
          playBoard[row][column] = 0
        }
      }
    }
  }
  /* clear non-locked cells off the game board */
  const nonLockedCells = board.querySelectorAll('.cell:not(.locked)')
  nonLockedCells.forEach(cell => board.removeChild(cell))
}


