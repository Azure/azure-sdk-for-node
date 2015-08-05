'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the ResourceProviderOperationDetailListResult class.
 * @constructor
 */
function ResourceProviderOperationDetailListResult() { }

/**
 * Validate the payload against the ResourceProviderOperationDetailListResult schema
 *
 * @param {JSON} payload
 *
 */
ResourceProviderOperationDetailListResult.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('ResourceProviderOperationDetailListResult cannot be null.');
  }
  if (util.isArray(payload['value'])) {
    for (var i = 0; i < payload['value'].length; i++) {
      if (payload['value'][i]) {
        models['ResourceProviderOperationDefinition'].validate(payload['value'][i]);
      }
    }
  }
};

/**
 * Deserialize the instance to ResourceProviderOperationDetailListResult schema
 *
 * @param {JSON} instance
 *
 */
ResourceProviderOperationDetailListResult.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.value !== null && instance.value !== undefined) {
      var deserializedArray = [];
      instance.value.forEach(function(element) {
        if (element !== null && element !== undefined) {
          element = models['ResourceProviderOperationDefinition'].deserialize(element);
        }
        deserializedArray.push(element);
      });
      instance.value = deserializedArray;
    }
  }
  return instance;
};

module.exports = new ResourceProviderOperationDetailListResult();
