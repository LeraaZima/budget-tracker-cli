// 1. Создайте класс Transaction.
// Реализуйет интерфейс ITransaction.

// Свойства:

// id: number — уникальный идентификатор транзакции;
// amount: number — сумма транзакции;
// type: 'income' | 'expense' — тип транзакции (доход или расход);
// date: string — дата транзакции (строка в формате ISO);
// description: string — описание транзакции.
// Методы:

// конструктор для инициализации всех свойств;
// метод toString(): string — возвращает строковое представление транзакции.

import {
  TransactionType,
  ITransaction,
  IAccount,
  ISummary,
  IAccountManager,
} from './types';

// Класс Transaction
export class Transaction implements ITransaction {
  public id: number;
  public amount: number;
  public type: TransactionType;
  public date: string; // ISO string
  public description: string;

  constructor(
    id: number,
    amount: number,
    type: TransactionType,
    date: string,
    description = ''
  ) {
    this.id = id;
    this.amount = amount;
    this.type = type;
    this.date = date;
    this.description = description;
  }


  public toString(): string {
    const sign = this.type === 'income' ? '+' : '-';
    const formattedAmount = `${sign}${this.amount.toFixed(2)}`;
    // Урезаем описание, если слишком длинное
    const desc = this.description ? ` — ${this.description}` : '';
    return `[${this.date}] ${this.type.padEnd(7)} ${formattedAmount.padStart(10)} (id:${this.id})${desc}`;
  }
}


// Класс Account

export class Account implements IAccount {
  public id: number;
  public name: string;
  private _transactions: Transaction[] = [];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this._transactions = [];
  }

  public addTransaction(transaction: Transaction | ITransaction): void {
    if (transaction instanceof Transaction) {
      this._transactions.push(transaction);
    } else {
      // Преобразуем в Transaction
      const t = new Transaction(
        transaction.id,
        transaction.amount,
        transaction.type,
        transaction.date,
        transaction.description
      );
      this._transactions.push(t);
    }
  }

  public getTransactions(): Transaction[] {
    // Возвращаем копию массива, чтобы не ломали внутреннее состояние извне
    return [...this._transactions];
  }

  public removeTransactionById(transactionId: number): boolean {
    const idx = this._transactions.findIndex(t => t.id === transactionId);
    if (idx === -1) return false;
    this._transactions.splice(idx, 1);
    return true;
  }

  // Сумма всех доходов
  public get income(): number {
    return this._transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0);
  }

  // Сумма всех расходов 
  public get expenses(): number {
    return this._transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
  }

  // Баланс = доходы - расходы
  public get balance(): number {
    return this.income - this.expenses;
  }

  public getSummary(): ISummary {
    return {
      income: this.income,
      expense: this.expenses, 
      balance: this.balance
    };
  }

  // Краткая строка про счёт: название, баланс, количество транзакций
  public getSummaryString(): string {
    return `${this.name} — Баланс: ${this.balance.toFixed(2)} (Доходы: ${this.income.toFixed(2)}, Расходы: ${this.expenses.toFixed(2)}) — Транзакций: ${this._transactions.length}`;
  }

  // Детальное строковое представление счёта, удобное для пользователя
  public toString(): string {
    const header = `Счёт "${this.name}" (id:${this.id})\nБаланс: ${this.balance.toFixed(2)} | Доходы: ${this.income.toFixed(2)} | Расходы: ${this.expenses.toFixed(2)}\nТранзакции (${this._transactions.length}):`;
    const txLines = this._transactions.length
      ? this._transactions.map(t => `  ${t.toString()}`).join('\n')
      : '  — нет транзакций —';
    return `${header}\n${txLines}`;
  }
}

// Класс AccountManager

export class AccountManager {
  private accounts: Account[] = [];

  constructor() {
    this.accounts = [];
  }

  // Добавляем новый счёт
  public addAccount(account: Account): void {
    // Предотвращаем дублирование id
    if (this.accounts.some(a => a.id === account.id)) {
      throw new Error(`Account with id ${account.id} already exists`);
    }
    this.accounts.push(account);
  }

  // Удаляем счёт по id, возвращаем true если удалили
  public removeAccountById(accountId: number): boolean {
    const idx = this.accounts.findIndex(a => a.id === accountId);
    if (idx === -1) return false;
    this.accounts.splice(idx, 1);
    return true;
  }

  public getAccountById(id: number): Account | undefined {
    return this.accounts.find(a => a.id === id);
  }

  public getAllAccounts(): Account[] {
    return [...this.accounts];
  }


  public getSummary(accountId: number): ISummary {
    const acc = this.getAccountById(accountId);
    if (!acc) {
      // Возвращаем нулевую сводку, но можно и бросать ошибку. Выбираю возвращать нули для удобства.
      return { income: 0, expense: 0, balance: 0 };
    }
    return acc.getSummary();
  }

  // Но также удобно иметь общий свод по всем счетам:
  public getOverallSummary(): ISummary {
    const income = this.accounts.reduce((sum, acc) => sum + acc.income, 0);
    const expense = this.accounts.reduce((sum, acc) => sum + acc.expenses, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }

  public getSummaryString(accountId: number): string {
    const acc = this.getAccountById(accountId);
    if (!acc) return `Account id:${accountId} — не найден`;
    return acc.getSummaryString();
  }

  // Строка с описанием всего бюджета (всех счетов)
  public toString(): string {
    const header = `Всего счетов: ${this.accounts.length}\nОбщий баланс: ${this.getOverallSummary().balance.toFixed(2)} (Доходы: ${this.getOverallSummary().income.toFixed(2)}, Расходы: ${this.getOverallSummary().expense.toFixed(2)})`;
    const accountsLines = this.accounts.length
      ? this.accounts.map(a => `\n${a.getSummaryString()}`).join('')
      : '\n— нет счетов —';
    return `${header}${accountsLines}`;
  }
}
