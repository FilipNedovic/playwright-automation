const { test, expect } = require("@playwright/test");

test("Pop-up validations", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  //    navigation
  //   await page.goto("https://google.com");
  //   await page.goBack();
  //   await page.goForward();
  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();
  await page.pause();
  page.on("dialog", (dialog) => dialog.accept());
  await page.locator("#confirmbtn").click();
  await page.locator("#mousehover").hover();
  const iframe = page.frameLocator("#courses-iframe");
  iframe.locator("li a[href*='lifetime-access']:visible").click();
  const textCheck = await iframe.locator(".text h2").textContent();
  console.log(textCheck.split(" ")[1]);
});
