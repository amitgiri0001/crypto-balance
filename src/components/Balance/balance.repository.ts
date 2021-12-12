import {ErrorCodes} from '../../constants/errorCodes.constant';
import {Holdings} from '../../types/holdings.type';
import {DB as data} from '../../__mock_data__/userBalances';

export class BalanceRepository {
    async getBalance(userId: string): Promise<Holdings[]> {
        const user = data[userId];

        if(!user) {
            throw Object.assign({
                code: ErrorCodes.BAD_REQUEST.USER_NOT_FOUND,
                message: `User not found`,
            });
        }
        // Below is just to keep the return type uniform.
        // It won't be need with proper DB schema and query.
        else if(!user.holdings) {
            user.holdings = [];
        }

        return user.holdings;
    }
}
