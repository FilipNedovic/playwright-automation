const { expect } = require('@playwright/test')

class OrdersHistoryPage {
  constructor (page) {
    this.page = page
    this.ordersTable = page.locator('table')
  }

  async verifyPlacedOrder (orderId) {
    await this.ordersTable.waitFor()
    const tableRows = this.ordersTable.locator('tr')

    for (let i = 1; i <= (await tableRows.count()); i++) {
      const id = await tableRows.nth(i).locator('th').textContent()

      if (id === orderId) {
        await tableRows.nth(i).locator('button').first().click()
        await expect(this.page.getByText(orderId)).toBeVisible()
        break
      }
    }
  }
}

module.exports = { OrdersHistoryPage }
