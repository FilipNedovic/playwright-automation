const { CartPage } = require('./cartPage')
const { CheckoutPage } = require('./checkoutPage')
const { DashboardPage } = require('./dashboardPage')
const { LoginPage } = require('./loginPage')
const { Navbar } = require('./navbar')
const { OrdersHistoryPage } = require('./ordersHistoryPage')

class POMManager {
  constructor (page) {
    this.page = page
    this.navbar = new Navbar(this.page)
    this.loginPage = new LoginPage(this.page)
    this.dashboardPage = new DashboardPage(this.page)
    this.cartPage = new CartPage(this.page)
    this.checkoutPage = new CheckoutPage(this.page)
    this.orderHistoryPage = new OrdersHistoryPage(this.page)
  }

  getLoginPage () {
    return this.loginPage
  }

  getDashboardPage () {
    return this.dashboardPage
  }

  getCartPage () {
    return this.cartPage
  }

  getCheckoutPage () {
    return this.checkoutPage
  }

  getNavbar () {
    return this.navbar
  }

  getOrderHistoryPage () {
    return this.orderHistoryPage
  }
}

module.exports = { POMManager }
