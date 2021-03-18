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

    isRightBorder() {
        return this.borders.contains('right')
    }

    isGround() {
        return this.borders.contains('ground')
    }

    setCharacter(character) {
        this.character = character
        let cssClass = character.getCssClass()
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
        return (this.div.classList.contains('invader') || this.div.classList.contains('intruder'))
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
    constructor(parent, width, setup) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []
        this.setup = setup
        this.alienLocations = setup.getAlienLocations()
        this.direction = 1

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
    defenderLocation() {
        return this.width * this.width - (this.width + Math.floor(this.width / 2) + 1)
    }

    draw() {
        for (let i = 0; i < this.width * this.width; i++) {
            this.createChildSquareAddToSquares(i)
            if (this.alienLocations.includes(i)) {
                let invader = createInvader(this.alienLocations[i], this.width)
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

    // _movement(direction) {    
    //     for (let i = 0; i < this.squares.length - 1; i++) {
    //         this.alienLocations[i] = this.alienLocations[i] + direction
    //         let nextSquare = this.squares[i + direction]
    //         if (this.alienLocations.includes(i)) {                
    //             let invader = createInvader(this.alienLocations[i], this.width)
    //             nextSquare.setCharacter(invader)            
    //         }
    //     }
    // }
    // moveRight() {
    //     this._movement(this.direction)
    // }
    // moveLeft() {
    //     this._movement(this.direction)
    // }
    // moveDown() {
    //     this._movement(this.direction)
    // }
    determineDirection() {           
        // if (this.squares[this.alienLocations[0]].borders.includes('left') && this.direction === -1
        // || this.squares[this.alienLocations[this.alienLocations.length-1]].borders.includes('right') && this.direction === 1 ) {
        //     this.direction = this.width
        // } else if (this.direction === this.width) {
        //     if (this.squares[this.alienLocations[0]].borders.includes('left')) this.direction = 1
        //     else this.direction = -1 
        // }        
        for (let i = 0; i < this.squares.length - 1; i++) {
            if (this.squares[i].isRightBorder && this.squares[i].hasAlien && this.direction === 1
                || this.squares[i].isLeftBorder && this.squares[i].hasAlien && this.direction === -1) {
                    console.log(this.direction)
                    this.direction = this.width
                    console.log(this.direction)
            } else if (this.direction === this.width) {
                if (this.squares[i].isRightBorder && this.squares[i].hasAlien) this.direction = 1
                else this.direction = -1
            }
        }
    }
    move() {
        for (let i = 0; i < this.squares.length - 1; i++) {
            let square = this.squares[i]
            if (this.alienLocations.includes(i)) {
                square.pickCharacterUp() 
            }
        }
        this.determineDirection()
        for (let i = 0; i < this.squares.length - 1; i++) {
        this.alienLocations[i] = this.alienLocations[i] + this.direction
        let nextSquare = this.squares[i + this.direction]
        if (this.alienLocations.includes(i)) {                
            let invader = createInvader(this.alienLocations[i], this.width)
            nextSquare.setCharacter(invader)            
        }
    }
        // this.determineDirection()    
        
        // this.moveDown()
            
        
    }

        
    
}


document.addEventListener('DOMContentLoaded', () => {
    // testDiv = document.querySelector('.test')
    // square = new Square(0, testDiv)
    // rocket = new Rocket('rocket', 0)
    // invader = createInvader(0, 1)
    // defender = new Defender('defender', 5)
    // square.setCharacter(defender)
    let grid = document.querySelector('.grid')
    let alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
    setup = new Setup(alienInvaders, [], [])
    board = new Board(grid, 15, setup)
    board.draw(setup)
    const startButton = document.querySelector('#start')
    startButton.addEventListener('mousedown', () => {
        board.move()
    })

})
