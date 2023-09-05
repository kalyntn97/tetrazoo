import tetrominos from './data.js'
/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
let currentT, nextT, bottomEdge
let TSequence = []
let playBoard = Array(22).fill().map(() => Array(10).fill(0))


/*------------------------ Cached Element References ------------------------*/
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const board = document.querySelector('.board')
const preview = document.querySelector('.preview')

/*----------------------------- Event Listeners -----------------------------*/
// startBtn.addEventListener('click', render)
// stopBtn.addEventListener('click', render)
document.addEventListener('keydown', userInput)

/*-------------------------------- Functions --------------------------------*/
// function render() {
//   // const playBoard = Array(22).fill(Array(10).fill(0))
//   // const TSequence = []
//   getCurrentAndNextT()
//   spawnCurrentT(currentT)
//   // displayNextT()

getCurrentAndNextT()

spawnCurrentT()

function spawnCurrentT() {
  for (let i = 0; i < currentT.Tarr.length; i++) {
    for (let j = 0; j < currentT.Tarr[0].length; j++) {
      playBoard[currentT.row + i][currentT.column + j] = currentT.Tarr[i][j]
  /* Game Over if Current T cannot move of board */
    }
  }
  displayCurrentT(currentT)
  displayNextT(nextT)
}
function getCurrentAndNextT() {
  if (TSequence.length === 0) {
    generateNextT()
    generateNextT()
  } else {
    generateNextT()
  }
  currentT = TSequence.splice(0, 1)[0]
  nextT =  TSequence.splice(0, 1)[0]
}

function generateNextT() {
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

function clearPlayBoard(previousT) {
  for (let i = 0; i < previousT.Tarr.length; i++) {
    for (let j = 0; j < previousT.Tarr[0].length; j++) {
      if (previousT.Tarr[i][j] === 1) {
        playBoard[currentT.row + i][currentT.column + j] = 0
      }
    }
  }
  while (board.firstChild) {
    board.removeChild(board.firstChild)
  }
}

function rotatecurrentT() {
  const after = currentT.Tarr.map((row, i) =>
    row.map((column, j) => currentT.Tarr[currentT.Tarr.length - j - 1][i]))
  currentT.Tarr = after
}

function userInput(e) {
  /* Up arrow */
  if (e.which === 38) {
    clearPlayBoard(currentT)
    rotatecurrentT()
    spawnCurrentT()
    console.log(currentT.Tarr)
    console.log(playBoard)
  /* Down arrow */
  } else if (e.which === 40) {
    clearPlayBoard(currentT)
    currentT.row = currentT.row + 1
    spawnCurrentT()
    console.log(playBoard)
  /* Left arrow */
  } else if (e.which === 37) {
    clearPlayBoard(currentT)
    currentT.column = currentT.column - 1
    spawnCurrentT()
    console.log(playBoard)
  /* Right arrow */
  } else if (e.which === 39) { 
    clearPlayBoard(currentT)
    currentT.column = currentT.column + 1
    spawnCurrentT()
    console.log(playBoard)
  }
}

// create the play field and preview matrix
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