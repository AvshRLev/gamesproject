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

describe("Start game functionality", () => {
  describe("Start/Pause button is clicked", () => {
    test("Aliens move", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      const div1 = await page.$("#\\31 ");
      const divIsInvader = await page.evaluate(
        (div1) => div1.classList.contains("invader"),
        div1
      );
      expect(divIsInvader).toBe(false);
    });

    test("Time is counted", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      const timer = await page.$("span#time");
      const time = await page.evaluate((timer) => timer.innerHTML, timer);
      expect(time).toBe("01");
    });

    test("Defender movement left is enabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press("ArrowLeft");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("201");
    });

    test("Defender movement right is enabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press("ArrowRight");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("203");
    });

    test("Defender shooting is enabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press(" ");
      const div187 = await page.$("#\\31 87 ");
      const divIsRocket = await page.evaluate(
        (div187) => div187.classList.contains("rocket"),
        div187
      );
      expect(divIsRocket).toBe(true);
    });

    test("Score is kept", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press(" ");
      await new Promise((r) => setTimeout(r, 2000));
      const scoreBoard = await page.$("span#score");
      const score = await page.evaluate(
        (scoreBoard) => scoreBoard.innerHTML,
        scoreBoard
      );
      expect(score).toBe("0010");
    });
  });
});
