'use strict';

var util = require('util');

var models = require('./index');

/**
 * @class
 * Initializes a new instance of the StorageAccountRegenerateKeyParameters class.
 * @constructor
 */
function StorageAccountRegenerateKeyParameters() { }

/**
 * Validate the payload against the StorageAccountRegenerateKeyParameters schema
 *
 * @param {JSON} payload
 *
 */
StorageAccountRegenerateKeyParameters.prototype.validate = function (payload) {
  if (!payload) {
    throw new Error('StorageAccountRegenerateKeyParameters cannot be null.');
  }
  if (payload['keyName']) {
    var allowedValues = [ 'key1', 'key2' ];
    if (!allowedValues.some( function(item) { return item === payload['keyName']; })) {
      throw new Error(payload['keyName'] + ' is not a valid value. The valid values are: ' + allowedValues);
    }
  }
};

/**
 * Deserialize the instance to StorageAccountRegenerateKeyParameters schema
 *
 * @param {JSON} instance
 *
 */
StorageAccountRegenerateKeyParameters.prototype.deserialize = function (instance) {
  return instance;
};

module.exports = new StorageAccountRegenerateKeyParameters();
