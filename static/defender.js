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

  module.exports = Defender;