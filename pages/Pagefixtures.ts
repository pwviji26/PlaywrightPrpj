import { test as base } from '@playwright/test';
import { LoginPage }             from '../pages/LoginPage';
import { InventoryPage }         from '../pages/InventoryPage';
import { CartPage }              from '../pages/CartPage';
import { CheckoutInfoPage }      from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage }  from '../pages/CheckoutOverviewPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

/**
 * Extended fixture type — all page objects available in every test via
 * destructuring: test('...', async ({ loginPage, inventoryPage, ... }) => {})
 */
export type PageFixtures = {
  loginPage:            LoginPage;
  inventoryPage:        InventoryPage;
  cartPage:             CartPage;
  checkoutInfoPage:     CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  orderConfirmationPage: OrderConfirmationPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
});

export { expect } from '@playwright/test';