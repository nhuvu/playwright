import {test, expect} from '@playwright/test';

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

test('User facing locators', async({page}) => {
    //by role
    await page.getByRole('textbox', {name: 'Email'}).first().click();
    await page.getByRole('button', {name: 'Name'}).first().click();
    //by label
    await page.getByLabel('Email').first().click();
    //by placeholder
    await page.getByPlaceholder('Email').first().click();
    //by text
    await page.getByText('Using the Grid').click();
    //by title
    await page.getByTitle('IoT Dashboard').click();
    //by text id (reserve by playwright, defined by )
    await page.getByTestId('SignIn').click();
}) 

test('Locating child elements', async({page}) => {
    //way 1 (compact systax - chaining)
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    //way 2 (traditional syntax - using locator)
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();

    //get child at position index
    await page.locator('nb-card').nth(3).getByRole('button').click(); //get the 4th element
})

test('Combine regular locator method and user facing locator', async({page}) => {
    //combine regular locator method and user facing locator
    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click();
})


test('Locating Parent Elements', async({page}) => {
    //locate by the parent element togther with the additional info of the child ele (hasText.., has locator id)
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"} ).click();
    await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).click();

    //using filter -> narrow the target ele one by one until getting the desired one
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click();
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click();

    //apply multiple filters
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click();

    //locate the child element then go up 1 level to the parent ('..')
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click();
})

test('Reusing locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    const passwordField = basicForm.getByRole('textbox', {name: "Password"});

    await emailField.fill("test@mail.com");
    await passwordField.fill("123456");
    await basicForm.getByRole('button').click();

    await expect(emailField).toHaveValue("test@mail.com")
})

test('Extracting Values', async({page}) => {
    //single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"});
    const buttonText = await basicForm.locator('button').textContent() //extract text using textContent()
    await expect(buttonText).toEqual('Submit');

    //all test values
    const allRadioBtnLabels = await page.locator('nb-radio').allTextContents();
    await expect(allRadioBtnLabels).toContain('Option 12');

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"});
    await emailField.fill("test@test.com");
    const emailValue = await emailField.inputValue(); //extract value using inputValue()
    await expect(emailValue).toEqual("test@test.com");

    //placeholder value
    const placeholderValue = await emailField.getAttribute('placeholder'); //extract placeholder using getAttribute()
    await expect(placeholderValue).toEqual("Email");
})

test('Assertions', async({page}) => {
    const basicFormBtn = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button');

    //generic assertions (compare the value on the left to the value on the right; will not wait for anything)
    const value = 5;
    expect(value).toEqual(5);
    const text = await basicFormBtn.textContent();
    expect(text).toEqual('Submit');

    //locator assertions (interact with the element; will always wait up to 5s for the element to be found)
    await expect(basicFormBtn).toHaveText('Submit');

    //soft assertions (different with non-soft: even the assertion fails, the test below will continue)
    await expect.soft(basicFormBtn).toHaveText('Submit');
    await basicFormBtn.click();
})