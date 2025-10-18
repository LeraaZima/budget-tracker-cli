// income (число) — общий доход за месяц;
// expenses (число) — общий расход за месяц;
// savings (число) — сумма, которую вы хотите отложить;
// netIncome (число) — чистый доход (доход за вычетом расходов);
// remaining (число) — сумма, оставшаяся после отложенных сбережений (чистый доход за вычетом сбережений).

let income: number = 60000;
let expenses: number = 30000;
let savings: number = 10000;
let netIncome: number = income - expenses;
let remaining: number = netIncome - savings;

console.log('Income:', income);
console.log('Expenses:', expenses);
console.log('Savings:', savings);
console.log('Net Income:', netIncome);
console.log('Remaining:', remaining);



