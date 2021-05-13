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
describe("Restart functionality", () => {
  describe("Restart button is clicked", () => {
    test("Aliens return to starting positions", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      await page.click("button#restart");
      const div1 = await page.$("#\\31 ");
      const divIsInvader = await page.evaluate(
        (div1) => div1.classList.contains("invader"),
        div1
      );
      expect(divIsInvader).toBe(true);
    });

    test("Time is reset", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      await page.click("button#restart");
      const timer = await page.$("span#time");
      const time = await page.evaluate((timer) => timer.innerHTML, timer);
      expect(time).toBe("00");
    });

    test("Score is reset", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press(" ");
      await new Promise((r) => setTimeout(r, 2000));
      await page.click("button#restart");
      const scoreBoard = await page.$("span#score");
      const score = await page.evaluate(
        (scoreBoard) => scoreBoard.innerHTML,
        scoreBoard
      );
      expect(score).toBe("0000");
    });

    test("Defender's location is reset", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press("ArrowLeft");
      await page.click("button#restart");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("202");
    });

    test("Defender movement is disabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#restart");
      await page.keyboard.press("ArrowLeft");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("202");
    });
  });
});
