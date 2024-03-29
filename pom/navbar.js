class Navbar {
  constructor (page) {
    this.page = page
    this.cart = page.locator("[routerlink*='cart']")
    this.ordersHistory = page.locator("[routerlink*='myorders']")
  }

  async navigateToCart () {
    await Promise.all([
      this.cart.click(),
      this.page.locator('div li').first().waitFor()
    ])
  }

  async navigateToOrdersHistory () {
    await this.ordersHistory.first().click()
  }
}

module.exports = { Navbar }
