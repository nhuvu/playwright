import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:4200/');
})

test.describe('Form Layout Page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

    test('Input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"})
                                           .getByRole('textbox', {name: "Email"});
        await usingTheGridEmailInput.fill('test@test.com'); //fill content
        await usingTheGridEmailInput.clear(); //clear content
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}); //slow type with delay between each char

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    })

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"});
        //Select radio button option 1
        await usingTheGridForm.getByLabel('Option 1').check({force: true}); //force check even if disabled
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true}); //force check even if disabled

        //generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked(); //boolean
        expect(radioStatus).toBeTruthy();
        //locator assertion
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked();

        //Select radio button option 2
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true});
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy();
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy();
    })
})

test('Checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    // await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true});
    // await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true});

    const allBoxes = page.getByRole('checkbox');
    for(const box of await allBoxes.all()){ //.all() returns an array of elements
        await box.check({force: true});
        expect (await box.isChecked()).toBeTruthy();
        await box.uncheck({force: true});
        expect (await box.isChecked()).toBeFalsy();
    }
})