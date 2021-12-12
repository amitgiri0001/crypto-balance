import {DataSource} from '../../types/dataSource.type';
import {Holdings} from '../../types/holdings.type';
import {User} from '../../types/user.type';

export class BalanceRepository {
    constructor(
        private dataSource: DataSource<User>
    ) {}

    async getHoldings(userId: string): Promise<Holdings[]> {
        const user = await this.dataSource.findById(userId);

        // Below is just to keep the return type uniform.
        // It won't be need with proper DB schema and query.
        if(!user.holdings) {
            user.holdings = [];
        }

        return user.holdings;
    }
}
