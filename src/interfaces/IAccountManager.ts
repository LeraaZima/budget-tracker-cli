namespace BudgetTracker {
  export interface IAccountManager {
    addAccount(account: IAccount): void;
    removeAccountById(accountId: number): boolean;
    getAccounts(): IAccount[];
    getAccountById(id: number): IAccount | undefined;
    getSummary(accountId: number): ISummary;
  }
}
