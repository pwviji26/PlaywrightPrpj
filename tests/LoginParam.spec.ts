import {test, expect} from '@playwright/test'

test('Valid Login Test ',async ({page})=>{    
        await page.goto('https://www.saucedemo.com/')
        //await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('standard_user');
        //await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        //await page.locator('[data-test="title"]').click();
        await expect(page.locator('[data-test="title"]')).toContainText('Products');
    })

    const usernames =['standard_user', 'visual_user']

    for(const username of usernames){ 
    test(`Valid Login with ${username}`, async ({page})=>
        {    
        await page.goto('https://www.saucedemo.com/')
        await page.locator('[data-test="username"]').fill(username);
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="title"]')).toContainText('Products');
    })}


    