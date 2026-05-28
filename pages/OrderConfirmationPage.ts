import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model — Checkout Complete: Order Confirmation
 * URL: /checkout-complete.html
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class OrderConfirmationPage {
  readonly page:             Page;
  readonly pageTitle:        Locator;
  readonly confirmHeader:    Locator;
  readonly confirmText:      Locator;
  readonly backToHomeBtn:    Locator;
  readonly ponyExpressImage: Locator;

  constructor(page: Page) {
    this.page              = page;
    this.pageTitle         = page.locator('[data-test="title"]');
    this.confirmHeader     = page.locator('[data-test="complete-header"]');
    this.confirmText       = page.locator('[data-test="complete-text"]');
    this.backToHomeBtn     = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage  = page.locator('[data-test="pony-express"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async backToInventory() {
    await this.backToHomeBtn.click();
  }
}