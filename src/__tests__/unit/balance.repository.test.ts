import {expect} from 'chai';
import * as sinon from 'sinon';
import {BalanceRepository} from '../../components/Balance/balance.repository';
import {MemoryDatasource} from '../../datasources/memory.datasource';
import {Holdings} from '../../types/holdings.type';
import {User} from '../../types/user.type';

describe('BalanceRepository', () => {
  let memoryDatasourceStub: sinon.SinonStub;
  before(`Mock Datasource`, () => {
    memoryDatasourceStub = sinon.stub(MemoryDatasource.prototype, 'findById');
  });

  after(`Restore mocks`, () => {
    memoryDatasourceStub.restore();
  });

  const memoryDatasource = new MemoryDatasource();
  const balanceRepository = new BalanceRepository(memoryDatasource);
  let userHoldings: Holdings[];
  let data: { [userId: string]: User};
  const userId1 = 'user_1';
  const userId2 = 'user_2';

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

  it('return user holdings', async () => {
    memoryDatasourceStub.resolves(data[userId1]);
    const holdings = await balanceRepository.getHoldings(userId1);

    expect(holdings).eql(userHoldings);
  });

  it('should return empty holdings if non found in DB', async () => {
    memoryDatasourceStub.resolves(data[userId2]);
    const holdings = await balanceRepository.getHoldings(userId2);

    expect(holdings).eql([]);
  });
});
