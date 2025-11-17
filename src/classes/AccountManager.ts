namespace BudgetTracker {
  export class AccountManager implements IAccountManager {
    private accounts: Account[] = [];

    addAccount(account: Account): void {
      this.accounts.push(account);
    }

    removeAccountById(id: number): boolean {
      const index = this.accounts.findIndex((a) => a.id === id);
      if (index === -1) return false;
      this.accounts.splice(index, 1);
      return true;
    }

    getAccounts(): Account[] {
      return [...this.accounts];
    }

    getAccountById(id: number): Account | undefined {
      return this.accounts.find((a) => a.id === id);
    }

    getSummary(): ISummary {
      const income = this.accounts.reduce((s, a) => s + a.income, 0);
      const expense = this.accounts.reduce((s, a) => s + a.expense, 0);
      return {
        income,
        expense,
        balance: income - expense,
      };
    }

    getSummaryString(): string {
      const summary = this.getSummary();
      return `Баланс всех счетов: ${summary.balance} ₽`;
    }

    toString(): string {
      return this.accounts.map((a) => a.getSummaryString()).join('\n');
    }
  }
}
