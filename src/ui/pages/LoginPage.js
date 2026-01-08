class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = "#email";
    this.passwordInput = "#password";
    this.loginButton = "#login-btn";
  }

  async open(url) {
    await this.page.goto(url);
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }
}

module.exports = LoginPage;
