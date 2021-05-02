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

module.exports = Rocket;

  