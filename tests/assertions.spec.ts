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

    //To continue even if any step failes use Soft assertions

    await expect.soft(page.locator('h6')).toBeVisible()
    const pageHeading=page.locator('h1')
    await expect(pageHeading).toBeVisible()
    console.log('Page Header Text:', await pageHeading.textContent())

    await expect(pageHeading).toContainText('Automation Testing Practice')


   })