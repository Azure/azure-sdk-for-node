'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountPropertiesUpdateParameters class.
 * @constructor
 */
function StorageAccountPropertiesUpdateParameters() { }

/**
 * Validate the payload against the StorageAccountPropertiesUpdateParameters schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountPropertiesUpdateParameters.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountPropertiesUpdateParameters cannot be null.');
  }
  if (payload['accountType']) {
    var allowedValues = [ 'Standard_LRS', 'Standard_ZRS', 'Standard_GRS', 'Standard_RAGRS', 'Premium_LRS' ];
    if (!allowedValues.some( function(item) { return item === payload['accountType']; })) {
      throw new Error(payload['accountType'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }

  if (payload['customDomain']) {
    models['CustomDomain'].validate(payload['customDomain']);
  }
};

/**
 * Deserialize the instance to StorageAccountPropertiesUpdateParameters schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountPropertiesUpdateParameters.prototype.deserialize = function (instance) {
  if (instance) {
    if (instance.customDomain !== null && instance.customDomain !== undefined) {
      instance.customDomain = models['CustomDomain'].deserialize(instance.customDomain);
    }
  }
  return instance;
};

module.exports = new StorageAccountPropertiesUpdateParameters();
