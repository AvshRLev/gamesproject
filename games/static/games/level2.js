class Defender{
    constructor() {

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
            let square = document.createElement('div') 
            this.squares.push(square)           
            this.parent.appendChild(square)
            if (alienInvaders.includes(i)) {
                let invader = createInvader(alienInvaders[i], width)
                invader.draw(square)
                this.aliens.push(invader)
            } else if (i > width*width-width) {
                square.classList.add('ground')
            }
        }
    }
    move() {
        for(let i = 0; i < this.aliens.length; i++) {
            this.aliens.forEach(invader => {
                invader.moveRight()
            })
        }
    }
}





document.addEventListener('DOMContentLoaded', () => {
    const grid = createGrid()
    const squares = Array.from(grid.querySelectorAll('div'))
    const resultDisplay = document.querySelector('#result')
    const timeDisplay = document.querySelector('#time')
    const startButton = document.querySelector('#start')
    const reStartButton = document.querySelector('#restart')
    let width = 15
    let currentShooterIndex
    let currentInvaderIndex
    let currentIntruderIndex
    let alienInvadersTakenDown
    let alienIntrudersTakenDown
    let result
    let time
    let direction    
    let intruderDirection
    let invaderId
    let timerId
    
    disablePlayer()
    setInitialValues()
    // addGround()

    function setInitialValues() {
        width = 15
        currentShooterIndex = 202
        currentInvaderIndex = 0
        currentIntruderIndex = 0
        alienInvadersTakenDown = []
        alienIntrudersTakenDown = []
        result = 0
        time = 0
        direction = 1
        intruderDirection = 1
        invaderId = 0
        timerId = 0
    }
    
    function createGrid(){
        let grid = document.querySelector(".grid")
        let board = new Board(grid, 15)
        return (grid);
    }
    
    function addGround() {
        for (let i = squares.length - 1; i >= squares.length - width; i--) {
            squares[i].classList.add('ground')
        }
        return squares
    }

    reStartButton.addEventListener('mousedown', () => {
        restart()
    })

    startButton.addEventListener('mousedown', () => {
            if (timerId && invaderId) {
                stopGame(timerId, invaderId, shoot, moveShooter)
                timerId = null
            } else {
                timerId = setInterval(addTime, 1000)
                invaderId = setInterval(function () {
                    moveIntruders();
                    moveInvaders();
                }, 500)
                document.addEventListener('keyup', shoot )
                document.addEventListener('keydown', moveShooter)
            }
        })

    function restart() {
        resetAlienPositions('invader', alienInvaders, restartInvaders)
        resetAlienPositions('intruder', alienIntruders, restartIntruders)
        squares[currentShooterIndex].classList.remove('shooter')
        squares[currentShooterIndex].classList.remove('boom')
        stopGame(invaderId, timerId, shoot, moveShooter)
        setInitialValues()
        resultDisplay.innerHTML = 00
        timeDisplay.innerHTML = 00
        draw()
    }

    function resetAlienPositions(alienClassName, alienArray, restartAliens) {
        for (let i = 0; i <= alienArray.length -1; i++) {
            squares[alienArray[i]].classList.remove(alienClassName)
            alienArray[i] = restartAliens[i]
        }
    }

    function addTime() {
        time += 1
        timeDisplay.innerHTML = time
    }

    const alienInvaders = [
        // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        // 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        // 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    ]

    const restartInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    ]
    const alienIntruders = [
        // 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    ]

    const restartIntruders = [
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    ]

    function draw() {
        // alienIntruders.forEach(intruder => squares[currentIntruderIndex + intruder].classList.add('intruder'))
        // alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
        squares[currentShooterIndex].classList.add('shooter')
    }
    draw()

    // move the shooter along a line
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter')
        switch(e.keyCode) {
            case 37:
                if(currentShooterIndex % width !== 0) currentShooterIndex -=1
                break
            case 39:
                if(currentShooterIndex % width < width - 1) currentShooterIndex +=1
                break
        }
        squares[currentShooterIndex].classList.add('shooter')
    }
    
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0
        const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1
        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else direction = -1
        }
        moveAliens(alienInvaders,direction, 'invader', alienInvadersTakenDown)
        lose()    
        // win()
    }

    function moveIntruders() {
        const leftEdge = alienIntruders[0] % width === 0
        const rightEdge = alienIntruders[alienIntruders.length -1] % width === width -1
        if ((leftEdge && intruderDirection === -1) || (rightEdge && intruderDirection === 1)) {
            intruderDirection = width
        } else if (intruderDirection === width) {
            if (leftEdge) intruderDirection = 1
            else intruderDirection = -1
        }
        moveAliens(alienIntruders,intruderDirection, 'intruder', alienIntrudersTakenDown)
        lose()    
        // win()
    }

    function moveAliens(alienArray, alienDirection, alienClassName, aliensTakenDown) {
        for (let i = 0; i <= alienArray.length -1; i++) {
            squares[alienArray[i]].classList.remove(alienClassName)
        }
        for (let i = 0; i <= alienArray.length -1; i++) {
            alienArray[i] += alienDirection
        }
        for (let i = 0; i <= alienArray.length -1; i++) {
            if (!aliensTakenDown.includes(i)) {
                squares[alienArray[i]].classList.add(alienClassName)
            }         
        }
    }
    
    function lose() {
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter') 
        || squares[currentShooterIndex].classList.contains('intruder', 'shooter')) {
            squares[currentShooterIndex].classList.add('boom')
            stopGame(invaderId, timerId, shoot, moveShooter)
            console.log('you lost because invaders touched you')
        }

        for (let i = squares.length -1; i >= squares.length - width ; i--) {
            if (squares[i].classList.contains('invader', 'ground') 
            || squares[i].classList.contains('intruder', 'ground')) {
                stopGame(invaderId, timerId, shoot, moveShooter)
                console.log(`you lost because invaders reached the ground`)
            }
        }
    }

    function win() {
        if (alienInvadersTakenDown.length + alienIntrudersTakenDown.length === (alienInvaders.length + alienIntruders.length)) {
            stopGame(invaderId, timerId, shoot, moveShooter)
            console.log('you win')
        }
     }

    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')
            if (squares[currentLaserIndex].classList.contains('invader')) {
                removeLaserAndRemoveAlien('invader',alienInvaders, alienInvadersTakenDown)
                result++
                resultDisplay.textContent = result
            } else if (squares[currentLaserIndex].classList.contains('intruder')) {
                removeLaserAndRemoveAlien('intruder',alienIntruders, alienIntrudersTakenDown)
                result++
                resultDisplay.textContent = result
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        function removeLaserAndRemoveAlien(alienClassName, alienKind, aliensTakenDown) {
            clearInterval(laserId)
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove(alienClassName)
            squares[currentLaserIndex].classList.add('boom')
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
            const alienTakenDown = alienKind.indexOf(currentLaserIndex)
            aliensTakenDown.push(alienTakenDown)
        }
        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }
    
})

function stopGame(invaderId, timerId, shoot, moveShooter) {
    clearInterval(invaderId)
    clearInterval(timerId)
    disablePlayer(shoot, moveShooter)
}

function disablePlayer(shoot, moveShooter) {
    document.removeEventListener('keyup', shoot)
    document.removeEventListener('keydown', moveShooter)
}

