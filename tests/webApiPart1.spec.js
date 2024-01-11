const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("../utils/apiUtils");
const loginPayload = {
  userEmail: "testis@mail.com",
  userPassword: "Test12345",
};
const orderPayload = {
  orders: [
    { country: "Ireland", productOrderedId: "6581ca979fd99c85e8ee7faf" },
  ],
};
let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("ordering flow", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");

  //  add specific product to cart
  const products = page.locator(".card-body");
  const productName = "Zara Coat 3";
  const count = await products.count();
  for (let i = 0; i < count; i++) {
    if (
      (await products.nth(i).locator("b").textContent()) ===
      productName.toUpperCase()
    ) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }

  //  verify that product is added to cart
  await page.locator("[routerlink*='cart']").click();
  await page.locator("div li").first().waitFor();

  const bool = page.locator("h3:has-text('Zara Coat 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();

  const personalInfo = page.locator(".payment__cc");
  const shippingInfo = page.locator(".payment__shipping");

  //  enter personal information
  await personalInfo.locator("input").first().fill("1111 1111 1111 1111");
  await personalInfo.locator("select").first().selectOption("06");
  await personalInfo.locator("select").last().selectOption("26");
  await personalInfo.locator("input").nth(1).fill("111");
  await personalInfo.locator("input").nth(2).fill("Filip Nedovic");

  //  enter shipping information
  await shippingInfo
    .locator("input")
    .last()
    .pressSequentially("ire", { delay: 100 });
  const dropdown = shippingInfo.locator(".ta-results");
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; i++) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text.trim() === "Ireland") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  //  verify email information
  expect(shippingInfo.locator("label").first()).toHaveText("testis@mail.com");

  //  place order and confirm
  await page.locator(".action__submit").click();
  await expect(page.locator("h1")).toHaveText(" Thankyou for the order. ");
  let orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  orderId = orderId.split("|")[1].trim();

  //  visit orders history and verify
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("[routerlink*='myorders']").first().click();
  const ordersTable = page.locator("table");
  await ordersTable.waitFor();
  const tableRows = ordersTable.locator("tr");

  //  match order by id
  for (let i = 0; i < (await tableRows.count()); i++) {
    const id = await tableRows.locator("th").nth(i).textContent();
    if (id === orderId) {
      ordersTable.locator("tr").nth(i).locator("button").first().click();
      await expect(page.getByText(orderId)).toBeVisible();
      break;
    }
  }
});

test("order history", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  //  visit orders history and verify
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("[routerlink*='myorders']").first().click();
  const ordersTable = page.locator("table");
  await ordersTable.waitFor();
  const tableRows = ordersTable.locator("tr");

  //  match order by id
  for (let i = 0; i < (await tableRows.count()); i++) {
    const id = await tableRows.locator("th").nth(i).textContent();
    if (id === response.orderId) {
      ordersTable.locator("tr").nth(i).locator("button").first().click();
      await expect(page.getByText(response.orderId)).toBeVisible();
      break;
    }
  }
});
