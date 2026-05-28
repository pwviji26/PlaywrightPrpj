import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model — Cart Page
 * URL: /cart.html
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class CartPage {
  readonly page:               Page;
  readonly pageTitle:          Locator;
  readonly cartItems:          Locator;
  readonly itemNames:          Locator;
  readonly itemPrices:         Locator;
  readonly checkoutBtn:        Locator;
  readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    this.page                = page;
    this.pageTitle           = page.locator('[data-test="title"]');
    this.cartItems           = page.locator('.cart_item');
    this.itemNames           = page.locator('.inventory_item_name');
    this.itemPrices          = page.locator('.inventory_item_price');
    this.checkoutBtn         = page.locator('[data-test="checkout"]');
    this.continueShoppingBtn = page.locator('[data-test="continue-shopping"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async proceedToCheckout() {
    await this.checkoutBtn.click();
  }

  async continueShopping() {
    await this.continueShoppingBtn.click();
  }
}