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

  export {
      Square
  }