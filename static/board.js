const zero = require("./zero");
const Defender = require("./defender.js");
const Square = require("./square.js");
const Rocket = require("./rocket.js");
const Alien = require("./alien.js");

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
    div.id = index;
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

function getTheOppositeOf(direction) {
  return direction * -1;
}

function createInvader(health, indexOnBoard) {
  let alien = new Alien(health, indexOnBoard);
  return alien;
}

module.exports = Board;
