const Ajv = require('ajv');
const log = require('./logger');
const moment = require('moment-timezone');
const fs = require('fs');

const schema = {
  "type": "array",
  "items": {
    "type": "object",
    properties: {
      customerId: { type: "string", pattern: "[A-Z]{2}[0-9]{4}" },
      startTime: { type: "string", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" },
      endTime: { type: "string", pattern: "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}" },
      zone: { type: "string", pattern: "[ABC]{1}" }
    },
    "additionalProperties": false,
    required: ['customerId', 'startTime', 'endTime', 'zone']
  },
  "minItems": 1
}

const schemaValidator = (data) => {
  let errorData = [];
  let finalData = [];
  var ajv = new Ajv({ allErrors: true });
  var validate = ajv.compile(schema);
  const valid = validate(data);

  if (valid) {
    return true;
  }
  else {
    let indexOfObj;
    errors = validate.errors;
    log.error(`Invalid records: ${JSON.stringify(errors)}`);      
    data.forEach(item => {
      let flg = false;
      errors.forEach(element => {  
        str = element.dataPath.split(".")[0];
        indexOfObj = str.substring(str.indexOf('[') + 1, str.indexOf(']'));
       errorObj = data[indexOfObj];      
        if(errorObj.customerId == item.customerId && errorObj.startTime == item.startTime && errorObj.endTime == item.endTime && errorObj.zone == item.zone){
          flg = true;
          errorData.push(errorObj);
        }
      });
      if(!flg){
        finalData.push(item);
      }
    });
  }
  errorData = JSON.stringify(errorData, null, 2);
  fs.writeFile(`error_${moment().format("DD-MM-YYYY_HH-mm")}.json`, errorData, (err) => {
    if (err) { throw err };
    console.log('Error file has been saved!');
  });
  return finalData;
}

exports.schemaValidator = schemaValidator;