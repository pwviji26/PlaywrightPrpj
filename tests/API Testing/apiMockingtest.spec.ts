import {test,expect} from '@playwright/test'


test.describe('API Testing - CRUD Methods',()=>
    {

test('Mock tag list-replace tags ', async ({page})=>
{
await page.route('https://conduit-realworld-example-app.fly.dev/api/tags',async route =>
{ const json={ 'tags':['Playwright','Mock API'] }

route.fulfill({json})
})
await page.goto('https://conduit-realworld-example-app.fly.dev')
await page.waitForTimeout(3000)
await expect(page.getByRole('button',{name:'Playwright'})).toBeVisible()
})

test('Mock tag list-update tags ', async ({page})=>
{
    //Update the tags at the starting using unshift
await page.route('https://conduit-realworld-example-app.fly.dev/api/tags',async route =>
{  const response=await route.fetch()
    const json=await response.json()
    console.log(json)
    json.tags.unshift('Playwright') 
    await route.fulfill({response, json})
})
await page.goto('https://conduit-realworld-example-app.fly.dev')
await page.waitForTimeout(3000)
await expect(page.getByRole('button',{name:'Playwright'})).toBeVisible()
    })

test.only('Record the HAR file',async({page})=>{
// Record the HAR file from Network Layer
// await page.route('https://conduit-realworld-example-app.fly.dev/api/tags',async route =>
// { 
   await page.routeFromHAR('./har/tags.har', {
    url:'https://conduit-realworld-example-app.fly.dev/api/tags',
    update: true
   })

   await page.goto('https://conduit-realworld-example-app.fly.dev')
})

//Modify the HAR file before reading it
test('Read the HAR file',async({page})=>{

   await page.routeFromHAR('./har/tags.har', {
    url:'https://conduit-realworld-example-app.fly.dev/api/tags',
    update: false
   })

   await page.goto('https://conduit-realworld-example-app.fly.dev')
   await page.waitForTimeout(3000)
   await expect(page.getByRole('button',{name:'PlaywrightMockAPI'})).toBeVisible()
})


})