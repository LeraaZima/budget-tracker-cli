namespace BudgetTracker {
  export class Account implements IAccount {
    public id: number;
    public name: string;
    private transactions: Transaction[] = [];

    constructor(id: number, name: string) {
      this.id = id;
      this.name = name;
    }

    get income(): number {
      return this.transactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
    }

    get expense(): number {
      return this.transactions
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
    }

    get balance(): number {
      return this.income - this.expense;
    }

    addTransaction(transaction: Transaction): void {
      this.transactions.push(transaction);
    }

    getTransactions(): Transaction[] {
      return [...this.transactions];
    }

    removeTransactionById(id: number): boolean {
      const index = this.transactions.findIndex((t) => t.id === id);
      if (index === -1) return false;
      this.transactions.splice(index, 1);
      return true;
    }

    getSummary(): ISummary {
      return {
        income: this.income,
        expense: this.expense,
        balance: this.balance,
      };
    }

    getSummaryString(): string {
      return `${this.name}: баланс ${this.balance} ₽ (${this.transactions.length} транзакций)`;
    }

    toString(): string {
      return `Счёт "${this.name}" (id: ${this.id}) — баланс: ${this.balance} ₽`;
    }
  }
}
