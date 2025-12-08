import { IAccount } from '../interfaces/IAccount';
import { ITransaction, TransactionTypeEnum } from '../interfaces/ITransaction';
import { escapeCsvValue } from '../utils/escapeCsvValue';
import { writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class Account implements IAccount {
  id: string;
  name: string;
  private transactions: ITransaction[] = [];

  constructor(name: string) {
    this.id = uuidv4(); // полностью уникальный UUID
    this.name = name;
  }

  get balance(): number {
    return this.transactions.reduce(
      (sum, t) =>
        sum + (t.type === TransactionTypeEnum.Income ? t.amount : -t.amount),
      0
    );
  }

  addTransaction(transaction: ITransaction) {
    this.transactions.push(transaction);
  }

  removeTransactionById(id: string) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }

  getTransactions(): ITransaction[] {
    return this.transactions;
  }

  getSummary() {
    const income = this.transactions
      .filter((t) => t.type === TransactionTypeEnum.Income)
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = this.transactions
      .filter((t) => t.type === TransactionTypeEnum.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, balance: income - expenses };
  }

  exportTransactionsToCSV(filename: string) {
    const header = ['ID', 'Дата', 'Тип', 'Сумма', 'Описание'];
    const rows = this.transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      t.amount.toString(),
      escapeCsvValue(t.description),
    ]);

    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    writeFileSync(`${filename}.csv`, csv, { encoding: 'utf8' });
  }
}
