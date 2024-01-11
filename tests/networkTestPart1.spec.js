const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("./utils/APIUtils");

const loginPayload = {
  userEmail: "testis@mail.com",
  userPassword: "Test12345",
};

const orderPayload = {
  orders: [
    { country: "Ireland", productOrderedId: "6581ca979fd99c85e8ee7faf" },
  ],
};

const fakeOrdersPayload = { data: [], message: "No Orders" };

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

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      //  intercepting response - API response->{ mock response }->browser->render data on FE
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakeOrdersPayload);
      route.fulfill({
        response,
        body,
      });
    }
  );

  await page.locator("button[routerlink*='myorders']").click();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
  );
  console.log(await page.locator(".mt-4").textContent());
});
