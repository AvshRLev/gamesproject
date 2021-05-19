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

describe("Win game", () => {
  describe("All aliens are shot", () => {
    test("Win is declared", async () => {
      await page.keyboard.press("T");
      await page.click("button#level-test");
      await page.click("button#start");
      await page.keyboard.press(" ");
      await new Promise((r) => setTimeout(r, 1500));
      const grid = await page.$(".grid");
      const divIsYouWin = await page.evaluate(
        (grid) => grid.classList.contains("youwin"),
        grid
      );
      expect(divIsYouWin).toBe(true);
    });
  });
});
