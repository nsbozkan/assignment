import RetirementCalculatorPage from '../../pageobjects/retirementCalculator.page.js';
import { expect } from '@wdio/globals';
import allure from '@wdio/allure-reporter';
import testData from '../data/testData.json' assert { type: 'json' };

describe("Retirement Calculator Test", () => {

    beforeEach(async () => {
        await browser.maximizeWindow();
        allure.addFeature('Retirement Calculator');
        allure.addSeverity('Medium');
    });


    it("Social Security fields should display when Yes and hide when No", async () => {
        allure.addTestId('Testcase-1');

        await RetirementCalculatorPage.open();
        await RetirementCalculatorPage.handleCookieBanner();

        // Yes -> Social Security fields visible
        await RetirementCalculatorPage.selectSocialSecurityBenefitsYes();
        await RetirementCalculatorPage.waitForSocialSecurityFieldsVisible();
        expect(await RetirementCalculatorPage.areSocialSecurityFieldsVisible()).toBe(true);

        // No -> Social Security fields hidden
        await RetirementCalculatorPage.selectSocialSecurityBenefitsNo();
        await RetirementCalculatorPage.waitForSocialSecurityFieldsHidden();
        expect(await RetirementCalculatorPage.areSocialSecurityFieldsVisible()).toBe(false);
    });

    it("Calculate Retirement Savings with Social Security Benefits - without adjustDefaults", async () => {
        allure.addTestId('Testcase-2');
        try {
            await RetirementCalculatorPage.open();
            await RetirementCalculatorPage.handleCookieBanner();
            await RetirementCalculatorPage.fillFullInfoAllFieldsWithSSBenefits();
            await RetirementCalculatorPage.calculatePlan();
            await RetirementCalculatorPage.waitMiniumNeededToRetireAmountDisplayed();
            expect(await RetirementCalculatorPage.minimumNeededToRetireAmount.getText()).toContain(testData.minNeededRequAmountWBenefit);
        } catch (error) {
            allure.addAttachment("Failure", error.message, "text/plain");
            throw error;
        }
    });

    it("Calculate Retirement Savings without Social Security Benefits - with adjustDefaults", async () => {
        allure.addTestId('Testcase-3');
        try {
            await RetirementCalculatorPage.open();
            await RetirementCalculatorPage.handleCookieBanner();
            await RetirementCalculatorPage.fillFullInfoWithoutSSBenefits();
            await RetirementCalculatorPage.adjustDefaults();
            await RetirementCalculatorPage.calculatePlan();
            await RetirementCalculatorPage.waitMiniumNeededToRetireAmountDisplayed();
            expect(await RetirementCalculatorPage.minimumNeededToRetireAmount.getText()).toContain(testData.minNeededRequAmountWOBenefit);
        } catch (error) {
            allure.addAttachment("Failure", error.message, "text/plain");
            throw error;
        }
    });



    it("Verify alert and required messages for all mandatory fields", async () => {
        allure.addTestId('Testcase-4');
        await RetirementCalculatorPage.open();
        await RetirementCalculatorPage.handleCookieBanner();
        await RetirementCalculatorPage.calculatePlan();
        const errors = await RetirementCalculatorPage.getRequiredFieldErrors();

        expect(errors.alert).toContain("Please fill out all required fields");
        expect(errors.currentAge).toContain("Input required");
        expect(errors.retirementAge).toContain("Input required");
        expect(errors.currentAnnualIncome).toContain("Input required");
        expect(errors.currentTotalSavings).toContain("Input required");
        expect(errors.currentAnnualSavings).toContain("Input required");
        expect(errors.savingsIncreaseRate).toContain("Input required");
    });

});
