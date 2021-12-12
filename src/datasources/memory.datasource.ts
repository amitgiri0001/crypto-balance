import {ErrorCodes} from '../constants/errorCodes.constant';
import {DataSource} from '../types/dataSource.type';
import {DB as memoryDB} from '../__mock_data__/userBalances';

export class MemoryDatasource<T> implements DataSource<T> {
  findById(id: string): T {
      const data = memoryDB[id];

      if(!data) {
        throw Object.assign({
            code: ErrorCodes.BAD_REQUEST.USER_NOT_FOUND,
            message: `User not found`,
        });
    }

    return data;
  }
}
