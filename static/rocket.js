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
  getCssClass() {
    return this.imageCssClass;
  }
  moveTo(square) {
    square.setCharacter(this);
  }
}

module.exports = Rocket;
