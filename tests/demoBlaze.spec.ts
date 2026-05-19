import {test, expect} from '@playwright/test'
import {products} from './testData/products.json'
import {address} from './testData/products.json'

test.describe('Mobile Purchase with Data Import and Storage State',()=>
    {
            test.beforeEach(async({page})=> {
                await page.goto('https://demoblaze.com/');

            });

//Adding 3 Products by reading from JSON 
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

//Deleting 3rd Product by reading from JSON 
test('Delete 3rd product from Cart ', async ({page})=>
        {  
        const pdttoDelete=products[2].productName;
        console.log('Product to be Deleted:'+ pdttoDelete)
        await page.getByRole('link', { name: 'Cart', exact: true }).click();
        await page.waitForSelector('#tbodyid tr',{timeout:10000})
        const cartCount1=await page.locator('#tbodyid tr').count()
        console.log('No of Rows Before Deletion:', +cartCount1)
        const row=page.locator('#tbodyid tr').filter({hasText:pdttoDelete}).first()
        await row.getByRole('link', { name: 'Delete' }).click();
        await expect(row).not.toBeVisible()
        await page.waitForTimeout(1000)
        const cartCount2=await page.locator('#tbodyid tr').count()
        console.log('No of Rows After Deletion:', +cartCount2)
    })

//Order Submision
test('Place Order and Verify Details',async({page})=>
{
  
     await page.getByRole('link', { name: 'Cart', exact: true }).click();
     await page.waitForSelector('#tbodyid tr',{timeout:10000})
     const totalAmt=await page.locator('#totalp').textContent();
     console.log('Total Amount in Cart:' + totalAmt)
     
     await page.getByRole('button', { name: 'Place Order' }).click();

     await page.getByRole('textbox', { name: 'Name:' }).fill(address.Name);
     await page.getByRole('textbox', { name: 'Country:' }).fill(address.Country);
     await page.getByRole('textbox', { name: 'City:' }).fill(address.City);
     await page.getByRole('textbox', { name: 'Credit card:' }).fill(address.CreditCard);
     await page.getByRole('textbox', { name: 'Month:' }).fill(address.Month);
     await page.getByRole('textbox', { name: 'Year:' }).fill(address.Year);
     page.once('dialog', dialog => {
       console.log(`Dialog message: ${dialog.message()}`);
       dialog.dismiss().catch(() => {});
     });
     await page.getByRole('button', { name: 'Purchase' }).click();

     await expect(page.getByRole('heading', { name: 'Thank you for your purchase!' })).toBeVisible();
     const orderDetails= await page.getByText(/Id: \d+Amount: \d+/).textContent();
     console.log('Order Details:'+ orderDetails)
     expect(orderDetails).toContain(`Amount: ${totalAmt} USD`)
     await page.getByRole('button', { name: 'OK' }).click();

})

})