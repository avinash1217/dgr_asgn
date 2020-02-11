const csv = require('csvtojson');
const request = require('request');
const validator = require('./jsonSchemaValidator');
const cal = require('./priceCalculator');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const rates = require('./rates');

const getCsvData = async(() => {
  const priceData = await(rates.getZonalPrices());
  csv()
    .fromStream(request.get('https://s3.eu-north-1.amazonaws.com/lemon-1/scooter_1337.csv'))
    .then((csvRow) => {
      const dataObj = validator.schemaValidator(csvRow);
      let finalResult = cal.calculatePrices(dataObj, priceData);
      console.log("finalResult",  finalResult);
    })
    .catch(function (error) {
      console.log(error);
    })
})

getCsvData();