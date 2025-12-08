import { ITransaction, TransactionTypeEnum } from '../interfaces/ITransaction';
import { v4 as uuidv4 } from 'uuid';

export class Transaction implements ITransaction {
  id: string;
  amount: number;
  type: TransactionTypeEnum;
  date: string;
  description: string;

  constructor(
    amount: number,
    type: TransactionTypeEnum,
    date: string,
    description: string
  ) {
    this.id = uuidv4().split('-')[0];
    this.amount = amount;
    this.type = type;
    this.date = date;
    this.description = description;
  }
}
