// import {test,expect} from '@playwright/test'

// test.skip('iFrame and Tooltip test', async({page})=>
// {
//     await  page.goto('https://jqueryui.com/tooltip/')
//     const frameOne= page.frameLocator('.demo-frame')
//     const ageInp= frameOne.locator('#age')
//     await ageInp.hover()
//     const toolTip=frameOne.getByRole('tooltip')
//     console.log(await toolTip.textContent())
//     expect (await toolTip.textContent()).toContain('We ask for your age only for statistical purposes.')
// })

// test('Autocomlete test', async({page})=>
// {
//     const expText = "JavaScript"
//     await page.goto('https://jqueryui.com/autocomplete/')
//     const frameOne = page.frameLocator('.demo-frame')
//     const autoInp = frameOne.locator('#tags')
//     await autoInp.fill('as')
//     const suggesList = frameOne.locator('u1#ui-id-1 li')
//     await page.waitForTimeout(2000)
//     expect(suggesList).toHaveCount(4)
//     const suggesCount = await suggesList.count()
//     console.log('Suggestion Count:', suggesCount)

//     for (let i = 0, i < suggesCount; i++) {
//         const suggesText = await suggesList.nth(i).textContent()
//         if (suggesText?.trim() == expText) {
//             await suggesList.nth(i).click()

//         } break
//     }

//     await expect(autoInp).toHaveValue(expText)
// })