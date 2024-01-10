const { test, expect } = require("@playwright/test");
let webContext;

test.beforeAll(async ({ browser }) => {
  //  initialize context
  const context = await browser.newContext();
  const page = await context.newPage();

  //  UI login
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("testis@mail.com");
  await page.locator("#userPassword").fill("Test12345");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState("networkidle");

  //  save state
  await context.storageState({ path: "state.json" });

  //  inject state
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("", async () => {
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  await page.pause();
});
