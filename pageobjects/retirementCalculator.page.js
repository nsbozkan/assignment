import { $, browser } from '@wdio/globals';
import Page from './page.js';
import testData from '../test/data/testData.json' assert { type: 'json' };


class RetirementCalculatorPage extends Page {
    // Main Form Locators
    get currentAge() { return $('#current-age'); }
    get retirementAge() { return $('#retirement-age'); }
    get currentAnnualIncome() { return $('#current-income'); }
    get spouseAnnualIncome() { return $('#spouse-income'); }
    get currentTotalSavings() { return $('#current-total-savings'); }
    get currentAnnualSavings() { return $('#current-annual-savings'); }
    get savingsIncreaseRate() { return $('#savings-increase-rate'); }
    get socialSecurityBenefitsYes() { return $("label[for='yes-social-benefits']"); }
    get socialSecurityBenefitsNo() { return $("label[for='no-social-benefits']"); }
    get ssOverrideAmount() { return $('#social-security-override'); }
    get ssOverrideSection() { return $('#ss-override-section'); }
    get maritalStatusSingle() { return $("label[for='single']"); }
    get maritalStatusMarried() { return $("label[for='married']"); }
    get calculateButton() { return $("//button[normalize-space()='Calculate']"); }
    get resultText() { return $("//h3[normalize-space()='Results']"); }
    get cookieCloseBtn() { return $('button.onetrust-close-btn-handler'); }
    // adjust default values
    get adjustDefaultLink() { return $("//a[normalize-space()='Adjust default values']"); }
    get additionalIncome() {
        return $("//input[@id='additional-income']");
    }

    get retirementDuration() {
        return $("//input[@id='retirement-duration']");
    }

    get includeInflation() {
        return $("label[for='include-inflation']");
    }
    get expectedInflationRate() {
        return $('#expected-inflation-rate');

    }
    get retirementAnnualIncomePercentage() {
        return $("//input[@id='retirement-annual-income']");
    }

    get preRetirementRoi() {
        return $("#pre-retirement-roi");
    }

    get postRetirementRoi() {
        return $("#post-retirement-roi");
    }

    get saveChangesButton() {
        return $("//button[normalize-space()='Save changes']");
    }

    get minimumNeededToRetireAmount() {
        return $("//td[@id='retirement-amount-results']");
    }

    get alertField() {
        return $("//p[@id='calculator-input-alert-desc']");
    }

    //error message for required fields
    get requiredFieldsAlert() { return $("//p[@id='calculator-input-alert-desc']"); }
    get currentAgeError() { return $('#invalid-current-age-error'); }
    get retirementAgeError() { return $('#invalid-retirement-age-error'); }
    get currentAnnualIncomeError() { return $('#invalid-current-income-error'); }
    get currentTotalSavingsError() { return $('#invalid-current-total-savings-error'); }
    get currentAnnualSavingsError() { return $('#invalid-current-annual-savings-error'); }
    get savingsIncreaseRateError() { return $('#invalid-savings-increase-rate-error'); }


    //get all required field error messages
    async getRequiredFieldErrors() {
        const safeGetText = async (el) => {
            try {
              await el.waitForDisplayed({ timeout: 5000 });
                return await el.getText();
            } catch (err) {
                return '';}
        }

        return {
            alert: await safeGetText(this.alertField),
            currentAge: await safeGetText(this.currentAgeError),
            retirementAge: await safeGetText(this.retirementAgeError),
            currentAnnualIncome: await safeGetText(this.currentAnnualIncomeError),
            currentTotalSavings: await safeGetText(this.currentTotalSavingsError),
            currentAnnualSavings: await safeGetText(this.currentAnnualSavingsError),
            savingsIncreaseRate: await safeGetText(this.savingsIncreaseRateError)
        };
    }




   //Closes the cookie banner if it is displayed on the page
    async handleCookieBanner() {
        if (await this.cookieCloseBtn.isDisplayed()) {
            await this.cookieCloseBtn.click();
        }
    }
    //Opens the retirement calculator page
    async openCalculator() {
        await this.open()
    }

    // check if all Social Security fields are visible
    async areSocialSecurityFieldsVisible() {
        try {
            return (
                await this.ssOverrideAmount.isDisplayed() &&
                await this.maritalStatusSingle.isDisplayed() &&
                await this.maritalStatusMarried.isDisplayed()
            );
        } catch (err) {
            return false;
        }
    }

