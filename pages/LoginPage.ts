import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model — Login Page
 * URL: https://www.saucedemo.com/
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class LoginPage {
  readonly page:          Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton:   Locator;
  readonly errorMessage:  Locator;

  constructor(page: Page) {
    this.page          = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async navigate(baseUrl: string) {
    await this.page.goto(baseUrl);
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}