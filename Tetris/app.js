document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'blue',
    'orange',
    'green',
    'red',
    'yellow',
    'purple',
    'cyan'
  ]

  // tetrominoes
  const lTetromino1 = [
    [1, 2, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2]
  ]

  const lTetromino2 = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2]
  ]

  const zTetromino1 = [
    [1, width, width + 1, width * 2],
    [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino2 = [
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1],
    [1, width + 1, width + 2, width * 2 + 2],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width + 2],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [2, width + 2, width * 2 + 2, width * 3 + 2],
    [width * 2, width * 2 + 1, width * 2 + 2, width * 2 + 3]
  ]

  const theTetrominoes = [lTetromino1, lTetromino2, zTetromino1, zTetromino2, oTetromino, tTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  // randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //draw the tetrimino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }
  //undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  //assign functions to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    } else if (e.keyCode === 38) {
      rotateClockwise()
    }
  }
  document.addEventListener('keydown', control)

  //make the tetromino move down
  function moveDown() {
    const isAtBottom = current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
    undraw()
    if (!isAtBottom) {currentPosition += width}
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      addScore()
      //start a new tetrimino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][0]
      currentPosition = 4
      currentRotation = 0
      draw()
      displayShape()
      gameOver()
    }
  }
  //control panel
  //move the tetrimino left
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  //move the tetrimino right
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

    if (!isAtRightEdge) {
      currentPosition += 1
    }
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }
  //rotate the tetrominoes
  function rotateClockwise() {
    undraw()
    currentRotation += 1
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (current.some(index => squares[currentPosition + index].classList.contains('taken')) || (isAtLeftEdge && isAtRightEdge)) {
      currentRotation -= 1
      if (currentRotation === -1) {
        currentRotation = 3
      }
    current = theTetrominoes[random][currentRotation]
    }
    draw()
  }
  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  //the tetrominoes without rotations
  const upNextTetrominoes = [
    [1, 2, displayWidth + 1, displayWidth * 2 + 1], //lTetromino1
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //lTetromino2
    [1, displayWidth, displayWidth + 1, displayWidth * 2], //zTetromino1
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino2
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
  ]
  function displayShape() {
    //remove tetromino trace
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })

  }

  //add function on button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null

    } else {
      draw()
      timerId = setInterval(moveDown, 500)
      nextRandom - Math.floor(Math.random() * theTetrominoes.length)
      displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
  //gameOver
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'Game Over'
      clearInterval(timerId)
    }
  }
})
