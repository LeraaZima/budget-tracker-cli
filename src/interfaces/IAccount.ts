import { ITransaction } from './ITransaction';

export interface IAccount {
  id: string;
  name: string;

  getTransactions(): ITransaction[];
  addTransaction(t: ITransaction): void;
  removeTransactionById(id: string): void;

  getSummary(): {
    income: number;
    expenses: number;
    balance: number;
  };
  exportTransactionsToCSV(filename: string): void;

  readonly balance: number;
}