    // select social security benefits Yes
    async selectSocialSecurityBenefitsYes() {
        await this.socialSecurityBenefitsYes.scrollIntoView();
        await this.socialSecurityBenefitsYes.waitForClickable({ timeout: 5000 });
        await this.socialSecurityBenefitsYes.click();
    }
     // select social security benefits NO
    async selectSocialSecurityBenefitsNo() {
        await this.socialSecurityBenefitsNo.scrollIntoView();
        await this.socialSecurityBenefitsNo.waitForClickable({ timeout: 5000 });
        await this.socialSecurityBenefitsNo.click();
    }
     //WAIT FOR VISIBILITY OF FIELDS
    async waitForSocialSecurityFieldsVisible() {
        await browser.waitUntil(
            async () => await this.areSocialSecurityFieldsVisible(),
            { timeout: 5000, timeoutMsg: "Social Security fields did not appear" }
        );
    }
       // Waits until the specified fields are no longer visible on the page
    async waitForSocialSecurityFieldsHidden() {
        await browser.waitUntil(
            async () => !(await this.areSocialSecurityFieldsVisible()),
            { timeout: 5000, timeoutMsg: "Social Security fields did not disappear" }
        );
    }



   async getAlertFieldDisplayed() {
        return await this.alertField.isDisplayed();
    }
    // GET MINIMUM NEEDED RETIREMENT AMOUNT AFTER CALCULATION
    async waitMiniumNeededToRetireAmountDisplayed() {
        await browser.waitUntil(
            async () => await this.minimumNeededToRetireAmount.isDisplayed(),
            {
                timeout: 20000,
                timeoutMsg: 'Minium needed to retire  amount did not appear within 20 seconds'
            }
        );
    }

    async waitForPageToLoad() {
        await browser.pause(5000);
    }



    async selectSocialSecurityBenefits(option = 'Yes') {
        const el = option === 'Yes' ? this.socialSecurityBenefitsYes : this.socialSecurityBenefitsNo;
        await this.clickElement(el);
    }

    async selectMaritalStatus(status = 'Married') {
        const el = status === 'Married' ? this.maritalStatusMarried : this.maritalStatusSingle;
        await this.clickElement(el);
    }

    async fillFullInfoAllFieldsWithSSBenefits() {
        await this.setInputValue(this.currentAge, testData.currentAge);
        await this.setInputValue(this.retirementAge, testData.retirementAge);
        await this.setInputValue(this.currentAnnualIncome, testData.currentIncome, true); 
        await this.setInputValue(this.spouseAnnualIncome, testData.spouseIncome);
        await this.setInputValue(this.currentTotalSavings, testData.currentTotalSavings, true); 
        await this.setInputValue(this.currentAnnualSavings, testData.currentAnnualSavings);
        await this.setInputValue(this.savingsIncreaseRate, testData.savingsIncreaseRate);
        await this.selectSocialSecurityBenefits('Yes');
        await this.selectMaritalStatus('Married');
        await this.setInputValue(this.ssOverrideAmount, testData.ssOverride, true);
    }


    async fillFullInfoWithoutSSBenefits() {
        await this.setInputValue(this.currentAge, testData.currentAge);
        await this.setInputValue(this.retirementAge, testData.retirementAge);
        await this.setInputValue(this.currentAnnualIncome, testData.currentIncome, true); 
        await this.setInputValue(this.spouseAnnualIncome, testData.spouseIncome);
        await this.setInputValue(this.currentTotalSavings, testData.currentTotalSavings, true); 
        await this.setInputValue(this.currentAnnualSavings, testData.currentAnnualSavings);
        await this.setInputValue(this.savingsIncreaseRate, testData.savingsIncreaseRate);
    }

     async adjustDefaults() {

        await this.clickElement(this.adjustDefaultLink);
        await this.setInputValue(this.additionalIncome, testData.additionalIncome);
        await this.setInputValue(this.retirementDuration, testData.retirementDuration);
        await this.clickElement(this.includeInflation);
        await this.setInputValue(this.retirementAnnualIncomePercentage, testData.retirementAnnualIncomePercentage);
        await this.setInputValue(this.preRetirementRoi, testData.preRetirementROI);
        await this.setInputValue(this.postRetirementRoi, testData.postRetirementROI);
        await this.clickElement(this.saveChangesButton);
    }

    async calculatePlan() {
        await this.calculateButton.scrollIntoView();
        await this.calculateButton.waitForClickable({ timeout: 10000 });
        await this.calculateButton.click();
        await this.waitForPageToLoad();

    }
}

export default new RetirementCalculatorPage();
