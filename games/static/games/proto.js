class Game {
    constructor() {

    }

}

class Setup {
    constructor(alienLocations, gameSpeed, movementPattern) {
        this.alienLocations = alienLocations
        this.gameSpeed = gameSpeed
        this.movementPattern = movementPattern
    }
    getAlienLocations() {
        return this.alienLocations
    }
    getGameSpeed() {
        return this.gameSpeed
    }
    getMovementPattern() {
        return this.movementPattern
    }
}

class Square {
    constructor(indexOnBoard, div, lineWidth, borders) {
        this.index = indexOnBoard
        this.div = div
        this.lineWidth = lineWidth
        this.borders = borders
    }
    isLeftBorder() {
        return this.borders.contains('left')
    }

    setCharacter(character) {
        this.character = character
        let cssClass = character.getCssClass()
        this.div.classList.clear()
        this.div.classList.add(cssClass)
    }
    setEmpty() {
        this.div.classList.clear()
        this.character = null
    }

    setGround() {
        this.div.classList.add('ground')
    }
    hasAlien() {
        return (this.classList.contains('invader') || this.classList.contains('intruder'))
    }
    hasDefender() {
        return (this.classList.contains('defender'))
    }
    topOfBoard() {
        return (this.indexOnBoard <= this.lineWidth)
    }
    pickCharacterUp() {
        let c = this.character
        this.setEmpty()
        return c
    }

}

class Defender {
    constructor(imageCssClass, lineWidth) {
        this.imageCssClass = imageCssClass
        this.lineWidth = lineWidth
    }
    getCssClass() {
        return this.imageCssClass
    }
    moveTo(square) {
        square.setCharacter(this)
    }
}

class Rocket {
    constructor(imageCssClass, indexOnBoard) {
        this.imageCssClass = imageCssClass
        this.indexOnBoard = indexOnBoard
    }
    getCssClass() {
        return this.imageCssClass
    }
    moveTo(square) {
        square.setCharacter(this)
    }
}

class Alien {
    constructor(name, imageCssClass, health, indexOnBoard, lineWidth) {
        this.name = name
        this.imageCssClass = imageCssClass
        this.health = health
        this.colorByHealthLevel = {
            1: 'green',
            2: 'blue'
        }
        this.indexOnBoard = indexOnBoard
        this.lineWidth = lineWidth
    }
    getCssClass() {
        return this.imageCssClass
    }
    moveTo(square) {
        square.setCharacter(this)
    }
}

function createInvader(indexOnBoard, lineWidth) {
    let alien = new Alien('invader', 'invader', 1, indexOnBoard, lineWidth)
    return alien
}

function createIntruder(indexOnBoard, lineWidth) {
    return new Alien('intruder', 'intruder', 2, indexOnBoard, lineWidth)
}

class Board {
    constructor(parent, width) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []

    }
    createChildSquareAddToSquares(index) {
        let div = document.createElement('div')
        this.parent.appendChild(div)
        const borders = []
        if (index >= this.bottomRow()) {
            borders.push('ground')
        }
        this.squares.push(new Square(index, div, this.width, borders))
    }
    bottomRow() {
        return (this.width * this.width - this.width)
    }
    defenderLocation() {
        return this.width * this.width - (this.width + Math.floor(this.width / 2) + 1)
    }

    draw(setup) {
        let alienLocations = setup.getAlienLocations()
        for (let i = 0; i < this.width * this.width; i++) {
            this.createChildSquareAddToSquares(i)
            if (alienLocations.includes(i)) {
                let invader = createInvader(alienLocations[i], this.width)
                this.squares[i].setCharacter(invader)
                this.aliens.push(invader)
            }
            if (i >= this.bottomRow()) {
                this.squares[i].setGround()
            }
        }
        let defender = new Defender('defender', this.width)
        this.squares[this.defenderLocation()].setCharacter(defender)
    }

    move() {
        for (let i = 0; i < this.squares.length - 1; i++) {
            let square = this.squares[i]
            let nextSquare = this.squares[i + 1]
            if (square.hasAlien()) {
                let alien = square.pickCharacterUp()
                alien.moveTo(nextSquare)
            }
        }
    }

    move2() {
        for (let i = 0; i < this.aliens.length - 1; i++) {
            let alien = this.aliens[i]
            let square = this.squares[alien.indexOnBoard]
            let nextSquare = this.squares[alien.indexOnBoard + 1]
            square.setEmpty()
            alien.moveTo(nextSquare)

        }
    }

}

// for(let i = 0; i < width*width; i++) {
//     let div = document.createElement('div') 
//     this.parent.appendChild(div)
//     this.squares.push(new Square(i, div)) 

//     if (alienInvaders.includes(i)) {
//         let invader = createInvader(alienInvaders[i], width)
//         invader.draw(square)
//         this.aliens.push(invader)
//     } else if (i > width*width-width) {
//         square.classList.add('ground')
//     }
// }


document.addEventListener('DOMContentLoaded', () => {
    // testDiv = document.querySelector('.test')
    // square = new Square(0, testDiv)
    // rocket = new Rocket('rocket', 0)
    // invader = createInvader(0, 1)
    // defender = new Defender('defender', 5)
    // square.setCharacter(defender)
    let grid = document.querySelector('.grid')
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
    board = new Board(grid, 15)
    setup = new Setup(alienInvaders, [], [])
    board.draw(setup)
    const startButton = document.querySelector('#start')
    startButton.addEventListener('mousedown', () => {
        board.move()
    })

})
