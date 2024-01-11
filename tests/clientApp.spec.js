const { test, expect } = require("@playwright/test");
const { POMManager } = require("../pom/pomManager");

const credentials = {
  email: "testis@mail.com",
  password: "Test12345",
};

const product = "Zara Coat 3";
const personalInfoData = {
  cardNumber: "1111 1111 1111 1111 1111",
  expMonth: "02",
  expYear: "26",
  cvv: "111",
  cardholder: "Testis Testic",
};
const shippingInfoData = {
  countrySearchSubstring: "ire",
  country: "Ireland",
};

test.only("ordering - happy flow", async ({ page }) => {
  const pomManager = new POMManager(page);

  const [
    loginPage,
    dashboardPage,
    cartPage,
    checkoutPage,
    navbar,
    ordersHistoryPage,
  ] = [
    pomManager.getLoginPage(),
    pomManager.getDashboardPage(),
    pomManager.getCartPage(),
    pomManager.getCheckoutPage(),
    pomManager.getNavbar(),
    pomManager.getOrderHistoryPage(),
  ];

  //  login
  await loginPage.goToLoginPage();
  await loginPage.validLogin(credentials);

  //  dashboard - add specific product to cart
  await dashboardPage.addProductToCart(product);

  //  cart - verify that product is added to cart
  await navbar.navigateToCart();
  const bool = page.locator("h3:has-text('Zara Coat 3')").isVisible();
  expect(bool).toBeTruthy();

  //  checkout - verify email info
  expect(checkoutPage.shippingInfoSection.locator("label").first()).toHaveText(
    credentials.email
  );

  //  checkout - enter personal and shipping info
  await cartPage.navigateToCheckout();
  await checkoutPage.enterPersonalInfo(personalInfoData);
  await checkoutPage.enterShippingInfo(shippingInfoData);

  //  place order
  await checkoutPage.submitOrder();
  await expect(page.locator("h1")).toHaveText(" Thankyou for the order. ");

  // extract order id
  let orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  orderId = orderId.split("|")[1].trim();

  //  visit orders history and verify
  await navbar.navigateToOrdersHistory();
  await ordersHistoryPage.verifyPlacedOrder(orderId);
});
