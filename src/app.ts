import * as bodyParser from 'body-parser';
import * as express from 'express';
import {balanceRouter} from './components/Balance/balance.router';

const app = express();
app.use(bodyParser.json());
app.use('/users', balanceRouter);

export {app};
