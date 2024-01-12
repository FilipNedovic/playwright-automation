const { test, expect } = require("@playwright/test");
const { POMManager } = require("../pom/pomManager");
const { JSONUtils } = require("../utils/jsonUtils");

const parser = new JSONUtils();
const customers = parser.parseRequiredJSON("../utils/customerData.json");
const order = parser.parseRequiredJSON("../utils/orderData.json");

customers.forEach((customer, index) => {
  test(`${index} ordering - happy flow`, async ({ page }) => {
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
    await loginPage.validLogin(customer.credentials);

    //  dashboard - add specific product to cart
    await dashboardPage.addProductToCart(order.product.name);

    //  cart - verify that product is added to cart
    await navbar.navigateToCart();
    const bool = page.locator("h3:has-text('Zara Coat 3')").isVisible();
    expect(bool).toBeTruthy();

    //  checkout - verify email info
    expect(
      checkoutPage.shippingInfoSection.locator("label").first()
    ).toHaveText(customer.credentials.email);

    //  checkout - enter personal and shipping info
    await cartPage.navigateToCheckout();
    await checkoutPage.enterPersonalInfo(customer.personalInfo);
    await checkoutPage.enterShippingInfo(customer.shippingInfo);

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
});
