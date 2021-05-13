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

describe("Pause game functionality", () => {
  describe("Start/Pause button is clicked twice", () => {
    test("Defender movement left is disabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#start");
      await page.keyboard.press("ArrowLeft");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("202");
    });

    test("Defender movement right is disabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#start");
      await page.keyboard.press("ArrowRight");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("202");
    });

    test("Defender shooting is disabled", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#start");
      await page.keyboard.press(" ");
      const div187 = await page.$("#\\31 87 ");
      const divIsRocket = await page.evaluate(
        (div187) => div187.classList.contains("rocket"),
        div187
      );
      expect(divIsRocket).toBe(false);
    });

    test("Counter is paused", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      const timer = await page.$("span#time");
      const time = await page.evaluate((timer) => timer.innerHTML, timer);
      expect(time).toBe("00");
    });

    test("Alien movement is paused", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 1200));
      const div1 = await page.$("#\\31 ");
      const divIsInvader = await page.evaluate(
        (div1) => div1.classList.contains("invader"),
        div1
      );
      expect(divIsInvader).toBe(true);
    });
  });
});
