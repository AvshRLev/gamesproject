const zero = require("../static/zero");

describe("A function that returns zero", () => {
  test("returns zero", () => {
    expect(zero()).toBe(0);
  });
});
