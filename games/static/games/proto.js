class Game {
    constructor(setup) {
        this.setup = setup
    }
    start() {
        let alienMovementId
        let grid = document.querySelector('.grid')
        let board = new Board(grid, 15, this.setup)
        board.draw(this.setup)
        this.controls(board)
        alienMovementId = setInterval(() => { 
            if (board.alienLocations.length === 0) clearInterval(alienMovementId)
            board.moveAliens() }, 500)
        const startButton = document.querySelector('#level1')
        startButton.addEventListener('mousedown', () => {
            alienMovementId = setInterval(() => { board.moveAliens() }, 500)
        })
        const stopButton = document.querySelector('#level2')
        stopButton.addEventListener('mousedown', () => {
            clearInterval(alienMovementId)
        })
    }
    controls(board) {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                board.moveDefender('left')
            }
            if (e.key === 'ArrowRight') {
                board.moveDefender('right')
            }

        })
        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                board.shootRocket()
            }
        })
    }

}

class Setup {
    constructor(alienLocations, gameSpeed) {
        this.alienLocations = alienLocations
        this.gameSpeed = gameSpeed
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
        return this.index < this.lineWidth
    }

    setCharacter(character) {
        this.character = character
        let cssClass = character.getCssClass()
        this.character.square = this.index
        this.div.classList.clear
        this.div.classList.add(cssClass)
    }
    setEmpty() {
        this.div.className = ""
        this.character = null
    }

