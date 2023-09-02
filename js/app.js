import tetrominos from './data.js'
/*-------------------------------- Constants --------------------------------*/
const playBoard = Array(20).fill(Array(10).fill(0))
playBoard[19] = [1,0,1,1,0,1,0,0,0,0]
const TSequence = []

/*---------------------------- Variables (state) ----------------------------*/
let currentT, nextT, bottomEdge

/*------------------------ Cached Element References ------------------------*/
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')


/*----------------------------- Event Listeners -----------------------------*/
startBtn.addEventListener('click', render)
stopBtn.addEventListener('click', render)


/*-------------------------------- Functions --------------------------------*/
function render() {
  const playBoard = Array(20).fill(Array(10).fill(0))
  getNextT()
// keep track of bottom edge
  // getNextT()
  console.log(currentT)
  console.log(nextT)
}

function getNextT() {
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
  let randomT
  const randomNum = Math.floor(Math.random() * Object.keys(tetrominos).length)
  randomT = {
    name: Object.keys(tetrominos)[randomNum],
    Tarr: Object.values(tetrominos)[randomNum]
  }
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