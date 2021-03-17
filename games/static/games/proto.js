class Game{
    constructor() {

    }

}

class Setup{
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

class Square{
    constructor(indexOnBoard, div, lineWidth) {
        this.index = indexOnBoard
        this.div = div
        this.lineWidth = lineWidth
    }
    setCharacter(character) {
        this.character = character
        let cssClass = character.getCssClass()
        this.div.classList.add(cssClass)
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

}

class Defender{
    constructor(imageCssClass, indexOnBoard, lineWidth) {
        this.imageCssClass = imageCssClass
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

class Rocket{
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

class Alien{
    constructor(name, imageCssClass, health, indexOnBoard, lineWidth ) {
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
    let alien =  new Alien('invader', 'invader', 1, indexOnBoard, lineWidth)
    return alien
}

function createIntruder(indexOnBoard, lineWidth) {
    return new Alien('intruder', 'intruder', 2, indexOnBoard, lineWidth)
}

class Board{
    constructor(parent, width) {
        this.parent = parent
        this.width = width
        this.aliens = []
        this.squares = []
        
    }
    createChildSquareAddToSquares(index) {
        let div = document.createElement('div') 
        this.parent.appendChild(div)
        this.squares.push(new Square(index, div, this.width)) 
        // return ?
    }
    draw(setup) {
        let alienLocations = setup.getAlienLocations()
        for(let i = 0; i < width*width; i++) {
            this.createChildSquareAddToSquares(i)
        }
        if(alienLocations.includes(i)) {
            let invader = createInvader(alienLocations[i], width)
            this.squares[i].setCharacter(invader)
        } else if (i > width*width-width) {
            this.squares[i].div.classList.add('ground')
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

// const alienInvaders = [
//         0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
//         15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
//         30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
//         ]            

document.addEventListener('DOMContentLoaded', () => {
    testDiv = document.querySelector('.test')
    square = new Square(0, testDiv)
    rocket = new Rocket('rocket', 0)
    invader = createInvader(0, 1)
    defender = new Defender('defender', 5)
    square.setCharacter(defender)
})