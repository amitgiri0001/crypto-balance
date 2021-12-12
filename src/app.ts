import * as bodyParser from 'body-parser';
import * as express from 'express';
import {balanceRouter} from './components/Balance/balance.router';

const app = express();
app.use(bodyParser.json());
app.use('/users', balanceRouter);

app.use((err, _, res, next) => {
  console.error(err);
  if (err.code) {
    return res.status(400).json(err);
  }
  return next(err)
});

export {app};
