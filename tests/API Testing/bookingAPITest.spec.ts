import {test,expect, request} from '@playwright/test'
import pet from '../testData/pet.json'
import updatePet from '../testData/updatePet.json'

test.describe('API Testing - CRUD Methods',()=>
    {

test('Fetch all bookings',async({request})=>
{
    
    const response=await request.get('/booking')
    console.log(response.status())
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()
    //expect(response.headers(['content-type']).toEqual('application/json;)
    console.log('JSON Data List:', await response.json())

})

test('Fetch a bookings Details',async({request})=>
{
    
    const response=await request.get('https://petstore.swagger.io/v2/pet/548661')
    console.log(response.status())
    expect(response.status()).toBe(200)
    expect(response.ok()).toBeTruthy()
    const jsonData=await response.json()
    console.log('JSON Data List:', jsonData)
    //expect(jsonData.firstname).toBe('Josh')
    //expect(jsonData.bookingdates.checkout).toBe('2019-01-01')

})

test('Add new Pet',async({request})=>{

        const response=await request.post('https://petstore.swagger.io/v2/pet', {
            headers:{
                'accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            data:pet
        })

        console.log(response.status())
        expect(response.status()).toBe(200)
        const jsonData= await response.json()
        console.log(jsonData)
        expect(jsonData.category.name).toBe('Parrot')
        expect(jsonData.tags[1].name).toBe('Yellow')
        expect(jsonData.category).toHaveProperty('name','Parrot')
        expect(jsonData.status).toContain('available')

})

test('Update Existing Pet details',async({request})=>{

        const response=await request.put('https://petstore.swagger.io/v2/pet', {
            headers:{
                'accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            data:updatePet
        })

        console.log(response.status())
        expect(response.status()).toBe(200)
        const jsonData= await response.json()
        console.log(jsonData)
        expect(jsonData.name).toBe('Parrot')
        expect(jsonData.tags[0].name).toBe('kangs tag 548661')
        expect(jsonData.category).toHaveProperty('name','kangs name')
        expect(jsonData.status).toContain('available')

})

test('Generate Token and Delete Booking',async({request})=>{
        let strToken: string
    const response=await request.post('/auth', {
            headers:{
                
                'Content-Type': 'application/json' 
            },
            data:{
                    "username" : "admin",
                    "password" : "password123"
            }
        })
        console.log(response.status())
        const jsonData=await response.json()
        console.log('Token Generated:', jsonData.token)
        strToken=jsonData.token

        const delresponse=await request.delete('/booking/81', {
            headers:{
                       'Content-Type': 'application/json',
                       'Cookie':  'token=' + strToken
            }
            
        })
        console.log(delresponse.status())
        //console.log(delresponse)
         

    })

test('Generate Token and Update',async({request})=>{
        let strToken: string
    const response=await request.post('/auth', {
            headers:{
                
                'Content-Type': 'application/json' 
            },
            data:{
                    "username" : "admin",
                    "password" : "password123"
            }
        })
        console.log(response.status())
        const jsonData=await response.json()
        console.log('Token Generated:', jsonData.token)
        strToken=jsonData.token
        const responseid=await request.get('booking/1',{
            headers:{
                        'accept': 'application/json',
                      
                    }})
        console.log(responseid.status())
        console.log(await responseid.json())

        const updateresponse=await request.put('/booking/1', {
            headers:{
                        'accept': 'application/json',
                       'Content-Type': 'application/json',
                       'Cookie':  'token=' + strToken,
                    },
                    data:{
                            "firstname" : "James",
                            "lastname" : "Brown",
                            "totalprice" : 111,
                            "depositpaid" : true,
                            "bookingdates" : {
                                        "checkin" : "2018-01-01",
                                        "checkout" : "2019-01-01"
                                            },
                            "additionalneeds" : "Breakfast"
                        }            
        })
        console.log(updateresponse.status())
        console.log(await updateresponse.json())

    })

test('To get all User Details using api key',async({request})=>{
        
    const response=await request.get('https://reqres.in/api/users/4', {
            headers:{
                
                'x-api-key': 'free_user_3DvbchiOJeRNpsGzB1NFWWM3OhS' 
            }

        })
        const resStatus=response.status()
        console.log(resStatus)
        console.log(await response.json())

})
    })  