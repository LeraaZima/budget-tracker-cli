export enum TransactionTypeEnum {
  Income = 'Доход',
  Expense = 'Расход',
}

export interface ITransaction {
  id: string;
  amount: number;
  type: TransactionTypeEnum;
  date: string;
  description: string;
}
