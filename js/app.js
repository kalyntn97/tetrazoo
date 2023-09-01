import tetrominos from './data.js'
const playField = Array(20).fill(Array(10).fill(0))

const board = document.querySelector('.board')
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 20; j++) {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    board.appendChild(cell)
  }
}