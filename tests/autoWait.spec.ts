import {test, expect} from '@playwright/test'

test.describe('Auto Wait Test',()=>{
    //test.beforeEach(async ({page})=> {
       // await page.goto('https://the-internet.herokuapp.com/tables')
   // })

   test('Auto Wait',async({page})=>
   {
    //test.setTimeout(15000)
    test.setTimeout(5000)

    await page.goto('http://uitestingplayground.com/ajax')
    await page.locator('#ajaxButton').click()

    const txtElem=page.locator('.bg-success')
    const txtMsg= await txtElem.textContent()

    await expect(txtElem).toHaveText('Data loaded with AJAX get request.')
    //await page.waitForTimeout(2000)
   }
   )

    test('Waiting for Network Response',async({page})=>
   {
    //test.setTimeout(15000)
    test.setTimeout(4000)

    await page.goto('http://uitestingplayground.com/')
    await page.getByRole('link',{name:'Load Delay'}).click()
    page.waitForLoadState('domcontentloaded')
    await page.getByRole('button',{name:'Button Appearing After Delay'}).click()
})

})
