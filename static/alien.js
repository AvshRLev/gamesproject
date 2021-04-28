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

  export {
      Alien
  }