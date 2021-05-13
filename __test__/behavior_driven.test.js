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

describe("Defender behavior", () => {
  describe("Before start button is clicked", () => {
    test("Defender is disabled", async () => {
      await page.click("button#level1");
      await page.keyboard.press("ArrowLeft");
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("202");
    });
  });

  describe("When hitting left border", () => {
    test("Defender stops", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      let i = 0;
      for (i = 0; i <= 8; i++) {
        await page.keyboard.press("ArrowLeft");
      }
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("195");
    });
  });

  describe("When hitting right border", () => {
    test("Defender stops", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      let i = 0;
      for (i = 0; i <= 8; i++) {
        await page.keyboard.press("ArrowRight");
      }
      const divDefender = await page.$(".defender");
      const Id = await page.evaluate(
        (divDefender) => divDefender.id,
        divDefender
      );
      expect(Id).toBe("209");
    });
  });
});

describe("Alien with health level of 1", () => {
  describe("Is hit by rocket", () => {
    test("Alien is erased from board", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await page.keyboard.press(" ");
      await new Promise((r) => setTimeout(r, 2000));
      const div40 = await page.$("#\\34 0 ");
      const divIsInvader = await page.evaluate(
        (div40) => div40.classList.contains("invader"),
        div40
      );
      expect(divIsInvader).toBe(false);
    });
  });
});
