import { test, expect } from '../fixtures/pageFixtures';
import testData from '../data/testData.json';

const { baseUrl, password, users, products, checkout, messages } = testData;

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 1 — Login : All Users (data-driven from testData.json)
// ══════════════════════════════════════════════════════════════════════════════

test.describe('Suite 1 — Login : All Users', () => {

  // Dynamically generate one test per user entry in testData.json
  for (const [, user] of Object.entries(users)) {

    if (user.expectLogin) {

      test(`[LOGIN SUCCESS] ${user.username} lands on inventory page`, async ({ loginPage }) => {
        test.setTimeout(user.timeout + 15_000);

        await loginPage.navigate(baseUrl);
        await loginPage.login(user.username, password);

        await expect(loginPage.page).toHaveURL(`${baseUrl}/inventory.html`, { timeout: user.timeout });
      });

    } else {

      test(`[LOGIN BLOCKED] ${user.username} sees locked-out error`, async ({ loginPage }) => {
        await loginPage.navigate(baseUrl);
        await loginPage.login(user.username, password);

        await expect(loginPage.page).toHaveURL(baseUrl + '/');
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(user.errorMessage!);
      });
    }
  }

  test('[LOGIN ERROR] invalid password shows mismatch error', async ({ loginPage }) => {
    await loginPage.navigate(baseUrl);
    await loginPage.login(users.standard.username, 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(messages.loginError);
  });

  test('[LOGIN ERROR] empty credentials shows username required error', async ({ loginPage }) => {
    await loginPage.navigate(baseUrl);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText(messages.emptyUsernameError);
  });

  test('[LOGIN ERROR] only password filled shows username required error', async ({ loginPage }) => {
    await loginPage.navigate(baseUrl);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toContainText(messages.emptyUsernameError);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 2 — Cart : Add Products (standard_user)
// ══════════════════════════════════════════════════════════════════════════════

test.describe('Suite 2 — Cart : Add Products', () => {

  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate(baseUrl);
    await loginPage.login(users.standard.username, password);

    await expect(inventoryPage.page).toHaveURL(`${baseUrl}/inventory.html`);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('[CART] adds all products from JSON and verifies remove buttons and badge', async ({
    inventoryPage,
  }) => {
    await inventoryPage.addAllProductsToCart(products);

    // Each product should now show a Remove button
    for (const product of products) {
      await expect(inventoryPage.removeBtn(product)).toBeVisible();
    }

    // Cart badge should reflect total number of products in JSON
    await expect(inventoryPage.cartBadge).toHaveText(String(products.length));
  });

  test('[CART] cart page lists every product defined in JSON', async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addAllProductsToCart(products);
    await inventoryPage.goToCart();

    await expect(cartPage.page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(products.length);

    for (let i = 0; i < products.length; i++) {
      await expect(cartPage.itemNames.nth(i)).toHaveText(products[i].name);
    }
  });

  test('[CART] adding products one at a time increments badge correctly', async ({
    inventoryPage,
  }) => {
    for (let i = 0; i < products.length; i++) {
      await inventoryPage.addProductToCart(products[i]);
      await expect(inventoryPage.cartBadge).toHaveText(String(i + 1));
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 3 — Checkout : Place Order (standard_user)
// ══════════════════════════════════════════════════════════════════════════════

test.describe('Suite 3 — Checkout : Place Order', () => {

  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.navigate(baseUrl);
    await loginPage.login(users.standard.username, password);

    await expect(inventoryPage.page).toHaveURL(`${baseUrl}/inventory.html`);
    await inventoryPage.addAllProductsToCart(products);
  });

  test('[CHECKOUT] proceeds from cart to checkout info page', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.goToCart();

    await expect(cartPage.page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await cartPage.proceedToCheckout();

    await expect(checkoutInfoPage.page).toHaveURL(`${baseUrl}/checkout-step-one.html`);
    await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information');
  });

  test('[CHECKOUT] shows validation error when customer info fields are empty', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();

    // Attempt to continue without filling any field
    await checkoutInfoPage.clickContinue();

    await expect(checkoutInfoPage.errorMessage).toBeVisible();
    await expect(checkoutInfoPage.errorMessage).toContainText(messages.emptyFirstName);
  });

  test('[CHECKOUT] fills customer info from JSON and reaches overview page', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(checkout.customer);

    await expect(checkoutOverviewPage.page).toHaveURL(`${baseUrl}/checkout-step-two.html`);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');
  });

  test('[CHECKOUT] overview shows correct products, prices, and totals from JSON', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(checkout.customer);

    await expect(checkoutOverviewPage.page).toHaveURL(`${baseUrl}/checkout-step-two.html`);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');

    // Verify all products from JSON appear in the overview
    for (let i = 0; i < products.length; i++) {
      await expect(checkoutOverviewPage.itemNames.nth(i)).toHaveText(products[i].name);
    }

    // Verify price summary from JSON
    await expect(checkoutOverviewPage.subtotalLabel).toHaveText(`Item total: ${checkout.expectedSubtotal}`);
    await expect(checkoutOverviewPage.taxLabel).toHaveText(`Tax: ${checkout.expectedTax}`);
    await expect(checkoutOverviewPage.totalLabel).toHaveText(`Total: ${checkout.expectedTotal}`);

    // Verify payment and shipping info from JSON
    await expect(checkoutOverviewPage.paymentInfo).toHaveText(checkout.payment);
    await expect(checkoutOverviewPage.shippingInfo).toHaveText(checkout.shipping);
  });

  test('[CHECKOUT] places order and shows confirmation screen', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    orderConfirmationPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(checkout.customer);

    await expect(checkoutOverviewPage.page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

    await checkoutOverviewPage.clickFinish();

    await expect(orderConfirmationPage.page).toHaveURL(`${baseUrl}/checkout-complete.html`);
    await expect(orderConfirmationPage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(orderConfirmationPage.confirmHeader).toHaveText(messages.orderConfirmHeader);
    await expect(orderConfirmationPage.confirmText).toContainText(messages.orderConfirmText);
    await expect(orderConfirmationPage.ponyExpressImage).toBeVisible();
  });

  test('[CHECKOUT] back-to-products button returns to inventory after order', async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    orderConfirmationPage,
  }) => {
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
    await checkoutInfoPage.fillAndContinue(checkout.customer);
    await checkoutOverviewPage.clickFinish();

    await expect(orderConfirmationPage.page).toHaveURL(`${baseUrl}/checkout-complete.html`);

    await orderConfirmationPage.backToInventory();

    await expect(inventoryPage.page).toHaveURL(`${baseUrl}/inventory.html`);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// SUITE 4 — E2E : Login → Cart → Order → Logout
// ══════════════════════════════════════════════════════════════════════════════

test.describe('Suite 4 — E2E : Login → Add to Cart → Place Order → Logout', () => {

  test('[E2E] standard_user completes full shopping journey', async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    orderConfirmationPage,
  }) => {

    // ── 1. Navigate and login ─────────────────────────────────────────────────
    await loginPage.navigate(baseUrl);
    await loginPage.login(users.standard.username, password);

    await expect(inventoryPage.page).toHaveURL(`${baseUrl}/inventory.html`);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // ── 2. Add all products from JSON ─────────────────────────────────────────
    await inventoryPage.addAllProductsToCart(products);

    await expect(inventoryPage.cartBadge).toHaveText(String(products.length));

    // ── 3. Open cart and verify product list ──────────────────────────────────
    await inventoryPage.goToCart();

    await expect(cartPage.page).toHaveURL(`${baseUrl}/cart.html`);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(cartPage.cartItems).toHaveCount(products.length);

    for (let i = 0; i < products.length; i++) {
      await expect(cartPage.itemNames.nth(i)).toHaveText(products[i].name);
    }

    // ── 4. Proceed to checkout info ───────────────────────────────────────────
    await cartPage.proceedToCheckout();

    await expect(checkoutInfoPage.page).toHaveURL(`${baseUrl}/checkout-step-one.html`);
    await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information');

    // ── 5. Fill customer info from JSON ───────────────────────────────────────
    await checkoutInfoPage.fillAndContinue(checkout.customer);

    await expect(checkoutOverviewPage.page).toHaveURL(`${baseUrl}/checkout-step-two.html`);
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview');

    // ── 6. Verify order summary from JSON ─────────────────────────────────────
    for (let i = 0; i < products.length; i++) {
      await expect(checkoutOverviewPage.itemNames.nth(i)).toHaveText(products[i].name);
    }

    await expect(checkoutOverviewPage.subtotalLabel).toHaveText(`Item total: ${checkout.expectedSubtotal}`);
    await expect(checkoutOverviewPage.taxLabel).toHaveText(`Tax: ${checkout.expectedTax}`);
    await expect(checkoutOverviewPage.totalLabel).toHaveText(`Total: ${checkout.expectedTotal}`);
    await expect(checkoutOverviewPage.paymentInfo).toHaveText(checkout.payment);
    await expect(checkoutOverviewPage.shippingInfo).toHaveText(checkout.shipping);

    // ── 7. Place the order ────────────────────────────────────────────────────
    await checkoutOverviewPage.clickFinish();

    await expect(orderConfirmationPage.page).toHaveURL(`${baseUrl}/checkout-complete.html`);
    await expect(orderConfirmationPage.pageTitle).toHaveText('Checkout: Complete!');
    await expect(orderConfirmationPage.confirmHeader).toHaveText(messages.orderConfirmHeader);
    await expect(orderConfirmationPage.confirmText).toContainText(messages.orderConfirmText);
    await expect(orderConfirmationPage.ponyExpressImage).toBeVisible();

    // ── 8. Return to inventory ────────────────────────────────────────────────
    await orderConfirmationPage.backToInventory();

    await expect(inventoryPage.page).toHaveURL(`${baseUrl}/inventory.html`);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    // ── 9. Logout ─────────────────────────────────────────────────────────────
    await inventoryPage.logout();

    await expect(loginPage.page).toHaveURL(baseUrl + '/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});