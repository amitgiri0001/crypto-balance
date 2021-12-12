import {Holdings} from './holdings.type';

export interface Balance extends Holdings {
    conversionPair?: string,
    pairPrice?: number,
    convertedBalance?: number,
}

export interface TotalBalance {
    balances: Balance[],
    total: number
}
