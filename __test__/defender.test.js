const Defender = require("../static/defender");

describe("Defender is the spaceship that shoots the aliens", () => {
  test("get its css class", () => {
    let defender = new Defender("defender", 15);
    expect(defender.getCssClass()).toEqual("defender");
  });
});
