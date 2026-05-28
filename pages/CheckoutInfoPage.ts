import { type Page, type Locator } from '@playwright/test';
import type { Customer } from '../data/types';

/**
 * Page Object Model — Checkout Step One: Your Information
 * URL: /checkout-step-one.html
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class CheckoutInfoPage {
  readonly page:            Page;
  readonly pageTitle:       Locator;
  readonly firstNameInput:  Locator;
  readonly lastNameInput:   Locator;
  readonly postalCodeInput: Locator;
  readonly continueBtn:     Locator;
  readonly cancelBtn:       Locator;
  readonly errorMessage:    Locator;

  constructor(page: Page) {
    this.page             = page;
    this.pageTitle        = page.locator('[data-test="title"]');
    this.firstNameInput   = page.locator('[data-test="firstName"]');
    this.lastNameInput    = page.locator('[data-test="lastName"]');
    this.postalCodeInput  = page.locator('[data-test="postalCode"]');
    this.continueBtn      = page.locator('[data-test="continue"]');
    this.cancelBtn        = page.locator('[data-test="cancel"]');
    this.errorMessage     = page.locator('[data-test="error"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  async fillCustomerInfo(customer: Customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async clickContinue() {
    await this.continueBtn.click();
  }

  async clickCancel() {
    await this.cancelBtn.click();
  }

  async fillAndContinue(customer: Customer) {
    await this.fillCustomerInfo(customer);
    await this.clickContinue();
  }
}