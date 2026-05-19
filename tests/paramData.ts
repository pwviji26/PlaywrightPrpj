import {test as base} from '@playwright/test'

export type TestOption = {
    username:string
}

export const test=base.extend<TestOption>
({
    username: ['standard_user',{option: true}]
})