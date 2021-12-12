
import * as sinon from 'sinon';
import * as client from 'supertest';
import {app} from '../../app';
import {BalanceController} from '../../components/Balance/balance.controller';
import {ErrorCodes} from '../../constants/errorCodes.constant';

describe('Balance Router', () => {
  describe('balanceByUserId', () => {
    let getBalance: sinon.SinonStub;

    before(`Stubs`, () => {
      getBalance = sinon.stub(BalanceController.prototype, 'getBalance');
    });

    after(`Restore`, () => {
      getBalance.restore();
    });

    it('should return response according to controller response', async () => {
      const userId = 'user_1';
      const expectedOutcome = {
        total: 100,
        balances: [{
          currency: 'btc',
          balance: 10,
        }]
      }

      getBalance.resolves(expectedOutcome);

      await client(app)
        .get(`/users/${userId}/balances`)
        .expect(200)
        .expect(expectedOutcome)
    });

    it('should pass exception to the framework when controller throws it', async () => {
      const userId = 'user_1';

      getBalance.throwsException()

      await client(app)
        .get(`/users/${userId}/balances`)
        .expect(500)
    });

    it('should log and return code to frontend to handle bad requests', async () => {
      const userId = 'user_1';

      getBalance.throwsException({
        // Originally a 404 from third party.
        code: ErrorCodes.BAD_REQUEST.CURRENCY_NOT_CONVERTIBLE
      })

      await client(app)
        .get(`/users/${userId}/balances`)
        .expect(400)
    });
  });
});
