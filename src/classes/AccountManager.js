import { Account } from './Account';
export class AccountManager {
    accounts = [];
    addAccount(name) {
        const acc = new Account(name);
        this.accounts.push(acc);
        return acc;
    }
    removeAccountById(id) {
        this.accounts = this.accounts.filter((acc) => acc.id !== id);
    }
    getAllAccounts() {
        return this.accounts;
    }
    getOverallSummary() {
        let income = 0;
        let expenses = 0;
        this.accounts.forEach((acc) => {
            const summary = acc.getSummary();
            income += summary.income;
            expenses += summary.expenses;
        });
        return { income, expenses, balance: income - expenses };
    }
}
