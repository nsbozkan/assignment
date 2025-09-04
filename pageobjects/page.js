import { browser } from '@wdio/globals'

module.exports = class Page {
   
     open (path='') {
        return browser.url(path);
    }

     // Set value for input/text area elements
    async setInputValue(element, value, clickBefore = false) {
        await element.scrollIntoView();
        await element.waitForDisplayed({ timeout: 5000 });
        if (clickBefore) {
            await element.click(); 
        }
        await element.setValue(value);
    }

    // Click-only elements like buttons, radio, checkbox
    async clickElement(element) {
        await element.scrollIntoView();
        await element.waitForClickable({ timeout: 5000 });
        await element.click();
    }
}
