import {expect} from 'chai';
import * as sinon from 'sinon';
import {BalanceController} from '../../components/Balance/balance.controller';
import {BalanceRepository} from '../../components/Balance/balance.repository';
import {ExchangeService} from '../../services/exchange.service';
import {Holdings} from '../../types/holdings.type';
import {User} from '../../types/user.type';

describe('BalanceController', () => {
  describe('getBalance', () => {
    let getHoldings: sinon.SinonStub;
    let getExchangeRate: sinon.SinonStub;
    let calculateBalance: sinon.SinonStub;
    let userHoldings: Holdings[];
    let data: { [userId: string]: User};
    const userId1 = 'user_1';
    const userId2 = 'user_2';

    before(`Stubs`, () => {
      getHoldings = sinon.stub(BalanceRepository.prototype, 'getHoldings');
      getExchangeRate = sinon.stub(ExchangeService.prototype, 'getExchangeRate');
      calculateBalance = sinon.stub(ExchangeService.prototype, 'calculateBalance');
    });

    beforeEach(`Setup data`, () => {
      userHoldings = [{
        currency: 'btc',
        balance: 10
      },
      {
        currency: 'eth',
        balance: 10
      }];

      data = {
        [userId1]: {
          holdings: userHoldings
        },
        [userId2]: {

        }
      }
    });

    after(() => {
      getHoldings.restore();
      getExchangeRate.restore();
      calculateBalance.restore();
    });

    it('should return total and updated balances', async () => {
      const balanceController = new BalanceController({});


      getHoldings.resolves(data[userId1].holdings);
      getExchangeRate.resolves([{ rate: 2 }]);
      calculateBalance.returns({
        total: 100,
        balances: [],
      });

      const { total, balances } = await balanceController.getBalance(userId1);
      expect(total).eql(100);
      expect(balances).eql([]);
    });
  });
});
