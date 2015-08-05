'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the UsageListResult class.
 * @constructor
 */
function UsageListResult() { }

/**
 * Validate the payload against the UsageListResult schema
 *
 * @param {JSON} payload
 *
 */
UsageListResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('UsageListResult cannot be null.');
  }
  if (util.isArray(payload['value'])) {
    for (var i = 0; i < payload['value'].length; i++) {
      if (payload['value'][i]) {
        models['Usage'].validate(payload['value'][i]);
      }
    }
  }
};

/**
 * Deserialize the instance to UsageListResult schema
 *
 * @param {JSON} instance
 *
 */
UsageListResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.value !== null && instance.value !== undefined) {
      var deserializedArray = [];
      instance.value.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['Usage'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.value = deserializedArray;
    }
  }
  return instance;
};

module.exports = new UsageListResult();
