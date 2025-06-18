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

test('List and Dropdowns', async({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select');
    await dropdownMenu.click();

    page.getByRole('list') //use this when list has a 'ul' tag
    page.getByRole('listitem') //use this when list has a 'li' tag

    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({hasText: "Cosmic"}).click(); //filter the list to find the desired option and click

    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)'); //assert the header background color after selecting the option

    //Select each color option and assert the header background color
    const colorList = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }
    await dropdownMenu.click(); 
    for(const color in colorList){
        await optionList.filter({hasText: color}).click() //color = Light, Dark, Cosmic, Corporate
        await expect(header).toHaveCSS('background-color', colorList[color]);
        if(color !== "Corporate") { //when not iterate the last element
            await dropdownMenu.click(); //reopen the dropdown menu for the next iteration
        }
    }
})

test('Tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"});
    await toolTipCard.getByRole('button', {name: "Top"}).hover(); //hover over the button to show the tooltip
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip'); //assert the tooltip text
})