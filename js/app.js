import tetrominos from './data.js'
import gameRounds from './game.js'


/*-------------------------------- Constants --------------------------------*/
const successSound = new Audio ('../assets/audio/success.wav')
const stickSound = new Audio ('../assets/audio/stick.wav')
const gameOverSound = new Audio ('../assets/audio/sadMeow.wav')
const clickSound = new Audio ('../assets/audio/click.mp3')
const gameStartSound = new Audio ('../assets/audio/bird.wav')
const bgMusic = new Audio ('../assets/audio/bgMusic.wav')


/*---------------------------- Variables (state) ----------------------------*/
let playBoard, TSequence, currentT, nextT, timer, score, level, speed, gameOver


/*------------------------ Cached Element References ------------------------*/
const buttons = document.querySelectorAll('.button')
const board = document.querySelector('.board')
const preview = document.querySelector('.preview')
const scoreEl = document.getElementById('score')
const levelEl = document.getElementById('level')


/*----------------------------- Event Listeners -----------------------------*/
document.addEventListener('DOMContentLoaded', () => { 
  init()
  playBgMusic()
})
buttons.forEach(button => button.addEventListener('click', gameControls))
document.addEventListener('keydown', userInput)


/*-------------------------------- Functions --------------------------------*/

/* build an empty playBoard with x rows and y columns and keep track of specific Ts in each cell */
function buildEmptyPlayBoard(rows, columns) {
  const emptyPlayBoard = new Array(rows)
  for (let i = 0; i < rows; i++) {
    emptyPlayBoard[i] = new Array(columns)
    for (let j = 0; j < columns; j++) {
      emptyPlayBoard[i][j] = [0, '']  // each cell is assigned '0' (empty) or '1' (occupied by a T cell), and a specific T class
    }
  }
  return emptyPlayBoard
}

/* initialize the game */
function init() {
  playBoard = buildEmptyPlayBoard(20, 10)
  TSequence = []
  currentT = 0
  nextT = getNextT()
  timer = null
  score = 0
  level = 1
  speed = 1000
  gameOver = false
  scoreEl.innerHTML = score
  levelEl.innerHTML = 1
  displayNextT()
}

/* play background music on loading */
function playBgMusic() {
 
}


/* reset the game */
function reset() {
  // stop the timer (animation)
  clearInterval(timer)
  timer = null
  // clear all cells from game board
  while (board.firstChild) {
    board.removeChild(board.firstChild)
  }
  // reset Pause button to Start
  const pauseBtn = document.getElementById('startBtn')
  if (pauseBtn.innerText === '⏸') {
    pauseBtn.innerText = '▶'
  }
  // hide game over screen
  gameOver = false
  const gameOverScreen = document.getElementById('gameOver')
  gameOverScreen.style.visibility = 'hidden'
  // initialize the game
  init()
}

/* render the display */
function render() {
  displayCurrentT()
  displayNextT()
  displayLockedT()
}

/* button events */
function gameControls(e) {
  clickSound.volume = 0.1
  clickSound.play()
  if (e.target.id === 'bgMusicBtn') {
    if (e.target.innerText === '🎧') {
      e.target.innerText = '🔇'
      bgMusic.volume = 0.25
      bgMusic.play()
      bgMusic.loop = true
    } else {
      e.target.innerText = '🎧'
      bgMusic.pause()
    }
  }
  if (e.target.id === 'startBtn') {
    startGame()
    if (e.target.innerText === '▶') {
      e.target.innerText = '⏸'
    } else {
      e.target.innerText = '▶'
    }
  }
  if (e.target.id === 'resetBtn') {
    reset()
  }
}

/* start the game loop */
function startGame() {
  // pause the game 
  if (timer) {
    clearInterval(timer)
    timer = null
  } else {
    // check if it is the start of the game
    if (currentT === 0) {
      showGameStartScreen()  //show start game screen
      currentT = nextT  // generate and display current and next Ts
      nextT = getNextT()
      render()
      timer = setInterval(dropTAnimation, 1000)  // set the speed
    } else {
        checkLevelUp()  // check if the game is running and set speed, level and score
      }
  }  
}

