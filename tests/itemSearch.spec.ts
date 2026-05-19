import {test, expect} from '@playwright/test'


test.beforeEach(async({page})=> {
        await page.goto('https://demoblaze.com/');
})
      
test('Search Item', async({page})=>
{
    await page.waitForTimeout(10000)
    const Item=page.getByRole('link' ,{name:'Samsung galaxy s6'})
    await expect(Item).toBeVisible()
    await Item.click()
    await page.waitForTimeout(10000)

})