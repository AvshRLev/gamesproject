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

class Setup {
  constructor(alienLocations, gameSpeed) {
    this.alienLocations = alienLocations;
    this.gameSpeed = gameSpeed;
  }
  getAlienLocations() {
    return this.alienLocations;
  }
  getGameSpeed() {
    return this.gameSpeed;
  }
  getMovementPattern() {
    return this.movementPattern;
  }
}

class Square {
  constructor(indexOnBoard, div, lineWidth, borders) {
    this.index = indexOnBoard;
    this.div = div;
    this.lineWidth = lineWidth;
    this.borders = borders;
  }
  isLeftBorder() {
    return this.borders.includes("left");
  }

  isRightBorder() {
    return this.borders.includes("right");
  }

  isGround() {
    return this.borders.includes("ground");
  }

  isTop() {
    return this.index < this.lineWidth;
  }

  setCharacter(character) {
    this.character = character;
    let cssClass = character.getCssClass();
    this.div.classList.clear;
    this.div.classList.add(cssClass);
    this.type = character.type;
  }
  setEmpty() {
    this.div.className = "";
    this.character = null;
    this.type = null;
  }

  setGround() {
    this.div.classList.add("ground");
  }
  hasAlien() {
    return this.character != null && this.character.type === "alien";
  }
  removeDeadAliens() {
    if (this.character != null && this.character.health === 0) {
      this.setEmpty();
    }
  }

  hasDefender() {
    return this.type === "defender";
  }
  hasRocket() {
    return this.type === "rocket";
  }
  topOfBoard() {
    return this.indexOnBoard <= this.lineWidth;
  }
  pickCharacterUp() {
    let c = this.character;
    this.setEmpty();
    return c;
  }
  hasDeadAlien() {
    return this.character.type === "alien" && this.character.isDead();
  }
}

class Defender {
  constructor(imageCssClass, lineWidth) {
    this.imageCssClass = imageCssClass;
    this.lineWidth = lineWidth;
    this.type = "defender";
  }
  getCssClass() {
    return this.imageCssClass;
  }
}

class Rocket {
  constructor(imageCssClass, index, board) {
    this.imageCssClass = imageCssClass;
    this.index = index;
    this.board = board;
    this.type = "rocket";
  }
  isAlien() {
    return false;
  }
  upTheBoard() {
    newIndex = this.indexOnBoard - this.board.width;
    return newIndex;
  }
  getCssClass() {
    return this.imageCssClass;
  }
  moveTo(square) {
    square.setCharacter(this);
  }
}

class Alien {
  constructor(health, square) {
    this.cssClassByHealth = ["dead", "invader", "intruder"];
    this.health = health;
    this.square = square;
    this.type = "alien";
  }
  getCssClass() {
    return this.cssClassByHealth[this.health];
  }
  isAlien() {
    return true;
  }
  moveTo(square) {
    square.setCharacter(this);
  }
  isDead() {
    return this.health === 0;
  }
}

function createInvader(health, indexOnBoard) {
  let alien = new Alien(health, indexOnBoard);
  return alien;
}

const DIRECTION_LEFT = -1;
const DIRECTION_RIGHT = 1;
const DIRECTION_NON = 0;

class Board {
  constructor(parent, width, setup) {
    this.parent = parent;
    this.width = width;
    this.aliens = [];
    this.squares = [];
    this.setupObject = setup.getAlienLocations();
    this.alienLocations = Object.keys(this.setupObject).map(Number);
    this.initialAlienLocations = this.alienLocations;
    this.alienHealthLevels = Object.values(this.setupObject);
    this.initialTotalAlienHealth = this.alienHealthLevels.reduce(
      (a, b) => a + b,
      0
    );
    this.currentTotalAlienHealth = this.initialTotalAlienHealth;
    this.direction = DIRECTION_RIGHT;
    this.previousDirection = DIRECTION_RIGHT;
    this.defenderLocation = this.defenderStartPosition();
    this.movementCounter = 0;
    this.score = 0;
  }

  createChildSquareAddToSquares(index) {
    let div = document.createElement("div");
    this.parent.appendChild(div);
    const borders = [];
    if (index >= this.twoBottomRows()) {
      borders.push("ground");
    }
    if (index % this.width === 0) {
      borders.push("left");
    }
    if (index % this.width === this.width - 1) {
      borders.push("right");
    }
    this.squares.push(new Square(index, div, this.width, borders));
  }
  twoBottomRows() {
    return this.width * this.width - 2 * this.width;
  }
  defenderStartPosition() {
    return (
      this.width * this.width - (this.width + Math.floor(this.width / 2) + 1)
    );
  }

