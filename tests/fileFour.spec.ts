import {test, expect} from '@playwright/test'

test.describe.only('Web Tables Test',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://the-internet.herokuapp.com/tables')
    })

test('To get details of user- change made in phase2 branch',async({page})=> {
  const table1= page.locator('table#table1 tbody')
        const rowData=table1.getByRole('row',{name:'Jason'})
        const txts=await rowData.evaluateAll(cols=>
            cols.map(element=>element.textContent));
            console.log('All Columns value:',txts)
    //Udated by Tester 2
    console.log('All Columns value:',rowData)
            console.log(rowData)
})
})
