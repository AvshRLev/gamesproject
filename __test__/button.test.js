const assert = require("assert"),
  puppeteer = require("puppeteer");

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

describe("Requested page URL", () => {
  test("Is navigated to", async () => {
    const url = await page.url();
    assert(url === "http://localhost:8000/space_invaders");
  });
});
describe("Level 1 button", () => {
  describe("When clicked", () => {
    test("Page title changes to Level 1", async () => {
      await page.click("button#level1");
      await expect(page.title()).resolves.toMatch("Level 1");
    });
  });
});
