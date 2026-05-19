import {test, expect} from '@playwright/test'
import {products} from './testData/products.json'

// Constants
const App_URL= 'https://demoblaze.com/';
const USERNAME= 'Viji85';
const PASSWORD= 'pwd123';


test.describe('Mobile Purchase with Data Import',()=>
    {
    test.beforeEach(async({page})=> {
        await page.goto(App_URL);
        await page.getByRole('link', {name: 'Log in'}).click()
        await page.locator('#loginusername').fill(USERNAME)
        await page.locator('#loginpassword').fill(PASSWORD)
        await page.getByRole('button', {name: 'Log in'}).click()
    });

test('Login to App',async({page})=>
    {
        console.log ('Logged in Successfully')     
        await expect(page.locator ('#nameofuser')).toHaveText('Welcome '+USERNAME)
})

products.forEach((product,index) => {
test(`Add to Cart ${product.productName}`, async ({page})=>
        {  
    page.on('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
    await page.getByRole('link', { name: product.productName }).click();
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await page.getByRole('link', { name: 'Home (current)' }).click();

 
})
})

products.forEach((product,index) => {
test(`Delete from Cart ${product.productName}`, async ({page})=>
        {  
        
        await page.getByRole('link', { name: 'Cart', exact: true }).click();
        //await expect(page.locator('tbodyid tr')).toHaveCount(3);
        const cartCount=await page.locator('#tbodyid tr').all()
        console.log('No of Rows:', cartCount.length)
        
        await page.getbyText(`${product[1].productName}`).click();
        //await expect(page.locator('#tbodyid')).toContain(product[2].productName);     
        //await page.getByRole('link', { name: 'Delete' }).(product[2].productName).click();
        //await expect(page).not.toContainText('Nexus')

        //await expect(page.locator('tbodyid tr')).toHaveCount(3);
        const cartCount1=await page.locator('#tbodyid tr').all()
        console.log('No of Rows after Deletion:', cartCount1.length)

        })})
  
})