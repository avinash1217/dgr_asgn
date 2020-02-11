const axios = require('axios');
const async = require('asyncawait/async');
const await = require('asyncawait/await');

const getZonalPrices = async(() => {
    let result;
    try {
      const response = await(axios.get('https://s3.eu-north-1.amazonaws.com/lemon-1/rate.json'));
      result = response.data;
      return result;
    } catch (error) {
      console.error(error);
    }
  });

exports.getZonalPrices = getZonalPrices;