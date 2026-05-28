import { test, expect } from '@playwright/test';

test('adds todo items to TodoMVC demo', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const todos = ['Buy milk', 'Write tests', 'Read book'];
  const todoInput = page.getByPlaceholder('What needs to be done?');

  for (const todo of todos) {
    await todoInput.fill(todo);
    await page.keyboard.press('Enter');
  }

  await expect(page.locator('.todo-list li')).toHaveCount(todos.length);
  await expect(page.locator('.todo-list li label')).toHaveText(todos);
});
