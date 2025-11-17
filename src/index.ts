/// <reference path="./interfaces/TransactionType.ts" />
/// <reference path="./interfaces/ITransaction.ts" />
/// <reference path="./interfaces/IAccount.ts" />
/// <reference path="./interfaces/ISummary.ts" />
/// <reference path="./interfaces/IAccountManager.ts" />

/// <reference path="./classes/Transaction.ts" />
/// <reference path="./classes/Account.ts" />
/// <reference path="./classes/AccountManager.ts" />

const personalAccount = new BudgetTracker.Account(1, 'Личный бюджет');

personalAccount.addTransaction(
  new BudgetTracker.Transaction(1, 1000, 'income', '2023-01-01', 'Зарплата')
);
personalAccount.addTransaction(
  new BudgetTracker.Transaction(2, 200, 'expense', '2023-01-05', 'Продукты')
);
personalAccount.addTransaction(
  new BudgetTracker.Transaction(
    3,
    150,
    'expense',
    '2023-01-10',
    'Коммунальные услуги'
  )
);

const manager = new BudgetTracker.AccountManager();
manager.addAccount(personalAccount);

console.log(String(personalAccount));
console.log(`Общий баланс всех бюджетов: ${manager.getSummary().balance} ₽`);

console.log('\nТранзакции личного бюджета:');
personalAccount.getTransactions().forEach((t) => console.log(t.toString()));
