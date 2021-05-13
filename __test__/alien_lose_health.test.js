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

describe("An alien with health level of 2", () => {
  describe("Is hit by a rocket", () => {
    test("Its css class is changed to 'invader'", async () => {
      await page.click("button#level3");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 400));
      await page.keyboard.press(" ");
      await new Promise((r) => setTimeout(r, 2300));
      const div40 = await page.$("#\\34 0 ");
      const divIsInvader = await page.evaluate(
        (div40) => div40.classList.contains("invader"),
        div40
      );
      expect(divIsInvader).toBe(true);
    });
  });
});
