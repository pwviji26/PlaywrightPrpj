import {test, expect} from '@playwright/test'

test.describe('Various Test for Alerts',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://testautomationpractice.blogspot.com/')
    })

    test('SimpleAlert Test', async({page})=>
    {page.on('dialog',async(alertBox)=>
    {
        const alertText=alertBox.message()
        expect(alertText).toBe('I am an alert box!')
        await alertBox.accept()
    })
    await page.getByRole('button',{name:'Simple Alert'}).click()

    })

    test('Confirmation Alert Test', async({page})=>
    {page.on('dialog',async(alertBox)=>
    {
        const alertText=alertBox.message()
        expect(alertText).toBe('Press a button!')
        //await alertBox.accept()
        await alertBox.dismiss()
        const confirmText=page.locator('#demo')
        expect(confirmText).toBe('You pressed Cancel!')
    })
    await page.getByRole('button',{name:'Confirmation Alert'}).click()

    })

    test('Prompt Alert Test', async({page})=>
    {page.on('dialog',async(alertBox)=>
    {
        const alertText=alertBox.message()
        expect(alertText).toBe('Please enter your name:')
        //await alertBox.accept()
        await alertBox.dismiss()
        const confirmText=page.locator('#demo')
        expect(confirmText).toBe('You pressed Cancel!')
    })
    await page.getByRole('button',{name:'Confirmation Alert'}).click()

    })
})