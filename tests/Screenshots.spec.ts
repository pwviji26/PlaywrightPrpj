import {test, expect} from '@playwright/test'

test.describe('Screenshots Test',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://testautomationpractice.blogspot.com/')
    })

test('Sample Screenshot Test', async({page})=> 
 { 
await page.screenshot({path:'./screenshot/fullpage.png', fullPage: true})
await page.screenshot({path:'./screenshot/viewpage.png'})
await page.locator('#colors').screenshot({path:'./screenshot/elementpage.png'})

 })})