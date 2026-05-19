import {test, expect} from '@playwright/test'

test.describe('Various Test for PopUp',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://testautomationpractice.blogspot.com/')
    })

 test('Popup Window Test', async({page})=> 
    {
        // //Method 1
        // const [newPage]= await Promise.all([
        //     page.waitForEvent('popup'),

        //     await page.getByRole('button', {name: 'New Tab'}).click()
        //       ])

        //       await newPage.waitForLoadState()
        //       await expect(newPage).toHaveTitle(/SDET-QA/)

        //Method 2
            //   const popuppromise= page.waitForEvent('popup')
            //   await page.getByRole('button', {name: 'New Tab'}).click()
            //   const popup= await popuppromise
            //   await popup.waitForLoadState()
            //   await expect(popup).toHaveTitle(/SDET-QA/)

        //Method 3
        page.on('popup', async(popupwin)=> 
        {
             popupwin.waitForLoadState()
             await expect(popupwin).toHaveTitle(/SDET-QA/)

        })
        await page.getByRole('button', {name: 'New Tab'}).click()
        await page.waitForTimeout(3000)

                
              })

 })