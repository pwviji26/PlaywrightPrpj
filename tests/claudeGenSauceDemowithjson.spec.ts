import { test, expect, Page } from '@playwright/test';
import testData from './testData/testData.json'


// ─── Types derived from JSON ───────────────────────────────────────────────────

type UserKey = keyof typeof testData.users;

interface Product {
  name:       string;
  dataTestId: string;
  removeId:   string;
  price:      number;
}

// ─── Destructure test data ─────────────────────────────────────────────────────

const { baseUrl, password, users, products, checkout, messages } = testData;

// Products configured in testData.json (Sauce Labs Backpack + Bike Light)
const cartProducts: Product[] = products;

// ─── Page Object Helpers ───────────────────────────────────────────────────────

async function login(page: Page, username: string, pwd = password) {
  await page.goto(baseUrl);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(pwd);
  await page.locator('[data-test="login-button"]').click();
}

async function logout(page: Page) {
  await page.locator('#react-burger-menu-btn').click();
  await page.locator('[data-test="logout-sidebar-link"]').waitFor({ state: 'visible' });
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await page.waitForURL(baseUrl + '/');
}

async function addProductsToCart(page: Page, items: Product[]) {
  for (const product of items) {
    await page.locator(`[data-test="${product.dataTestId}"]`).click();
    await expect(page.locator(`[data-test="${product.removeId}"]`)).toBeVisible();
  }
}

// ─── Test Suite 1 : Login Validation for All Users ────────────────────────────

