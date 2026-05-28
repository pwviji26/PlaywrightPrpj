import { type Page, type Locator } from '@playwright/test';
import type { Product } from '../data/types';

/**
 * Page Object Model — Inventory / Products Page
 * URL: /inventory.html
 *
 * Responsibilities: locators + user actions ONLY.
 * All assertions live in the spec file.
 */
export class InventoryPage {
  readonly page:          Page;
  readonly pageTitle:     Locator;
  readonly cartBadge:     Locator;
  readonly cartLink:      Locator;
  readonly burgerMenuBtn: Locator;
  readonly logoutLink:    Locator;
  readonly allItemsLink:  Locator;

  constructor(page: Page) {
    this.page          = page;
    this.pageTitle     = page.locator('[data-test="title"]');
    this.cartBadge     = page.locator('.shopping_cart_badge');
    this.cartLink      = page.locator('[data-test="shopping-cart-link"]');
    this.burgerMenuBtn = page.locator('#react-burger-menu-btn');
    this.logoutLink    = page.locator('[data-test="logout-sidebar-link"]');
    this.allItemsLink  = page.locator('[data-test="inventory-sidebar-link"]');
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Returns the add-to-cart locator for a product */
  addToCartBtn(product: Product): Locator {
    return this.page.locator(`[data-test="${product.dataTestId}"]`);
  }

  /** Returns the remove-from-cart locator for a product */
  removeBtn(product: Product): Locator {
    return this.page.locator(`[data-test="${product.removeId}"]`);
  }

  async addProductToCart(product: Product) {
    await this.addToCartBtn(product).click();
  }

  async addAllProductsToCart(products: Product[]) {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }

  async removeProductFromCart(product: Product) {
    await this.removeBtn(product).click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async openBurgerMenu() {
    await this.burgerMenuBtn.click();
    await this.logoutLink.waitFor({ state: 'visible' });
  }

  async logout() {
    await this.openBurgerMenu();
    await this.logoutLink.click();
  }
}