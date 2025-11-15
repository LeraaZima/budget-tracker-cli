// 1. Тип TransactionType
// Создайте тип для перечисления типов транзакций. Он должен включать "income" и "expense".

export type TransactionType = 'income' | 'expense';

// 2. Интерфейс ITransaction
// Создайте интерфейс для представления транзакции, который содержит следующие свойства:

export interface ITransaction {
  id: number;
  amount: number;
  type: TransactionType;
  date: string;
  description: string;
}

// id — уникальный идентификатор транзакции (число);
// amount — сумма транзакции (число);
// type — тип транзакции (строка типа TransactionType);
// date — дата транзакции (строка в формате ISO);
// description — описание транзакции (строка).


// 3. Интерфейс IAccount
// Создайте интерфейс для представления счёта. Этот интерфейс должен содержать следующие свойства:

export interface IAccount {
  id: number;
  name: string;
  addTransaction(transaction: ITransaction): void;
  getTransactions(): ITransaction[];
  removeTransactionById(transactionId: number): boolean;
}

// id — уникальный идентификатор счёта (число);
// name — название счёта (строка);
// addTransaction(account: ITransaction): void — добавление новой транзакции;
// removeTransactionById(accountId: number): boolean — удаление транзакции по идентификатору, возвращает успешность удаления;
// getTransactions(): ITransaction[] — получение всех транзакций.


// 4. Интерфейс ISummary
// Создайте интерфейс для сводной информации о счёте. Этот интерфейс должен содержать следующие свойства:

export interface ISummary {
    income: number;
    expense: number;
    balance: number;
}

// income — общая сумма доходов (число);
// expenses — общая сумма расходов (число);
// balance — текущий баланс (число).




// 5. Интерфейс IAccountManager
// Создайте интерфейс для управления счетами с методами:

// addAccount(account: IAccount): void — добавление нового счёта;
// removeAccountById(accountId: number): boolean — удаление счёта по идентификатору, возвращает успешность удаления;
// getAccounts(): IAccount[] — получение массива всех счетов;
// getAccountById(id: number): Account | undefined — получение счёта по идентификатору;
// getSummary(accountId: number): ISummary — получение сводной информации о конкретном счёте.

export interface IAccountManager {
  addAccount(account: IAccount): void;
  removeAccountById(accountId: number): boolean;
  getAccounts(): IAccount[];
  getAccountById(id: number): IAccount | undefined;
  getSummary(accountId: number): ISummary;
}




// Проверка решения:
// Экспортируйте все типы и интерфейсы из файла types.ts.
// В файле index.ts создайте объект контроля счёта (пока без использования классов), который будет реализовывать интерфейс IAccountManager.
// Создайте счёт и добавьте в него несколько транзакций. Счёт должен реализовывать интерфейс Account.
// Добавьте счёт в объект управления счетов и проверьте работу всех методов.
// Готовый шаблон для ленивых
