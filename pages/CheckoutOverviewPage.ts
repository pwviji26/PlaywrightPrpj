import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object Model — Checkout Step Two: Overview
 * URL: /checkout-step-two.html
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class CheckoutOverviewPage {
  readonly page:          Page;
  readonly pageTitle:     Locator;
  readonly itemNames:     Locator;
  readonly itemPrices:    Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel:      Locator;
  readonly totalLabel:    Locator;
  readonly paymentInfo:   Locator;
  readonly shippingInfo:  Locator;
  readonly finishBtn:     Locator;
  readonly cancelBtn:     Locator;

  constructor(page: Page) {
    this.page          = page;
    this.pageTitle     = page.locator('[data-test="title"]');
    this.itemNames     = page.locator('.inventory_item_name');
    this.itemPrices    = page.locator('.inventory_item_price');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel      = page.locator('[data-test="tax-label"]');
    this.totalLabel    = page.locator('[data-test="total-label"]');
    this.paymentInfo   = page.locator('[data-test="payment-info-value"]');
    this.shippingInfo  = page.locator('[data-test="shipping-info-value"]');
    this.finishBtn     = page.locator('[data-test="finish"]');
    this.cancelBtn     = page.locator('[data-test="cancel"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async clickFinish() {
    await this.finishBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }
}