const { test, expect } = require('@playwright/test')

test('Browser context Playwright test', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  //  blocking requests
  await page.route('**/*.{jpg, png, jpeg}', (route) => route.abort())

  const username = page.locator('#username')
  const signIn = page.locator('#signInBtn')
  const cardTitles = page.locator('.card-body a')

  //  log request/response
  page.on('request', (request) => console.log(request.url()))
  page.on('response', (response) =>
    console.log(response.url(), response.status())
  )

  await page.goto('https://rahulshettyacademy.com/loginpagePractise')
  await username.fill('test')
  await page.locator("[type='password']").fill('learning')
  await signIn.click()
  await expect(page.locator("[style*='block']")).toContainText('Incorrect')

  await username.fill('')
  await username.fill('rahulshettyacademy')
  await signIn.click()

  //   console.log(await cardTitles.first().textContent());
  //   console.log(await cardTitles.nth(1).textContent());
  const allTitles = await cardTitles.allTextContents()
  console.log(allTitles)
})

test('Page Playwright test', async ({ page }) => {
  await page.goto('https://google.com')
  await expect(page).toHaveTitle('Google')
})

test('UI Controls', async ({ page }) => {
  const dropdown = page.locator('select.form-control')
  const userRadioBtn = page.locator('.radiotextsty').last()
  const terms = page.locator('#terms')
  const documentLink = page.locator("[href*='documents-request']")

  await Promise.all([
    page.goto('https://rahulshettyacademy.com/loginpagePractise'),
    dropdown.selectOption('consult'),
    userRadioBtn.click(),
    page.locator('#okayBtn').click(),
    //   console.log(await userRadioBtn.isChecked()),
    expect(userRadioBtn).toBeChecked()
  ])
  terms.click()
  expect(terms).toBeChecked()
  terms.uncheck()
  expect(terms.isChecked()).toBeFalsy()
  expect(documentLink).toHaveAttribute('class', 'blinkingText')
})

test('Child windows handling', async ({ browser }) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const username = page.locator('#username')
  const signIn = page.locator('#signInBtn')
  const documentLink = page.locator("[href*='documents-request']")

  await page.goto('https://rahulshettyacademy.com/loginpagePractise')

  const [newPage] = await Promise.all([
    context.waitForEvent('page'), // listen for any new page
    documentLink.click() // new page is opened
  ])

  const text = await newPage.locator('.red').textContent()
  const domain = text.split('@')[1].split(' ')[0]
  await username.fill(domain)
  await page.pause()
})
