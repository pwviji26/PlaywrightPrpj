import {test,expect} from '@playwright/test'

test('Visual Test',async({page})=>
{
    await page.goto('https://www.example.com')
    await expect(page).toHaveScreenshot()

})