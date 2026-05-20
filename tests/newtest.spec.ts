import {test, expect} from '@playwright/test'

  test('Assertion Test',async({page})=>
   {
//Generic Assertions
    const value=10
    expect(value).toBeGreaterThan(6)

    // Page Assertions
    await page.goto('https://testautomationpractice.blogspot.com/')
    await expect(page).toHaveURL(/blogspot/)
    await expect(page).toHaveTitle(/Practice/)
    await expect(page).not.toHaveTitle(/Demo/)
   })