import {ErrorCodes} from '../constants/errorCodes.constant';
import {DataSource} from '../types/dataSource.type';
const testDB = '../../__mock_data__/testdb.json'
export class MemoryDatasource<T> implements DataSource<T> {
  private memoryDB: { [userId: string]: T }
  constructor() {
    this.memoryDB = require(process.env.DB_FILE_PATH ?? testDB);
  }

  async findById(id: string): Promise<T> {
      const data = this.memoryDB[id];

      if(!data) {
        throw Object.assign({
            code: ErrorCodes.BAD_REQUEST.USER_NOT_FOUND,
            message: `User not found`,
        });
    }

    return data;
  }
}
