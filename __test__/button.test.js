const assert = require("assert"),
  puppeteer = require("puppeteer");

let browser, page;

beforeEach(async() => {
  browser = await puppeteer.launch({
    headless: true
  });
  page = await browser.newPage();
  await page.goto("http://localhost:8000/space_invaders");
})

afterEach(async() => {
  await browser.close();
})

  test("test space invaders url", async() => {
  const url = await page.url();
  assert(url==="http://localhost:8000/space_invaders");
});

test("press level 1 button gets level 1", async() => {
  await page.click('button#level1');
  await expect(page.title()).resolves.toMatch('level1');
});