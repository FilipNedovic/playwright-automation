class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailField = page.locator("#userEmail");
    this.passwordField = page.locator("#userPassword");
    this.signInBtn = page.locator("[value='Login']");
  }

  async validLogin(credentials) {
    await this.emailField.fill(credentials.email);
    await this.passwordField.fill(credentials.password);
    await this.signInBtn.click();
    await this.page.waitForLoadState("networkidle");
  }

  async goToLoginPage() {
    await this.page.goto("https://rahulshettyacademy.com/client");
  }
}

module.exports = { LoginPage };
