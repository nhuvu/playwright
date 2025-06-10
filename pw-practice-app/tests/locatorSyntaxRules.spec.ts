import {test} from 'playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('Locator Syntax rules', async({page}) => {
    //by Tag name -> as click() 
    await page.locator('input').first().click();
    //by ID
    page.locator('#inputEmail1');
    //by Class value
    page.locator('.shape-rectangle');
    //by Class value (full match)
    page.locator('[class="input-full-width size-medium shape-rectangle"]');
    //by Attribute name
    page.locator('[placeholder="Email"]');
    //combine different selectors
    page.locator('input#inputEmail1.shape-rectangle'); //no space between selectors
    //by Xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');
    //by partial text
    page.locator(':text("Using")');
    //by exact text
    page.locator(':text-is("Using the input")');
});