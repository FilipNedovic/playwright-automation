const { test, expect } = require("@playwright/test");

test("get product", async ({ page }) => {
  const email = page.locator("#userEmail");
  const password = page.locator("#userPassword");
  const loginBtn = page.locator("#login");
  const cardTitles = page.locator(".card-body b");

  await page.goto("https://rahulshettyacademy.com/client");
  await expect(page).toHaveTitle("Let's Shop");
  await email.fill("testis@mail.com");
  await password.fill("Test12345");
  await loginBtn.click();
  //   discouraged
  //   await page.waitForLoadState("networkidle");
  await cardTitles.first().waitFor();
  console.log(await cardTitles.allTextContents());
});
