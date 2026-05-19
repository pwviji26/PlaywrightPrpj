import {test, expect} from '@playwright/test'

test.beforeEach(async({page})=> {
await page.goto('https://demoblaze.com/');

});

//Logout from App

test('Logout from Demoblaze', async ({page})=>{

await page.waitForTimeout(10000)
const logoutlink=page.getByRole('link',{ name:'Log out'})
await expect(logoutlink).toBeVisible()
await logoutlink.click()
await page.waitForTimeout(5000)
console.log('Logged Out of Demoblaze Aplication Successfully')
}
)
