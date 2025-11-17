namespace BudgetTracker {
  export class Transaction implements ITransaction {
    public id: number;
    public amount: number;
    public type: TransactionType;
    public date: string;
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
      const desc = this.description ? ` — ${this.description}` : '';

      return `[${this.date}] ${this.type.padEnd(7)} ${formattedAmount.padStart(
        10
      )} (id:${this.id})${desc}`;
    }
  }
}
