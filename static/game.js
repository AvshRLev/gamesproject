const zero = require('./zero')
const Board = require('./board.js')

const BOARD_WIDTH = 15;

class Game {
  constructor(setup) {
    this.setup = setup;
    this.grid = document.querySelector(".grid");
    this.startButton = document.querySelector("#start");
    this.restartButton = document.querySelector("#restart");
    this.timeDisplay = document.querySelector("#time");
    this.time = 0;
    this.scoreDisplay = document.querySelector("#score");
    this.score = 0;
    this.isRunning = false;
  }
  keepScore(board) {
    this.score = this.updateScore(board);
    this.scoreDisplayUpdate();
  }

  updateScore(board) {
    return board.score;
  }

  scoreDisplayUpdate() {
    this.scoreDisplay.innerHTML = this.score.toLocaleString("en-US", {
      minimumIntegerDigits: 4,
      useGrouping: false,
    });
  }

  scoreReset() {
    this.score = zero();
    this.scoreDisplayUpdate();
  }

  timerRun() {
    if (this.isRunning) {
      this.time = addOneTo(this.time);
      this.timeDisplayUpdate();
    }
  }
  timerReset() {
    this.time = zero();
    this.timeDisplayUpdate();
  }
  timeDisplayUpdate() {
    this.timeDisplay.innerHTML = this.time.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }

  announceLose(gameId) {
    this.grid.innerHTML = "";
    this.grid.classList.remove("youwin");
    this.grid.classList.add("youlose");
    clearInterval(gameId);
    this.gamePause();
  }
  start() {
    let gameId = 0;
    let timerId = 0;
    let scoreId = 0;
    scoreId = setInterval(() => {
      this.keepScore(board);
    }, 100);
    timerId = setInterval(() => {
      this.timerRun();
    }, 1000);
    let startButtonEventHandler = () => {
      if (gameId) {
        clearInterval(gameId);
        gameId = zero();
        this.gamePause();
        return;
      }
      this.gameRun();
      gameId = setInterval(() => {
        if (allAliensDeadOn(board)) {
          this.announceWin(gameId);
          return;
        }
        if (aliensHitGround(board)) {
          this.announceLose(gameId);
          return;
        }
        board.moveAliens();
      }, 500);
    };
    let restartButtonEventHandler = () => {
      clearInterval(gameId);
      clearInterval(timerId);
      clearInterval(scoreId);
      this.timerReset();
      this.scoreReset();
      this.restart(startButtonEventHandler, restartButtonEventHandler);
    };
    let board = new Board(this.grid, BOARD_WIDTH, this.setup);
    this.startButton.addEventListener("mousedown", startButtonEventHandler);
    board.draw(this.setup);
    this.controls(board);
    this.restartButton.addEventListener("mousedown", restartButtonEventHandler);
  }
  announceWin(gameId) {
    this.grid.innerHTML = "";
    this.grid.classList.remove("youlose");
    this.grid.classList.add("youwin");
    clearInterval(gameId);
    this.gamePause();
  }
  restart(startButtonEventHandler, restartButtonEventHandler) {
    this.startButton.removeEventListener("mousedown", startButtonEventHandler);
    this.restartButton.removeEventListener(
      "mousedown",
      restartButtonEventHandler
    );
    this.cleanBoard();
    this.gamePause();
    this.start();
  }
  cleanBoard() {
    this.grid.innerHTML = "";
  }
  gamePause() {
    this.isRunning = false;
  }
  gameRun() {
    this.isRunning = true;
  }
  controls(board) {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && this.isRunning) {
        board.moveDefender("left");
      }
      if (e.key === "ArrowRight" && this.isRunning) {
        board.moveDefender("right");
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === " " && this.isRunning) {
        board.shootRocket();
      }
    });
  }
}

function allAliensDeadOn(board) {
  return !board.containsAliens();
}

function aliensHitGround(board) {
  return board.squares.some((square) => square.isGround() && square.hasAlien());
}
function addOneTo(time) {
  return time + 1;
}

module.exports = Game;

