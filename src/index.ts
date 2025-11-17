import { Transaction } from './classes';
import { Account } from './classes';
import { AccountManager } from './classes';


// Создаём счёт
const acc1 = new Account(1, 'Кошелёк');
const acc2 = new Account(2, 'Банковская карта');

// Создаём транзакции
const t1 = new Transaction(1, 1500, 'income', new Date('2025-11-01').toISOString(), 'Зарплата');
const t2 = new Transaction(2, 200, 'expense', new Date('2025-11-03').toISOString(), 'Продукты');
const t3 = new Transaction(3, 50, 'expense', new Date('2025-11-05').toISOString(), 'Кофе');

acc1.addTransaction(t1);
acc1.addTransaction(t2);

acc2.addTransaction(t3);

// Создаём менеджер и добавляем счета
const manager = new AccountManager();
manager.addAccount(acc1);
manager.addAccount(acc2);

// Выводим всё
console.log(manager.toString());

// Подробно по счету 1
console.log('\n--- Подробно по счету 1 ---');
console.log(acc1.toString());

// Пример удаления транзакции и счета
console.log('\nУдаляем транзакцию id:2 из счета 1');
acc1.removeTransactionById(2);
console.log(acc1.toString());

console.log('\nУдаляем счёт id:2');
console.log('Удалено:', manager.removeAccountById(2));
console.log(manager.toString());



//dz 6
import { GenericStorage, Product } from './generics';

const productStorage = new GenericStorage<Product>();

productStorage.add(new Product(1, 'Ноутбук', 150000));
productStorage.add(new Product(2, 'Смартфон', 80000));
productStorage.add(new Product(3, 'Планшет', 50000));
productStorage.add({ id: 4 } as Product);

console.log('--- Описание всех продуктов ---');
productStorage.describeAll();