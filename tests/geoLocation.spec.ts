import {test, expect} from '@playwright/test'


test.use({
    locale: 'en-US',
    permissions: ['geolocation'],
    geolocation:{longitude:-81.515755, latitude:27.664827, accuracy:100},

})

test('GeoLocation Test',async({page})=> {  

await page.goto('https://my-location.org/')
await page.waitForTimeout(5000)
await expect(page.locator('#address')).toContainText('FL 33825, United States')
})
