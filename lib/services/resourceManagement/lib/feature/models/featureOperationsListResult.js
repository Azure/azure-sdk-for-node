'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the FeatureOperationsListResult class.
 * @constructor
 */
function FeatureOperationsListResult() { }

/**
 * Validate the payload against the FeatureOperationsListResult schema
 *
 * @param {JSON} payload
 *
 */
FeatureOperationsListResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('FeatureOperationsListResult cannot be null.');
  }
  if (util.isArray(payload['value'])) {
    for (var i = 0; i < payload['value'].length; i++) {
      if (payload['value'][i]) {
        models['FeatureResult'].validate(payload['value'][i]);
      }
    }
  }

  if (payload['nextLink'] !== null && payload['nextLink'] !== undefined && typeof payload['nextLink'].valueOf() !== 'string') {
    throw new Error('payload[\'nextLink\'] must be of type string.');
  }
};

/**
 * Deserialize the instance to FeatureOperationsListResult schema
 *
 * @param {JSON} instance
 *
 */
FeatureOperationsListResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.value !== null && instance.value !== undefined) {
      var deserializedArray = [];
      instance.value.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['FeatureResult'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.value = deserializedArray;
    }
  }
  return instance;
};

module.exports = new FeatureOperationsListResult();
