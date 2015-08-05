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
  if (util.isArray(payload['value'])) {
    for (var i = 0; i < payload['value'].length; i++) {
      if (payload['value'][i]) {
        models['StorageAccount'].validate(payload['value'][i]);
      }
    }
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
      instance.value.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['StorageAccount'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.value = deserializedArray;
    }
  }
  return instance;
};

module.exports = new StorageAccountListResult();
