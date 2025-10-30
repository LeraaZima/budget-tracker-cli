// 1. calculateTotal

function calculateTotal(values: number[]): number {
  let total = 0;
  for (let i of values) {
    total += i;
  }
  return total;
}
console.log(calculateTotal([100, 200, 300]));

// 2. calculateAverage

function calculateAverage(values: number[]): number {
  if (values.length == 0) {
    return 0;
  }
  let total = 0;
  for (let i of values) {
    total += i;
  }
  let average = total / values.length;
  return average;
}
console.log(calculateAverage([10, 30, 50, 70]));

// 3. formatCurrency

function formatCurrency(amount: number, symbol: string): string {
  return `${amount} ${symbol}`;
}
console.log(formatCurrency(1000, '$'));

// 4. getTopValues

function getTopValues(values: number[], count: number): number[] {
  let sortedValues = values.slice();
  sortedValues.sort((a, b) => b - a);
  let topValues = sortedValues.slice(0, count);
  return topValues;
}
console.log(getTopValues([10, 70, 3, 43, 7], 3));

//5. printSummary

function printSummary(values: number[]): void {
  if (values.length === 0) {
    console.log('Массив пустой');
    return;
  }
  let total = 0;
  for (let i of values) {
    total += i;
  }
  let count = values.length;
  let average = total / count;

  console.log(`Всего записей: ${values.length}`);
  console.log(`Сумма: ${total}`);
  console.log(`Среднее: ${average}`);
}

printSummary([100, 500, 1000, 2000, 800]);
