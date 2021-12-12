import axios from 'axios';
import {ErrorCodes} from '../constants/errorCodes.constant';
import {Balance} from '../types/balance.type';
import {ExchangeRate} from '../types/exchangeRate.type';
import {Holdings} from '../types/holdings.type';

const FIXED_DECIMAL = 9;

export class ExchangeService {
  calculateBalance(holdings: Holdings[], exchangePairs: ExchangeRate[]) {
    let total = 0;

    // Find converted balances
    const exchangeValuesMap = exchangePairs.reduce((exchange,currency) => (
       {   ...exchange,
            [currency.baseCurrency]: currency
        }
    ), {});

    const updatedHoldings = holdings.map(holding => {
      const targetPair = exchangeValuesMap[holding.currency] as ExchangeRate;
      const convertedBalance = +(holding.balance * targetPair.rate).toFixed(FIXED_DECIMAL);

      total += convertedBalance;
      return {
        currency: holding.currency,
        balance: +holding.balance,
        conversionPair: targetPair.currencyPair,
        pairPrice: +targetPair.rate,
        convertedBalance: convertedBalance,
      } as Balance;
    });

    return {
      balances: updatedHoldings,
      total: parseFloat(total.toFixed(FIXED_DECIMAL)),
    }
  }

  async getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate> {
    const currencyPair = baseCurrency.toLocaleLowerCase() + targetCurrency.toLocaleLowerCase();

    // TODO: Need to cache this API call to avoid hitting rate limits.
    const { data } = await axios.get(`https://www.bitstamp.net/api/v2/ticker/${currencyPair}`)
                        .catch((error) => {
                          if(error.response.status == 404) {
                            throw new Object({
                              code: ErrorCodes.BAD_REQUEST.CURRENCY_NOT_CONVERTIBLE,
                              message: `Unsupported currency conversion ${currencyPair}`
                            })
                          }

                          console.error({
                            code: ErrorCodes.THIRD_PARTY_ERRORS.SERVICE_UNAVAILABLE,
                            message: `Service unavailable.`
                          });

                          throw error;
                        });

     return {
        baseCurrency,
        targetCurrency,
        rate: data.last,
        currencyPair,
     };
 }
}
