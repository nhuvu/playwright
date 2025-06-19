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

test('Dialog Box', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //Create a listener for the dialog event from the browser
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?'); //assert the dialog message
        dialog.accept(); //accept the dialog
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click();
    await expect(page.locator('tr').first()).not.toHaveText("mdo@gmail.com");
})

test('Web Tables', async({page}) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    //1. Get the row by any text in the row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}); 
    await targetRow.locator('.nb-edit').click(); //click the edit button in the row
    //get the age box to modify the edit action (clear and fill new value)
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('30'); 
    await page.locator('.nb-checkmark').click();
    const ageFieldValue = await targetRow.locator('td').last().textContent();
    expect(ageFieldValue).toEqual('30');

    //2. Get the row based on value in a specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click(); //go to page 2
    //get the rows by text "11" first, then filter by the ID column between rows and only get the row with ID 11
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText("11")}); 
    await targetRowById.locator('.nb-edit').click(); 
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('araleTest@mail.com'); 
    await page.locator('.nb-checkmark').click();

    const emailFieldValue = await targetRowById.locator('td').nth(5).textContent();
    expect(emailFieldValue).toEqual('araleTest@mail.com');

    //3. Test table filter
    const ages = ["20", "30", "40", "200"];
    
    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500); //wait for the filter to apply

        const ageRows = page.locator('tbody tr');
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent();
            if(age === "200"){
                expect(cellValue).toContain("No data found"); 
            }else{
                expect(cellValue).toEqual(age); //assert that the age cell in each row has the same age value
            }
        }
    }
})

test('Date Picker', async({page}) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInput = page.getByPlaceholder('Form Picker');
    await calendarInput.click(); //open the date picker

    //getByText: get with partial match, to get exact match use {exact: true}
    await page.locator('[class=" day-cell ng-star-inserted"]').getByText('1', {exact: true}).click(); //select the 1st day of the month
    await expect(calendarInput).toHaveValue('Jun 1, 2025'); //assert the date value
})