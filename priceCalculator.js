const d3 = require('d3');
const R = require('ramda');
var abc = [];

const calculatePrices = (dataObj, priceData) => {
    dataObj.forEach(element => {
        let val = R.find(R.propEq('zone', element.zone))(priceData);
        element.amount = val.price;
    });
    const expenseMetrics = d3.nest()
        .key(function (d) { return d.customerId; })
        .rollup(function (v) {
            return {
                count: v.length,
                amount: d3.sum(v, function (d) { return d.amount; })
            };
        })
        .entries(dataObj);
    return JSON.stringify(expenseMetrics, null, 2);

};

exports.calculatePrices = calculatePrices;





