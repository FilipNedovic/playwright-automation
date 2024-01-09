const { test, expect } = require("@playwright/test");

test("Browser context Playwright test", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const username = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise");
  await username.fill("test");
  await page.locator("[type='password']").fill("learning");
  await signIn.click();
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");

  await username.fill("");
  await username.fill("rahulshettyacademy");
  await signIn.click();

  //   console.log(await cardTitles.first().textContent());
  //   console.log(await cardTitles.nth(1).textContent());
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
});

test("Page Playwright test", async ({ page }) => {
  await page.goto("https://google.com");
  await expect(page).toHaveTitle("Google");
});
