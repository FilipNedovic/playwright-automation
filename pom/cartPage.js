class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutBtn = page.locator("text=Checkout");
  }

  async navigateToCheckout() {
    await this.checkoutBtn.click();
  }
}

module.exports = { CartPage };