test.describe('Login — All Users', () => {

  // Dynamically generate one test per user entry in testData.json
  for (const [key, user] of Object.entries(users) as [UserKey, typeof users[UserKey]][]) {

    if (user.expectLogin) {
      test(`${user.username} can log in successfully`, async ({ page }) => {
        test.setTimeout(user.timeout + 15_000);
        await login(page, user.username);
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`, { timeout: user.timeout });
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
      });
    } else {
      test(`${user.username} sees error on login`, async ({ page }) => {
        await login(page, user.username);
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText(
          (user as typeof users['locked']).errorMessage
        );
        await expect(page).toHaveURL(baseUrl + '/');
      });
    }
  }

  test('invalid password shows error', async ({ page }) => {
    await login(page, users.standard.username, 'wrong_password');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(messages.loginError);
  });

  test('empty credentials shows error', async ({ page }) => {
    await page.goto(baseUrl);
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(messages.emptyUsernameError);
  });
});

// ─── Test Suite 2 : Add to Cart & Full Checkout (standard_user) ───────────────

test.describe('standard_user — Add to Cart & Place Order', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, users.standard.username);
    await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
  });

  test('adds products from JSON to cart and verifies badge count', async ({ page }) => {
    await addProductsToCart(page, cartProducts);
    await expect(page.locator('.shopping_cart_badge')).toHaveText(
      String(cartProducts.length)
    );
  });

  test('cart contains all products defined in testData.json', async ({ page }) => {
    await addProductsToCart(page, cartProducts);

    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(page.locator('.cart_item')).toHaveCount(cartProducts.length);

    // Verify each product name in order
    for (let i = 0; i < cartProducts.length; i++) {
      await expect(page.locator('.inventory_item_name').nth(i))
        .toHaveText(cartProducts[i].name);
    }
  });

  test('completes full checkout and places order', async ({ page }) => {
    const { customer, expectedSubtotal, expectedTax, expectedTotal } = checkout;

    // ── Step 1 : Add products from JSON ──────────────────────────────────────
    await addProductsToCart(page, cartProducts);
    await expect(page.locator('.shopping_cart_badge')).toHaveText(String(cartProducts.length));

    // ── Step 2 : Go to cart ───────────────────────────────────────────────────
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
    await expect(page.locator('.cart_item')).toHaveCount(cartProducts.length);

    for (let i = 0; i < cartProducts.length; i++) {
      await expect(page.locator('.inventory_item_name').nth(i))
        .toHaveText(cartProducts[i].name);
    }

    // ── Step 3 : Proceed to checkout ─────────────────────────────────────────
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-step-one.html`);
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');

    // ── Step 4 : Fill shipping information from JSON ─────────────────────────
    await page.locator('[data-test="firstName"]').fill(customer.firstName);
    await page.locator('[data-test="lastName"]').fill(customer.lastName);
    await page.locator('[data-test="postalCode"]').fill(customer.postalCode);
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

    // ── Step 5 : Verify order overview ───────────────────────────────────────
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');

    for (let i = 0; i < cartProducts.length; i++) {
      await expect(page.locator('.inventory_item_name').nth(i))
        .toHaveText(cartProducts[i].name);
    }

    await expect(page.locator('[data-test="subtotal-label"]'))
      .toHaveText(`Item total: ${expectedSubtotal}`);
    await expect(page.locator('[data-test="tax-label"]'))
      .toHaveText(`Tax: ${expectedTax}`);
    await expect(page.locator('[data-test="total-label"]'))
      .toHaveText(`Total: ${expectedTotal}`);

    // ── Step 6 : Place the order ──────────────────────────────────────────────
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);

    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');
    await expect(page.locator('[data-test="complete-header"]'))
      .toHaveText(messages.orderConfirmHeader);
    await expect(page.locator('[data-test="complete-text"]'))
      .toContainText(messages.orderConfirmText);

    // ── Step 7 : Return to inventory ──────────────────────────────────────────
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
  });

  test('checkout fails when required info fields are empty', async ({ page }) => {
    // Add first product from JSON, then attempt empty checkout
    await page.locator(`[data-test="${cartProducts[0].dataTestId}"]`).click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText(messages.emptyFirstName);
  });

  test('standard_user can log out successfully', async ({ page }) => {
    await logout(page);
    await expect(page).toHaveURL(baseUrl + '/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});

// ─── Test Suite 3 : Full E2E — Login → Cart → Order → Logout ─────────────────

test.describe('E2E — Login, Add to Cart, Place Order, Logout', () => {

  test('standard_user completes full end-to-end journey (data-driven)', async ({ page }) => {
    const { customer, expectedSubtotal, expectedTax, expectedTotal } = checkout;

    // 1. Login
    await login(page, users.standard.username);
    await expect(page).toHaveURL(`${baseUrl}/inventory.html`);

    // 2. Add all products defined in JSON
    await addProductsToCart(page, cartProducts);
    await expect(page.locator('.shopping_cart_badge')).toHaveText(String(cartProducts.length));

    // 3. Open cart and verify items
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(page.locator('.cart_item')).toHaveCount(cartProducts.length);
    for (let i = 0; i < cartProducts.length; i++) {
      await expect(page.locator('.inventory_item_name').nth(i))
        .toHaveText(cartProducts[i].name);
    }

    // 4. Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-step-one.html`);

    // 5. Enter shipping info from JSON
    await page.locator('[data-test="firstName"]').fill(customer.firstName);
    await page.locator('[data-test="lastName"]').fill(customer.lastName);
    await page.locator('[data-test="postalCode"]').fill(customer.postalCode);
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

    // 6. Verify totals from JSON
    await expect(page.locator('[data-test="subtotal-label"]'))
      .toHaveText(`Item total: ${expectedSubtotal}`);
    await expect(page.locator('[data-test="tax-label"]'))
      .toHaveText(`Tax: ${expectedTax}`);
    await expect(page.locator('[data-test="total-label"]'))
      .toHaveText(`Total: ${expectedTotal}`);

    // 7. Finish order
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
    await expect(page.locator('[data-test="complete-header"]'))
      .toHaveText(messages.orderConfirmHeader);

    // 8. Go back to inventory
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${baseUrl}/inventory.html`);

    // 9. Logout
    await logout(page);
    await expect(page).toHaveURL(baseUrl + '/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});