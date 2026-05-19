import {test, expect} from '@playwright/test'


test.beforeEach(async({page})=> {
        await page.goto('https://demoblaze.com/');
})
      

test('Add Item to Cart ', async ({page})=>{

const Item=page.getByRole('link' ,{name:'Samsung galaxy s6'})
await expect(Item).toBeVisible()
await Item.click()

})