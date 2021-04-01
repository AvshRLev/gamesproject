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
        return this.borders.includes('left')
    }

    isRightBorder() {
        return this.borders.includes('right')
    }

    isGround() {
        return this.borders.includes('ground')
    }

    setCharacter(character) {
        this.character = character
        let cssClass = character.getCssClass()
        this.character.square = this.index
        this.div.classList.clear
        this.div.classList.add(cssClass)
    }
    setEmpty() {
        this.div.className= ""
        this.character = null
    }

    setGround() {
        this.div.classList.add('ground')
    }
    hasAlien() {
        return (this.character != null && this.character.type === 'alien')
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
    constructor(name, imageCssClass, health, square, lineWidth) {
        this.name = name
        this.imageCssClass = imageCssClass
        this.health = health
        this.colorByHealthLevel = {
            1: 'green',
            2: 'blue'
        }
        this.square = square
        this.lineWidth = lineWidth
        this.type = 'alien'
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
    constructor(parent, width, setup) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []
        this.setup = setup
        this.alienLocations = setup.getAlienLocations()
        this.direction = 1
        this.defenderLocation = this.defenderStartPosition()

    }
    createChildSquareAddToSquares(index) {
        let div = document.createElement('div')
        this.parent.appendChild(div)
        const borders = []
        if (index >= this.bottomRow()) {
            borders.push('ground')
        } else if (index % this.width === 0) {
            borders.push('left')
        } else if (index % this.width === this.width-1) {
            borders.push('right')
        }
        this.squares.push(new Square(index, div, this.width, borders))
    }
    bottomRow() {
        return (this.width * this.width - this.width)
    }
    defenderStartPosition() {
        return this.width * this.width - (this.width + Math.floor(this.width / 2) + 1)
    }

    draw() {
        for (let i = 0; i < this.width * this.width; i++) {
            this.createChildSquareAddToSquares(i)
            if (this.alienLocations.includes(i)) {
                let invader = createInvader(this.squares[i].index, this.width)
                this.squares[i].setCharacter(invader)
                // this.aliens.push(invader)
            }
            if (i >= this.bottomRow()) {
                this.squares[i].setGround()
            }
        }
        let defender = new Defender('defender', this.width)
        this.squares[this.defenderLocation].setCharacter(defender)
    }

    
    moveAliens() {
        const aliensAtLeftBorder = this.squares[this.alienLocations[0]].isLeftBorder()
        const aliensAtRightBorder = this.squares[this.alienLocations[this.alienLocations.length - 1]].isRightBorder()
        if ((aliensAtLeftBorder && this.direction === -1) || (aliensAtRightBorder && this.direction === 1)) {
            this.direction = this.width
        } else if (this.direction === this.width) {
            if (aliensAtLeftBorder) this.direction = 1
            else this.direction = -1
        }
        for (let i = 0; i < this.squares.length - 1; i++) {
            if(this.squares[i].hasAlien()) {
                let c = this.squares[i].pickCharacterUp()
                this.aliens.push(c)
            }
        }
        for (let i = 0; i < this.alienLocations.length; i++) {
            this.alienLocations[i] = this.alienLocations[i] + this.direction
            
        }
        for (let i = 0; i < this.squares.length - 1; i++) {
            if (this.alienLocations.includes(i)) {
                let c = this.aliens.pop()          
                this.squares[i].setCharacter(c)
            }
        }
    }

    moveDefender(direction){
        console.log(this.squares[this.defenderLocation])
        let defenderAtLeftBorder = this.squares[this.defenderLocation].isLeftBorder()
        let defenderAtRightBorder = this.squares[this.defenderLocation].isRightBorder()
        let defender = this.squares[this.defenderLocation].pickCharacterUp()
        if (direction === 'left') {
            console.log(defenderAtLeftBorder)
            if (defenderAtLeftBorder) this.defenderLocation = this.defenderLocation
            else this.defenderLocation -= 1            
        } else if (direction === 'right') {
            if (defenderAtRightBorder) this.defenderLocation
            else this.defenderLocation += 1
        }
        
        this.squares[this.defenderLocation].setCharacter(defender)
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let grid = document.querySelector('.grid')
    let alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    ]
    setup = new Setup(alienInvaders, [], [])
    board = new Board(grid, 15, setup)
    board.draw(setup)
    console.log(board.defenderLocation)
    const startButton = document.querySelector('#start')
    startButton.addEventListener('mousedown', () => {
        board.moveAliens()
    })
    document.addEventListener('keydown', (e) => {
        if(e.keyCode === 37) {
            board.moveDefender('left')
        } else if (e.keyCode === 39) {
            board.moveDefender('right')
        }
    } )

})
