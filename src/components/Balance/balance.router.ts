import {Router} from "express";
import {BalanceController} from "./balance.controller";
const balanceRouter = Router();

balanceRouter.get('/:userId/balances', async (req, res, next) => {
    const balanceInstance = new BalanceController();

    const context = {
        userId: req.params.userId,
        conversionCurrency: req.query.currency as string,
    };

    try {
        const balance = await balanceInstance.getBalance(context.userId, context.conversionCurrency);
        return res.json(balance);
    }
    catch (error) {
        return next(error);
    }
});

export {balanceRouter};

