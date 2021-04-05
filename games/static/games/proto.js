class Game {
    constructor() {

    }
    controls() {
        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 37) {
                board.moveDefender('left')
            } else if (e.keyCode === 39) {
                board.moveDefender('right')
            } 
            if (e.keyCode === 32) board.shootRocket(e) 
        })
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

    isTop() {
        return this.index <= this.lineWidth
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
    constructor(imageCssClass, indexOnBoard, board) {
        this.imageCssClass = imageCssClass
        this.indexOnBoard = indexOnBoard
        this.board = board
    }
    fly() {
        let x = this.board.squares[this.indexOnBoard].pickCharacterUp()
        this.indexOnBoard = this.upTheBoard()
        this.board.squares[this.indexOnBoard].setCharacter(x)

    }
    upTheBoard() {
        newIndex = this.indexOnBoard - this.board.width
        return newIndex
    }
    getCssClass() {
        return this.imageCssClass
    }
    moveTo(square) {
        square.setCharacter(this)
    }
}

class Alien {
    constructor(name, health, square, lineWidth) {
        this.name = name
        this.imageCssClass = ['dead' , 'invader', 'intruder']
        this.health = health
        this.square = square
        this.lineWidth = lineWidth
        this.type = 'alien'
    }
    getCssClass() {
        return this.imageCssClass[this.health]
    }
    moveTo(square) {
        square.setCharacter(this)
    }
    isDead() {
        return this.health === 0
    }
}

function createInvader(health ,indexOnBoard, lineWidth) {
    let alien = new Alien('invader',health , indexOnBoard, lineWidth)
    return alien
}

function createIntruder(indexOnBoard, lineWidth) {
    return new Alien('intruder', 2, indexOnBoard, lineWidth)
}
const directionLeft = -1
const directionRight = 1

class Board {
    constructor(parent, width, setup) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []
        this.setup = setup
        this.setupObject = setup.getAlienLocations()
        this.alienLocations = Object.keys(this.setupObject).map(Number)
        this.alienHealthLevels = Object.values(this.setupObject)
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
                let health = this.alienHealthLevels.shift()
                let invader = createInvader(health, this.squares[i].index, this.width)
                this.squares[i].setCharacter(invader)
            }
            if (i >= this.bottomRow()) {
                this.squares[i].setGround()
            }
        }
        let defender = new Defender('defender', this.width)
        this.squares[this.defenderLocation].setCharacter(defender)
    }

    moveAliens() {
        this.direction = this.determineDirection()
        for (let i = 0; i < this.squares.length - 1; i++) {
            if(this.squares[i].hasAlien()) {
                let c = this.squares[i].pickCharacterUp()
                this.aliens.push(c)
            }
        }
        this.updateAlienLocations()
        for (let i = 0; i < this.squares.length - 1; i++) {
            if (this.alienLocations.includes(i)) {
                let c = this.aliens.shift()          
                this.squares[i].setCharacter(c)
            }
        }
    }

    updateAlienLocations() {
        return this.alienLocations = this.alienLocations.map(location =>location + this.direction)
    }

    determineDirection() { 
        let direction = this.direction    
        if (this.aliensHitBorder()) {            
            return this.directionDown()
        } 
        if (this.aliensMovingDown()) {
            if (this.aliensAtLeftBorder()){
                return directionRight
            }  
            return directionLeft                        
        } 
        return direction        
    }

    directionDown() {
        return this.width
    }

    aliensHitBorder() {
        return (this.aliensAtLeftBorder() && this.aliensMovingLeft()) || (this.aliensAtRightBorder() && this.aliensMovingRight())
    }

    aliensAtLeftBorder() {
        const leftMostAlien = this.alienLocations[0]
        return this.squares[leftMostAlien].isLeftBorder()
    }

    aliensMovingLeft() {
        return this.direction === directionLeft
    }

    aliensAtRightBorder() {
        const rightMostAlien = this.alienLocations[this.alienLocations.length - 1]
        return this.squares[rightMostAlien].isRightBorder()
    }

    aliensMovingRight() {
        return this.direction === directionRight
    }

    aliensMovingDown() {
        return this.direction === this.directionDown()
    }

    moveDefender(direction){
        let defender = this.pickDefenderUp()
        let nextMove = this.calculateNextDefenderMove(direction)
        this.defenderMove(nextMove)
        this.putDown(defender)
    }
    calculateNextDefenderMove(direction) {
        if (this.defenderCanMoveLeft(direction)) {
            return directionLeft            
        }
        if (this.defenderCanMoveRight(direction)) {            
            return directionRight
        }     
        return 0   
    }
    defenderMove(nextMove) {
        return this.defenderLocation = this.defenderLocation + nextMove
    }
    defenderCanMoveRight(direction) {
        return direction === 'right' && this.defenderNotAtRightBorder()
    }
    defenderCanMoveLeft(direction) {
        return direction === 'left' && this.defenderNotAtLeftBorder()
    }
    pickDefenderUp() {
        return this.squares[this.defenderLocation].pickCharacterUp()
    }
    putDown(defender) {
        return this.squares[this.defenderLocation].setCharacter(defender)
    }
    defenderNotAtLeftBorder() {
        return !this.squares[this.defenderLocation].isLeftBorder()
    }
    defenderNotAtRightBorder() {
        return !this.squares[this.defenderLocation].isRightBorder()
    }

    shootRocket(e) {
        let rocketId
        const squareAboveDefender = this.squares[this.defenderLocation-this.width]
        let rocket = new Rocket('rocket', squareAboveDefender, this)
        squareAboveDefender.setCharacter(rocket)
        function moveRocket() {
            let rocketInFlight = squareAboveDefender.pickCharacterUp()
            
            rocketInFlight.indexOnBoard = rocketInFlight.indexOnBoard - this.width
            try {
                this.squares[rocketInFlight.indexOnBoard].setCharacter(rocketInFlight)
            }
            catch(err) {
                console.log(rocketInFlight)
            }
        }
        switch(e.keyCode) {
            case 32:
                rocketId = setInterval(moveRocket , 100)
                break
        }
        
    }

    
}