/* check if player meets level up conditions */
function checkLevelUp() { 
  let score = +scoreEl.innerHTML
  for (let i = 0; i < gameRounds.length; i++) {
    if (score === gameRounds[i].score) {
      level = gameRounds[i].level
      speed = gameRounds[i].speed
      levelEl.innerHTML = level
      clearInterval(timer)
      timer = setInterval(dropTAnimation, speed)  
      return
    }
  }
}

/* start screen display and sound effect */
function showGameStartScreen() {
  const gameStartScreen = document.getElementById('gameStart')
  gameStartScreen.style.visibility = 'visible'  // show screen for 1s
  gameStartSound.volume = 0.2
  gameStartSound.play()
  setTimeout(e => {
    gameStartScreen.style.visibility = 'hidden'
  }, 1000)

}

/* game over screen display and sound effect */
function showGameOverScreen() {
  const gameOverScreen = document.getElementById('gameOver')
  gameOverScreen.style.visibility = 'visible'
  gameOverSound.volume = 0.1
  gameOverSound.play()
}

/* continuous animation to move the current T down the playBoard */
function dropTAnimation() {
    clearGameBoard()  // clear the previous position as the current T changes position
    currentT.row = currentT.row + 1  // move the current T down by one row
    lockCurrentT()  // lock the current T
    render()  //update game board display
  }

/* display current T that is moving down the playBoard */
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

/* display the next T in sequence */
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

/* display the locked Ts by looping through playBoard */
function displayLockedT() {
  // check if game over conditions are met
  if (currentT.row === 0) {
    if (playBoard[currentT.Tarr.length][currentT.column][0] === 1) {
      clearInterval(timer)
      timer = null
      gameOver = true
      showGameOverScreen()
    }
  }

  if (!gameOver) {
    for (let row = 0; row < playBoard.length; row++) {
      for (let column = 0; column < playBoard[row].length; column++) {
        // loop through the playBoard to select the DOM cell at that row/column
        const domCell = document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`);
        if (!playBoard[row][column][0] || domCell) {  // if there is already a cell in the DOM or playBoard
          continue  // do not create another DOM cell
        }  // create DOM cells based on the playBoard data 
        const cell = document.createElement('div')
        cell.classList.add('cell', 'locked', `${playBoard[row][column][1]}`)
        cell.dataset.row = row  // row in playBoard
        cell.dataset.column = column  // column in playBoard
        cell.style.gridRow = row + 1
        cell.style.gridColumn = column + 1
        board.appendChild(cell)
      }
    }
  }
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
  let row = 0  // row at which T spawns on board
  let column  // column at which T spawns on board
  if (randomT.name === 'O') {
    column = playBoard[0].length / 2 - 1
  } else {
    column = playBoard[0].length / 2 - 2
  }
  randomT.row = row
  randomT.column = column
  TSequence.push(randomT)
}

/* lock the current T into a playBoard position once it reaches the lowest possible row */
function lockCurrentT() {
  // check if the current T is ready to be locked
  if (!posValid(0)) {  // current T is locked when it touches the game board borders or collides with another T
    for (let i = 0; i < currentT.Tarr.length; i++) {
      for (let j = 0; j < currentT.Tarr[0].length; j++) {
        if (currentT.Tarr[i][j] === 1) {
          playBoard[currentT.row + i][currentT.column + j][0] = 1  // lock the current T into the playBoard  
          playBoard[currentT.row + i][currentT.column + j][1] = currentT.name  // assign a T class to the cell
        }
      }
    }
    // play a sound when a T is locked
    stickSound.volume = 0.1
    stickSound.play()
    // clear out full rows 
    clearFullRows()
    // get new Ts
    currentT = nextT
    nextT = getNextT()
  }
}

/* clear full rows */
function clearFullRows() {
  // get the number of filled rows
  let filledRows = 0
  let lastFilledRow = -1
  let firstFilledRow = -1
  // loop through playBoard from the bottom up and find rows with all cells filled
  for (let row = playBoard.length - 1; row >= 0; row--) {
    if (playBoard[row].every(column => column[0] === 1)) {
      // select all cells from the filled rows and remove them 
      const cellsToRemove = document.querySelectorAll(`.cell[data-row="${row}"]`)
      cellsToRemove.forEach(cell => cell.remove())
      // find the number of filled rows, first and last row filled
      if (firstFilledRow === -1) {
        firstFilledRow = row
      }
      filledRows++
      lastFilledRow = row
    }
  }
  // shift the rows above the filled rows down
  let next = 0  // loop through each row from the bottom of the playBoard
  for (let row = lastFilledRow - 1; row >= 0; row--) {
    for (let column = 0; column < playBoard[row].length; column++) {
      if (firstFilledRow - next >= 0) {  // start from the first filled row
        playBoard[firstFilledRow - next][column][0] = playBoard[row][column][0]  // copy all cells of the row above the last filled row to the first filled row
        playBoard[firstFilledRow - next][column][1] = playBoard[row][column][1]
        playBoard[row][column][0] = 0  // remove all cells from the filled row
        playBoard[row][column][1] = ''
        const domCell = document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`);  // select all DOM cells from the filled row and remove them
        if (domCell) {
          domCell.remove()
        }
        // play a sound if a line is cleared
        successSound.volume = 0.1
        successSound.play()
      }
    }
    next++  // move to the next filled row and repeat
  }

  // update and display the score and level for each cleared row
  score = score + filledRows * 10
  scoreEl.innerHTML = score
  checkLevelUp()
}

