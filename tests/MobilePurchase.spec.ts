import {test, expect} from '@playwright/test'

test.use(
    {

    trace: 'off',
    screenshot: 'on',

})

test.describe.configure({mode:"parallel"})

test.describe.only('Mobile Purchase',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://demoblaze.com/')
    })

    test('Login',{tag:"@smoke"},async({page})=>
    {
        await page.getByRole('link', {name: 'Log in'}).click()
        await page.locator('#loginusername').fill('Viji85')
        await page.locator('#loginpassword').fill('pwd123')
        await page.getByRole('button', {name: 'Log in'}).click()
        console.log ('Logged in Successfully')     

        await expect(page.locator ('#nameofuser')).toHaveText('Welcome Viji85')
})

test('Add to Cart',{tag:"@smoke"},async({page})=>
{
    page.on('dialog',async(alertBox)=>{
        const alertText=alertBox.message()
        console.log(alertText)
        expect(alertText).toBe('Product added')
        await alertBox.accept()
    } )
    await page.click('img[src="imgs/galaxy_s6.jpg"]')
    await page.waitForTimeout(3000)
    const addtoCart= page.getByRole('link', {name:'Add to cart'})
    await addtoCart.click()
    await page.getByRole('link', {name:'Home'}).click()
    await page.click('img[src="imgs/Lumia_1520.jpg"]')
    await page.waitForTimeout(3000)
    await addtoCart.click()
    await page.getByRole('link', {name:'Home'}).click()
    await page.click('img[src="imgs/iphone_6.jpg"]')
    await page.waitForTimeout(3000)
    await addtoCart.click()
 

})

// test.fail('Delete from Cart',{annotation:{
//     type: 'Issue',
//     description: 'Checking flaky Test',
// }},async({page})=>
// {
//     await page.getByRole('link', {name:'Cart'}).click()
//     await page.locator('tr',{hasText:'Nokia lumia 1520'}).locator('a',{hasText:'Delete'}).click()
//     await page.waitForTimeout(3000)
//     await expect(page.locator('tr',{hasText:'Samsung galaxy s6'})).toHaveCount(0)
//     await expect(page.locator('tr',{hasText:'Iphone 6 32gb'})).toHaveCount(1)
// })

})
        
        
   
