import 'babel-polyfill'
import 'chromedriver';
import * as Constants from './Constants';
import * as Logger from 'winston2';
import * as Assert from 'assert';
import * as Webdriver from 'selenium-webdriver';
import * as Chrome from 'selenium-webdriver/chrome';

const By = Webdriver.By;
const until = Webdriver.until;

const chromeOptions = new Chrome.Options();

if (process.env.GOOGLE_CHROME_BIN) {
    Logger.info('Custom chrome path:', process.env.GOOGLE_CHROME_BIN);
    chromeOptions.setChromeBinaryPath(process.env.GOOGLE_CHROME_BIN);
    chromeOptions.addArguments('headless', 'disable-gpu', 'no-sandbox');
}

/**
 * Fetches LendingClub balance and withdraws the maximum amount.
 */
const withdrawAllFunds = async function() {
    Logger.info('Withdrawing LC funds');

    const driver = new Webdriver.Builder()
        .withCapabilities(chromeOptions.toCapabilities())
        .build();
    driver.get('https://www.lendingclub.com/auth/login');
    driver.findElement(By.name('email')).sendKeys(Constants.LendingClubEmail);
    driver.findElement(By.name('password')).sendKeys(Constants.LendingClubPassword);
    driver.findElement(By.xpath("//button[@type='submit']")).click();
    await driver.wait(until.titleContains('Account Summary'), 5000);

    driver.get('https://www.lendingclub.com/investor/account/1/transfer');
    driver.findElement(By.xpath("//ul[contains(@class, 'transferSelect')]/descendant::li[position()=3]")).click();
    const availableBalanceStr = await driver.findElement(By.xpath("//span[contains(@class, 'available')]")).getText();
    const availableBalance = availableBalanceStr.replace('$', '');
    Logger.info('Available balance:', availableBalance);
    
    if (parseFloat(availableBalance) > 0) {
        driver.findElement(By.xpath("//input[@data-aid='withdrawAmount']")).sendKeys(availableBalance);
        driver.findElement(By.xpath("//button[@data-aid='withdrawSubmit']")).click();
        driver.findElement(By.id('transferModalConfirm')).click();
        await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'pendingRow')]")), 5000);

        Logger.info('Successful withdraw:', availableBalance);
    } else {
        Logger.info('Nothing to withdraw!");
    }
    driver.quit();
};

const main = async function(){
    Logger.info('Starting script');
    try {
        await withdrawAllFunds();
        Logger.info('Great success!');
    } catch(err) {
        Logger.error('Err:', err);
    }
};

main();
