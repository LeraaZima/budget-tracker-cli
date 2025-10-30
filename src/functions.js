// 1. calculateTotal
function calculateTotal(values) {
    var total = 0;
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var i = values_1[_i];
        total += i;
    }
    return total;
}
console.log(calculateTotal([100, 200, 300]));
// 2. calculateAverage
function calculateAverage(values) {
    if (values.length == 0) {
        return 0;
    }
    var total = 0;
    for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
        var i = values_2[_i];
        total += i;
    }
    var average = total / values.length;
    return average;
}
console.log(calculateAverage([10, 30, 50, 70]));
// 3. formatCurrency
function formatCurrency(amount, symbol) {
    return "".concat(amount, " ").concat(symbol);
}
console.log(formatCurrency(1000, '$'));
// 4. getTopValues
function getTopValues(values, count) {
    var sortedValues = values.slice();
    sortedValues.sort(function (a, b) { return b - a; });
    var topValues = sortedValues.slice(0, count);
    return topValues;
}
console.log(getTopValues([10, 70, 3, 43, 7], 3));
//5. printSummary
function printSummary(values) {
    if (values.length === 0) {
        console.log('Массив пустой');
        return;
    }
    var total = 0;
    for (var _i = 0, values_3 = values; _i < values_3.length; _i++) {
        var i = values_3[_i];
        total += i;
    }
    var count = values.length;
    var average = total / count;
    console.log("\u0412\u0441\u0435\u0433\u043E \u0437\u0430\u043F\u0438\u0441\u0435\u0439: ".concat(values.length));
    console.log("\u0421\u0443\u043C\u043C\u0430: ".concat(total));
    console.log("\u0421\u0440\u0435\u0434\u043D\u0435\u0435: ".concat(average));
}
printSummary([100, 500, 1000, 2000, 800]);
