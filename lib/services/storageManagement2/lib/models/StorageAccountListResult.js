'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountListResult class.
 * @constructor
 */
function StorageAccountListResult() { }

/**
 * Validate the payload against the StorageAccountListResult schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountListResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountListResult cannot be null.');
  }
  if (payload['value'] !== null && payload['value'] !== undefined && util.isArray(payload['value'])) {
    payload['value'].forEach(function(element) {
      if (element !== null && element !== undefined) {
        models['StorageAccount'].validate(element);
      }
    });
  }

  if (payload['nextLink'] !== null && payload['nextLink'] !== undefined && typeof payload['nextLink'] !== 'string') {
    throw new Error('payload["nextLink"] must be of type string.');
  }

};

/**
 * Deserialize the instance to StorageAccountListResult schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountListResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.value !== null && instance.value !== undefined) {
      var deserializedArray = [];
      instance.value.forEach(function(element1) {
        if (element1 !== null && element1 !== undefined) {
          element1 = models['StorageAccount'].deserialize(element1);
        }
        deserializedArray.push(element1);
      });
      instance.value = deserializedArray;
    }

  }
  return instance;
};

module.exports = new StorageAccountListResult();