document.addEventListener('DOMContentLoaded', () => {
    let grid = document.querySelector('.grid')
    let alienInvaders = {
        0:1, 1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1,
        15:1, 16:2, 17:2, 18:2, 19:2, 20:2, 21:2, 22:2, 23:2, 24:2,
        30:1, 31:1, 32:1, 33:2, 34:1, 35:1, 36:1, 37:1, 38:1, 39:1,
    }
    setup = new Setup(alienInvaders, [], [])
    board = new Board(grid, 15, setup)
    board.draw(setup)
    const startButton = document.querySelector('#start')
    startButton.addEventListener('mousedown', () => {
        board.moveAliens()
    })
    game = new Game()
    game.controls()
    
    

})





// moveRocket(rocket, rocketId) {        
        
    //     let rocketLocation = rocket.indexOnBoard.index 
    //     let til = this.squares[rocketLocation].pickCharacterUp()
    //     rocket.indexOnBoard.index -= this.width
    //     let nextSquare = this.squares[rocket.board.squares.index]
    //     if (nextSquare.hasAlien()) {
    //         if(nextSquare.character.isDead()) {
    //             nextSquare.setCharacter(til)
    //         } else {
    //             clearInterval(rocketId) 
    //             console.log(nextSquare.character.health)              
    //             nextSquare.character.health -= 1
    //             let alienHit = nextSquare.pickCharacterUp()
    //             console.log(alienHit)
    //             nextSquare.setCharacter(alienHit)
    //         }            
    //     } else if(nextSquare.isTop()) {
    //         clearInterval(rocketId) 
    //     } else {
    //         nextSquare.setCharacter(til)
    //     }         
    //     // if(nextSquare.isTop()) {
    //     //     nextSquare.setCharacter(til)
    //     //     nextSquare.pickCharacterUp(til)
    //     //     clearInterval(rocketId)

    //     // } else {nextSquare.setCharacter(til)}
    // } 