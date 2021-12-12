import axios from 'axios';
import {expect} from 'chai';
import * as sinon from 'sinon';
import {ErrorCodes} from '../../constants/errorCodes.constant';
import {ExchangeService} from '../../services/exchange.service';
import {ExchangeRate} from '../../types/exchangeRate.type';
import {Holdings} from '../../types/holdings.type';

describe("ExchangeService", () => {
  describe('calculateBalance', () => {
    let holdings: Holdings[];
    let exchangePairs: ExchangeRate[];
    const exchangeService = new ExchangeService();
    beforeEach(`Setup data`, () => {
      holdings = [{
        currency: 'btc',
        balance: 10
      },
      {
        currency: 'eth',
        balance: 10
      }];

      exchangePairs = [{
        baseCurrency: 'btc',
        targetCurrency: 'usd',
        currencyPair: 'btcusd',
        rate: 2
      }, {
        baseCurrency: 'eth',
        targetCurrency: 'usd',
        currencyPair: 'ethusd',
        rate: 3
      }];
    });

    it('should holdings balance conversions as per target currency', async () => {
      const {balances} = exchangeService.calculateBalance(holdings, exchangePairs);

      expect(balances[0].balance).eql(holdings[0].balance);
      expect(balances[0].currency).eql(holdings[0].currency);
      expect(balances[0].conversionPair).eql(exchangePairs[0].currencyPair);
      expect(balances[0].pairPrice).eql(exchangePairs[0].rate);
      expect(balances[0].convertedBalance).eql(exchangePairs[0].rate * holdings[0].balance);
    });

    it('should return total in converted currency', async () => {
      const {total} = exchangeService.calculateBalance(holdings, exchangePairs);

      const expectedTotal = holdings[0].balance * exchangePairs[0].rate + holdings[1].balance * exchangePairs[1].rate;

      expect(total).eql(expectedTotal);
    });
  });

  describe('getExchangeRate', () => {
    let axiosStub: sinon.SinonStub;
    beforeEach(`Stub methods`, () => {
      axiosStub = sinon.stub(axios, 'get');
    })

    afterEach(`Reset stub`, () => {
      axiosStub.restore();
    });

    it('should return latest rate for the exchange pair', async () => {
      const exchangeService = new ExchangeService();
      const baseCurrency = 'btc';
      const targetCurrency = 'usd';
      const rateFromThirdParty = 100;

      axiosStub.resolves({
        data: {
          last: rateFromThirdParty,
        }
      });
      const { rate } = await exchangeService.getExchangeRate(baseCurrency, targetCurrency);

      expect(rate).eql(rateFromThirdParty);
    });

    it('should handle unavailable currency pair exceptions', async () => {
      const exchangeService = new ExchangeService();
      const baseCurrency = 'btc';
      const targetCurrency = 'sgd';

      axiosStub.rejects({
        response: {
          status: 404
        }
      })
      await exchangeService.getExchangeRate(baseCurrency, targetCurrency)
        .then(() => {
          throw new Error(`Code should not reach here.`)
        },(error) => {
          expect(error.code).eql(ErrorCodes.BAD_REQUEST.CURRENCY_NOT_CONVERTIBLE);
        })
    });

    it('should handle other exceptions from third party', async () => {
      const exchangeService = new ExchangeService();
      const baseCurrency = 'btc';
      const targetCurrency = 'sgd';

      axiosStub.rejects({
        response: {
          status: 429 // rate limit
        }
      })
      await exchangeService.getExchangeRate(baseCurrency, targetCurrency)
        .then(() => {
          throw new Error(`Code should not reach here.`)
        },(error) => {
          expect(error.code == undefined).eql(true);
        })
    });
  });
});
