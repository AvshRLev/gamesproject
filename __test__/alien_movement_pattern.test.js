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

describe("Aliens movement pattern", () => {
  describe("5 steps right", () => {
    test("Move down", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 3200));
      const div20 = await page.$("#\\32 0 ");
      const div20IsInvader = await page.evaluate(
        (div20) => div20.classList.contains("invader"),
        div20
      );
      const div59 = await page.$("#\\35 9 ");
      const div59IsInvader = await page.evaluate(
        (div59) => div59.classList.contains("invader"),
        div59
      );
      expect(div20IsInvader).toBe(true);
      expect(div59IsInvader).toBe(true);
    });
  });

  describe("1 step down", () => {
    test("Move left", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 3700));
      const div19 = await page.$("#\\31 9 ");
      const div19IsInvader = await page.evaluate(
        (div19) => div19.classList.contains("invader"),
        div19
      );
      const div58 = await page.$("#\\35 8 ");
      const div58IsInvader = await page.evaluate(
        (div58) => div58.classList.contains("invader"),
        div58
      );
      expect(div19IsInvader).toBe(true);
      expect(div58IsInvader).toBe(true);
    });
  });

  describe("5 steps left", () => {
    test("Move down", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 6200));
      const div30 = await page.$("#\\33 0 ");
      const div30IsInvader = await page.evaluate(
        (div30) => div30.classList.contains("invader"),
        div30
      );
      const div69 = await page.$("#\\36 9 ");
      const div69IsInvader = await page.evaluate(
        (div69) => div69.classList.contains("invader"),
        div69
      );
      expect(div30IsInvader).toBe(true);
      expect(div69IsInvader).toBe(true);
    }, 8000);
  });

  describe("2nd step down", () => {
    test("Move right", async () => {
      await page.click("button#level1");
      await page.click("button#start");
      await new Promise((r) => setTimeout(r, 6700));
      const div31 = await page.$("#\\33 1 ");
      const div31IsInvader = await page.evaluate(
        (div31) => div31.classList.contains("invader"),
        div31
      );
      const div70 = await page.$("#\\37 0 ");
      const div70IsInvader = await page.evaluate(
        (div70) => div70.classList.contains("invader"),
        div70
      );
      expect(div31IsInvader).toBe(true);
      expect(div70IsInvader).toBe(true);
    }, 9000);
  });
});
