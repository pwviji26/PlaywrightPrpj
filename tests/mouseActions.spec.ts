import {test, expect} from '@playwright/test'

test.describe('Various Test for Mouse Actions',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://testautomationpractice.blogspot.com/')
    })

//  test('Doubleclick Test', async({page})=> 
//     {
//         await page.getByRole('button', {name: 'Copy Text'}).dblclick()
//         await expect(page.locator('#field2')).toHaveValue('Hello World!')
//         await page.locator('#field2').click({button: 'right'})
//         await page.waitForTimeout(3000)
//     })

 test('Move to Element and Click Test',async({page})=> 
{
     await page.getByRole('button', {name: 'Point Me'}).hover()
     await page.getByRole('link', {name: 'Laptops'}).click()

})   
})