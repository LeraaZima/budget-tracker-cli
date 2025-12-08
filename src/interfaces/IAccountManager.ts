import { IAccount } from './IAccount';

export interface IAccountManager {
  accounts: IAccount[];

  addAccount(name: string): IAccount;
  removeAccountById(id: string): void;
  getAllAccounts(): IAccount[];
  getOverallSummary(): { income: number; expenses: number; balance: number };
}
