import { chromium, test, expect } from "@playwright/test";

test.only ('Launch Context Test', async()=>
{
    const browser=await chromium.launch({
        headless: false
    })

    const contextOne= await browser.newContext()
    const pageOne= await contextOne.newPage()
    await pageOne.setViewportSize({width: 2080, height:720})
    await pageOne.waitForTimeout(2000)
    await pageOne.goto('https://jqueryui.com/autocomplete/')
    contextOne.close()

    const contextTwo= await browser.newContext()
    const pageTwo= await contextTwo.newPage()
    await pageTwo.setViewportSize({width: 1080, height:720})
    await pageTwo.waitForTimeout(2000)
    await pageTwo.goto('https://playwright.dev/docs/intro')

} )