  draw() {
    for (let i = 0; i < this.width * this.width; i++) {
      this.createChildSquareAddToSquares(i);
      if (this.alienLocations.includes(i)) {
        let health = this.alienHealthLevels.shift();
        let invader = createInvader(health, this.squares[i].index);
        this.squares[i].setCharacter(invader);
      }
    }
    let defender = new Defender("defender", this.width);
    let square = this.squares[this.defenderLocation];
    square.setCharacter(defender);
  }

  moveAliens() {
    this.determineDirection();
    this.alienLocations = this.calculateAlienLocations();
    this.updateCurrentTotalAlienHealth();
    this.updateScore();
    for (let i = 0; i < this.squares.length - 1; i++) {
      if (this.squares[i].hasAlien()) {
        let c = this.squares[i].pickCharacterUp();
        this.aliens.push(c);
      }
    }

    for (let i = 0; i < this.squares.length; i++) {
      if (this.alienLocations.includes(i)) {
        let c = this.aliens.shift();
        this.squares[i].setCharacter(c);
      }
    }
  }
  calculateCurrentTotalAlienHealth() {
    return this.squares
      .filter((square) => square.hasAlien())
      .map((square) => square.character.health)
      .reduce((a, b) => a + b, 0);
  }
  updateCurrentTotalAlienHealth() {
    this.currentTotalAlienHealth = this.calculateCurrentTotalAlienHealth();
  }
  calculateScore() {
    return (this.initialTotalAlienHealth - this.currentTotalAlienHealth) * 10;
  }
  updateScore() {
    this.score = this.calculateScore();
  }

  calculateAlienLocations() {
    return this.squares
      .filter((square) => square.hasAlien())
      .map((square) => square.index + this.direction);
  }

  containsAliens() {
    return this.alienLocations.length != 0;
  }

  determineDirection() {
    let nextMove = calcNextAlienMove(
      this.previousDirection,
      this.movementCounter,
      5,
      this.directionDown()
    );
    this.direction = nextMove.direction;
    this.previousDirection = nextMove.previousDirection;
    this.movementCounter = nextMove.movementCounter;
  }

  directionDown() {
    return this.width;
  }

  moveDefender(direction) {
    let defender = this.pickDefenderUp();
    let nextMove = this.calculateNextDefenderMove(direction);
    this.defenderMove(nextMove);
    this.putDown(defender);
  }
  calculateNextDefenderMove(direction) {
    if (this.defenderCanMoveLeft(direction)) {
      return DIRECTION_LEFT;
    }
    if (this.defenderCanMoveRight(direction)) {
      return DIRECTION_RIGHT;
    }
    return DIRECTION_NON;
  }
  defenderMove(nextMove) {
    return (this.defenderLocation = this.defenderLocation + nextMove);
  }
  defenderCanMoveRight(direction) {
    return direction === "right" && this.defenderNotAtRightBorder();
  }
  defenderCanMoveLeft(direction) {
    return direction === "left" && this.defenderNotAtLeftBorder();
  }
  pickDefenderUp() {
    return this.squares[this.defenderLocation].pickCharacterUp();
  }
  putDown(defender) {
    return this.squares[this.defenderLocation].setCharacter(defender);
  }
  defenderNotAtLeftBorder() {
    return !this.squares[this.defenderLocation].isLeftBorder();
  }
  defenderNotAtRightBorder() {
    return !this.squares[this.defenderLocation].isRightBorder();
  }

  shootRocket() {
    let rocketId;
    let rocket = this.createRocket();
    let rocketLocation = this.getIndexOf(rocket);
    let nextRocketLocation = this.getNextIndexOf(rocket);
    this.squareAt(rocketLocation).setCharacter(rocket);

    rocketId = setInterval(() => {
      // Sometimes if the interval is just right an alien gets picked up
      // instead of the rocket, the following if statement takes care of
      // this situation by removing the alien that was effectively hit by a rocket
      if (!this.squareAt(rocketLocation).hasRocket()) {
        this.squareAt(rocketLocation).setEmpty();
        // Here we clear the interval because otherwise this interval of the rocket will
        // keep trying to find that rocket but it is not there
        clearInterval(rocketId);
        return;
      }
      let rocketInFlight = this.liftRocketAt(rocketLocation, rocketId);
      this.updateIndexOf(rocket);
      rocketLocation = this.getIndexOf(rocket);
      nextRocketLocation = this.update(nextRocketLocation);
      if (this.boardTopIs(rocketLocation)) {
        clearInterval(rocketId);
        this.waitAndEraseRocketAt(rocketLocation);
      }
      // if there is a next square remove dead alien on it if there is one
      // and if it is an alien erase the rocket, reduce the aliens health by
      // one and set the square's css according to the new alien's health level
      if (this.squareAt(nextRocketLocation)) {
        this.squareAt(nextRocketLocation).removeDeadAliens();
        if (this.squareAt(nextRocketLocation).hasAlien()) {
          clearInterval(rocketId);
          this.waitAndEraseRocketAt(rocketLocation);
          this.reduceAlienHealthByOneAt(nextRocketLocation);
          this.updateAlienHitAt(nextRocketLocation);
        }
      }
      // After checking and preparing all conditions we put down the rocket in the
      // next location up the board whic after update is rocketLocation
      if (this.squareAt(rocketLocation))
        this.squareAt(rocketLocation).setCharacter(rocketInFlight);
    }, 100);
  }

