import { test, expect, Page } from '@playwright/test';

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://www.saucedemo.com';
const PASSWORD = 'secret_sauce';

const USERS = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

type Username = (typeof USERS)[keyof typeof USERS];

// ─── Page Object Helpers ───────────────────────────────────────────────────────

async function login(page: Page, username: Username, password = PASSWORD) {
  await page.goto(BASE_URL);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

async function logout(page: Page) {
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('[data-test="logout-sidebar-link"]').waitFor({ state: 'visible' });
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await page.waitForURL(BASE_URL + '/');
}

// ─── Test Suite 1 : Login Validation for All Users ────────────────────────────

test.describe('Login — All Users', () => {

  test('standard_user can log in successfully', async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('locked_out_user sees error on login', async ({ page }) => {
    await login(page, USERS.locked);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out.'
    );
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('problem_user can log in successfully', async ({ page }) => {
    await login(page, USERS.problem);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('performance_glitch_user can log in (with extended timeout)', async ({ page }) => {
    test.setTimeout(60_000);
    await login(page, USERS.performanceGlitch);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`, { timeout: 30_000 });
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('error_user can log in successfully', async ({ page }) => {
    await login(page, USERS.error);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('visual_user can log in successfully', async ({ page }) => {
    await login(page, USERS.visual);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('any user — invalid password shows error', async ({ page }) => {
    await login(page, USERS.standard, 'wrong_password');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('empty credentials shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });
});

// ─── Test Suite 2 : Add to Cart & Full Checkout (standard_user) ───────────────

test.describe('standard_user — Add to Cart & Place Order', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, USERS.standard);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('adds Sauce Labs Backpack and Bike Light to cart', async ({ page }) => {
    // Add Sauce Labs Backpack
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

    // Add Sauce Labs Bike Light
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // Cart badge shows 2 items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('cart contains correct products', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);

    // Verify both products appear
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_name').nth(1)).toHaveText('Sauce Labs Bike Light');
  });

  test('completes full checkout and places order', async ({ page }) => {

    // ── Step 1 : Add products ─────────────────────────────────────────────────
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // ── Step 2 : Go to cart ───────────────────────────────────────────────────
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');

    // Verify cart items
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_name').nth(1)).toHaveText('Sauce Labs Bike Light');

    // ── Step 3 : Proceed to checkout ─────────────────────────────────────────
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // ── Step 4 : Fill shipping information ───────────────────────────────────
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('10001');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // ── Step 5 : Verify order overview ───────────────────────────────────────
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
    await expect(page.locator('.inventory_item_name').first()).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_name').nth(1)).toHaveText('Sauce Labs Bike Light');
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $39.98');
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $3.20');
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $43.18');

    // ── Step 6 : Place the order ──────────────────────────────────────────────
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);

    // Verify order confirmation
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="complete-text"]')).toContainText(
      'Your order has been dispatched'
    );

    // ── Step 7 : Return to inventory ──────────────────────────────────────────
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('checkout fails if required info fields are empty', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Try continuing with no info
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  // ─── Step 8 : Logout ────────────────────────────────────────────────────────
  test('standard_user can log out successfully', async ({ page }) => {
    await logout(page);
    await expect(page).toHaveURL(BASE_URL + '/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});

// ─── Test Suite 3 : Full E2E — Login → Cart → Order → Logout ─────────────────

test.describe('E2E — Login, Add to Cart, Place Order, Logout', () => {

  test('standard_user completes full end-to-end journey', async ({ page }) => {

    // 1. Login
    await login(page, USERS.standard);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    // 2. Add Sauce Labs Backpack & Bike Light
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    // 3. Open cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
    await expect(page.locator('.cart_item')).toHaveCount(2);

    // 4. Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);

    // 5. Enter shipping info
    await page.locator('[data-test="firstName"]').fill('Jane');
    await page.locator('[data-test="lastName"]').fill('Smith');
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);

    // 6. Finish order
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');

    // 7. Go back to home
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);

    // 8. Logout
    await logout(page);
    await expect(page).toHaveURL(BASE_URL + '/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});