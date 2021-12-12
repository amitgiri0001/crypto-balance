import {ExchangeService} from '../../services/exchange.service';
import {TotalBalance} from '../../types/balance.type';
import {BalanceRepository} from "./balance.repository";
const DEFAULT_FIAT_CURRENCY = 'usd';

export class BalanceController {
    private balanceRepository: BalanceRepository;
    private exchangeService: ExchangeService;

    constructor(context) {
        this.balanceRepository = new BalanceRepository(context.dataSource);
        this.exchangeService = new ExchangeService();
    }

    async getBalance(userId: string, conversionCurrency: string = DEFAULT_FIAT_CURRENCY): Promise<TotalBalance> {
        // Get user holdings
        const userHoldings = await this.balanceRepository.getHoldings(userId);

        const exchangePairsPromise = userHoldings.map(async (holding) => {
            return this.exchangeService.getExchangeRate(holding.currency, conversionCurrency);
        });
        const exchangePairs = await Promise.all(exchangePairsPromise);

        const {balances: updatedBalances, total} = this.exchangeService.calculateBalance(userHoldings, exchangePairs);

        return {
            total,
            balances: updatedBalances,
        }
    };
}
