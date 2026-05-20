import {test, expect} from '@playwright/test'

test.describe.only('Web Tables Test',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://the-internet.herokuapp.com/tables')
    })

test('To get data from a Row',async({page})=> {
        const table1= page.locator('table#table1 tbody')  
        const firstRow= await table1.locator('tr').nth(2).allTextContents()
        firstRow.forEach(async(txt)=>{
        console.log(txt)
        })
})
})