  updateAlienHitAt(nextRocketLocation) {
    let alienHit = this.squareAt(nextRocketLocation).pickCharacterUp();
    if (alienHit) this.squareAt(nextRocketLocation).setCharacter(alienHit);
  }
  reduceAlienHealthByOneAt(nextRocketLocation) {
    this.squareAt(nextRocketLocation).character.health -= 1;
    this.squareAt(nextRocketLocation).removeDeadAliens();
  }
  waitAndEraseRocketAt(rocketLocation) {
    setTimeout(() => {
      this.liftRocketAt(rocketLocation);
    }, 100);
  }
  boardTopIs(rocketLocation) {
    return this.squareAt(rocketLocation).isTop();
  }
  update(nextRocketLocation) {
    return nextRocketLocation + this.directionUp();
  }
  updateIndexOf(rocket) {
    rocket.index = rocket.index + this.directionUp();
  }
  liftRocketAt(rocketLocation, rocketId) {
    let rocket = this.squareAt(rocketLocation).pickCharacterUp();
    if (!rocket) {
      clearInterval(rocketId);
      throw new Error("couldnt find rocket at location: " + rocketLocation);
    }
    return rocket;
  }
  getNextIndexOf(rocket) {
    return rocket.index + this.directionUp();
  }
  getIndexOf(rocket) {
    return rocket.index;
  }
  createRocket() {
    return new Rocket("rocket", this.squareAboveDefender(), this);
  }

  squareAboveDefender() {
    return this.defenderLocation - this.width;
  }

  squareAt(rocketLocation) {
    return this.squares[rocketLocation];
  }

  directionUp() {
    return -this.width;
  }
}
function calcNextAlienMove(
  previousDirection,
  movementCounter,
  numberOfMoves,
  down
) {
  if (movementCounter < numberOfMoves) {
    return {
      movementCounter: increaseByOne(movementCounter),
      previousDirection: previousDirection,
      direction: previousDirection,
    };
  }
  if (movementCounter === numberOfMoves) {
    return {
      movementCounter: zero(),
      previousDirection: getTheOppositeOf(previousDirection),
      direction: down,
    };
  }
}

function increaseByOne(movementCounter) {
  return movementCounter + 1;
}

function zero() {
  return 0;
}

function getTheOppositeOf(direction) {
  return direction * -1;
}

function level(level) {
  document.querySelector("#game").style.display = "block";
  document.querySelector("#level-select").style.display = "none";
  let setup = new Setup(level, []);
  let game = new Game(setup);
  game.start();
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#game").style.display = "none";
  document.querySelector("#level-select").style.display = "block";
  let level1Button = document.querySelector("#level1");
  let level2Button = document.querySelector("#level2");
  let level3Button = document.querySelector("#level3");
  let level4Button = document.querySelector("#level4");
  let level1 = {
    0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
    15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1,
    30: 1, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1,
  };
  let level2 =  {
    0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
    15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2,
    30: 1, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1,
  };
  let level3 =  {
    0: 1, 1: 2, 2: 1, 3: 2, 4: 1, 5: 2, 6: 1, 7: 2, 8: 1, 9: 2,
    15: 2, 16: 1, 17: 2, 18: 1, 19: 2, 20: 1, 21: 2, 22: 1, 23: 2, 24: 1,
    30: 1, 31: 2, 32: 1, 33: 2, 34: 1, 35: 2, 36: 1, 37: 2, 38: 1, 39: 2,
  };
  let level4 =  {
    0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1,
    15: 2, 16: 2, 17: 2, 18: 2, 19: 2, 20: 2, 21: 2, 22: 2, 23: 2, 24: 2,
    30: 2, 31: 2, 32: 2, 33: 2, 34: 2, 35: 2, 36: 2, 37: 2, 38: 2, 39: 2,
    45: 1, 46: 1, 47: 1, 48: 1, 49: 1, 50: 1, 51: 1, 52: 1, 53: 1, 54: 1,
  };
  level1Button.addEventListener("click", () => {
    level(level1);
  });
  level2Button.addEventListener("click", () => {
    level(level2);
  });
  level3Button.addEventListener("click", () => {
    level(level3);
  });
  level4Button.addEventListener("click", () => {
    level(level4);
  });
});
