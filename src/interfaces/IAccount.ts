namespace BudgetTracker {
  export interface IAccount {
    id: number;
    name: string;

    addTransaction(transaction: ITransaction): void;
    getTransactions(): ITransaction[];
    removeTransactionById(transactionId: number): boolean;
  }
}
