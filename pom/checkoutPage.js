class CheckoutPage {
  constructor (page) {
    this.page = page
    this.personalInfoSection = page.locator('.payment__cc')
    this.shippingInfoSection = page.locator('.payment__shipping')
    this.submitOrderBtn = page.locator('.action__submit')
  }

  async enterPersonalInfo (data) {
    await this.personalInfoSection
      .locator('input')
      .first()
      .fill(data.cardNumber)
    await this.personalInfoSection
      .locator('select')
      .first()
      .selectOption(data.expMonth)
    await this.personalInfoSection
      .locator('select')
      .last()
      .selectOption(data.expYear)
    await this.personalInfoSection.locator('input').nth(1).fill(data.cvv)
    await this.personalInfoSection
      .locator('input')
      .nth(2)
      .fill(data.cardholder)
  }

  async enterShippingInfo (data) {
    await this.shippingInfoSection
      .locator('input')
      .last()
      .pressSequentially(data.countrySearchSubstring, { delay: 100 })
    const dropdown = this.shippingInfoSection.locator('.ta-results')
    await dropdown.waitFor()
    const optionsCount = await dropdown.locator('button').count()
    for (let i = 0; i < optionsCount; i++) {
      const text = await dropdown.locator('button').nth(i).textContent()
      if (text.trim() === data.country) {
        await dropdown.locator('button').nth(i).click()
        break
      }
    }
  }

  async submitOrder () {
    await this.submitOrderBtn.click()
  }
}

module.exports = { CheckoutPage }
