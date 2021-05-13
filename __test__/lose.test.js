const puppeteer = require("puppeteer");

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:8000/space_invaders");
});

afterEach(async () => {
  await browser.close();
});

describe("Lose game", () => {
  describe("Aliens get to defender's row", () => {
    test("Lose is declared", async () => {
      await page.keyboard.press("T");
      await page.click("button#level-test");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 4000));
      const grid = await page.$(".grid");
      const divIsYouLose = await page.evaluate(
        (grid) => grid.classList.contains("youlose"),
        grid
      );
      expect(divIsYouLose).toBe(true);
    });
  });
});
