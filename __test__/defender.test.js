const Defender = require("../static/defender");

describe("Defender class", () => {
  describe("Create a defender", () => {
    test("Get its css class", () => {
      let defender = new Defender("defender", 15);
      expect(defender.getCssClass()).toEqual("defender");
    });
  });
});
