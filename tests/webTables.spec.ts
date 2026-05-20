import {test, expect} from '@playwright/test'

test.describe.configure({mode:"parallel"})
test.describe.only('Web Tables Test',()=>{
    test.beforeEach(async ({page})=> {
        await page.goto('https://the-internet.herokuapp.com/tables')
    })

    test('Getting Rows and Columns Count in Table',async({page})=> { 
    const tableRows=await page.locator('table#table1 tbody tr').all()
        console.log('No of Rows:', tableRows.length)
        tableRows.forEach(async(rows)=>{
            console.log('No of Columns:',await rows.locator('td').count())
            //Included for CR005
            expect(tableRows.length).toBe(4)
        })

    })

    test('To get data from a Row',async({page})=> {
        const table1= page.locator('table#table1 tbody')  
        const firstRow= await table1.locator('tr').nth(2).allTextContents()
        firstRow.forEach(async(txt)=>{
        console.log(txt)
        })

    })

    test('To get details of user',async({page})=> {
  const table1= page.locator('table#table1 tbody')
        const rowData=table1.getByRole('row',{name:'Jason'})
        const txts=await rowData.evaluateAll(cols=>
            cols.map(element=>element.textContent));
            console.log('All Columns value:',txts)
})

    })


