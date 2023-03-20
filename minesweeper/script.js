/*
/           Game Logic
*/


const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}

function createBoard(boardWidth, boardHeight, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardWidth, boardHeight, numberOfMines)

    for (let x = 0; x < boardHeight; x++) {
        const row = []
        for (let y = 0; y < boardWidth; y++) {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                this.element.dataset.status = value
                },
            }

        row.push(tile)
        }
        board.push(row)
    }

    return board
}

function markTile(tile) {
if (
    tile.status !== TILE_STATUSES.HIDDEN &&
    tile.status !== TILE_STATUSES.MARKED
) {
    return
}

if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
    //remove flag img
    tile.element.innerHTML = ''
} else {
    tile.status = TILE_STATUSES.MARKED
    //add flag img
    tile.element.innerHTML = '<img src="./assests/flag.png" alt="flag" width="15px" height="15px">'
}
}

function revealTile(board, tile, i) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }   

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER

    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
        return (
            tile.status === TILE_STATUSES.NUMBER ||
            (tile.mine &&
            (tile.status === TILE_STATUSES.HIDDEN ||
                tile.status === TILE_STATUSES.MARKED))
        )
        })
    })
}

function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
        return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardWidth, boardHeight, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
        x: randomNumber(boardHeight),
        y: randomNumber(boardWidth),
        }

        if (!positions.some(positionMatch.bind(null, position))) {
        positions.push(position)
        }
    }

    return positions
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }   

    return tiles
}

/*
/           UI Logic
*/

//Game diffuclty settings
const BOARD_WIDTH = 12
const BOARD_HEIGHT = 17
const NUMBER_OF_MINES = 30

//creating the board and tile information
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT, NUMBER_OF_MINES)

//adding the board and tiles to screen
const boardElement = document.querySelector(".board")
boardElement.style.setProperty("--board-width", BOARD_WIDTH)
boardElement.style.setProperty("--board-height", BOARD_HEIGHT)

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
    })
})

//display subtext information: Flags left, start button, timer
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".win-lose-message")
minesLeftText.textContent = NUMBER_OF_MINES

// add event listeners only after player selects start
const start = document.querySelector(".start")
start.addEventListener("click", () => {
    //  display and start timer
    start.style.setProperty("opacity", "0")
    start.style.setProperty("pointer-events", "none")

    let totalSeconds = 0;
    let min = 0;
    let sec = 0;
    const timerEl = document.querySelector('.timer')
    timerEl.innerHTML = `Time:  ${min}:0${sec}`
    var gameTimer = setInterval(function () {
            totalSeconds++
            min = Math.floor(totalSeconds/60)
            sec = Math.floor(totalSeconds%60)

            if (sec < 10) {
                timerEl.innerHTML = `Time:  ${min}:0${sec}`
            }
            else timerEl.innerHTML = `Time:  ${min}:${sec}`

        }, 1000)
    
    // add tile elements and event listeners when game starts
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
            tile.element.addEventListener("click", () => {
                let i = 0;
                revealTile(board, tile, i)
                checkGameEnd(gameTimer)
            })
            tile.element.addEventListener("contextmenu", e => {
                e.preventDefault()
                markTile(tile)
                listMinesLeft()
            })
        })
    })
})

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
}, 0)

minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd(gameTimer) {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true })
        boardElement.addEventListener("contextmenu", stopProp, { capture: true })
        //stop timer
        clearInterval(gameTimer)
        gameOver = true
    }

    if (win) {
        messageText.classList.toggle('active')
        messageText.innerHTML += `<h1>You Win!</h1>
                                <h5>Time:</h5>
                                <h5>${document.querySelector('.timer').textContent}</h5>`
        gameOver = true
    }
    if (lose) {
        messageText.classList.toggle('active')
        messageText.innerHTML += `<h1>Game Over.</h1>
                                <h5>Time:</h5>
                                <h5>${document.querySelector('.timer').textContent}</h5>`
        board.forEach(row => {
        row.forEach(tile => {
            if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
            if (tile.mine) revealTile(board, tile)
        })
        })
        gameOver = true
    }
    }

function stopProp(e) {
    e.stopImmediatePropagation()
}

function openHelp() {
    const helpbox = document.querySelector('.help-box')
    helpbox.classList.toggle('help-box-active')
    console.log('click')
}