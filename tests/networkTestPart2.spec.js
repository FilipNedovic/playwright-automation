const { test, expect } = require('@playwright/test')

test('Security test request intercept', async ({ page }) => {
  const emailField = page.locator('#userEmail')
  const passwordField = page.locator('#userPassword')
  const loginBtn = page.locator('#login')
  const email = 'testis@mail.com'
  const password = 'Test12345'

  //  visit page and login
  await page.goto('https://rahulshettyacademy.com/client')
  await expect(page).toHaveTitle("Let's Shop")
  await emailField.fill(email)
  await passwordField.fill(password)
  await loginBtn.click()
  await page.waitForLoadState('networkidle')
  await page.locator('.card-body b').first().waitFor()

  await page.locator("button[routerlink*='myorders']").click()

  //  intercept request calls
  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
    (route) =>
      route.continue({
        url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'
      })
  )
  await page.locator("button:has-text('View')").first().click()
  await expect(page.locator('.blink_me')).toHaveText(
    'You are not authorize to view this order'
  )
})
