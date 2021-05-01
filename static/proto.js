const Game = require('./game')
const Setup = require('./setup')

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