    setGround() {
        this.div.classList.add('ground')
    }
    hasAlien() {
        if (this.character != null && this.character.health === 0) this.setEmpty()
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
    hasDeadAlien() {
        return (this.character.type === 'alien' && this.character.isDead())
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
    constructor(imageCssClass, index, board) {
        this.imageCssClass = imageCssClass
        this.index = index
        this.board = board
    }
    isAlien() {
        return false
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
        this.imageCssClass = ['dead', 'invader', 'intruder']
        this.health = health
        this.square = square
        this.lineWidth = lineWidth
        this.type = 'alien'
    }
    getCssClass() {
        return this.imageCssClass[this.health]
    }
    isAlien() {
        return true
    }
    moveTo(square) {
        square.setCharacter(this)
    }
    isDead() {
        return this.health === 0
    }
}

function createInvader(health, indexOnBoard, lineWidth) {
    let alien = new Alien('invader', health, indexOnBoard, lineWidth)
    return alien
}

function createIntruder(indexOnBoard, lineWidth) {
    return new Alien('intruder', 2, indexOnBoard, lineWidth)
}
const DIRECTION_LEFT = -1
const DIRECTION_RIGHT = 1
const DIRECTION_NON = 0

class Board {
    constructor(parent, width, setup) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []
        this.setup = setup
        this.setupObject = setup.getAlienLocations()
        this.alienLocations = Object.keys(this.setupObject).map(Number)
        this.initialAlienLocations = this.alienLocations
        this.alienHealthLevels = Object.values(this.setupObject)
        this.direction = DIRECTION_RIGHT
        this.previousDirection = DIRECTION_RIGHT
        this.defenderLocation = this.defenderStartPosition()
        this.counter = 0

    }

    createChildSquareAddToSquares(index) {
        let div = document.createElement('div')
        this.parent.appendChild(div)
        const borders = []
        if (index >= this.bottomRow()) {
            borders.push('ground')
        } else if (index % this.width === 0) {
            borders.push('left')
        } else if (index % this.width === this.width - 1) {
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
        this.alienLocations = this.calculateAlienLocations()
        for (let i = 0; i < this.squares.length - 1; i++) {
            if (this.squares[i].hasAlien()) {
                let c = this.squares[i].pickCharacterUp()
                this.aliens.push(c)
            }
        }
        
        for (let i = 0; i < this.squares.length; i++) {
            if (this.alienLocations.includes(i)) {
                let c = this.aliens.shift()
                this.squares[i].setCharacter(c)
            }
        }
    }


    calculateAlienLocations() {
        return this.squares
            .filter(square => square.hasAlien())
            .map(square => square.index + this.direction)
    }

    determineDirection() {
        let nextMove = calcNextAlienMove(this.previousDirection, this.counter, 5, this.directionDown())
        this.direction = nextMove.direction
        this.previousDirection = nextMove.previousDirection
        this.counter = nextMove.counter
        return nextMove.direction
    }

    changeDirection() {
        this.previousDirection = getTheOppositeOf(this.previousDirection)
    }
    
    aliensAtLeftBorder() {
        let aliensAtLeftBorder = this.squares
        .filter(square => square.hasAlien())
        .filter(square => square.isLeftBorder())
        if (aliensAtLeftBorder.length === 0) return false
        else return true
    }

    aliensMovingLeft() {
        return this.direction === DIRECTION_LEFT
    }

    aliensAtRightBorder() {
        let aliensAtRightBorder = this.squares
        .filter(square => square.hasAlien())
        .filter(square => square.isRightBorder())
        if (aliensAtRightBorder.length === 0) return false
        else return true
    
    }

    aliensMovingRight() {
        return this.direction === DIRECTION_RIGHT
    }

    directionDown() {
        return this.width
    }

    aliensHitBorder() {
        return (this.aliensAtLeftBorder() && this.aliensMovingLeft()) || (this.aliensAtRightBorder() && this.aliensMovingRight())
    }

    aliensMovingDown() {
        return this.direction === this.directionDown()
    }

    moveDefender(direction) {
        let defender = this.pickDefenderUp()
        let nextMove = this.calculateNextDefenderMove(direction)
        this.defenderMove(nextMove)
        this.putDown(defender)
    }  
    calculateNextDefenderMove(direction) {
        if (this.defenderCanMoveLeft(direction)) {
            return DIRECTION_LEFT
        }
        if (this.defenderCanMoveRight(direction)) {
            return DIRECTION_RIGHT
        }
        return DIRECTION_NON
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

    shootRocket() {
        let rocketId
        let rocket = this.createRocket()
        let rocketLocation = this.getIndexOf(rocket)
        let nextRocketLocation = this.getNextIndexOf(rocket)
        this.squareAt(rocketLocation).setCharacter(rocket)
        rocketId = setInterval(() => {
            let rocketInFlight = this.liftRocketAt(rocketLocation)
            if (rocketInFlight.isAlien()) {
                this.squareAt(rocketLocation).setCharacter(rocket)
                rocketInFlight = this.liftRocketAt(rocketLocation)
            }            
            this.updateIndexOf(rocket)
            rocketLocation = this.getIndexOf(rocket)
            nextRocketLocation = this.update(nextRocketLocation)
            if (this.theTopIs(rocketLocation)) {
                clearInterval(rocketId)
                this.waitAndEraseRocketAt(rocketLocation) 
            }
            if (this.squareAt(nextRocketLocation)) {
                if (this.squareAt(nextRocketLocation).hasAlien()) {            
                    clearInterval(rocketId)
                    this.waitAndEraseRocketAt(rocketLocation)
                    this.squareAt(nextRocketLocation).character.health -= 1
                    let alienHit = this.squareAt(nextRocketLocation).pickCharacterUp()
                    this.squareAt(nextRocketLocation).setCharacter(alienHit)
                }
            }
            if (this.squareAt(rocketLocation).hasAlien()) this.squareAt(rocketLocation).setEmpty()
            this.squareAt(rocketLocation).setCharacter(rocketInFlight)

        }, 100);
    }
    waitAndEraseRocketAt(rocketLocation) {
        setTimeout(() => { this.liftRocketAt(rocketLocation) }, 100)
    }
    theTopIs(rocketLocation) {
        return this.squareAt(rocketLocation).isTop()
    }
    update(nextRocketLocation) {
        return nextRocketLocation + this.directionUp()
    }
    updateIndexOf(rocket) {
        rocket.index = rocket.index + this.directionUp()
    }
    liftRocketAt(rocketLocation) {
        return this.squareAt(rocketLocation).pickCharacterUp()
    }
    getNextIndexOf(rocket) {
        return rocket.index + this.directionUp()
    }
    getIndexOf(rocket) {
        return rocket.index
    }
    createRocket() {
        return new Rocket('rocket', this.squareAboveDefender(), this)
    }
    
    squareAboveDefender() {
        return this.defenderLocation - this.width
    }

    squareAt(rocketLocation) {
        return this.squares[rocketLocation]
    }

    directionUp() {
        return -this.width
    }
    
}
function calcNextAlienMove(previousDirection, counter, numberOfMoves, down) {
    if (counter < numberOfMoves) {
        return {
            'counter': increaseByOne(counter),
            'previousDirection':  previousDirection, 
            'direction': previousDirection,
            
        }
    }
    if (counter === numberOfMoves) {
        return {
            'counter': zero(counter),
            'previousDirection': getTheOppositeOf(previousDirection),
            'direction': down,
            
        }
    }
}

function increaseByOne(counter){
    return counter += 1
}

function zero(counter) {
    return counter = 0
}

function getTheOppositeOf(direction) {
    return direction * -1
}

document.addEventListener('DOMContentLoaded', () => {
    // let grid = document.querySelector('.grid')
    let alienInvaders = {
        0: 2, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
        15: 2, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1,
        30: 2, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1,
    }
    setup = new Setup(alienInvaders, [])
    
    const startButton = document.querySelector('#start')
    startButton.addEventListener('mousedown', () => {
        board.moveAliens()
    })
    game = new Game(setup)
    game.start()
    



})





            // let rocketInFlight = this.squareAt(rocketLocation).pickCharacterUp()
            // console.log(rocketInFlight)
            // if (this.squareAt(nextRocketLocation).hasAlien()) {
            //     clearInterval(rocketId)
            // }
            // if(this.squareAt(nextRocketLocation).isTop()) {
            //     clearInterval(rocketId)
            // }
            // this.squareAt(nextRocketLocation).setCharacter(rocketInFlight)
            // rocketLocation -= this.width
