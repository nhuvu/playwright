import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}, testInfo) => {
    await page.goto('http://uitestingplayground.com/ajax');
    await page.locator('#ajaxButton').click();
    testInfo.setTimeout(testInfo.timeout + 2000); //set timeout for this test suite 
});

test('Auto waiting', async ({page}) => {
    const successBtn = page.locator('.bg-success');
    await successBtn.click();
    
    const text = await successBtn.textContent();
    expect(text).toEqual('Data loaded with AJAX get request.');

    //self-defined wait
    await successBtn.waitFor({state: "attached"}) //self-defined wait state 
    const allText = await successBtn.allTextContents(); //allTextContents() will not wait for anything, test will simply fail
    expect(allText).toContain('Data loaded with AJAX get request.');
    
    await expect(successBtn).toHaveText('Data loaded with AJAX get request.', {timeout: 5000}); //expect will wait for the text to appear, up to 5s
})

test('Alternative waiting', async ({page}) => {
    const successBtn = page.locator('.bg-success');

    //1. wait for element
    await page.waitForSelector('.bg-success')

    //2. wait for response (api call when element is click)
    await page.waitForResponse('https://uitestingplayground.com/ajaxdata')

    //3. wait for network calls (NOT RECOMMENDED)
    await page.waitForLoadState('networkidle');

    //4. others
    await page.waitForTimeout(5000); //wait for 5 seconds (not recommended, use only for debugging)
    await page.waitForURL('**/ajaxdata'); //wait for the URL to change (not recommended, use only for debugging)

    const allText = await successBtn.allTextContents(); 
    expect(allText).toContain('Data loaded with AJAX get request.');
})

test('Timeouts', async ({page}) => {
    //defaul timeout of all test is 30s, can be re-define in playwright.config.ts;
    //test.setTimeout(10000); //set timeout for this test to 20s
    test.slow(); //increase default test timeout in 3 times (eg. 10s -> 30s)
    const successBtn = page.locator('.bg-success');
    await successBtn.click({timeout: 6000}); //set timeout here will override the action timeout in playwright.config.ts
    
})
