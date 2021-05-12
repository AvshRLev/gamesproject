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

module.exports = Setup;
