import { test, expect } from "@playwright/test";

test("Playwright Special locators", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/angularpractice");

  const label = page.getByLabel("Check me out if you Love IceCreams!");
  const employmentStatus = page.getByLabel("Employed");
  const gender = page.getByLabel("Gender");
  const password = page.getByPlaceholder("Password");
  await label.check();
  await employmentStatus.check();
  await expect(label).toBeChecked();
  await expect(employmentStatus).toBeChecked();
  await gender.selectOption("Male");
  await password.fill("Test12345");
  await page.getByRole("button", { name: "Submit" }).click();
  await page
    .getByText("Sucess! The Form has been submitted succesfully!.")
    .isVisible();
  await page.getByRole("link", { name: "Shop" }).click();
  await page
    .locator("app-card")
    .filter({ hasText: "Nokia Edge" })
    .getByRole("button", { name: "Add" })
    .click();
  await page.pause();
});
