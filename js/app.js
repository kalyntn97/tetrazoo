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


/*-------------------------------- Functions --------------------------------*/
// function render() {
//   // const playBoard = Array(22).fill(Array(10).fill(0))
//   // const TSequence = []
//   getCurrentAndNextT()
//   spawnCurrentT(currentT)
//   // displayNextT()
// }

getCurrentAndNextT()

spawnCurrentT(playBoard, currentT)

function spawnCurrentT(playBoard, currentT) {
  for (let i = 0; i <currentT.Tarr.length; i++) {
     for (let j = 0; j < currentT.Tarr[0].length; j++) {
       playBoard[i][currentT.column + j] = currentT.Tarr[i][j]
    }
  }
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
  const row = (randomT.name === 'I') ? 1 : 0 /* row at which T spawns on board */
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






//create the play field and preview matrix
const board = document.querySelector('.board')
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 20; j++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    board.appendChild(cell)
  }
}

const preview = document.querySelector('.preview')
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    preview.appendChild(cell)
  }
}
