'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountPropertiesCreateParameters class.
 * @constructor
 */
function StorageAccountPropertiesCreateParameters() { }

/**
 * Validate the payload against the StorageAccountPropertiesCreateParameters schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountPropertiesCreateParameters.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountPropertiesCreateParameters cannot be null.');
  }
  if (payload['accountType']) {
    var allowedValues = [ 'Standard_LRS', 'Standard_ZRS', 'Standard_GRS', 'Standard_RAGRS', 'Premium_LRS' ];
    if (!allowedValues.some( function(item) { return item === payload['accountType']; })) {
      throw new Error(payload['accountType'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }
};

/**
 * Deserialize the instance to StorageAccountPropertiesCreateParameters schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountPropertiesCreateParameters.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new StorageAccountPropertiesCreateParameters();
