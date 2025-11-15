console.log('🚀 Budget Tracker CLI');
import { ITransaction, IAccount, IAccountManager, ISummary } from './types';

const account: IAccount & { transactions: ITransaction[] } = {
  id: 1,
  name: 'Личный бюджет',
  transactions: [],

  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  },

  removeTransactionById(transactionId: number): boolean {
    const index = this.transactions.findIndex((t) => t.id === transactionId);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      return true;
    }
    return false;
  },

  getTransactions(): ITransaction[] {
    return this.transactions;
  },
};

const accountManager: IAccountManager & { accounts: IAccount[] } = {
  accounts: [],

  addAccount(account: IAccount): void {
    this.accounts.push(account);
  },

  removeAccountById(accountId: number): boolean {
    const index = this.accounts.findIndex((acc) => acc.id === accountId);
    if (index !== -1) {
      this.accounts.splice(index, 1);
      return true;
    }
    return false;
  },

  getAccounts(): IAccount[] {
    return this.accounts;
  },

  getAccountById(id: number): IAccount | undefined {
    return this.accounts.find((acc) => acc.id === id);
  },

  getSummary(accountId: number): ISummary {
    const account = this.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = account.getTransactions();

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  },
};

account.addTransaction({
  id: 1,
  amount: 1000,
  type: 'income',
  date: '2023-01-01T00:00:00Z',
  description: 'Зарплата за январь',
});

account.addTransaction({
  id: 2,
  amount: 200,
  type: 'expense',
  date: '2023-01-05T00:00:00Z',
  description: 'Покупка продуктов',
});

account.addTransaction({
  id: 3,
  amount: 150,
  type: 'expense',
  date: '2023-01-10T00:00:00Z',
  description: 'Оплата коммунальных услуг',
});

accountManager.addAccount(account);

console.log(
  'Список всех бюджетов:',
  JSON.stringify(accountManager.getAccounts(), null, 2)
);

console.log('Сводная информация о бюджете:', accountManager.getSummary(1));

accountManager.removeAccountById(account.id);

console.log(
  'Список всех бюджетов после удаления:',
  accountManager.getAccounts()
);
