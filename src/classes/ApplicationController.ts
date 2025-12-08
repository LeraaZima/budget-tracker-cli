import inquirer from 'inquirer';
import { AccountManager } from './AccountManager';
import { IAccount } from '../interfaces/IAccount';
import { Transaction } from './Transaction';
import { TransactionTypeEnum } from '../interfaces/ITransaction';

export class ApplicationController {
  accountManager: AccountManager;

  constructor() {
    this.accountManager = new AccountManager();

    // Пример начального заполнения
    const a1 = this.accountManager.addAccount('Кошелёк');
    const a2 = this.accountManager.addAccount('Банк');

    a1.addTransaction(
      new Transaction(
        500,
        TransactionTypeEnum.Income,
        new Date().toISOString().split('T')[0],
        'Зарплата'
      )
    );
    a1.addTransaction(
      new Transaction(
        120,
        TransactionTypeEnum.Expense,
        new Date().toISOString().split('T')[0],
        'Продукты'
      )
    );
    a2.addTransaction(
      new Transaction(
        1000,
        TransactionTypeEnum.Income,
        new Date().toISOString().split('T')[0],
        'Фриланс'
      )
    );
  }

  public async start() {
    await this.mainMenu();
  }

  private async mainMenu() {
    while (true) {
      console.clear();
      const accounts = this.accountManager.accounts;

      const choices = [
        ...accounts.map((acc) => ({
          name: `${acc.name} — Баланс: ${acc.balance}`,
          value: acc.id,
        })),
        { name: 'Создать новый счёт', value: 'create' },
        { name: 'Выход', value: 'exit' },
      ];

      const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Выберите счёт или действие:',
        choices,
      });

      if (choice === 'exit') break;

      if (choice === 'create') {
        await this.createAccount();
        continue; // вернуться к главному меню с новым счётом
      }

      const account = this.accountManager.accounts.find((a) => a.id === choice);
      if (!account) {
        console.log('Ошибка: выбранный счёт не найден. Нажмите Enter.');
        await inquirer.prompt({ type: 'input', name: 'ok', message: '' });
        continue;
      }

      await this.watchAccount(account);
    }
  }

  private async createAccount() {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'Введите название нового счёта:',
      validate: (v: string) =>
        v && v.trim().length > 0 ? true : 'Введите непустое название',
    });

    this.accountManager.addAccount(name.trim());
  }

  private async watchAccount(account: IAccount) {
    while (true) {
      console.clear();
      console.log(`Счёт: ${account.name} (id: ${account.id})`);
      console.log(`Баланс: ${account.balance}`);
      console.log('Транзакции:');
      const tx = account.getTransactions();
      if (!tx.length) console.log('  Транзакций нет.');
      tx.forEach((t) => {
        console.log(
          `  ${t.id} | ${t.date} | ${t.type} | ${t.amount} | ${t.description}`
        );
      });

      const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Выберите действие:',
        choices: [
          { name: 'Добавить транзакцию', value: 'add' },
          { name: 'Удалить транзакцию', value: 'remove' },
          { name: 'Экспортировать в CSV', value: 'export' },
          { name: 'Удалить счёт', value: 'delete' },
          { name: 'Назад', value: 'back' },
        ],
      });

      if (action === 'back') break;
      if (action === 'add') await this.addTransaction(account);
      if (action === 'remove') await this.removeTransaction(account);
      if (action === 'export') await this.exportTransactionsToCSV(account);
      if (action === 'delete') {
        await this.removeAccount(account);
        break;
      }
    }
  }

  private async addTransaction(account: IAccount) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'amount',
        message: 'Введите сумму:',
        validate: (v: string) => {
          const num = Number(v);
          if (isNaN(num) || num <= 0) return 'Введите число больше нуля';
          return true;
        },
        filter: (v: string) => Number(v),
      },
      {
        type: 'list',
        name: 'type',
        message: 'Выберите тип транзакции:',
        choices: [
          { name: 'Доход', value: TransactionTypeEnum.Income },
          { name: 'Расход', value: TransactionTypeEnum.Expense },
        ],
      },
      {
        type: 'input',
        name: 'date',
        message: 'Введите дату (YYYY-MM-DD), по умолчанию сегодня:',
        default: () => new Date().toISOString().split('T')[0],
        validate: (v: string) =>
          /^\d{4}-\d{2}-\d{2}$/.test(v) ? true : 'Формат YYYY-MM-DD',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Введите описание транзакции:',
        default: '',
      },
    ]);

    const transaction = new Transaction(
      answers.amount,
      answers.type,
      answers.date,
      answers.description
    );
    account.addTransaction(transaction);
  }

  private async removeTransaction(account: IAccount) {
    const transactions = account.getTransactions();
    if (!transactions.length) {
      console.log('Транзакций нет. Нажмите Enter.');
      await inquirer.prompt({ type: 'input', name: 'ok', message: '' });
      return;
    }

    const { transactionId } = await inquirer.prompt({
      type: 'list',
      name: 'transactionId',
      message: 'Выберите транзакцию для удаления:',
      choices: transactions.map((t) => ({
        name: `${t.date} | ${t.type} | ${t.amount} | ${t.description}`,
        value: t.id,
      })),
    });

    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: 'Подтвердите удаление',
    });
    if (confirm) account.removeTransactionById(transactionId);
  }

  private async removeAccount(account: IAccount) {
    const { confirm } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirm',
      message: `Вы уверены, что хотите удалить счёт "${account.name}"?`,
    });

    if (confirm) this.accountManager.removeAccountById(account.id);
  }

  private async exportTransactionsToCSV(account: IAccount) {
    const { filename } = await inquirer.prompt({
      type: 'input',
      name: 'filename',
      message: 'Введите имя файла для экспорта (без расширения):',
      validate: (v: string) =>
        v && v.trim().length > 0 ? true : 'Введите имя файла',
    });
    try {
      account.exportTransactionsToCSV(filename.trim());
      console.log('Экспорт завершён успешно! Нажмите Enter.');
      await inquirer.prompt({ type: 'input', name: 'ok', message: '' });
    } catch (err) {
      console.log('Ошибка при экспорте:', (err as Error).message);
      await inquirer.prompt({ type: 'input', name: 'ok', message: '' });
    }
  }
}
