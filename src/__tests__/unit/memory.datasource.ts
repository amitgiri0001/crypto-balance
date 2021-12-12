import {expect} from 'chai';
import {ErrorCodes} from '../../constants/errorCodes.constant';
import {MemoryDatasource} from '../../datasources/memory.datasource';

describe('MemoryDatasource', () => {
  describe('findById', () => {
    const user1= 'user_1';

    it('should return found user', async () => {
      const memoryDatasource = new MemoryDatasource();

      const userInfo = await memoryDatasource.findById(user1);
      expect(userInfo !== null).eql(true);
    });

    it('should throw exception if no user found', async () => {
      const memoryDatasource = new MemoryDatasource();

      await memoryDatasource.findById('unknown_user_id')
        .then(() => {
          throw new Error(`Code shouldn't have passed.`);
        }, (error) => {
          expect(error.code).eql(ErrorCodes.BAD_REQUEST.USER_NOT_FOUND);
        })
    });

    it('should used env variable for available', async () => {
      process.env.DB_FILE_PATH = '../../__mock_data__/testdb.json';

      const memoryDatasource = new MemoryDatasource();

      const userInfo = await memoryDatasource.findById(user1);
      expect(userInfo !== null).eql(true);
    });
  });
});
