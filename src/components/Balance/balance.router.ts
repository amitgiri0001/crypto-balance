import {Router} from "express";
import {DataSources} from '../../constants/datasource.constants';
import {BalanceController} from "./balance.controller";
const balanceRouter = Router();

balanceRouter.get('/:userId/balances', async (req, res, next) => {
    const context = {
        dataSource: new (DataSources.memory)()
    }
    const balanceInstance = new BalanceController(context);

    const args = {
        userId: req.params.userId,
        conversionCurrency: req.query.currency as string,
    };

    try {
        const balance = await balanceInstance.getBalance(args.userId, args.conversionCurrency);
        return res.json(balance);
    }
    catch (error) {
        return next(error);
    }
});

export {balanceRouter};

