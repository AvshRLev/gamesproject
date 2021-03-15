class Square{
    constructor(indexOnBoard, div) {
        this.index = indexOnBoard
        this.div = div
    }
    setCharacter(character) {
        this.character = character
        this.div.class = character.getCssClass
    }
    isTaken() {}    
}

function createSquare(indexOnBoard, imageCssClass) {
    let square = new Square(indexOnBoard, imageCssClass)
    return square
}

class Defender{
    constructor(imageCssClass, indexOnBoard, lineWidth) {
        this.imageCssClass = imageCssClass
        this.indexOnBoard = indexOnBoard
        this.lineWidth = lineWidth
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
    _move(direction) {
        this.indexOnBoard = indexOnBoard + direction
    }
    moveLeft() {
        this._move(-1)
    } 
    moveRight() {
        this._move(1)
    } 
    moveDown() {
        this._move(this.lineWidth)
    }
    isDead() {
        return this.health === 0
    }
    draw(square) {
        if(this.isDead()) {
            square.class = 'empty'
        } else {
            square.classList.add(this.imageCssClass)
        }
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
        const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
        ]    
        for(let i = 0; i < width*width; i++) {
            let div = document.createElement('div') 
            this.parent.appendChild(div)
            this.squares.push(new Square(i, div)) 

            if (alienInvaders.includes(i)) {
                let invader = createInvader(alienInvaders[i], width)
                invader.draw(square)
                this.aliens.push(invader)
            } else if (i > width*width-width) {
                square.classList.add('ground')
            }
        }
    }
    
}