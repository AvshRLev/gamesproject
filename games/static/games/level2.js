document.addEventListener('DOMContentLoaded', () => {
    const grid = createGrid()
    const squares = Array.from(grid.querySelectorAll('div'))
    const resultDisplay = document.querySelector('#result')
    const timeDisplay = document.querySelector('#time')
    const startButton = document.querySelector('#start')
    const reStartButton = document.querySelector('#restart')
    let width = 15
    createSides()
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let result = 0
    let time = 0
    let drow1 = 1
    let drow2 = 1
    let drow3 = 1
    direction = 1
    let invaderId = 0
    let timerId
    const row1 = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ]
    const row2 = [
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ]
    const row3 = [
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]
    disablePlayer()

    function createSides() {
        for(let i = 0; i < 220; i++) {
            if (i % width === 0) {
                squares[i].classList.add('leftSide')
            } else if ((i === 14 ) || (i % 15 === 14)) {
                squares[i].classList.add('rightSide')
            }
        }
    }
    
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
                    moveInvaders2(row1);
                    moveInvaders2(row2);
                    moveInvaders2(row3);
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
        squares[currentShooterIndex].classList.remove('shooter')
        squares[currentShooterIndex].classList.remove('boom')
        clearInterval(invaderId)
        clearInterval(timerId)
        disablePlayer(shoot,moveShooter)
        width = 15
        currentShooterIndex = 202
        currentInvaderIndex = 0
        alienInvadersTakenDown = []
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

    // define the alien invaders
    // const alienInvaders = [
    //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    //     // 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    //     // 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    // ]

    

    // let restartInvaders = [
    //     0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    //     // 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    //     // 30, 31, 32, 33, 34, 35, 36, 37, 38, 39 
    // ]

    function draw() {
        row1.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
        row2.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
        row3.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
        squares[currentShooterIndex].classList.add('shooter')
    }
    draw()


    // move the alien invaders
    function moveRight(row) {
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.remove('invader')
        }
        for (let i = 0; i <= row.length -1; i++) {
            row[i]++
        }
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.add('invader')
        }
    }
    
    function moveLeft(row) {
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.remove('invader')
        }
        for (let i = 0; i <= row.length -1; i++) {
            row[i]--
        }
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.add('invader')
        }
    }
    function moveDown(row) {
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.remove('invader')
        }
        for (let i = 0; i <= row.length -1; i++) {
            row[i] += width
        }
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.add('invader')
        }
    }    
        
    function moveInvaders2(row) {
        if (squares[row[0]].classList.contains('leftSide')) {
            for(let i = 0; i < 5; i++) {
                moveRight(row)
            }
            
        } else if (squares[row[row.length -1]].classList.contains('rightSide')) {
            moveLeft(row)
        }
    }
    
    function moveInvaders(row) {
        const leftEdge = squares[row[0]].classList.contains('leftSide')
        const rightEdge = squares[row[row.length -1]].classList.contains('rightSide')
        direction = `d${row}`

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width
        } else if (direction === width) {
            if (leftEdge) {
                direction = 1
            } else {
                direction = -1
            }        
        }
        for (let i = 0; i <= row.length -1; i++) {
            squares[row[i]].classList.remove('invader')
        }
        for (let i = 0; i <= row.length -1; i++) {
            row[i] += direction
        }
        for (let i = 0; i <= row.length -1; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[row[i]].classList.add('invader')
            }
            
        }
        // lose()
        // win()
    }

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

    function lose() {
        // decide a game over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            squares[currentShooterIndex].classList.add('boom')
            clearInterval(invaderId)
            clearInterval(timerId)
            disablePlayer(shoot, moveShooter)
        }

        for (let i = 0; i <= alienInvaders.length -1; i++) {
            if (alienInvaders[i] > squares.length - (width-1)) {
                clearInterval(invaderId)
                clearInterval(timerId)
                disablePlayer(shoot, moveShooter)

            }
        }
    }
    
    function win() {
        // declare a win
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            clearInterval(invaderId)
            clearInterval(timerId)
            disablePlayer(shoot, moveShooter)
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
                

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakenDown)
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


