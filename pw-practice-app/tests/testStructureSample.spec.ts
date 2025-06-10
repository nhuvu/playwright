import {test} from '@playwright/test';

//hooks (beforeEach)
test.beforeEach(async({page})=> {
    await page.goto('http://localhost:4200/')
})

//test suite
test.describe('test suite 1', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
    })
    //testcase
    test('the first test', async({page}) => {
        await page.getByText('Form Layouts').click()
    })
    
    test('navigate to the datepicker page', async({page}) => {
        await page.getByText('Datepicker').click()
    })
})

test.describe('test suite 2', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Charts').click()
    })
    //testcase
    test('navigate to the echart page', async({page}) => {
        await page.getByText('Echarts').click()
    })
})


test.afterEach( ()=> {
    
})

test.afterAll( ()=> {
    
})
