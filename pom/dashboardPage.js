class DashboardPage {
  constructor(page) {
    this.products = page.locator(".card-body");
  }

  async addProductToCart(productName) {
    const count = await this.products.count();
    for (let i = 0; i < count; i++) {
      if (
        (await this.products.nth(i).locator("b").textContent()) ===
        productName.toUpperCase()
      ) {
        //  add to cart
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
      }
    }
  }
}

module.exports = { DashboardPage };
