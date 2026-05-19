import {expect} from '@playwright/test'
import {test} from './paramData'
import {users} from './testData/users.json'


//Using TS file for maintaining Test data
//  test('Parameterization Project - With Valid Login', async ({page,username})=>
//         {    
//         await page.goto('https://www.saucedemo.com/')
//         await page.locator('[data-test="username"]').fill(username);
//         await page.locator('[data-test="password"]').fill('secret_sauce');
//         await page.locator('[data-test="login-button"]').click();
//         await expect(page.locator('[data-test="title"]')).toContainText('Products');
//     })

    //Using JSON file for maintaining Test data

    users.forEach((user,index) => {
        test(`Login to App With Valid Login ${user.username}`, async ({page})=>
        {    
        await page.goto('https://www.saucedemo.com/')
        await page.locator('[data-test="username"]').fill(user.username);
        await page.locator('[data-test="password"]').fill(user.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="title"]')).toContainText('Products');
    })

        
    });

    // Giving data during runtime

    test('Valid Login', async ({page})=>
            {    
            await page.goto('https://www.saucedemo.com/')
            await page.locator('[data-test="username"]').fill(process.env.USERNAME);
            await page.locator('[data-test="password"]').fill(process.env.PASSWORD);
            await page.locator('[data-test="login-button"]').click();
            await expect(page.locator('[data-test="title"]')).toContainText('Products');
        })
