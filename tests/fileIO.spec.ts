import {test, expect} from '@playwright/test'

const filepath1='./screenshot/viewpage.png'
const filepath2='./screenshot/fullpage.png'

test('File Upload Test',async({page})=> {   
        await page.goto('https://the-internet.herokuapp.com/upload')

        //Method 1
        await page.setInputFiles('input#file-upload',filepath1)
        await page.getByRole('button',{name:'Upload'}).click()
        await page.waitForTimeout(3000)
        await expect(page.getByText('viewpage.png')).toBeVisible()

        //Method 2

        const fileChooserPromise = page.waitForEvent('filechooser')
        await page.locator('input#file-upload').click()
        




    })

    test('File Download Test',async({page},context)=> {   
        await page.goto('https://the-internet.herokuapp.com/download')
        const [download]= await Promise.all([
            page.waitForEvent('download'),
            page.getByRole('link',{name:'test-upload.txt'}).click()
        
        ])
        await download.saveAs('./downloads/test-upload.txt')
        console.log('File downloaded to Path'+ await download.path())

    })