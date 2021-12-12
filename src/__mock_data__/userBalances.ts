import {User} from '../types/user.type';

export const DB: { [userId: string]: User } = {
  "user_1": {
    "holdings": [
      {
        "currency": "btc",
        "balance": 0.5
      },
      {
        "currency": "eth",
        "balance": 2
      }
    ]
  },
  "user_2": {
    "holdings": [
      {
        "currency": "btc",
        "balance": 0.1
      }
    ]
  },
  "user_3": {
    "holdings": [
      {
        "currency": "eth",
        "balance": 2
      }
    ]
  },
  "user_4": {}
}