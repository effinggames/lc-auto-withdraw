import 'babel-polyfill'
import * as Constants from './Constants';
import * as Logger from 'winston2';
import * as RequestLib from 'request-promise';
import * as Cheerio from 'cheerio';
import * as Assert from 'assert';

const Request = RequestLib.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36'
    },
    followAllRedirects: true,
    jar: true
});

/**
 * Fetches LendingClub balance and withdraws the maximum amount
 */
const withdrawAllFunds = async function() {
    Logger.info('Withdrawing LC funds');

    //Login request
    const loginRSP = await Request.post({
        url: 'https://www.lendingclub.com/account/login.action',
        form: {
            login_url: '',
            login_email: Constants.LendingClubEmail,
            login_password: Constants.LendingClubPassword
        }
    });
    Logger.info('LC login rsp:', loginRSP.trim().replace(/(\r\n|\n|\r)/gm, ""));

    const withdrawPageRSP = await Request.get('https://www.lendingclub.com/account/withdraw.action');
    Logger.info('LC withdraw page rsp:', withdrawPageRSP.trim().replace(/(\r\n|\n|\r)/gm, ""));

    const $ = Cheerio.load(withdrawPageRSP);
    const availableBalanceStr = $('.field.value').text().replace('$', '');
    const availableBalance = Number.parseFloat(availableBalanceStr);
    const tokenName = $('[name="struts.token.name"]').attr('value');
    const tokenValue = $('[name=token]').attr('value');
    Assert.ok(!Number.isNaN(availableBalance), `Invalid availableBalance found: ${availableBalanceStr}`);
    Assert.ok(tokenName);
    Assert.ok(tokenValue);

    Logger.info(`Balance: ${availableBalance}, Token Name: ${tokenName}, Token Value: ${tokenValue}`);

    if (availableBalance <= 0) {
        Logger.info('No available funds to withdraw!');
        return;
    } else {
        Logger.info(`Withdrawing funds: ${availableBalance}`);
    }

    const withdrawRSP = await Request.post({
        url: 'https://www.lendingclub.com/account/submitWithdrawFunds.action',
        form: {
            'struts.token.name': tokenName,
            token: tokenValue,
            amount: availableBalance,
            guid: ''
        }
    });

    Logger.info('LC withdraw rsp:', withdrawRSP.trim().replace(/(\r\n|\n|\r)/gm, ""));
};

const main = async function(){
    Logger.info('Starting script');
    try {
        await withdrawAllFunds();
    } catch(err) {
        Logger.error('Err:', err);
        process.exit(1);
    }
    Logger.info('Great success!');
};

main();
