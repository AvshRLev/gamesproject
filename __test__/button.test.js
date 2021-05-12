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

describe("Behavior driven tests with puppeteer", () => {
  test("Test space invaders url", async () => {
    const url = await page.url();
    assert(url === "http://localhost:8000/space_invaders");
  });

  test("Clicking level 1 button changes title to be level1", async () => {
    await page.click("button#level1");
    await expect(page.title()).resolves.toMatch("Level 1");
  });
});
