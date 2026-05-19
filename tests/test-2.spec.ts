import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  https://demoblaze.com/await page.goto('https://demoblaze.com/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.locator('#loginusername').click();
  await page.locator('#loginusername').fill('Viji85');
  await page.locator('#loginpassword').click();
  await page.locator('#loginpassword').fill('pwd123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'Home (current)' }).click();
  await page.getByRole('link', { name: 'Nokia lumia' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'Home (current)' }).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('link', { name: 'Home (current)' }).click();
  await page.getByRole('link', { name: 'Nexus' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: 'Cart', exact: true }).click();
  await page.getByRole('link', { name: 'Delete' }).nth(2).click();
});