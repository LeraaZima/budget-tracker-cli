import inquirer from 'inquirer';
import { AccountManager } from './AccountManager';
import { Transaction } from './Transaction';
import { TransactionTypeEnum } from '../interfaces/ITransaction';
export class ApplicationController {
    accountManager;
    constructor() {
        this.accountManager = new AccountManager();
        const wallet = this.accountManager.addAccount('Кошелёк');
        const bank = this.accountManager.addAccount('Банк');
        wallet.addTransaction(new Transaction(500, TransactionTypeEnum.Income, new Date().toISOString().split('T')[0], 'Зарплата'));
        wallet.addTransaction(new Transaction(120, TransactionTypeEnum.Expense, new Date().toISOString().split('T')[0], 'Продукты'));
        bank.addTransaction(new Transaction(1000, TransactionTypeEnum.Income, new Date().toISOString().split('T')[0], 'Фриланс'));
    }
    async start() {
        console.log(' ПРИЛОЖЕНИЕ ДЛЯ УЧЕТА ЛИЧНЫХ ФИНАНСОВ \n');
        await this.mainMenu();
    }
    async mainMenu() {
        while (true) {
            console.clear();
            console.log('ГЛАВНОЕ МЕНЮ\n');
            const accounts = this.accountManager.accounts;
            console.log('Доступные счета:');
            if (accounts.length === 0) {
                console.log('  (нет счетов)');
            }
            else {
                accounts.forEach((acc, index) => {
                    console.log(`  ${index + 1}. ${acc.name} (Баланс: ${acc.balance} руб.)`);
                });
            }
            if (accounts.length > 0) {
                const summary = this.accountManager.getOverallSummary();
                console.log(`\nОбщая статистика:`);
                console.log(`  Доходы: ${summary.income} руб.`);
                console.log(`  Расходы: ${summary.expenses} руб.`);
                console.log(`  Общий баланс: ${summary.balance} руб.`);
            }
            console.log('\n Действия');
            console.log('  C - Создать новый счёт');
            console.log('  X - Выход из приложения');
            const { command } = await inquirer.prompt({
                type: 'input',
                name: 'command',
                message: '\nВведите номер счета или команду (C/X):',
            });
            const cmd = command.trim().toLowerCase();
            if (cmd === 'x') {
                console.log('\nДо свидания! Приложение закрыто.');
                break;
            }
            if (cmd === 'c') {
                await this.createAccount();
                continue;
            }
            const index = parseInt(cmd) - 1;
            if (!isNaN(index) && index >= 0 && index < accounts.length) {
                await this.watchAccount(accounts[index]);
            }
            else {
                console.log('\nНеверная команда или номер счета.');
                await this.pressEnterToContinue();
            }
        }
    }
    async createAccount() {
        console.clear();
        console.log('СОЗДАНИЕ НОВОГО СЧЕТА\n');
        const { name } = await inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Введите название нового счёта:',
            validate: (v) => v && v.trim().length > 0 ? true : 'Введите непустое название',
        });
        const accountName = name.trim();
        const account = this.accountManager.addAccount(accountName);
        console.log(`\nСчёт "${accountName}" успешно создан!`);
        console.log(`ID счета: ${account.id}`);
        const { addFirstTransaction } = await inquirer.prompt({
            type: 'confirm',
            name: 'addFirstTransaction',
            message: 'Хотите добавить первую транзакцию к этому счету?',
            default: false,
        });
        if (addFirstTransaction) {
            await this.addTransaction(account);
        }
        await this.pressEnterToContinue('Нажмите Enter чтобы вернуться в главное меню...');
    }
    async watchAccount(account) {
        while (true) {
            console.clear();
            console.log(`СЧЕТ: ${account.name}\n`);
            console.log(`Баланс: ${account.balance} руб.\n`);
            const summary = account.getSummary();
            console.log('Статистика по счету:');
            console.log(`  Доходы: ${summary.income} руб.`);
            console.log(`  Расходы: ${summary.expenses} руб.`);
            console.log(`  Чистый баланс: ${summary.balance} руб.\n`);
            console.log('Транзакции:');
            const transactions = account.getTransactions();
            if (transactions.length === 0) {
                console.log('  Транзакций пока нет.');
            }
            else {
                transactions.forEach((t, index) => {
                    const sign = t.type === TransactionTypeEnum.Income ? '+' : '-';
                    console.log(`  ${index + 1}. ${t.date} | ${sign}${t.amount} руб. | ${t.description}`);
                });
            }
            console.log('\nДействия');
            console.log('  1. Добавить транзакцию');
            console.log('  2. Удалить транзакцию');
            console.log('  3. Экспортировать в CSV');
            console.log('  4. Удалить этот счет');
            console.log('  0. Вернуться в главное меню');
            const { action } = await inquirer.prompt({
                type: 'input',
                name: 'action',
                message: '\nВыберите действие (0-4):',
                validate: (input) => {
                    const num = parseInt(input);
                    return !isNaN(num) && num >= 0 && num <= 4
                        ? true
                        : 'Введите число от 0 до 4';
                },
            });
            const actionNum = parseInt(action);
            switch (actionNum) {
                case 0:
                    return;
                case 1:
                    await this.addTransaction(account);
                    break;
                case 2:
                    await this.removeTransaction(account);
                    break;
                case 3:
                    await this.exportTransactionsToCSV(account);
                    break;
                case 4:
                    const shouldDelete = await this.confirmDeleteAccount(account);
                    if (shouldDelete) {
                        console.log(`\nСчет "${account.name}" удален.`);
                        await this.pressEnterToContinue();
                        return;
                    }
                    break;
            }
        }
    }
    async addTransaction(account) {
        console.clear();
        console.log('ДОБАВЛЕНИЕ ТРАНЗАКЦИИ\n');
        console.log(`Счет: ${account.name}\n`);
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'Тип транзакции:',
                choices: [
                    { name: 'Доход', value: TransactionTypeEnum.Income },
                    { name: 'Расход', value: TransactionTypeEnum.Expense },
                ],
            },
            {
                type: 'input',
                name: 'amount',
                message: 'Введите сумму:',
                validate: (v) => {
                    const num = Number(v);
                    if (isNaN(num) || num <= 0)
                        return 'Введите число больше нуля';
                    return true;
                },
                filter: (v) => Number(v),
            },
            {
                type: 'input',
                name: 'date',
                message: 'Введите дату (YYYY-MM-DD):',
                default: () => new Date().toISOString().split('T')[0],
                validate: (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) ? true : 'Формат YYYY-MM-DD',
            },
            {
                type: 'input',
                name: 'description',
                message: 'Введите описание:',
                default: '',
            },
        ]);
        const transaction = new Transaction(answers.amount, answers.type, answers.date, answers.description);
        account.addTransaction(transaction);
        const typeText = answers.type === TransactionTypeEnum.Income ? 'доход' : 'расход';
        console.log(`\nТранзакция добавлена! (${typeText}: ${answers.amount} руб.)`);
        await this.pressEnterToContinue();
    }
    async removeTransaction(account) {
        console.clear();
        console.log('УДАЛЕНИЕ ТРАНЗАКЦИИ\n');
        const transactions = account.getTransactions();
        if (transactions.length === 0) {
            console.log('Транзакций нет для удаления.');
            await this.pressEnterToContinue();
            return;
        }
        console.log('Выберите транзакцию для удаления:\n');
        transactions.forEach((t, index) => {
            const sign = t.type === TransactionTypeEnum.Income ? '+' : '-';
            console.log(`  ${index + 1}. ${t.date} | ${sign}${t.amount} руб. | ${t.description}`);
        });
        const { transactionIndex } = await inquirer.prompt({
            type: 'input',
            name: 'transactionIndex',
            message: '\nВведите номер транзакции для удаления:',
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num >= 1 && num <= transactions.length
                    ? true
                    : `Введите число от 1 до ${transactions.length}`;
            },
        });
        const index = parseInt(transactionIndex) - 1;
        const transactionToDelete = transactions[index];
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Удалить транзакцию "${transactionToDelete.description}" на сумму ${transactionToDelete.amount} руб.?`,
            default: false,
        });
        if (confirm) {
            account.removeTransactionById(transactionToDelete.id);
            console.log('\nТранзакция удалена.');
        }
        else {
            console.log('\nУдаление отменено.');
        }
        await this.pressEnterToContinue();
    }
    async confirmDeleteAccount(account) {
        console.clear();
        console.log('УДАЛЕНИЕ СЧЕТА\n');
        const { confirm } = await inquirer.prompt({
            type: 'confirm',
            name: 'confirm',
            message: `Вы уверены, что хотите удалить счет "${account.name}"?\nЭто действие нельзя отменить!`,
            default: false,
        });
        if (confirm) {
            this.accountManager.removeAccountById(account.id);
            return true;
        }
        return false;
    }
    async exportTransactionsToCSV(account) {
        console.clear();
        console.log('ЭКСПОРТ В CSV\n');
        const { filename } = await inquirer.prompt({
            type: 'input',
            name: 'filename',
            message: 'Введите имя файла (без расширения .csv):',
            default: `transactions_${account.name}_${new Date().toISOString().split('T')[0]}`,
            validate: (v) => v && v.trim().length > 0 ? true : 'Введите имя файла',
        });
        try {
            account.exportTransactionsToCSV(filename.trim());
            console.log(`\nФайл "${filename}.csv" успешно создан!`);
            console.log(`Место сохранения: ${process.cwd()}\\${filename}.csv`);
        }
        catch (err) {
            console.log('\nОшибка при экспорте:', err.message);
        }
        await this.pressEnterToContinue();
    }
    async pressEnterToContinue(message = 'Нажмите Enter чтобы продолжить...') {
        await inquirer.prompt({
            type: 'input',
            name: 'continue',
            message,
        });
    }
}
