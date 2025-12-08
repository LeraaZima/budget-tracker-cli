import { IAccount } from '../interfaces/IAccount';
import { Account } from './Account';

export class AccountManager {
  accounts: IAccount[] = [];

  addAccount(name: string): IAccount {
    const acc = new Account(name);
    this.accounts.push(acc);
    return acc;
  }

  removeAccountById(id: string) {
    this.accounts = this.accounts.filter((acc) => acc.id !== id);
  }

  getAllAccounts(): IAccount[] {
    return this.accounts;
  }

  getOverallSummary() {
    let income = 0;
    let expenses = 0;
    this.accounts.forEach((acc) => {
      const summary = acc.getSummary();
      income += summary.income;
      expenses += summary.expenses;
    });
    return { income, expenses, balance: income - expenses };
  }
}
