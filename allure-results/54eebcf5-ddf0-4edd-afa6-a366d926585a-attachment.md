# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: API Testing\bookingAPITest.spec.ts >> API Testing - CRUD Methods >> Fetch a bookings Details
- Location: tests\API Testing\bookingAPITest.spec.ts:18:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test'
  2  | 
  3  | test.describe('API Testing - CRUD Methods',()=>
  4  |     {
  5  | 
  6  | test('Fetch all bookings',async({request})=>
  7  | {
  8  |     
  9  |     const response=await request.get('/booking')
  10 |     console.log(response.status())
  11 |     expect(response.status()).toBe(200)
  12 |     expect(response.ok()).toBeTruthy()
  13 |     //expect(response.headers(['content-type']).toEqual()
  14 |     console.log('JSON Data List:', await response.json())
  15 | 
  16 | })
  17 | 
  18 | test('Fetch a bookings Details',async({request})=>
  19 | {
  20 |     
  21 |     const response=await request.get('/booking/81')
  22 |     console.log(response.status())
> 23 |     expect(response.status()).toBe(200)
     |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  24 |     expect(response.ok()).toBeTruthy()
  25 |     //expect(response.headers(['content-type']).toEqual())
  26 |     const jsonData=await response.json()
  27 |     console.log('JSON Data List:', jsonData)
  28 |     expect(jsonData.firstname).toBe('Jane')
  29 |     expect(jsonData.bookingdates.checkout).toBe('2019-01-01')
  30 | 
  31 | 
  32 | })
  33 | 
  34 |     })
```