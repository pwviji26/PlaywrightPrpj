import {test as setup, expect} from '@playwright/test'
import { STORAGE_STATE } from '../playwright.config';   

// Constants
const App_URL= 'https://demoblaze.com/';
const USERNAME= 'Viji85';
const PASSWORD= 'pwd123';

// Setup File for storage state
setup('Login to Mobile Purchase App',async({page})=>   {
        await page.goto(App_URL);
        await page.getByRole('link', {name: 'Log in'}).click()
        await page.locator('#loginusername').fill(USERNAME)
        await page.locator('#loginpassword').fill(PASSWORD)
        await page.getByRole('button', {name: 'Log in'}).click()
        await expect(page.locator ('#nameofuser')).toContainText('Welcome '+USERNAME)
        await page.context().storageState({path: STORAGE_STATE})

    })