/* listen to keyboard events from player */
function userInput(e) {
  // Up arrow (rotate)
  clearGameBoard()
  if (e.which === 38) {
    if (posValid(0)) {
      rotateCurrentT(currentT)
    }
  
    // Down arrow
  } else if (e.which === 40) {
    if (posValid(0)) {
      currentT.row = currentT.row + 1  // move down if possible
    } else {
      lockCurrentT()  // lock T into playBoard if its position is invalid
    }

    // Left arrow
  } else if (e.which === 37) {
    if (posValid(-1)) {
      currentT.column = currentT.column - 1
    }

    // Right arrow
  } else if (e.which === 39) {
    if (posValid(1)) {
      currentT.column = currentT.column + 1
    }
  }

    // Space bar (drop to the lowest row available)
  if (e.which === 32) {
    for (let row = playBoard.length - 1; row >= 0; row--) {
      if (playBoard[row][currentT.column][0] === 0) {  // lowest available row
        dropToLastRowRecursive()  // move the T down at low as possible
        break  // stop the loop once the lowest row available is found
      }
    }
  }
  render()
}

function rotateCurrentT() {
  const after = currentT.Tarr.map((row, i) =>
    row.map((column, j) => currentT.Tarr[currentT.Tarr.length - j - 1][i]))
  currentT.Tarr = after
}

/* move the T down one row at a time until it can no longer be moved down */
function dropToLastRowRecursive() {
  if (posValid(0)) {
    currentT.row += 1
    dropToLastRowRecursive()
  } else if (!posValid(0)) {
    lockCurrentT()
  }
}

/* check if current T position is valid */
function posValid(side) {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      if (currentT.Tarr[i][j] === 1) {
        const row = currentT.row + i
        const column = currentT.column + j + side
        // check if the current T is outside of the playBoard's dimensions
        if (row + 1 >= playBoard.length || column < 0 || column >= playBoard[0].length) {
          return false
        }
        // check if the current T collides with an existing T on the playBoard
        if (playBoard[row + 1][column][0] === 1) {
          return false
        }
      }
    } 
  }
  return true
} 

/* clear the previous position of the current T as it moves inside the playBoard */
function clearGameBoard() {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      if (currentT.Tarr[i][j] === 1) {
        if (!playBoard.some(row => row.some(cell => cell[0]))) {  // update the playBoard value to '0' for each cell of the current T
          playBoard[currentT.row + i][currentT.column + j][0] = 0
          playBoard[currentT.row + i][currentT.column + j][1] = ''       
        }
      }
    }
  }
  // remove the non-locked DOM cells of the current T off the game board display
  const nonLockedCells = board.querySelectorAll('.cell:not(.locked)')
  nonLockedCells.forEach(cell => board.removeChild(cell))
}