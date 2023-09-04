import tetrominos from './data.js'
/*-------------------------------- Constants --------------------------------*/

/*---------------------------- Variables (state) ----------------------------*/
let currentT, nextT, bottomEdge
let TSequence = []
let playBoard = Array(22).fill().map(() => Array(10).fill(0))


/*------------------------ Cached Element References ------------------------*/
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')


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
// }

getCurrentAndNextT()

spawnCurrentT(currentT)

function spawnCurrentT() {
  for (let i = 0; i < currentT.Tarr.length; i++) {
     for (let j = 0; j < currentT.Tarr[0].length; j++) {
       playBoard[currentT.row + i][currentT.column + j] = currentT.Tarr[i][j]
    }
  } 
  /* Game Over if Current T cannot move of board */
}
console.log(currentT, playBoard)

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
  return TSequence.push(randomT)
}



//create the play field and preview matri
const board = document.querySelector('.board')
for (let i = 2; i < playBoard.length; i++) {
  for (let j = 0; j < playBoard[0].length; j++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    board.appendChild(cell)
    cell.innerHTML = playBoard[i][j]
  }
}

const preview = document.querySelector('.preview')
for (let i = 0; i < nextT.length; i++) {
  for (let j = 0; j < nextT[0].length; j++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    preview.appendChild(cell)
    cell.innerHTML = nextT[i][j]
    console.log(nextT)
  }
}

function userInput(e) {
  if (e.which === 38) {
    console.log('Up Arrow Key')
  } else if (e.which === 40) {
    console.log('Down Arrow Key')
    currentT.row = currentT.row + 1
    spawnCurrentT()
    console.log(playBoard)
  } else if (e.which === 37) {
    console.log('Left Arrow Key')
    currentT.column = currentT.column - 1
    spawnCurrentT()
    console.log(playBoard)
  } else if (e.which === 39) { 
    console.log('Right Arrow Key')
    currentT.column = currentT.column + 1
    spawnCurrentT()
    console.log(playBoard)
  }
}
