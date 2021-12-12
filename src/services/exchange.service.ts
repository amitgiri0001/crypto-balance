import axios from 'axios';
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
      total,
    }
  }

  async getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<ExchangeRate> {
    const currencyPair = baseCurrency.toLocaleLowerCase() + targetCurrency.toLocaleLowerCase();

    // TODO: Need to cache this API call to avoid hitting rate limits.
    const { data } = await axios.get(`https://www.bitstamp.net/api/v2/ticker/${currencyPair}`);

     return {
        baseCurrency,
        targetCurrency,
        rate: data.last,
        currencyPair,
     };
 }
}
