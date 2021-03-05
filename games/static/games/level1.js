document.addEventListener('DOMContentLoaded', () => {
    const grid = createGrid()
    const squares = Array.from(grid.querySelectorAll('div'))
    const resultDisplay = document.querySelector('#result')
    const timeDisplay = document.querySelector('#time')
    const startButton = document.querySelector('#start')
    const reStartButton = document.querySelector('#restart')
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let currentIntruderIndex = 0
    let alienInvadersTakenDown = []
    let alienIntrudersTakenDown = []
    let result = 0
    let time = 0
    let direction = 1
    let intruderDirection = 1
    let invaderId = 0
    let timerId

    disablePlayer()
    
    function createGrid(){
        let grid = document.querySelector(".grid")
        for(let i = 0; i < 220; i++) {
            let gridElement = document.createElement('div')            
            grid.appendChild(gridElement)
        }
        return grid;
    }

    reStartButton.addEventListener('mousedown', () => {
        restart()
    })

    startButton.addEventListener('mousedown', () => {
            if (timerId && invaderId) {
                clearInterval(timerId)
                clearInterval(invaderId)
                timerId = null
                disablePlayer(shoot,moveShooter)
            } else {
                timerId = setInterval(addTime, 1000)
                invaderId = setInterval(function () {
                     moveInvaders();
                     moveIntruders();
                }, 500)
                document.addEventListener('keyup', shoot )
                document.addEventListener('keydown', moveShooter)
            }
        })

    function restart() {
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            alienInvaders[i] = restartInvaders[i]
        }
        for (let i = 0; i <= alienIntruders.length -1; i++) {
            squares[alienIntruders[i]].classList.remove('intruder')
        }
        for (let i = 0; i <= alienIntruders.length -1; i++) {
            alienIntruders[i] = restartIntruders[i]
        }
        squares[currentShooterIndex].classList.remove('shooter')
        squares[currentShooterIndex].classList.remove('boom')
        clearInterval(invaderId)
        clearInterval(timerId)
        disablePlayer(shoot,moveShooter)
        width = 15
        currentShooterIndex = 202
        currentInvaderIndex = 0
        alienInvadersTakenDown = []
        alienIntrudersTakenDown = []
        result = 0
        time = 0
        invaderId = 0
        timerId = 0
        resultDisplay.innerHTML = 00
        timeDisplay.innerHTML = 00
        draw()
    }

    function addTime() {
        time += 1
        timeDisplay.innerHTML = time
    }

    // timerId = setInterval(addTime, 1000)

    // define the alien invaders
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    ]

    const alienIntruders = [
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    ]

    const restartIntruders = [
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    ]

    const restartInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    ]

    function draw() {
        // draw bthe alien invaders
        alienIntruders.forEach(intruder => squares[currentIntruderIndex + intruder].classList.add('intruder'))
        alienInvaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
        
        // draw the shooter
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
    

    // move the alien invaders
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0
        const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1
        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) direction = 1
            else direction = -1
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            alienInvaders[i] += direction
        }
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader')
            } 
        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if(alienIntrudersTakenDown.includes[i]) {
                squares[alienIntruders[i]].classList.add('invader')
            }
        }        
        }
        // decide a game over
        lose()    
        // declare a win
        win()
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
        for (let i = 0; i <= alienIntruders.length -1; i++) {
            squares[alienIntruders[i]].classList.remove('intruder')
        }
        for (let i = 0; i <= alienIntruders.length -1; i++) {
            alienIntruders[i] += intruderDirection
        }
        for (let i = 0; i <= alienIntruders.length -1; i++) {
            if (!alienIntrudersTakenDown.includes(i)) {
                squares[alienIntruders[i]].classList.add('intruder')
            }            
        }
        // decide a game over
        lose()    
        // declare a win
        win()
    }
     function lose() {
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter') 
        || squares[currentShooterIndex].classList.contains('intruder', 'shooter')) {
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
            clearInterval(timerId)
            disablePlayer(shoot, moveShooter)
            console.log('you lost because invaders touched you')
        }

        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if (alienInvaders[i] > squares.length - (width-1) 
            || alienIntruders[i] > squares.length - (width-1)) {
                clearInterval(invaderId)
                clearInterval(timerId)
                disablePlayer(shoot, moveShooter)
                console.log(`you lost because invaders reached the ground`)
            }
        }
     }
     function win() {
        if (alienInvadersTakenDown.length + alienIntrudersTakenDown.length === (alienInvaders.length + alienIntruders.length)) {
            clearInterval(invaderId)
            clearInterval(timerId)
            disablePlayer(shoot, moveShooter)
            console.log('you win')
        }
     }

    // Shoot at aliens
    function shoot(e) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        // Move the laser from the shooter to the alien invaders
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')
            if (squares[currentLaserIndex].classList.contains('invader')) {
                clearInterval(laserId)
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')
                squares[currentLaserIndex].classList.add('boom')
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                const invaderTakenDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(invaderTakenDown)
                result++
                resultDisplay.textContent = result
            } else if (squares[currentLaserIndex].classList.contains('intruder')) {
                clearInterval(laserId)
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('intruder')                
                squares[currentLaserIndex].classList.add('boom')
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
                squares[currentLaserIndex].classList.add('invader')
                const intrudersTakenDown = alienIntruders.indexOf(currentLaserIndex)
                alienIntrudersTakenDown.push(intrudersTakenDown)
                console.log(alienIntrudersTakenDown)
                result++
                resultDisplay.textContent = result
            }

            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
            }
        }

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }
    
})

function disablePlayer(shoot, moveShooter) {
    document.removeEventListener('keyup', shoot)
    document.removeEventListener('keydown', moveShooter)
}


